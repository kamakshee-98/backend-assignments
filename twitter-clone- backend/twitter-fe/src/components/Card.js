import React, { useState } from 'react'
import './Card.css'
import profilePic from '../images/image2.jpg';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Card = (props) => {

    /* config */
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    /* create like */
    const unlikePost = async (postId, type) => {
        const request = { "postId": postId }
        const response = await axios.put(`${API_BASE_URL}/api/auth/${type}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllTweet();
        }
    }

    /* create comment box and comments state */
    const [commentBox, setCommentBox] = useState(false);
    const [comments, setComments] = useState(" ");

    /* useSelector */
    const user = useSelector(state => state.userReducer);

    /* create comment box functionality */
    const submitComment = async (postId) => {
        setCommentBox(false);
        const request = { "postId": postId, "commentText": comments }
        const response = await axios.put(`${API_BASE_URL}/api/auth/comment`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllTweet();
        }
    }

    /* create retweet functionality */
    const retweet = async (postId) => {
        const request = { "postId": postId }
        const response = await axios.put(`${API_BASE_URL}/api/auth/retweet`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllTweet();
        }
    }

    return (
        <>
            {/*tweets */}
            <div className='card shadow-sm mt-4 ms-2 me-4'>
                <div className='card-body'>
                    {/* profile pic and delete icon */}
                    <div className='row'>
                        {/* profile pic */}
                        <div className='col-7'>
                            <img className='profile-pic' src={profilePic} alt='profilePic' style={{ height: '50px', width: '50px' }}></img>
                            <p className='d-flex flex-column fs-6 mt-3 mb-1 ms-2'>{props.postData.author.fullName}</p>
                            <p className='fs-6 mb-1 ms-2 text-muted'>12/07/2021</p>
                        </div>

                        {/* delete icon */}
                        {props.postData.author._id === user.user._id ? <div className='col-5'>
                            <span className='float-end'>
                                <i className="fa-solid fa-trash fs-4" onClick={() => props.deleteTweet(props.postData._id)}></i>
                            </span>
                        </div> : ""}
                    </div>



                    {/* post the tweets */}
                    <div className='row'>

                        <div className='col-12'>
                            <img className='img-fluid p-2' src={props.postData.image} alt='tweet' style={{ height: '250px', width: '350px', borderRadius: '10px' }} />
                        </div>

                        <div className='col-12 ms-4 mt-3'>
                            <p>{props.postData.description}</p>
                        </div>

                        {/* likes, comment, and retweet */}
                        <div className='row my-3'>
                            <div className='col-12 d-flex'>
                                {/* like the tweet */}
                                <i onClick={() => unlikePost(props.postData._id, 'like')} className="fa-regular fa-thumbs-up fs-4 ms-4"></i> {props.postData.likes.length}
                                <i onClick={() => unlikePost(props.postData._id, 'unlike')} className="fa-regular fa-thumbs-down fs-4 ms-4"></i>
                                <i onClick={() => setCommentBox(true)} className="fa-regular fa-comment fs-4 ms-4" style={{ color: '#192ed2' }}></i>
                                <i onClick={() => retweet(props.postData._id)} className="fa-solid fa-retweet fs-4 ms-4"></i> <p> {props.postData.retweet.length}</p>
                            </div>
                        </div>
                        {/* comment box */}
                        {commentBox ? <div className='row mt-2'>
                            <div className='col-7'>
                                <textarea onChange={(e) => setComments(e.target.value)} className='form-control'></textarea>
                            </div>
                            <div className='col-5'>
                                <button className='btn btn-secondary' onClick={() => submitComment(props.postData._id)}>submit</button>
                            </div>
                        </div> : ''}

                        {props.postData.comments.map((comment) => {
                            return (<>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p>{comment.commentText} - {comment.commentedBy.fullName}</p>
                                    </div>
                                </div>
                            </>)
                        })}
                       
                    </div>

                </div>
            </div>
        </>
    )
}

export default Card
