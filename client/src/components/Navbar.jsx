import React from 'react'
import Logo from '../img/logo_tmp.jpeg'
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='container'>
                <div className='logo'>
                    <img src={Logo} alt="" />
                </div>
                <div className='links'>
                    <Link className='link' to='/?cat=art'><h6>ART</h6></Link>
                    <Link className='link' to='/?cat=food'><h6>FOOD</h6></Link>
                    <Link className='link' to='/?cat=maps'><h6>MAPS</h6></Link>
                    <Link className='link' to='/?cat=trash'><h6>TRASH</h6></Link>
                </div>
            </div>
        </div>
    )
}
export default Navbar