import React from 'react'
import './Card.css'
import moreAction from '../images/more-action.PNG'
import profilePic from '../images/profile-pic.jpg'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../config';


const Card = (props) => {

    const user = useSelector(state => state.userReducer);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    /* create likes */
    const likePost = async(postId) =>{
        const request = {"postId": postId};
        const response = await axios.put(`${API_BASE_URL}/like`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllPosts();
        }
    }

    return (
        <div>
            {/* card */}
            <div className='card shadow-sm'>
                <div className='card-body px-2'>
                    <div className='row'>
                        {/* column 1  */}
                        <div className='col-6 d-flex'>
                            {/* image section */}
                            <img className='p-2 profilePic' src={profilePic} alt='porfilePic'></img>

                            {/* title and description */}
                            <div className='d-flex flex-column justify-content-center mt-2'>
                                <p className='fs-6 fw-bold'>{props.postData.author.fullName}</p>
                                {/* location - css styles */}
                                <p className='location'>{props.postData.location}</p>
                            </div>
                        </div>

                        {/* column 2  more action */}
                        {props.postData.author._id === user.user._id ? <div className='col-6'>
                            <img onClick={()=> props.deletePost(props.postData._id)} style={{ cursor: "pointer" }} className='float-end fs-3 p-2 mt-2' alt="more action" src={moreAction} />
                        </div> : ""}
                    </div>

                    {/* second row -> post- image */}
                    <div className='row'>
                        <div className='col-12'>
                            <img className='p-2 img-fluid' src={props.postData.image} alt={props.postData.description} style={{borderRadius:'25px'}}/>
                        </div>
                    </div>

                    {/* third row - left side - icons ad right side - likes */}
                    <div className='row mt-2'>
                        <div className='col-6'>
                            <i onClick={()=>likePost(props.postData._id)} className=" ms-3 me-3 fs-5 fa-regular fa-heart"></i>
                            <i className="me-3 fs-5 fa-regular fa-comment"></i>
                            <i className="me-3 fs-5 fa-solid fa-location-arrow"></i>
                        </div>
                        <div className='col-6'>
                            <span className='pe-2 fs-5 float-end'>{props.postData.likes.length} likes</span>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <p className='text-muted mt-2 ms-3'>2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Card