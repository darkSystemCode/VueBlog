
const state = {
  drawerState: false,
  asideColor: '#5F4B8B',
  aTextColor: '#FFFFFF',
  aActiveColor: '#ff6600',
  headerBColor: '#5F4B8B',
  headerColor: '#FFFFFF',
  theme_color: '#5F4B8B',
  doubleOpen: false,
  crumbsState: true,
  leftMenu: false
}

const getters = {
  openDrawer: state => {
    return state.drawerState
  },
  AsideColor: state => {
    return state.asideColor
  },
  ATextColor: state => {
    return state.aTextColor
  },
  ActiveColor: state => {
    return state.aActiveColor
  },
  HeaderBColor: state => {
    return state.headerBColor
  },
  HeaderColor: state => {
    return state.headerColor
  },
  DoubleOpen: state => {
    return state.doubleOpen
  },
  CrumbsState: state => {
    return state.crumbsState
  },
  getLeftMenu: state => {
    return state.leftMenu
  },
  getTheme_color: state => {
    return state.theme_color
  }
}

const mutations = {
  asideChange(state, changeColor) {
    state.asideColor = changeColor
    window.localStorage.setItem("asideColor", changeColor)
  },
  textChange(state, changeColor) {
    state.aTextColor = changeColor
    window.localStorage.setItem("navTextColor", changeColor)
  },
  activeChange(state, changeColor) {
    state.aActiveColor = changeColor
    window.localStorage.setItem("navActiveColor", changeColor)
  },
  headerBChange(state, changeColor) {
    state.headerBColor = changeColor
    window.localStorage.setItem("headerBColor", changeColor)
  },
  headerChange(state, changeColor) {
    state.headerColor = changeColor
    window.localStorage.setItem("headerColor", changeColor)
  },
  valueChange(state, changeValue) {
    state.doubleOpen = changeValue
  },
  setDrawerState(state, value) {
    state.drawerState = value
  },
  setCrumbsState(state, value) {
    state.crumbsState = value
  },
  setLeftMenu(state, value) {
    state.leftMenu = value
  },
  setTheme_color(state, value) {
    state.theme_color = value
    window.localStorage.setItem("themeColor", value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}