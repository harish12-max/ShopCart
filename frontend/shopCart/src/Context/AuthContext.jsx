import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [loading, setLoader] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const respones = await axiosInstance.get("/user/me");
                setUser(respones.data);

            } catch (error) {
                setUser(null)
            } finally {
                setLoader(false)
            }
        }

        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoader }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext);
