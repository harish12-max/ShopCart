import React from 'react'
import { useAuth } from '../Context/AuthContext'
import {useNavigate} from "react-router-dom"


function PublicRoute({children}) {
    const {user , loading} = useAuth();
    const navigate = useNavigate()

    if(loading){
      return <h1>loading...</h1>
    }

    if(user){
        return navigate("/home") 
    }
  return children
}

export default PublicRoute