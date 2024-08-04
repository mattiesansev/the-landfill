import React from 'react'
import Logo from '../img/logo_tmp.jpeg'
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='container'>
                <Link className='link' to='/'>
                <div className='logo'>
                    <img src={Logo} alt="" />
                </div>
                </Link>
                <div className='title'>
                    the bay area data dump
                </div>
                <div className='links'>
                    <Link className='link' to='/about'><h6>about us</h6></Link>
                    <Link className='link' to='/contact'><h6>contact</h6></Link>
                </div>
            </div>
        </div>
    )
}
export default Navbar