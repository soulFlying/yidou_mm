<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang=scss>
  *{
    padding: 0;
    margin: 0;
  }
  body,html{
   /* max-width: 992px; */
    min-width: 320px;
    margin: 0 auto;
  }
  /*html{*/
    /*background: #F1F0F6;*/
  /*}*/
#app {
  /*font-family: 'PingFangSC-Light','HiraginoSansGB-W3','HiraginoSansGB-W6','PingFangSC-Regular';*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4A4A4A;
}
</style>
