const state = {
  code: '' //验证码
}

const mutations = {
  setCode(state, code) {
    state.code = code
  }
}

export default {
  namespaced: true,
  state,
  mutations
}