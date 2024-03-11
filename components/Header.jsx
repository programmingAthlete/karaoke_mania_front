import React, { useState} from "react";

function Header (item){
  const [updateUserName, setUpdateUserName] = useState(false)

  const handleOnClickLogout = () => {
    item.unsetUserEmail("");
    localStorage.removeItem("userEmail");
  }

  const handleOnSubmitUpdateUsername = (event) => {
    console.log(event);
  }

  const handleOnClickUpdateUserName = () => {
    if (updateUserName === false){
      setUpdateUserName(true);
    }
    else{
      setUpdateUserName(false);
    }
  }

  return (
    <div>
      <div>
      <button
        onClick={handleOnClickLogout}
       className="btn btn-outline-danger ml-2"
      >
        Log Out
      </button>
      <button
        onClick={handleOnClickUpdateUserName}
        className="btn btn-outline-primary ml-2"
      >
        Update Username
      </button>
    </div>
    {updateUserName ? (<div>
      <input type="text" placeholder="New Username"/>
      <button className="btn btn-outline-success ml-2" 
      onClick={handleOnSubmitUpdateUsername}>Submit</button>
    </div>):(<div></div> )}
  </div>
  )
}

export default Header;