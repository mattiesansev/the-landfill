import React from "react";

const AuthorFooter = (props) => {
  const { authorImageUrl, authorName, postDate } = props;
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
      <img 
        src={authorImageUrl} 
        alt={authorName}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-accent transition-colors duration-200"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 group-hover:text-accent transition-colors duration-200">
          {authorName}
        </span>
        {postDate && (
          <span className="text-xs text-gray-500">
            {postDate}
          </span>
        )}
      </div>
    </div>
  );
};
export default AuthorFooter;
