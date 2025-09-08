import axios from "axios"

//instancia de axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('AUTH_TOKEN')
    //si tiene un token que lo envie
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
   /*  {
        headers: {
             Authorization: 
        } 
    } */
    return config
})

export default api