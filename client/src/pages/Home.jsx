import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const posts = [
        {
            id: 1,
            title: "Test title 1",
            desc: "Descriptions",
            img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        },
        {
            id: 2,
            title: "Test title 1",
            desc: "Descriptions",
            img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        },
        {
            id: 3,
            title: "Test title 1",
            desc: "Descriptions",
            img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        },
        {
            id: 4,
            title: "Test title 1",
            desc: "Descriptions",
            img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        },
        {
            id: 5,
            title: "Test title 1",
            desc: "Descriptions",
            img: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        },

    ]
    return (
        <div className='home'>
            <div className='posts'>
                {posts.map(post=>(
                    <div className='post' key={post.id}>
                    <div className="img">
                        <img src={post.img} alt="" />
                        </div>
                        <div className="content">
                        <Link className="link" to={`/post/${post.id}`}>
                        <h1>{post.title}</h1>
                        <p>{post.desc}</p>
                        <button>Read more</button>
                        </Link>
                        </div>
                        </div>
                ))}
            </div>
        </div>
    )
}
export default Home