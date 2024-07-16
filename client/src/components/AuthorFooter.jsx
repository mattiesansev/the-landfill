import React from 'react'

const AuthorFooter = (props) => {
    const { authorImageUrl, authorName, postDate } = props
    return (
        <div className='user'>
            <img src={authorImageUrl}></img>
            <div className='info'>
                <span>{authorName}</span>
                <p>{postDate}</p>
            </div>
        </div>
    )
}
export default AuthorFooter