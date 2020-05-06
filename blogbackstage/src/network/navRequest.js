import {axiosUtil} from './axiosUtil'
export function setNav(title, path) {
  return axiosUtil({
    url: '/setNav',
    data: {
      title: title,
      path: path
    },
    method: 'post'
  })
}

export function getNav() {
  return axiosUtil({
    url: '/getNav',
    method: 'post'
  })
}

export function setChildNav(parentID, title, path) {
  return axiosUtil({
    url: '/setChildNav',
    method: 'post',
    data: {
      navNumber: parentID,
      childTitle: title,
      childPath: path
    }
  })
}

export function getChildNav(index) {
  return axiosUtil({
    url: '/getChildNav',
    method: 'get',
    params: {
      parentIndex: index
    }
  })
}