import React, { useState, useEffect } from 'react'
import profile from '../images/profile-pic.jpg'
import './Profile.css'
import { Link, useNavigate } from 'react-router-dom'
/* import from modal components - bootstrap */
import Modal from 'react-bootstrap/Modal';

/* import image for carousel slider */
import carousel2 from '../images/carousel2.jpg'
import carousel3 from '../images/carousel3.jpg'

import axios from 'axios';
import { API_BASE_URL } from '../../src/config'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'

const Profile = () => {

    const user = useSelector(state => state.userReducer);

    /*create usestate for image post */
    const [image, setImage] = useState({ preview: '', data: '' })
    /* create state for caption */
    const [caption, setCaption] = useState("");
    /* create state for location */
    const [location, setLocation] = useState("");
    /* usenavigate */
    const navigate = useNavigate('');
    /* loading icon  */
    const [loading, setLoading] = useState(false);

    /*get all my post */
    const [allmyposts, setAllmyPosts] = useState([]);

    /* create post detail state, on click the popup image the detail of the image is shown */
    const [postDetail, setPostDetail] = useState({});

    /* popup */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showPost, setShowPost] = useState(false);
    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    /* create CONFIG_OBJ to upload image */
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    /* delete functionality for popup */
    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
            console.log(response, postId);
            if (response.status === 200) {
                getMyPosts();
                setShow(false);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleFileSelect = (event) => {
        const img = {
          preview: URL.createObjectURL(event.target.files[0]),
          data: event.target.files[0]
        }
        setImage(img);
      }

    /* upload image */
   const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append('file', image.data);

    const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
    return response;
  }

    /* add post */
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
        } else if (location === '') {
            Swal.fire({
                icon: 'error',
                title: 'Location is mandatory!'
            })
        }
        else {
            setLoading(true);
            const imgRes = await handleImgUpload();
            const request = { description: caption, location: location, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
            // write api call to create post
            const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ)
            setLoading(false);

            if (postResponse.status === 201) {
                navigate("/posts")
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred while creating post'
                })
            }
        }
    }

    /* get Allmy post - the person who logged in */
    const getMyPosts = async () => {
        const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJ);

        if (response.status === 200) {
            setAllmyPosts(response.data.posts);
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occured while getting all your posts!'
            })
        }
    }

    /* create showDetail   */
    const showDetail = (post) => {
        setPostDetail(post);
    }
    useEffect(() => {
        getMyPosts();
    },);

    return (
        <div>
            <div className='container shadow mt-3 p-4'>
                <div className='row bg-light'>

                    {/* column 1 */}
                    <div className='col-md-6 d-flex flex-column'>
                        <img className="p-2 profile-image img-fluid" src={profile} alt='profile-pic' />
                        <p className='fw-bold fs-5 ms-3'>{user.user.fullName}</p>
                        <p className='fs-5 ms-3'>{user.user.email}</p>
                        <p className='fs-5 ms-3'>UI/UX designer <Link>@redux</Link> | Follow <Link>{user.user.fullName}</Link></p>
                        <p className='fs-5 ms-3'>My portfolio on <Link>www.portfolio.com</Link>{user.user.fullName}</p>
                    </div>

                    {/*column 2 */}
                    <div className='col-md-6 d-flex flex-column justify-content-between mt-3'>
                        <div className='d-flex justify-content-equal mx-auto'>
                            <div className='count-section pe-md-5 pe-4 text-center fw-bold'>
                                <h4>{allmyposts.length}</h4>
                                <p>Posts</p>
                            </div>
                            <div className='count-section px-md-5 px-4 text-center fw-bold'>
                                <h4>20</h4>
                                <p>Followers</p>
                            </div>
                            <div className='ps-md-5 ps-4 text-center fw-bold'>
                                <h4>10</h4>
                                <p>Following</p>
                            </div>
                        </div>
                        {/* Button section */}
                        <div className='mx-auto mt-md-0 mt-4'>
                            <button className='custom-btn custom-btn-white'>
                                <span className='text-muted fs-6'>Edit profile</span>
                            </button>
                            <button className='custom-btn custom-btn-white' onClick={handlePostShow}>
                                <span className='text-muted fs-6'>Upload Post</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* hr tag */}
                <div className='row my-3'>
                    <div className='col-12'>
                        <hr />
                    </div>
                </div>

                {/* gallery section */}
                <div className='row mb-3'>
                    {allmyposts.map((post) => {
                        return (
                            <div className='col-md-4 col-sm-12' key={post._id}>
                                <div className="card" onClick={handleShow}>
                                    <img onClick={() => showDetail(post)} src={post.image} className="card-img-top" alt={post.description} />
                                </div>
                            </div>
                        )
                    })
                    }

                </div>
            </div>

            {/* popup */}
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>
                    {/* onclick the button need to display the image */}
                    <div className='row'>
                        {/* Carousel Slider */}
                        <div className='col-md-6'>
                            <div id="carouselExampleIndicators" className="carousel slide">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={postDetail.image} alt="" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={carousel2} className="d-block w-100" alt="image2" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={carousel3} className="d-block w-100" alt="image3" />
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>

                        {/* description of the image */}
                        <div className='col-md-6'>
                            <div className='row'>
                                {/* column 1  */}
                                <div className='col-6 mt-2 d-flex'>
                                    {/* title and description */}
                                    <div className='d-flex flex-column justify-content-center mt-2'>
                                        <p className='fs-6 fw-bold'>{postDetail.description}</p>
                                        {/* location - css styles */}
                                        <p className='location'>{postDetail.location}</p>
                                    </div>
                                </div>

                                {/* column 2 */}
                                <div className='col-6'>
                                    <div className="dropdown">
                                        <button className="btn" type="button" data-bs-toggle="dropdown">
                                            <i className="fa-solid fa-ellipsis me-7" style={{ color: '#020408' }}></i>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link className="dropdown-item" href="#">
                                                    <i className="fa-regular fa-pen-to-square px-2"></i>Edit Post
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" onClick={() => deletePost(postDetail._id)}>
                                                    <i className="fa-solid fa-trash px-2"></i>Delete Post
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-12'>
                                    <p className='text-muted mt-2 ms-2'>2 hours ago</p>
                                </div>
                            </div>
                            {/* second row -> description of the image */}
                            <div className='row'>
                                <div className='col-12 ms-2'>
                                    <p>Lorem ipsum dummy text lorem ipsum dummy text. Lorem ipsum dummy text lorem ipsum dummy text.</p>
                                </div>
                            </div>

                            {/* third row - left side - icons ad right side - likes */}
                            <div className='row mt-2'>
                                <div className='col-6'>
                                    <i className=" ms-2 me-3 fs-5 fa-regular fa-heart"></i>
                                    <i className="me-3 fs-5 fa-regular fa-comment"></i>
                                    <i className="me-3 fs-5 fa-solid fa-location-arrow"></i>
                                </div>
                                <div className='col-12 mt-3 ms-2'>
                                    <span className='pe-2 fs-5 fw-bold'>200 likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Upload image */}
            <Modal show={showPost} onHide={handlePostClose} size='lg' centered>
                <Modal.Header closeButton>
                    <span className='fw-bold fs-2'>Upload Image</span>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6 col-sm-12'>
                            <div className='upload-Post'>
                                <div className="dropZoneContainer">
                                    <input type="file" id="drop_zone" className="FileUpload" accept=".jpg,.png,.gif" onchange={handleFileSelect} />
                                    <div className="dropZoneOverlay"><i className="fa-solid fa-cloud-arrow-up fs-1"></i><br />Upload Photo From Computer</div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-around'>
                            <div className='row'>
                                <div className='col-sm-12 mb-3'>
                                    <div className="form-floating">
                                        <textarea onChange={(ev) => { setCaption(ev.target.value) }} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                                        <label for="floatingTextarea">Add Caption</label>
                                    </div>
                                </div>

                                <div className='col-sm-12'>
                                    <div className="form-floating mb-5">
                                        <input type="text" onChange={(ev) => { setLocation(ev.target.value) }} className="form-control" id="floatingInput" placeholder="Add location" />
                                        <label for="floatingInput"><i className="fa-solid fa-location-dot px-2"></i>Add location</label>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-12'>
                                        {loading ? <div className='col-md-12 mt-3 text-center'>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div> : ''}
                                        <button onClick={() => addPost()} className='custom-btn custom-btn-pink float-end'>
                                            <span className='fw-600 fs-6'>Post</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Profile