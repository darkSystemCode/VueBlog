import {axiosUtil} from "./axiosUtil";
export function setMineInfo(author, skills, introduce, avatar, backAvatar) {
  return axiosUtil({
    url: '/setMine',
    data: {
      author: author,
      skill: skills,
      introduce: introduce,
      avatar: avatar,
      backgAvatar: backAvatar
    },
    method: 'post'
  })
}