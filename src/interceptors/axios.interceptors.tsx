import axios from "axios"

export const PrivatePublicInterceptors = () => {
    axios.interceptors.request.use((request) => {
       // console.log("start request", request);
        return request
    })
}