import React, { useState } from "react";



const Modal = ({ setUserEmail }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserEmail(email);
  };

  return (
    <div id="modalInput" className="modal-email">
      <form onSubmit={handleSubmit}>
        <p>
            This email is used only to get your past information back.
        </p>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-outline-primary ml-2">Submit</button>
      </form>
    </div>
  );
};

export default Modal;
