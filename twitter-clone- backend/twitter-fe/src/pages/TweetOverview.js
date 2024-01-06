import React, { useEffect, useState } from 'react'
import Card from '../components/Card';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2';



const TweetOverview = () => {

  const [alltweet, setAlltweet] = useState([]);

  /* config */
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }

  /* create get all tweet functionality */
  const getAllTweet = async()=>{
    console.log("getAllTweet");
    const response = await axios.get(`${API_BASE_URL}/api/auth/alltweet`, CONFIG_OBJ);
    
    if(response.status === 200){
      setAlltweet(response.data.posts);
    } else{
      Swal.fire({
        icon: 'error',
        title: 'Some error occured while getting all tweets'
      })
    }
  }

  /* delete tweet who posted the tweet */
  const deleteTweet = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/api/auth/deletetweet/${postId}`, CONFIG_OBJ);
    if (response.status === 200) {
      getAllTweet();
    }
  }

  /* use effect for get all tweet */
  useEffect(()=>{
    getAllTweet();
  });

  return (
    <>
      <div className='container'>
        <div className='row'>
        {alltweet.map((post)=>{
          return(
            <Card postData = {post} deleteTweet={deleteTweet} getAllTweet={getAllTweet}/>
          )
        })}
        </div>
      </div>
    </>
  )
}

export default TweetOverview
