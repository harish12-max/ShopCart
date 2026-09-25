import React from 'react'
import { useAuth } from '../Context/AuthContext'
import {Navigate} from "react-router-dom"
import "../styles/authRoute.css"


function PublicRoute({children}) {
    const {user , loading} = useAuth();
    

    if(loading){
      return (
        <div className="auth-route-loading">
          <div className="auth-route-loader"></div>
          <p>Loading...</p>
        </div>
      )
    }

    if(user){
        return <Navigate to={"/home"} replace/>
    }
  return children
}

export default PublicRoute