<template>
  <div class=payment>
    <nav v-show=!weixinStatus><em @click=goback></em>支付成功</nav>
    <img src="./pay.png"/>
    <h1>支付成功</h1>
    <!--<p class=countDown>{{seconds}}S</p>
    <p>您的预购码是</p>
    <p class=orderCode>{{coupon}}</p>
    <P>{{presaleDesc}}</P>-->
  </div>
</template>
<script>
  import $ from 'jquery'
  var URL = 'http://demo.easyto.com/api'
  export default {
    data () {
      return {
        weixinStatus: false,
        coupon: '',
        presaleDesc: '',
        seconds: 3
      }
    },
    created () {
      document.title = '支付成功'
      this.getCode()
    },
    mounted () {
      setInterval(this.downTime, 1000)
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
      }, // 获取预购码
      getCode () {
        var userId = localStorage.getItem('userId')
        var deviceId = localStorage.getItem('deviceId')
        var token = localStorage.getItem('token')
        var href = window.location.href
        var index = href.lastIndexOf('/')
        var orderId = href.substring(index + 1)
        $.ajax({
          url: URL + '/api/v1.0/translator/presale/coupon',  // 后台登录地址
          type: 'get',
          // contentType:"application/json; charset=utf-8",
          data: {
            user_id: userId,
            device_id: deviceId,
            token: token,
            orderId: orderId
          },
          success: (response) => {
            if (response.code === 200) {
              this.presaleDesc = response.data.presaleDesc
              this.coupon = response.data.coupon
            }
          }
        })
      },
      downTime () {
        if (this.seconds > 0) {
          this.seconds = this.seconds - 1
        } else {
          this.$router.replace({path: '/'})
          return
        }
      }, // 返回上一级
      goback () {
        window.history.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/app";

  .payment {
    overflow: hidden;
    text-align: center;
    font-family: HiraginoSansGB-W3;
    font-size: 30px;
    color: #9B9B9B;
    line-height: rem(45);
    padding: 0 rem(45);
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
      }
    }
    img {
      display: block;
      width: rem(91);
      height: rem(91);
      margin: 0 auto;
      margin-top: rem(260);
    }
    h1 {
      font-family: HiraginoSansGB-W6;
      font-size: rem(40);
      color: #F5A623;
      line-height: rem(60);
      font-weight: bold;
      margin-top: rem(23);
    }
    .countDown {
      margin: rem(20) 0 rem(30);
      font-size: rem(36);
    }
    .orderCode {
      margin-bottom: rem(30);
      font-size: rem(36);
      color: #000;
    }
  }
</style>
