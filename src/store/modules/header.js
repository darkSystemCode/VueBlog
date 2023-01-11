const state = {
  nav: [], //左侧导航栏数据
  isCollapse: false,  //是否收缩左侧导航栏 false为展开 true为收缩
  asideTitle: [], //存储点击左侧导航栏后的导航名，作为标题显示头
/*{
  path: '/Welcome',
      meta: {
  title: '主控制台',
      activeIndex: 0,
      close: false
}
}*/
  crumbs: [], //存储面包屑 '控制台','主控制台'
  activeIndex: 0,  //当前活跃的标题下标
  count: 0  //下标增值变量
}

const getters = {
  CollapseState: state => {
    return state.isCollapse
  },
  AsideTitle: state => {
    return state.asideTitle
  },
  active: state => {
    return state.activeIndex
  },
  Count: state => {
    return state.count
  },
  Crumbs: state => {
    return state.crumbs
  },
  Navs: state => {
    return state.nav
  }
}

const mutations = {
  setCollapse(state, payload) {
    state.isCollapse = payload
  },
  setAside(state, values) {
    state.asideTitle.push(values)
  },
  delOrAddAside(state, value) {
    state.asideTitle = value
  },
  setActiveIndex(state, value) {
    state.activeIndex = value
  },
  setCount(state, value) {
    state.count = value
  },
  setCrumbs(state, crumbs) {
    state.crumbs = crumbs
  },
  setNav(state, values) {
    state.nav = values
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}