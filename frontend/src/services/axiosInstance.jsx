import axios from 'axios'
const instance = axios.create({
    baseURL:"http://localhost:2000/api",
    withCredentials:true
})
instance.interceptors.request.use((config)=>{
    const token= localStorage.getItem("token")
    console.log(token)
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})

instance.interceptors.response.use(
    res=>res,
    async error=>{
        const originalRequest= error.config 
        if(error.response.status==400 && !originalRequest._retry){
            originalRequest._retry=true 
            try{
                await axios.post("http://localhost:2000/api/refresh-token",{},{
                    withCredentials:true
                })
                .then((res)=>{
                    localStorage.setItem("token",res.data.accessToken)
                    originalRequest.headers.Authorization=`Bearer ${res.data.accessToken}`
                    return instance(originalRequest)
                })
            }
            catch(err){
                localStorage.removeItem("token")
                window.location.href="/login"
            }
        }
        return Promise(error)
    }
)

export default instance