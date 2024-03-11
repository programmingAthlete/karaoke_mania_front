import { baseUrl } from "./Config";
import {encryptAES, decryptAES} from "./Crypto";

export function stringToBoolean(str) {
  return str.toLowerCase() === "true" || str === "1";
}

function request(headers, relUrl, body, method){
  const url = baseUrl.concat(relUrl);
  return fetch(url, { method: method, headers: headers, body: body}).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
}


export function fetchFromDB(email, relUrl) {
  const url = baseUrl.concat(relUrl);
  return fetch(url, {  headers: { Authorization: email } }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

export function fetchDataFromDB(relUrl){
  const url = baseUrl.concat(relUrl);
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}


export function fetchPublicVars(relUrl) {
  const url = baseUrl.concat(relUrl);
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

export function fetchPartKey(reUrl) {
  const url=baseUrl.concat(reUrl);
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

export async function putRequest(ids, email, relUrl) {
  const requestModel = await preRequest(email);
  const partKey = requestModel.partKey;
  const pathUrl = constructPathWithKey(relUrl, partKey.h, partKey.nonce);
  const url = baseUrl.concat(pathUrl);
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: requestModel.email,
    },
    body: JSON.stringify({ ids: ids }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  });
}

export function constructPathWithKey(relUrl, h, nonce){
  const path_rel = relUrl.concat("?h=").concat(h).concat('&nonce=').concat(nonce);
  return path_rel
}


function getRandomInteger(x) {
  return Math.floor(Math.random() * (x + 1));
}


function calculateSessionKey(partKey){
  const g = BigInt(partKey.g)
  const n = BigInt(partKey.n)
  const randomNum = BigInt(getRandomInteger(partKey.n));
  const h = (g ** randomNum) % n;
  const key = (BigInt(partKey.part_key) ** randomNum) % n;
  const sessionKey = {sessionKey: key,
    publicVars: {h: h, nonce: partKey.nonce, n: n}} 
  return sessionKey
}

async function preRequest(email){
  const partKey = await fetchPartKey("part_key");
  const sessionkey = calculateSessionKey(partKey);
  const cH = sessionkey.publicVars.h;
  const sH = sessionkey.publicVars.nonce;
  const encryptedText = encryptAES(sessionkey.sessionKey, email);
  const cipherRequest = {
    h: cH,
    nonce: sH,
    n: sessionkey.publicVars.n,
    sessionKey: sessionkey.sessionKey
  }
  const requestModel = {
    partKey: cipherRequest,
    email: encryptedText
  }
  return requestModel
}

export async function prepareEncryptedRequest(email, relUrl){
  const requestModel = await preRequest(email);
  const pathRel = constructPathWithKey(relUrl, 
    requestModel.partKey.h, 
    requestModel.partKey.nonce);
  return {url: baseUrl.concat(pathRel), requestModel: requestModel}
}


export async function fetchEncryptedData(relUrl, email){
  const requestModel = await preRequest(email);
  const partKey = requestModel.partKey;
  const path_rel = constructPathWithKey(relUrl, partKey.h, partKey.nonce);
  const resp = await fetchFromDB(requestModel.email, path_rel);
  if (!Array.isArray(resp)) {
    const decryptedData = decryptAES(resp.payload, partKey.sessionKey);
    return decryptedData
  }
  const toReturn = resp.map((item) => {
    return {
      ...item,
      users: JSON.parse(decryptAES(item.users, partKey.sessionKey)).join(' & ')
    }
  })
  return toReturn;
}

export async function fetchEncryptedDataWithoutHeaders(relUrl){
  const partKey = await fetchPartKey("part_key");
  const sessionkey = calculateSessionKey(partKey);
  const cH = sessionkey.publicVars.cH;
  const sH = sessionkey.publicVars.sH;
  const urlRel = constructPathWithKey(relUrl, cH, sH, sessionkey.publicVars.n);
  const resp = await fetchDataFromDB(urlRel)
  const decryptedData = decryptAES(resp.payload, partKey.sessionKey);
  return decryptedData;
}

export async function deleteById(relUrl, email){
  const requestModel = await preRequest(email);
  const partKey = requestModel.partKey;
  const urlRel = constructPathWithKey(relUrl, partKey.h, partKey.nonce);
  const url=baseUrl.concat(urlRel);
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: requestModel.email,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    })
    .catch((error) => {
    });
}