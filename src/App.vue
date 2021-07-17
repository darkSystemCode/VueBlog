<template>
  <div id="app">
    <!--加载页面动画-->
    <div class="shadow" id="shadow">
      <div class="loading" id="loading" style="display: none">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'App',
    computed: {

    },
    created() {
      if(typeof(window.localStorage.getItem("headerBColor")) === 'string') {
        this.$store.commit('globalSetting/headerBChange', window.localStorage.getItem("headerBColor"))
      }
      if(typeof(window.localStorage.getItem("headerColor")) === 'string') {
        this.$store.commit('globalSetting/headerChange', window.localStorage.getItem("headerColor"))
      }
      if(typeof(window.localStorage.getItem("asideColor")) === 'string') {
        this.$store.commit('globalSetting/asideChange', window.localStorage.getItem("asideColor"))
      }
      if(typeof(window.localStorage.getItem("navTextColor")) === 'string') {
        this.$store.commit('globalSetting/textChange', window.localStorage.getItem("navTextColor"))
      }
      if(typeof(window.localStorage.getItem("navActiveColor")) === 'string') {
        this.$store.commit('globalSetting/activeChange', window.localStorage.getItem("navActiveColor"))
      }
      if(typeof(window.localStorage.getItem("themeColor")) === 'string') {
        this.$store.commit('globalSetting/setTheme_color', window.localStorage.getItem("themeColor"))
      }
    }
  }

  setTimeout(function () {
    let loadingDom = document.getElementById("loading")
    loadingDom.style.display = "block"
  }, 100)
  window.onload = function () {
    let loadDom = document.getElementById("loading")
    loadDom.style.display = "none"
    let shadowDom = document.getElementById("shadow")
    shadowDom.style.display = "none"
  }
</script>

<style>
  @import "assets/css/loadingAnimate.css";

  body {
    margin: 0;
    padding: 0;
  }

  .shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000000;
    z-index: 1000;
  }

  .shadow .loading {
    position: absolute;
    top: 50%;
    left: 42%;
  }
</style>
