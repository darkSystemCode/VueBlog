import Axios from "axios";
export function axiosUtil(config) {
  const instance = Axios.create({
    baseURL: 'http://localhost:8808',
    timeout: 5000,
  })
  //响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error)
  })
  return instance(config);
}