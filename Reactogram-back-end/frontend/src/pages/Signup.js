import React, { useState } from 'react'
import './Login.css'
/* import images with class name and type of images */
import socialDesktop from '../images/social-desktop.PNG'
import socialMobile from '../images/social-mobile.PNG'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../src/config'
import Swal from 'sweetalert2'
import 'react-datepicker/dist/react-datepicker.css'



const Signup = () => {

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    

    const signup = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { fullName: fullName, email, password}
        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                
                if (result.status === 201) {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    })
                }
                setFullName('');
                setEmail('');
                setPassword('');
                
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
        <div>
            <div className="container login-conatiner">
                <div className="row">
                    <div className="col-md-7 col-sm-12 d-flex justify-content-center align-items-center">
                        <img alt="social Desktop images" className='socialDesktop' style={{ height: '85%' }} src={socialDesktop} />
                        <img alt="socail mobile images" className='socialMobile' src={socialMobile} />
                    </div>
                    {/* card */}
                    <div className="col-md-5 col-sm-12">
                        <div className="card shadow">
                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : ''}
                            <div className="card-body px-5">
                                <h4 className="card-title text-center fw-bold mt-3">Sign up</h4>

                                {/* form */}
                                <form onSubmit={(e) => signup(e)}>
                                    
                                    <p>{currentDate}</p> <p>{currentTime}</p>
                                    <input type="text" className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Phone number' />
                                    <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value) } className="p-2 mb-2 form-control input-bg" placeholder='E-mail' />
                                    <input type="text" value={fullName} onChange={(ev) => setFullName(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Full Name' />
                                    <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value) } className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                                    

                                    <div className='mt-3 d-grid'>
                                        <button type='submit' className="custom-btn custom-btn-blue" >Sign Up</button>
                                    </div>

                                    {/* text - "or" */}
                                    <div className='my-4'>
                                        <hr className='text-muted'></hr>
                                        <h5 className='text-muted text-center'>OR</h5>
                                        <hr className='text-muted'></hr>
                                    </div>

                                    {/* button for sign up */}
                                    <div className='d-grid'>
                                        <button className="custom-btn custom-btn-white">
                                            <span className='text-muted'>Already have an account?</span>
                                            <Link to="/login" className='ms-1 text-info fw-bold'>Log In</Link>
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup