import React, { useEffect, useState } from 'react';
import './Profile.css'
import profilePhot from '../images/image3.jpg';
import logo from '../images/logo2.png';
import { Link, useNavigate} from 'react-router-dom';
import profileImg from '../images/profile1.png'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {

    const user = useSelector(state => state.userReducer);

    /* edit profile useState */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /* upload profile pic useState */
    const [showPost, setShowPost] = useState(false);
    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    /*create usestate for image post */
    const [image, setImage] = useState({ preview: '', data: '' })

    /* creates useState for get all my tweet */
    const [allmytweet, setAllmytweet] = useState([]);

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

    /* create const get all my tweet */
    const getAllmytweet = async () => {
        console.log("getAllTweet");
        const response = await axios.get(`${API_BASE_URL}/api/auth/allmytweet`, CONFIG_OBJ);

        if (response.status === 200) {
            setAllmytweet(response.data.posts);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occured while getting all tweets'
            })
        }
    }

    /* create handle file select for upload image */
    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }

    /* to add profile pic */
    const profilePic = async () => {

        if (image.preview === '') {
            Swal.fire({
                icon: 'error',
                title: 'Profile pic is mandatory!'
            })
        } 
        else {
            
            const imgRes = await handleImgUpload();
            const request = {image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            // write api call to create post
            const postResponse =await axios.post (`${API_BASE_URL}/api/auth/register`, request, CONFIG_OBJ)
            
            if (postResponse.status === 201) {
                console.log("Profile photo added");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred while adding profile pic'
                })
            }
        }
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }

    /* config */
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    
    useEffect(() => {
        getAllmytweet();
    });

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
                            <img src={profileImg} className="img-fluid float-start mt-3 profile" alt="profile pic" style={{ heigth: '70px', width: '70px' }} />
                            <div className='d-flex flex-column justify-content-center'>
                                <p className='fs-6 mt-4 mb-1 ms-2'>{user.user.fullName}</p>
                                {/* location - css styles */}
                                <p className='fs-6 mb-1 ms-2'>@{user.user.userName}</p>
                            </div>
                        </div>
                    </div>

                    {/* profile page of the user */}
                    <div className='col-md-9 col-sm-6 mt-2'>
                        <div className='container'>
                            <div className='row'>
                                <div className='card shadow'>
                                    <div className="card-body">
                                        <h5 className="card-title float-start fw-bold fs-3">Profile</h5>
                                    </div>

                                    <hr className='text-muted' />

                                    {/* user details */}
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <img className='img-fluid ms-2' src={profilePhot} alt='profile _Photo' style={{ height: '90px', width: '90px', borderRadius: '50%' }} />
                                            <p className='d-flex flex-column fs-6 mt-3 mb-1 ms-3'>{user.user.fullName}</p>
                                            <p className='fs-6 mb-1 ms-3 text-muted'>{user.user.userName}</p>

                                            {/* dob, joine date, location */}
                                            <div className='col-md-6 d-flex flex-column justify-content-between count-section mt-3 '>
                                                <div className='d-flex justify-content-equal mx-auto'>
                                                    <div className='count-section text-center fw-bold'>
                                                        <p><i className="fa-solid fa-cake-candles"></i>12/07/1997</p>
                                                    </div>
                                                    <div className='count-section text-center fw-bold ms-4'>
                                                        <p><i className="fa-solid fa-location-dot"></i>Delhi</p>
                                                    </div>
                                                    <div className='count-section text-center fw-bold ms-4'>
                                                        <p><i className="fa-regular fa-calendar"></i>01/10/2020</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* followers and following */}
                                            <div className='col-md-6 d-flex flex-column justify-content-between mt-2'>
                                                <div className='d-flex justify-content-equal mx-auto'>
                                                    <div className='ps-md-5 ps-1 text-center fw-bold'>
                                                        <h6>{allmytweet.length}</h6>
                                                        <p>Followers</p>
                                                    </div>
                                                    <div className='ps-md-5 ps-4 text-center fw-bold'>
                                                        <h6>{allmytweet.length}</h6>
                                                        <p>Following</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* buttons */}
                                        <div className='col-md-6 col-sm-12'>
                                            <div className='row mt-5'>
                                                <div className='col d-flex flex-column justify-content-between'>
                                                    <button className='custom-btn custom-btn-white float-end' onClick={handlePostShow}>
                                                        <span className='fw-600 fs-6'>Upload profile photo</span>
                                                    </button>

                                                    <button className='custom-btn custom-btn-white float-end mt-3' onClick={handleShow}>
                                                        <span className='fw-600 fs-6'>Edit profile</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='text-muted' />

                                    {/* tweets by user */}
                                    <div className='card'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                {allmytweet.map((post) => {
                                                    return (
                                                        <div className='col-12 mt-2'>
                                                            <img className='img-fluid post-image' src={post.image} alt={post.description} />
                                                        </div>
                                                    )
                                                })}

                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit profile popup */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" placeholder='Enter Full Name' />
                            </div>
                            <div className="mb-3">
                                <label for="exampleInputLocation" className="form-label">Location</label>
                                <input type="text" className="form-control" placeholder='Enter location' />
                            </div>
                            <div className="mb-3">
                                <label for="exampleInputDateofbirth" className="form-label">Date of Birth</label>
                                <input type="text" className="form-control" placeholder='dd-mm-yyyy' />
                            </div>

                            {/* buttons in edit profile */}
                            <div className='row mt-4 float-end'>
                                <div className='col-12'>
                                    <div className='mx-auto mt-md-0 mt-4'>
                                        <button className='custom-btn custom-btn-white'>
                                            <span className='text-muted fs-6'>Close</span>
                                        </button>
                                        <button className='custom-btn custom-btn-white'>
                                            <span className='text-muted fs-6'>Edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                </Modal>

                {/* upload profile pic */}
                <Modal show={showPost} onHide={handlePostClose} size='md' centered>
                    <Modal.Header closeButton>
                        <span className='fw-bold fs-2'>Upload Profile pic</span>
                    </Modal.Header>
                    <Modal.Body>

                        {/* alert message */}
                        <div className="alert alert-primary" role="alert">
                            Note: The image should be square in shape.
                        </div>

                        {/* upload profile pic */}
                        <div className='row'>
                            <div className='col-md-6 col-sm-12'>
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

                        <hr className='text-muted mt-4' />

                        {/* buttons -- save and close */}
                        <div className='row mt-4 float-end'>
                            <div className='col-12'>
                                <div className='mx-auto mt-md-0 mt-4'>
                                    <button className='custom-btn custom-btn-white'>
                                        <span className='text-muted fs-6'>Close</span>
                                    </button>
                                    <button className='custom-btn custom-btn-white' onClick={()=>profilePic()}>
                                        <span className='text-muted fs-6'>Save Profile pic</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}

export default Profile
