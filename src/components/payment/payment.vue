<template>
  <div class=payment>
    <nav v-show=!weixinStatus><em @click=goback></em>支付</nav>
    <img src="./payMent.png"/>
    <p class=money>订单已提交，您还需支付{{price}}元</p>
    <p class=promt>请在2小时内完成支付，以便帮您预订相关项目</p>
    <!--<div><span></span><input type=button   value='微   信' @click='wxId'></div>-->
    <div><span></span><input type=button     value='支付宝' @click='baoId'></div>
    <transition name=fade>
      <div v-show=tostShow class="tost"></div>
    </transition>
  </div>
</template>
<script>
  import $ from 'jquery'
  import pingpp from 'pingpp-js'
  var URL = 'https://yidou.easyto.com/mall'
  export default {
    data () {
      return {
        mobile: '',
        ChkNum: '',
        deviceId: '',
        color_arr: [],
        activeIndex: 0,
        tostShow: false,
        nameText: '',
        phoneText: '',
        total: 0,
        sku: '',
        color: '',
        weixinStatus: false,
        nomber: 1,
        buyNom: 1 + '台',
        orderId: '',
        price: ''
      }
    },
    created () {
      document.title = '支付'
      /* this.isWeiXin() */
      this.getId()
    },
    mounted () {
    },
    methods: {
      enterTost (text, timer) {
        let tost = document.getElementsByClassName('tost')[0]
        if (tost) {
          tost.innerHTML = text
          this.tostShow = true
          setTimeout(() => {
            this.tostShow = false
          }, timer || 3000)
        }
      }, // 获取参数
      GetQueryString (name) {
        var after = window.location.href.split('#')[1]
        if (after) {
          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
          var r = after.match(reg)
          if (r != null) {
            return decodeURIComponent(r[2])
          } else {
            return null
          }
        }
      },
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
        window.history.go(-1)
      }, // 支付宝pay
      baoId () {
        var userId = localStorage.getItem('userId')
        var deviceId = localStorage.getItem('deviceId')
        var token = localStorage.getItem('token')
       /* var uuid = localStorage.getItem('uuid')
        var mobile = localStorage.getItem('mobile') */
        var channel = 'alipay_wap'
        var successUrl = 'https://yidou.easyto.com/pay/pay_success.html'
        /* var cancel_url = '' */
        $.ajax({
          url: URL + '/api/v1/pay/pay_charge?channel=' + channel + '&orderId=' + this.orderId + '&device_id=' + deviceId + '&user_id=' + userId +
          '&token=' + token + '&success_url=' + successUrl,
          type: 'post',
          contentType: 'application/x-www-form-urlencoded;application/json;charset=UTF-8',
          dataType: 'json',
          data: '',
          success: (response) => {
            if (response.code === 401) {
              let _this = this
              _this.enterTost('登录过期，请重新登录！', 3000)
              localStorage.removeItem('deviceId')
              localStorage.removeItem('token')
              localStorage.removeItem('userId')
              setTimeout(function () {
                _this.$router.push({path: '/'})
              }, 3000)
            } else if (response.code === 404) {
              this.enterTost(response.msg, 3000)
              let _this = this
              setTimeout(function () {
                _this.$router.replace({path: '/orderLists'})
              }, 3000)
              return false
            }
            pingpp.createPayment(response.data, function (result, err) {
              if (result === 'success') {
                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回， 其他的支付结果都会跳转到 extra 中对应的 URL(后端处理)。
                // 我的项目中在微信公众号支付成功会跳转到我们的支付成功页面 window.location.href = 'success.html';
              } else if (result === 'fail') {
                this.$router.replace({path: '/orderLists'})
                // charge 不正确或者微信公众账号支付失败时会在此处返回
                // 支付失败会跳转到支付失败页面 window.location.href = 'fail.html'; } else
                if (result === 'cancel') {
                  this.$router.replace({path: '/orderLists'})
                  // 微信公众账号支付取消支付
                  // 取消支付同样跳转到支付失败页面 window.location.href = 'fail.html';
                }
              }
            })
          }
        })
      }, // 微信pay
      wxId () {
        var userId = localStorage.getItem('userId')
        var deviceId = localStorage.getItem('deviceId')
        var token = localStorage.getItem('token')
        /* var uuid = localStorage.getItem('uuid')
        var mobile = localStorage.getItem('mobile') */
        var channel = 'wx_wap'
        var successUrl = 'https://yidou.easyto.com/pay/pay_success.html'
        /* 'http://localhost:8080/#/paySuccess/' + this.orderId */
        /* var cancel_url = '' */
        $.ajax({
          url: URL + '/api/v1/pay/pay_charge?channel=' + channel + '&orderId=' + this.orderId + '&device_id=' + deviceId + '&user_id=' + userId +
          '&token=' + token + '&result_url=' + successUrl,
          type: 'post',
          contentType: 'application/x-www-form-urlencoded;application/json;charset=UTF-8',
          dataType: 'json',
          data: '',
          success: (response) => {
            if (response.code === 401) {
              let _this = this
              _this.enterTost('登录过期，请重新登录！', 3000)
              localStorage.removeItem('deviceId')
              localStorage.removeItem('token')
              localStorage.removeItem('userId')
              setTimeout(function () {
                _this.$router.push({path: '/'})
              }, 3000)
            } else if (response.code === 404) {
              this.enterTost(response.msg, 3000)
              let _this = this
              setTimeout(function () {
                _this.$router.push({path: '/orderLists'})
              }, 3000)
              return false
            }
            pingpp.createPayment(response.data, function (result, err) {
              if (result === 'success') {
                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回， 其他的支付结果都会跳转到 extra 中对应的 URL(后端处理)。
                // 我的项目中在微信公众号支付成功会跳转到我们的支付成功页面 window.location.href = 'success.html';
              } else if (result === 'fail') {
                this.$router.replace({path: '/orderLists'})
                // charge 不正确或者微信公众账号支付失败时会在此处返回
                // 支付失败会跳转到支付失败页面 window.location.href = 'fail.html'; } else
                if (result === 'cancel') {
                  this.$router.replace({path: '/orderLists'})
                  // 微信公众账号支付取消支付
                  // 取消支付同样跳转到支付失败页面 window.location.href = 'fail.html';
                }
              }
            })
          }
        })
      }, // 截取参数
      getId () {
        this.orderId = this.$route.params.orderId
        this.price = this.$route.params.price
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/css/app";

  .payment {
    overflow: hidden;
    font-family: HiraginoSansGB-W3;
    font-size: rem(30);
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
        margin-top: rem(35);
        cursor: pointer;
        margin-left: rem(20);
      }
    }
    img {
      width: rem(103);
      height: rem(130);
      margin: 0 auto;
      margin-top: rem(100);
      margin-bottom: rem(60);
    }
    p {
      text-align: center;
    }
    .money {
      font-family: HiraginoSansGB-W6;
      font-size: rem(36);
      color: #F5A623;
    }
    .promt {
      font-size: rem(30);
      color: #A2AEB6;
      margin: rem(10) 0 rem(59);
    }
    div {
      border-top: 1px solid #D8D8D8;
      border-bottom: 1px solid #D8D8D8;
      height: rem(100);
      line-height: rem(100);
      overflow: hidden;
      color: #4A4A4A;
      span {
        width: rem(80);
        height: rem(80);
        display: inline-block;
        margin: 0 rem(15) 0 rem(20);
        float: left;
        background: red;
        margin-top: rem(10);
        background: url("weichat.png") no-repeat center;
        background-size: 100% 100%;
      }
      &:nth-child(6) {
        border-bottom: 1px solid #D8D8D8;
        span {
          background: url("bao.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      input {
        float: left;
        height: rem(100);
        background: none;
        border: none;
        font-size: rem(30);
        width: rem(600);
        text-align: left;
        background: url("right.png") no-repeat right center;
        background-size: auto 50%;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .7s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
    .tost {
      position: fixed;
      bottom: rem(260);
      left: 50%;
      margin-left: rem(-150);
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: rem(28);
      width: rem(300);
      padding: rem(30) rem(20);
      border-radius: 15px;
      line-height: rem(50)!important;
      border: none;
    }
  }
</style>
