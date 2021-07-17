import Axios from 'axios'

//读取左侧导航栏的json文件
export default function getNav() {
  return Axios({
    url: location.protocol + "/nav.json",
    method: 'get'
  })
}
