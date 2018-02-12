<template>
<div class=noOrder>
  <nav v-show=!weixinStatus><em @click=goback></em>我的预购</nav>
  <img src="./noorder.png"/>
  <p>您还没有预购产品哦~</p>
</div>
</template>
<script>
  export default {
    data () {
      return {
        weixinStatus: false
      }
    },
    created () {
      document.title = '我的预购'
      this.isWeiXin()
    },
    mounted () {
    },
    methods: {
      isWeiXin () {
        let ua = navigator.userAgent.toLowerCase()
        let uaTest = ua.match(/MicroMessenger/i)
        if (uaTest === null || uaTest === 'null' || uaTest === 'undefined' || uaTest === undefined) {
          this.weixinStatus = false
        } else {
          if (uaTest[0] && ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
            this.weixinStatus = true
          }
        }
      }, // 返回上一级
      goback () {
        this.$router.push({path: '/'})
      }
    }
  }
</script>


<style lang="scss" scoped>
   @import "../../assets/css/app";
  .noOrder{
    overflow: hidden;
    text-align: center;
    font-family: HiraginoSansGB-W3;
    font-size: rem(30);
    color: #9B9B9B;
    nav {
      font-size: rem(36);
      color: #4A4A4A;
      text-align: center;
      line-height: rem(120);
      height: rem(90);
      overflow: hidden;
      em {
        width: rem(23);
        height: rem(43);
        background: url("back.png") no-repeat center;
        background-size: 100% 100%;
        display: inline-block;
        float: left;
        margin-top: rem(40);
        cursor: pointer;
        margin-left: rem(20);
      }
    }
    img{
      width: rem(95);
      height: rem(95);
      margin: 0 auto;
      margin-top: rem(330);
      margin-bottom: rem(50);
    }
  }
</style>
