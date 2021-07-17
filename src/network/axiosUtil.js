import Axios from "axios";
import ElMsg from 'element-ui'

function axiosUtil(config) {
  const instance = Axios.create({
    baseURL: 'http://localhost:8808',
    // timeout: 5000,
    // headers: {'token': window.localStorage.getItem("token")}
  })
  /**
   * 判断是否存在本地token 如果存在则请求前携带上token 否则不携带token请求
   */
  if((window.localStorage.getItem("token") == null? '': window.localStorage.getItem("token")) != '') {
    instance.defaults.headers = {'token': window.localStorage.getItem("token")}
  }
  //响应拦截器
  instance.interceptors.response.use(res => {
    if(res.data.code === 20010 && res.data.type == 'error') {
      ElMsg.Message({
        message: res.data.msg,
        type: res.data.type,
        duration: 3000
      })
    }
    return res.data
  }, error => {
    console.log(error)
  })
  return instance(config);
}

function request_get(config) {
  return axiosUtil({
    url: config.url,
    method: 'GET',
    params: (config.data == null || config.data == '')? '': config.data
  })
}

function request_post(config) {
  return axiosUtil({
    url: config.url,
    method: 'POST',
    data: config.data
  })
}

export {request_get, request_post}