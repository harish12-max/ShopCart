import axios from "axios"

const axiosInstance = axios.create({
    baseURL:"http://localhost:8082",
    withCredentials:true,
    headers:{
        'content-type':"application/json"
    }
})

export default axiosInstance;