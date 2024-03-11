import {deleteById} from "../../Utils";

function UserSongRow(item) {
    const handleOnClickUnselect = async (event) => {
      const url = 'songs/'.concat(item.index)
      await deleteById(url, item.email);
      window.location = window.location.protocol + '//'+ window.location.host +
       window.location.pathname + '?tab=userSongs';
    }
  
    return (
      <>
        <tr>
          <td><b>{item.incIndex}</b></td>
          <td>{item.artist}</td>
          <td>{item.song}</td>
          <td>{item.users}</td>
          <td scope="row">
            <button className="btn btn-outline-danger mx-2"
             onClick={handleOnClickUnselect}>Revert</button>
          </td>
        </tr>
      </>
    );
  }

  export default UserSongRow;