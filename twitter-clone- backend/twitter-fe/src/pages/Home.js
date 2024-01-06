import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../images/logo2.png';
import profileImg from '../images/profile1.png'
/* popup button and modal */
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../src/config'
import TweetOverview from './TweetOverview';

const Home = () => {

    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.userReducer);

    /* declare variable to dispatch and navigate */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* logout functionality */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate('/login');
    }

    /* useState for popup and modal */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /*create usestate for image post */
    const [image, setImage] = useState({ preview: '', data: '' })

    /* create CONFIG_OBJ to upload image */
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    /* handleFileSelect -- to upload image */
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }

    /* add post -- to upload images */
    const addPost = async () => {

        if (image.preview === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post image is mandatory!'
            })
        } else if (caption === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post caption is mandatory!'
            })
        }
        else {
            setLoading(true);
            const imgRes = await handleImgUpload();
            const request = { description: caption, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            // write api call to create post
            const postResponse =await axios.post (`${API_BASE_URL}/api/auth/createtweet`, request, CONFIG_OBJ)
            setLoading(false);
            if (postResponse.status === 201) {
                navigate("/profile")
                console.log("Tweeted added");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred while creating tweet'
                })
            }
        }
    }

    return (
        <>
            <div className='container'>
                <div className='row mt-5'>

                    {/* Side bar */}
                    <div className='col-md-3 col-sm-3'>
                        <div className='sidebar_container1 mt-4 fs-1'>
                            <Link to='/login'>
                                <img src={logo} alt='logo' style={{ height: '70px', width: '70px', marginLeft: '20px' }} />
                            </Link>
                        </div>

                        <div className='sidebar_content ms-5'>
                            <div className='sidebar_container'>
                                {/*Home button and it is linked */}
                                <button type='button' className='custom-btn custom-btn-white mt-3 ms-3 pe-5 ps-2'>
                                    <i className="fa-solid fa-house ms-1" style={{ color: '#0c0d0d' }}></i>
                                    <Link to='/home' style={{ textDecoration: 'none', color: 'black' }}> Home</Link>
                                </button>
                            </div>

                            <div className='sidebar_container'>
                                {/* Profile button and it is linked */}
                                <button type='button' className='custom-btn custom-btn-white mt-3 ms-3 pe-5 ps-2' to='/profile'>
                                    <i className="fa-solid fa-user ms-1" style={{ color: '#0c0d0d' }}></i>
                                    <Link to='/profile' style={{ textDecoration: 'none', color: 'black' }}> Profile</Link>
                                </button>
                            </div>

                            <div className='sidebar_container'>
                                {/* Logout */}
                                <button type='button' className='custom-btn custom-btn-white mt-3 ms-3 pe-5 ps-2' onClick={() => logout()}>
                                    <i className="fa-solid fa-arrow-right-from-bracket ms-1" style={{ color: '#060709' }}></i>
                                    Logout</button>
                            </div>
                        </div>

                        {/* footer -- profile image and user name */}
                        <div className='sidebar_container2 fs-1'>
                          {user ?   <img src={profileImg} className="img-fluid float-start mt-3 profile" alt="profile pic" style={{ heigth: '70px', width: '70px' }} /> :''}
                            <div className='d-flex flex-column justify-content-center'>
                                <p className='fs-6 mt-3 mb-1 ms-2'>{user.user.fullName}</p>
                                <p className='fs-6 mb-1 ms-2'>@{user.user.userName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Home page */}
                    <div className='col-md-9 col-sm-6 mt-2'>
                        {/* New Tweet button */}
                        <div className='container'>
                            <div className='row'>
                                <div className="card shadow">
                                    <div className="card-body">
                                        <h5 className="card-title float-start fw-bold fs-4">Home</h5>
                                        <button type='button' className='btn btn-primary float-end' onClick={handleShow}>Tweet</button>
                                    </div>

                                    {/* post tweet */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <TweetOverview />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* popup for new tweet button */}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Tweet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='card shadow-sm'>
                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                <div className="d-flex align-items-center">
                                    <strong role="status">Loading...</strong>
                                    <div className="spinner-border ms-auto" aria-hidden="true"></div>
                                </div>
                            </div> : ''}
                            <div className='card-body'>
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className="mb-3">
                                            <label for="exampleFormControlTextarea1" className="form-label">Enter Content</label>
                                            <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" rows="3"></textarea>
                                        </div>
                                    </div>

                                    {/* upload images */}
                                    <div className='col-12'>
                                        <div className="mb-3">
                                            <label className="form-label">Upload Image (optional)</label>
                                            <div className='upload-Post'>
                                                <div className='dropZoneContainer'>
                                                    <input name='file' type='file' id='drop_Zone' className='FileUpload' accept='.jpg, .png, .gif' onChange={handleFileSelect} />
                                                    <div className='dropZoneOverlay'>
                                                        {image.preview && <img alt='' src={image.preview} width='200' height='200' />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* buttons close and tweet*/}
                                <div className='row mt-4 float-end'>
                                    <div className='col-12'>
                                        <div className='mx-auto mt-md-0 mt-4'>
                                            <button className='custom-btn custom-btn-white'>
                                                <span className='text-muted fs-6'>Close</span>
                                            </button>
                                            <button className='custom-btn custom-btn-white' onClick={() => addPost()} >
                                                <span className='text-muted fs-6'>Tweet</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default Home