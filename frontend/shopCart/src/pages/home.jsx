import React from 'react'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../AxiosCall/axios'


function home() {
  const {setUser} =useAuth()
  const navigate = useNavigate()

  const handleLogout = async()=>{
    try {
    await axiosInstance.post("/user/logout")
    setUser(null)
    navigate("/login")
      
    } catch (error) {
      console.log(error)
      
    }

  }

  return (
    <div>
      <h1>Home</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default home