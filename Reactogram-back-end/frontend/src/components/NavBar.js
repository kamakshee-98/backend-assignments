import React from 'react'
import './NavBar.css'
import logo from '../images/logo.PNG'
import { Link,useNavigate } from 'react-router-dom'
import profilePic from '../images/profile-pic.jpg'
import { useDispatch, useSelector } from 'react-redux'

const NavBar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.userReducer);
    

    /* create a const for logout */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        dispatch({ type: "LOGIN_ERROR" });
        navigate('/login');
    }
    return (
        <div>
                        {/* navbar */}
            <nav className="navbar bg-body-tertiary shadow-sm">
                <div className="container-fluid">
                    <Link className='navbar-brand ms-5' to="/">
                        <img src={logo} alt='logo' height="45px" />
                    </Link>

                    <form className="d-flex me-md-5" role="search">
                        <input className="searchBox form-control me-4 text-muted" type="search" placeholder="Search" aria-label="Search" />
                        {/* mobile responsive search icon */}
                        <Link className="nav-link text-dark fs-5 me-4 mt-2 searchIcon" to="#"><i className="fa-solid fa-magnifying-glass"></i></Link>
                        <Link className="nav-link text-dark fs-5 me-4 mt-2" to="/posts"><i className="fa-solid fa-house"></i></Link>
                        {user? <Link className="nav-link text-dark fs-5 me-4 mt-2" to="#"><i className="fa-regular fa-heart"></i></Link> :''}

                        {/*dropdown link */}
                        <div className="dropdown">
                            {user ? <> <button className="btn" type="button" data-bs-toggle="dropdown">
                                <img className='p-2  nav-profilePic' src={profilePic} alt='porfilePic'></img>
                            </button> 
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item mt-0" to="/myprofile">My profile</Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/login" onClick={()=>logout()}>
                                        Logout
                                    </Link>
                                </li>
                            </ul> </> :''}
                        </div>

                    </form>
                </div>
            </nav>
        </div>
    )
}

export default NavBar