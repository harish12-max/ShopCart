import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import React from 'react'

function ProtectedRoute({children}) {
    const {user , loading } = useAuth()
    const navigate = useNavigate()

    if(loading){
        return <h1>loading...</h1>
    }

    if(!user){
        return navigate("/login")
    }

    return children
}

export default ProtectedRoute