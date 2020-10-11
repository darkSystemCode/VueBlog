import Axios from 'axios'

export default function getNav() {
  return Axios({
    url: location.protocol + "/nav.json",
    method: 'get'
  })
}
