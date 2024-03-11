import pkg from 'crypto-js';
const { enc, AES, mode, pad } = pkg;

function padKey(key) {
  // Pad key to 128 bits (16 bytes) with leading zeros
  return key.toString(16).padStart(32, "0");
}

function padKey1(key) {
  // Pad key to 128 bits (16 bytes) with leading zeros
  while (key.length < 32) {
    key = "0" + key;
  }
  return key;
}

export function decryptAES(encryptedData, key) {
  // Pad the key to 128 bits
  key = padKey1(key.toString(16));

  // Convert the encrypted hexadecimal data to a WordArray
  const encryptedWordArray = enc.Hex.parse(encryptedData);

  // Convert the key to a WordArray
  const keyWordArray = enc.Hex.parse(key);

  // Decrypt the data using the key
  const decrypted = AES.decrypt({ ciphertext: encryptedWordArray }, keyWordArray, {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  });
  
  const decryptedString = enc.Utf8.stringify(decrypted);
  return decryptedString;
}

export function encryptAES(key, data) {
  // Pad the key to 128 bits
  key = padKey(key.toString(16));

  // Convert the data and key to WordArray
  const dataWordArray = enc.Utf8.parse(data);
  const keyWordArray = enc.Hex.parse(key);

  // Encrypt the data using AES with PKCS#7 padding
  const encrypted = AES.encrypt(dataWordArray, keyWordArray, {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
}