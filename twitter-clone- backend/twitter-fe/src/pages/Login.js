import React, { useState } from 'react';
/* image1 for medium size device */
import Logo from '../images/image1.jpg'
/* logo2 image for small size device */
import Logo2 from '../images/logo2.png'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config'
import { useDispatch } from 'react-redux';

const Login = () => {

    /* create useState for email, password, loading */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

     /* declare variable to dispatch and navigate */
     const dispatch = useDispatch();
     const navigate = useNavigate();

     /* create login functionality */
    const login = (event) => {
        event.preventDefault();
        setLoading(true);
        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/api/auth/login`, requestData)
            .then((result) => {
                if (result.status === 200) {
                    setLoading(false);
                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem('user', JSON.stringify(result.data.result.user));
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                    setLoading(false);
                    navigate('/home');
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
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
                                <h5 className="card-title fw-bold mt-2 ms-2">Log In</h5>
                                <form onSubmit={(e)=> login(e)}>
                                    {/* input-bg --- css */}
                                    <input type="email" value={email} onChange={(ev)=> setEmail (ev.target.value)} className="form-control input-bg mt-4 mb-2 p-2" placeholder='Enter email' />
                                    <input type="password" value={password} onChange={(ev)=> setPassword (ev.target.value)} className="form-control input-bg p-2 mb-2" placeholder='Enter password' />
                                    {/* button */}
                                    <div className='mt-3 d-grid'>
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
                                            <Link to='/signup' className='ms-1 text-info fw-bold'>Register here</Link>
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

export default Login