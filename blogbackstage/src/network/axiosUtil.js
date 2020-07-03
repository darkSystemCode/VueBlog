import Axios from "axios";

export default function axiosUtil(config) {
    const instance = Axios.create({
      baseURL: 'http://localhost:81',
      withCredentials: true //可携带cookie
      /*  ,
        timeout: 5000,*/
    })
    //响应拦截器
    instance.interceptors.response.use(res => {
      return res.data
    }, error => {
      console.log(error)
    })
    return instance(config)
}