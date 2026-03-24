import React from "react";
import GroupPhoto from "../img/group_cropped.jpg"

const Contact = () => {
  return (
    <div className="contact">
      <div className="contact-photo">
        <img src={GroupPhoto} alt="The Bay Area Data Dump team" />
      </div>
      <h1 className="contact-heading">Want to get in touch?</h1>
      <div className="contact-links">
        <a href="mailto:bayareadatadump@gmail.com" className="contact-link">
          <span className="contact-link-label">Email</span>
          <span className="contact-link-value">bayareadatadump@gmail.com</span>
        </a>
        <a href="https://www.instagram.com/bayareadatadump/" target="_blank" rel="noopener noreferrer" className="contact-link">
          <span className="contact-link-label">Instagram</span>
          <span className="contact-link-value">@bayareadatadump</span>
        </a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfffPb045GrsatVJLg6jUN1nOprh2NlREhJgmIUfmxBFC_T_w/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="contact-link">
          <span className="contact-link-label">Newsletter</span>
          <span className="contact-link-value">Sign up for updates</span>
        </a>
      </div>
    </div>
  );
};
export default Contact;
