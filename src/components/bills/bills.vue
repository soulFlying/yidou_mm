<template>
  <div class=getBill>
    <nav v-show=!weixinStatus><em @click=goback></em>发票<a @click='saveBill'>保存</a></nav>
    <div class="headBg" v-bind:class='{ headHeight:!weixinStatus  }'></div>
    <div class="bg"></div>
    <div class="billContent">
      <div class="selectBill">
        <label v-for='(item, index) in items' @click='selectBill (index)' :class='{active:index === activeIndex}'>
          <input type="button"/>{{item}}</label>
      </div>
      <div class="billDetail" v-show=isCompany>
        <div><input type=text placeholder="请填写单位名称" v-model="addressText" maxlength='25'/></div>
        <div><input type=text placeholder="请填写纳税人识别号" v-model="taxText" maxlength='25'/></div>
      </div>
    </div>
    <transition name=fade>
      <div v-show=tostShow class="tost"></div>
    </transition>
  </div>
</template>

<script>
  /* import $ from 'jquery' */
  export default {
    data () {
      return {
        tostShow: false,
        weixinStatus: false,
        activeIndex: 0,
        items: ['个人', '公司', '不需要发票'],
        isCompany: false,
        billInfo: {},
        addressText: '',
        taxText: ''
      }
    },
    created () {
      document.title = '发票'
      if (this.$route.query.billDetail) {
        var params = JSON.parse(this.$route.query.billDetail)
        if (params.type === '不需要发票') {
          this.activeIndex = 2
        } else if (params.type === '个人') {
          this.activeIndex = 0
        } else if (params.type === '公司') {
          this.activeIndex = 1
          this.isCompany = true
          this.addressText = params.address
          this.taxText = params.tax
        }
      }
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
      },
      saveBill () {
        if (this.activeIndex === 0 || this.activeIndex === 2) {
          this.billInfo['type'] = this.items[this.activeIndex]
        } else if (this.activeIndex === 1) {
          if (!this.addressText) {
            this.enterTost('请填写单位名称~', 2000)
            return
          }
          if (!this.taxText) {
            this.enterTost('请填写纳税人识别号~', 2000)
            return
          }
          this.billInfo['type'] = this.items[this.activeIndex]
          this.billInfo['address'] = this.addressText
          this.billInfo['tax'] = this.taxText
        }
        var bj = JSON.stringify(this.billInfo)
        this.$router.push({path: '/form', query: {billDetail: bj}})
      }, // 保存发票
      selectBill (n) {
        this.activeIndex = n
        if (n === 1) {
          this.isCompany = true
        } else {
          this.isCompany = false
        }
      }
    },
    watch: {
      addressText: function () {
        var _this = this
        _this.addressText = _this.addressText.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
      },
      taxText: function () {
        var _this = this
        _this.taxText = _this.taxText.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/css/app";

  .getBill {
    position: relative;
    overflow: hidden;
    nav {
      font-size: rem(36);
      width: 100%;
      color: #fff;
      text-align: center;
      background: url("bgform.png") no-repeat top;
      background-size: 100% auto;
      line-height: rem(120);
      height: rem(120);
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      em {
        width: rem(80);
        height: rem(80);
        background: url("./back.png") no-repeat center;
        background-size: 30% auto;
        display: inline-block;
        float: left;
        top: rem(20);
        left: 0;
        cursor: pointer;
        position: absolute;
        z-index: 999;
      }
      a {
        right: 0;
        top: 0;
        padding: 0 rem(30);
        cursor: pointer;
        position: absolute;
        text-decoration: none;
      }
    }
    .headBg {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: rem(280);
      background: url('./bgform.png') no-repeat;
      background-size: 100% 100%;
    }
    .headHeight {
      height: rem(284);
    }
    .bg {
      background: #F1F0F6;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
    }
    .billContent {
      margin-top: rem(120);
      > div {
        margin: 0 rem(21);
        background: #fff;
        box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        text-align: left;
        font-size: rem(30);
        line-height: rem(50);
        margin-bottom: rem(20);
        padding-left: rem(23);
      }
      .selectBill {
        height: rem(100);
        line-height: rem(100);
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
        padding: 0;
        label {
          cursor: pointer;
          font-weight: bold;
          padding: 0 rem(21);
          input {
            width: rem(30);
            height: rem(30);
            background: #D8D8D8;
            outline: none;
            border: none;
            border-radius: 50%;
            margin-right: rem(10);
            vertical-align: middle;
            appearance: none;
            -webkit-appearance: none;
          }
        }
        .active {
          input {
            background: url("./selected.png") no-repeat center;
            background-size: cover;
          }
        }
      }
      .billDetail {
        div {
          border-bottom: 1px solid #E7E7E7;
          padding: rem(21) rem(20) rem(21) 0;
          input {
            width: 100%;
            border: none;
          }
        }
      }
    }
    .tost {
      position: fixed;
      bottom: rem(200);
      left: 50%;
      margin: 0 0 0 rem(-160);
      background: rgba(0, 0, 0, 0.5) !important;
      color: #fff;
      font-size: rem(28);
      width: rem(300);
      padding: rem(30) rem(20);
      border-radius: 15px;
      min-height: rem(50);
      text-align: center;
      letter-spacing: 2px;
    }
  }
</style>
