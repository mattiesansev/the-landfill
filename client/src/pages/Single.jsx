import React from "react";
import Menu from "../components/Menu";
import AuthorFooter from "../components/AuthorFooter";

const Single = (props) => {
  const { headerImageUrl, authorImageUrl, authorName, postDate, content } =
    props;
  return (
    <div className="single">
      <div className="content">
        <img src={headerImageUrl}></img>
        <AuthorFooter authorImageUrl="" authorName="" postDate="" />
      </div>
      <Menu />
    </div>
  );
};
export default Single;
