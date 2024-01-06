import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
/* image1 for medium size device */
import Logo from '../images/image1.jpg'
/* logo2 image for small size device */
import Logo2 from '../images/logo2.png';
import './Login.css'
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../src/config'
import axios from 'axios'
import { useDispatch } from 'react-redux';

const Signup = () => {

    /* created useState */
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    /* declare variable to dispatch and navigate */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* loading spinner */
    const [loading, setLoading] = useState(false);

    /* created register for onSubmit form */
    const register = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { fullName: fullName, email, password, userName }
        axios.post(`${API_BASE_URL}/api/auth/register`, requestData)
            .then((result) => {

                if (result.status === 201) {
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                    setLoading(false);
                    navigate('/login');
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    })
                }
                setFullName('');
                setEmail('');
                setPassword('');
                setUserName('');

            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred please try again later!'
                })
            })
    }

    return (
        <>
            <div className='container login-container'>
                <div className='row shadow p-4'>
                    {/* image section  */}
                    <div className='col-md-7 d-flex justify-content-center align-items-center'>
                        {/* responsive image for medium and small device */}
                        <img className='social-large img-fluid' src={Logo} alt='logo' style={{ height: '500px', width: '400px' }} />
                        <img className='social-small' src={Logo2} alt='Logo2' style={{ height: '100px', width: '100px', marginBottom: '20px' }} />
                    </div>
                    <div className='col-md-5'>
                        {/* card */}
                        <div className="card shadow-sm">
                            <div className="card-body px-5">
                                {loading ? <div className='col-md-12 mt-3 text-center'>
                                    <div className="d-flex align-items-center">
                                        <strong role="status">Loading...</strong>
                                        <div className="spinner-border ms-auto" aria-hidden="true"></div>
                                    </div>
                                </div> : ''}
                                {/* heading */}
                                <h5 className="card-title fw-bold mt-2 ms-2">Register</h5>
                                <form onSubmit={(e) => register(e)}>
                                    {/* input-bg --- css */}
                                    <input type="text" value={fullName} onChange={(ev) => setFullName(ev.target.value)} className="form-control input-bg mt-4 mb-2 p-2" placeholder='Enter full name' />
                                    <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="form-control input-bg mt-3 mb-2 p-2" placeholder='Enter email' />
                                    <input type="text" value={userName} onChange={(ev) => setUserName(ev.target.value)} className="form-control input-bg mt-3 mb-2 p-2" placeholder='Enter username' />
                                    <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="form-control input-bg mt-3 p-2 mb-2" placeholder='Enter password' />
                                    {/* button */}
                                    <div className=' mt-3 d-grid'>
                                        <button type='submit' className="custom-btn custom-btn-blue">Submit</button>
                                    </div>

                                    {/* next to login button */}
                                    <div className='my-4'>
                                        <hr className='text-muted' />
                                        <h5 className='text-muted text-center'>OR</h5>
                                        <hr className='text-muted' />
                                    </div>

                                    {/* signup button in login page */}
                                    <div className='mt-3 mb-5 d-grid'>
                                        <button className="custom-btn custom-btn-white">
                                            <span className='text-muted fs-6'>Don't have an account?</span>
                                            <Link to='/login' className='ms-1 text-info fw-bold'>Log In</Link>
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
