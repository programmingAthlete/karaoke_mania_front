import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import {fetchEncryptedData, deleteById, fetchDataFromDB, putRequest } from "../../Utils";
import { Tabs, Tab } from "react-bootstrap"; 
import Row from "./Row";
import UserSongRow from "./UserSongRow";
import {DoneQueueRow, NotDoneQueueRow} from "./QueueRow";
import Loading from "./Loading";



function getQueueColumns(adminEmailValidity){
  if (adminEmailValidity){
    return [
        null, // Column 1 (e.g., checkbox column)
        null, // Column 2 (e.g., artist column)
        null, // Column 3 (e.g., song title column)
        null, // Column 4 (e.g., nickname column)
        null, // Column 5 (e.g., action column)
    ]
  }
  else {
     return [
      null, // Column 1 (e.g., checkbox column)
      null, // Column 2 (e.g., artist column)
      null, // Column 3 (e.g., song title column)
      null, // Column 4 (e.g., nickname column)
  ]
  }
}

function Table(props) {
  const [loading, setLoading] = useState(true);
  const tab = (new URLSearchParams(window.location.search).get("tab")) ?? "allSongs"

  const [songs, setSongs] = useState([]);
  const [userSongs, setUserSongs] = useState([]);
  const [doneQueue, setDoneQueue] = useState([]);
  const [notDoneQueue, setNotDoneQueue] = useState([]);
  
  const [activeTab, setActiveTab] = useState(tab);
  const [allSongsInitialized, setAllSongsInitialized] = useState(false);
  const [userSongsInitialized, setUserSongsInitialized] = useState(false);
  const [doneQueueInitialized, setDoneQueueInitialized] = useState(false);
  const [notDoneQueueInitialized, setNotDoneQueueInitialized] = useState(false);
  const allSongsTableRef = useRef(null);
  const userSongsTableRef = useRef(null);
  const doneQueueTableRef = useRef(null);
  const notDoneQueueTableRef = useRef(null);

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formSelected = event.target;
    const checkboxes = formSelected.querySelectorAll(
      "input[type='checkbox']:checked"
    );
    const selectedCheckboxes = Array.from(checkboxes).map((checkbox) => {
      const name = checkbox.getAttribute("name");
      if (name != null) {
        return parseInt(name);
      }
    });
    try {
      await putRequest(selectedCheckboxes, props.userEmail, "songs");
      window.location = window.location.protocol + '//'+ window.location.host + window.location.pathname
      //window.location.reload(false);
    } catch (error) {
    }
    await putRequest(selectedCheckboxes, props.userEmail);
  };


  const fetchSongs = async (email) => {
    const pathRel = "songs"
    try{
      const data = await fetchEncryptedData(pathRel, email);
      setSongs(data);
    } catch (error){}
    finally{
      setLoading(false);
    } 
  };

  const fetchUserSongs = async (email) => {
    const pathRel = "songs/me"
    try{
      const data = await fetchEncryptedData(pathRel, email);
      setUserSongs(data)
    } catch (error){}
    finally{
      setLoading(false);
    } 
  }

  const fetchQueueSongs = async (email) => {
    const pathRel = "queues"
    try{
      const data = await fetchDataFromDB(pathRel);
      const doneQueueData = data.filter((item) => item.done === true);
      const notDoneQueueData = data.filter((item) => item.done === false);
      setDoneQueue(doneQueueData);
      setNotDoneQueue(notDoneQueueData);
    } catch (error){}
    finally{
      setLoading(false);
    } 
  }

  
  useEffect(() => {
    if (activeTab === "allSongs") {
      fetchSongs(props.userEmail);
    } else if (activeTab === "userSongs") {
      fetchUserSongs(props.userEmail);
    } else if (activeTab === "queue") {
      fetchQueueSongs(props.userEmail);
    }
  }, [activeTab, props.userEmail, loading]);

  useEffect(() => {
    if (activeTab === "allSongs" && songs.length > 0 && allSongsTableRef.current && !allSongsInitialized) {
      $(allSongsTableRef.current).DataTable({
        // Add DataTable configuration options for the all songs table
        aoColumns: [
          null, // Column 1 (e.g., checkbox column)
          null, // Column 2 (e.g., artist column)
          null, // Column 3 (e.g., song title column)
          null, // Column 4 (e.g., nickname column)
        ],
      });
      setAllSongsInitialized(true);
    } else if (activeTab === "userSongs" && userSongs.length > 0 && userSongsTableRef.current && !userSongsInitialized) {
      $(userSongsTableRef.current).DataTable({
        // Add DataTable configuration options for the user songs table
        aoColumns: [
          null, // Column 1 (e.g., checkbox column)
          null, // Column 2 (e.g., artist column)
          null, // Column 3 (e.g., song title column)
          null, // Column 4 (e.g., nickname column)
          null, // Column 5 (e.g., action column)
        ],
      });
      setUserSongsInitialized(true);
      //setLoading(false);
    }
    else if (activeTab === "queue" && doneQueue.length > 0 && doneQueueTableRef.current && !doneQueueInitialized){
      $(doneQueueTableRef.current).DataTable({
        // Add DataTable configuration options for the user songs table
        aoColumns: [
          null, // Column 1 (e.g., checkbox column)
          null, // Column 2 (e.g., artist column)
          null, // Column 3 (e.g., song title column)
          null, // Column 4 (e.g., nickname column)
          null, // Column 5 (e.g., action column)
      ]
      });
      setDoneQueueInitialized(true);
      //setLoading(false);
    }
    else if (activeTab === "queue" && notDoneQueue.length > 0 && notDoneQueue.current && !notDoneQueueInitialized){
      $(notDoneQueueTableRef.current).DataTable({
        // Add DataTable configuration options for the user songs table
        aoColumns: [
          null, // Column 1 (e.g., checkbox column)
          null, // Column 2 (e.g., artist column)
          null, // Column 3 (e.g., song title column)
          null, // Column 4 (e.g., nickname column)
          null, // Column 5 (e.g., action column)
      ]
      });
      setNotDoneQueueInitialized(true);
    }
  }, [activeTab, songs, userSongs, allSongsInitialized, userSongsInitialized, doneQueueInitialized, notDoneQueueInitialized, doneQueue, notDoneQueue]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
    <Tab eventKey="allSongs" title="All Songs">
      <form onSubmit={handleOnSubmit}>
        <table ref={allSongsTableRef} id="allSongsTable" className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Artist</th>
              <th scope="col">Title</th>
              <th scope="col">Nickname</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((item) => (
              <Row
                index={item.id}
                selected={item.selected}
                artist={item.artist_name}
                song={item.song_name}
                users={item.users}
              />
            ))}
          </tbody>
        </table>
        <button type="submit" className="btn btn-outline-success">
          Submit
        </button>
      </form>
      </Tab>
      <Tab eventKey="userSongs" title="My Selections">          
          <table ref={userSongsTableRef} id="userSongsTable" className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Artist</th>
              <th scope="col">Title</th>
              <th scope="col">Nickname</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {userSongs.map((item) => (
              <UserSongRow
                incIndex={item.inc_index}
                index={item.id}
                selected={item.selected}
                artist={item.artist_name}
                song={item.song_name}
                users={item.users}
                email={props.userEmail}
              />
            ))}
          </tbody>
        </table>
        </Tab>
        <Tab eventKey="queue" title="Queue">
          <h4>Songs Not Done</h4>
        <table ref={notDoneQueueTableRef} id="notDoneQueueTable" className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Artist</th>
              <th scope="col">Title</th>
              <th scope="col">Nickname</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {notDoneQueue.map((item) => (
              <NotDoneQueueRow
                incIndex={item.inc_index}
                index={item.song_id}
                artist={item.artist_name}
                song={item.song_name}
                users={item.users}
                email={props.userEmail}
                adminEmail={props.adminEmail}
              />
            ))}
          </tbody>
        </table>
        <h4>Songs Done</h4>
        <table ref={doneQueueTableRef} id="doneQueueTable" className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Artist</th>
              <th scope="col">Title</th>
              <th scope="col">Nickname</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {doneQueue.map((item) => (
              <DoneQueueRow
                incIndex={item.inc_index}
                index={item.song_id}
                artist={item.artist_name}
                song={item.song_name}
                users={item.users}
                email={props.userEmail}
                adminEmail={props.adminEmail}
              />
            ))}
          </tbody>
        </table>
        </Tab>
      </Tabs>
    </>
  );
}

export default Table;
