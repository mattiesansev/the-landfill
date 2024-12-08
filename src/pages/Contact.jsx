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
      <a href="mailto:bayareadatadump@gmail.com">email us at bayareadatadump@gmail.com</a>
      <p>follow us on instagram at <a href={"https://www.instagram.com/bayareadatadump/"}>bayareadatadump</a></p>
    </div>
  );
};
export default Contact;
