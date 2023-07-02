import axios from "axios";
import baseURL from "./baseURL";
import SweetAlert from "../components/Playground/SweetAlert";
import Redirect, { navigate } from "./navigate";
const axiosClient = new axios.create({
    baseURL: baseURL
})

axiosClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const accessToken = user?.token;
        config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : ''
        return config;
    },
    (error) => Promise.reject(error)

)

axiosClient.interceptors.response.use((res) => {
    return res
}, (error) => {
    console.log(error)
    if (error?.response?.data?.message === "Invalid/Expired token, please login again") {
        localStorage.removeItem('userInfo')
        // window.location.assign('/login')
    }
    return Promise.reject(error)
}
)

export default axiosClient