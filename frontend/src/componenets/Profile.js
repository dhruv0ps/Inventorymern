import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { userId } = useParams(); 

    useEffect(() => {
         fetchusers();
    },[])

    const fetchusers = async() => {
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profilelogin/:${userId}`)
      
    }
  return (
    <div>
    <h1>Welcome, User!</h1>
    <p>User ID from URL: {userId}</p> 
</div>
  )
}

export default Profile
