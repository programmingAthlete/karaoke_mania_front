import React, { useState, useEffect } from "react";
import {fetchEncryptedData, stringToBoolean} from '../../Utils'
import Table from "./Table";

function Main(item){
  const [adminEmail, setAdminEmail] = useState(false)

  const fetchAdminEmail = async () => { 
    const response  = await fetchEncryptedData('users/admin', item.email);
    setAdminEmail(stringToBoolean(response))
  }

  useEffect(() => {
    // Retrieve the email from localStorage when the component mounts
    fetchAdminEmail()
  }, []);

  const handleOnClickUploadFile = async (event) => {
    event.preventDefault();
    const fileInput = event.target[0];
    
    // Check if any file is selected
    if (fileInput.files.length === 0) {
      alert("Please select a file.");
      return;
    }
    // Get the selected file from the file input
    const file = fileInput.files[0];

    const url = JSON.parse(await fetchEncryptedData('songs/load/'.concat(file.name), adminEmail));      
    await fetch(url.url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file
    })
    .then(response => {
        if (!response.ok) {
            alert("File upload failed. Status: " + response.status);
        }
      })
      .catch(error => {
        alert("An error occurred while uploading the file.");
      });
      window.location = window.location.protocol + '//'+ window.location.host + window.location.pathname;
  }

  return (
    <>
      <div>
      {adminEmail && (
        <>
          <br />
          <form onSubmit={handleOnClickUploadFile}>
            <input type="file" id="fileInput" />
            <button type="submit" className="btn btn-outline-primary ml-2">
              Upload Song File
            </button>
          </form>
        </>
      )}
    </div>
    <br />
    <Table userEmail={item.email} adminEmail={adminEmail} />
    </>
  )
}

export default Main;