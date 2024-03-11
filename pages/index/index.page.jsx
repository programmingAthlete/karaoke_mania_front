import React, { useState, useEffect } from "react";
import './code.css'
import Modal from "../../components/Modal";
import Header from "../../components/Header";
import Main from "../../components/karaoke/Main";
import { baseUrl } from "../../Config";
export { Page }

function insertUserInDB(email) {
  const url = baseUrl.concat("add_person");
  console.log(url);
  const resp = fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  });
  return resp;
}


function Page() {
  const [userEmail, setUserEmail] = useState("");

  const handleSetUserEmail = (email) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
    insertUserInDB(email);
  };


  useEffect(() => {
    // Retrieve the email from localStorage when the component mounts
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <>
      <div>
        {userEmail? (
        <>
        <Header unsetUserEmail={setUserEmail} email={userEmail}/>
        <Main email={userEmail} />
        </>
          ): ( 
          <Modal setUserEmail={handleSetUserEmail} />
          )}
      </div>
    </>
  )
}
