import {prepareEncryptedRequest} from "../../Utils";

function getProperty(userList, propertyName){
  let values = []
  for (const obj of userList){
    values.push(obj[propertyName])
  }
  return values
}

async function queueReqeusts(email, pathRel, method, songIndex, peopleIds){
  const preparedRequest = await prepareEncryptedRequest(email, pathRel)
  const body = JSON.stringify({
        song_id: songIndex,
        people_ids: peopleIds
    })
    return fetch(preparedRequest.url, {
      method: method,
      headers: {
        Authorization: preparedRequest.requestModel.email,
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      })
      .catch((error) => {
        console.log(error)
      });
}

export function NotDoneQueueRow(item) {

    const handleOnClickToDone = async () => {
      await queueReqeusts(item.email, 'queues/done', 'PATCH', item.index, peopleIds)
      console.log('here')
      window.location = window.location.protocol + '//'+ window.location.host +
       window.location.pathname + '?tab=queue';
    }

    const emails = getProperty(item.users, 'email'); 
    const peopleIds = getProperty(item.users, 'person_id');
    
    return (
      <>
        <tr>
          <td><b>{item.incIndex}</b></td>
          <td>{item.artist}</td>
          <td>{item.song}</td>
          <td>{emails}</td>
          {item.adminEmail? (
            <td scope="row">
            <button className="btn btn-outline-success mx-2"
             onClick={handleOnClickToDone}>Set to Done</button>
          </td>
          ):
          (<td>No Actions Allowed</td>)}
        </tr>
      </>
    );
  }

export function DoneQueueRow(item) {


    const handleOnCLickDelete = async () => {
      await queueReqeusts(item.email, 'queues/delete', 'DELETE', item.index, peopleIds)
      window.location.reload()
    }

    const handleOnCLickRePush = async () => {
      await queueReqeusts(item.email, 'queues/re-push', 'PATCH', item.index, peopleIds)
      window.location.reload()
    }

    const emails = getProperty(item.users, 'email'); 
    const peopleIds = getProperty(item.users, 'person_id');
    
    return (
      <>
        <tr>
          <td><b>{item.incIndex}</b></td>
          <td>{item.artist}</td>
          <td>{item.song}</td>
          <td>{emails}</td>
          {item.adminEmail? (
            <td scope="row">
            <button className="btn btn-outline-success mx-2"
              onClick={handleOnCLickRePush}>Re-push to queue</button>
             <button className="btn btn-outline-danger mx-2"
             onClick={handleOnCLickDelete}>Delete</button>
          </td>
          ):
          (<td>No Actions Allowed</td>)}
        </tr>
      </>
    );
  }