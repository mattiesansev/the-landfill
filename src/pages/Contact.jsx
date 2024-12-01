import React from "react";
import GroupPhoto from "../img/group_cropped.jpg"

const Contact = () => {
  return (
    <div className="contact">
      <div className="contactHeader">
        <div className="groupPhoto">
            <img src={GroupPhoto}></img>
        </div>
        Want to get in touch?
      </div>
      <p>email us at bayareadatadump@gmail.com </p>
      <p>follow us on instagram at </p>
    </div>
  );
};
export default Contact;
