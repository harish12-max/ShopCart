import axios from "axios"

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        'content-type':"application/json"
    }
})

export default axiosInstance;