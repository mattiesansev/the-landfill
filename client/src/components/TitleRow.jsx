import React from 'react'
import Logo from '../img/logo_tmp.jpeg'
import {Link} from 'react-router-dom'

const TitleRow = () => {
    return (
        <div className='title_row'>
            <div className='container'>
                <Link className='link' to='/'>
                <div className='logo'>
                    <img src={Logo} alt="" />
                </div>
                </Link>
                <div className='title'>
                    The Bay Area Data Dump
                </div>
            </div>
        </div>
    )
}
export default TitleRow