<template>
  <div class=order>
    <div class="headBg" v-bind:class='{ headHeight:weixinStatus === false}'></div>
    <div class="bg"></div>
    <nav v-show='!weixinStatus'><em @click='goback'></em>订单列表</nav>
    <div class='orderLists'>
      <!-- ul里面几个scoller就是无限滚动的几个api -->
      <!-- <ul class="mui-table-view" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="10" infinite-scroll-immediate-check="false"> -->
      <ul>
        <!--li数据遍历循环部分-->
        <li v-for='item in list' v-on:click ='goDetail(item.orderId,item.btnNum)'>
          <div class="header">
            <span class="stateDesc">{{item.stateDesc}}</span>
            <span v-show='item.orderTimeout' class="downTime">{{item.orderTimeout | countDownTime}}</span>
          </div>
          <div class="content">
            <div><img :src='item.avatar'></div>
            <div class="detail">
              <h2>{{item.orderTitle}}</h2>
              <p>种类：{{item.translator.cate}}</p>
              <p>颜色：{{item.translator.color}}</p>
              <p>数量：{{item.translator.count}}</p>
            </div>
          </div>
          <div class="bottom">
            <a>合计：￥{{item.orderMoney}}</a>
            <input v-show='item.btnNum == 1' type="button" @click.stop='goBuy(item.orderId,item.orderMoney)' value='立即支付'/>
            <!-- <input v-show='!item.orderTimeout&&!item.payTime' v-if="item.action.actionType=='0'" class="closeBtn" type="button" value='已关闭'/> -->
            <input v-show="item.btnNum == 2" type="button" style="margin-left:0.2rem" @click.stop='checkInfo(item.orderId)' value='查看物流'/>
            <input v-show="item.btnNum == 2" type="button"  @click.stop="confirmGoods(item.orderId)" value='确认收货'/>
          </div>
        </li>
        <!--底部判断是加载图标还是提示“全部加载”-->
        <!-- <li class="more_loading" v-show="!queryLoading">
          <mt-spinner type="snake" color="#00ccff" :size="20" v-show="loading&&!allLoaded"></mt-spinner>
          <span v-show="allLoaded">已全部加载</span>
        </li> -->
      </ul>
    </div>
    <!--物流信息 -->
    <div class="goodsInfo" v-show="infoShow">
        <div class="goodsInfo_main">
            <div class="content">
                <div class="title">物流信息</div>
                <ul class="infoList">
                    <li class="info" v-for='(item,index) in goodsInfo.data'>
                        <p>{{item.time}}</p>
                        <p>{{item.context}}</p>
                    </li>
                </ul>
            </div>
            <div class="del">
                <img src="./del.png" alt="" @click="infoShow=false">
            </div>
        </div>
    </div>
    <div class='toastWrap' v-show="tostShow" @touchmove.prevent>
      <div class="tost_">
        <div class="toast"></div>
        <div class="btn" v-show="toastBtn">
          <button class="yes" @click="toastBtnYes">确定</button>
          <button class="no" @click="toastBtnNo">取消</button>
        </div>
      </div>
    </div>
    <transition name=fade>
      <div v-show=toastBlack class="toast_black"></div>
    </transition>
  </div>
</template>

<script>
  import $ from 'jquery'
  var URL = 'https://yidou.easyto.com/mall'
  export default {
    data () {
      return {
        weixinStatus: false,
        orderId: '',
        price: '',
        timer: '',
        overTime: '',
        userId: '',
        deviceId: '',
        token: '',
        list: [],
        queryLoading: false,
        loading: false,
        allLoaded: false,
        totalNum: 0,
        pageSize: 10,
        pageNum: 1,
        tostShow: false,
        toastBlack: false,
        toastBtn: false,
        confirmGoodsId: '',
        infoShow: false,
        goodsInfo: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.orderList()
      })
      next()
    },
    created () {
      document.title = '订单列表'
      this.userId = localStorage.getItem('userId')
      this.deviceId = localStorage.getItem('deviceId')
      this.token = localStorage.getItem('token')
      // this.orderList(this.userId, this.deviceId, this.token, this.pageNum)
    },
    mounted () {
    },
    methods: {
      // 获取颜色
      orderList () {
        $.ajax({
          url: URL + '/api/v1.0/order/list',
          type: 'get',
          // contentType:"application/json; charset=utf-8",
          data: {
            user_id: this.userId,
            device_id: this.deviceId,
            token: this.token,
            // pageNum: this.pageNum
            groupType: 'translator'
          },
          success: res => {
            if (res.code === 200) {
              // 没有订单 跳转无预购页面
              if (res.data.length === 0) {
                this.$router.push({path: '/noOrder'})
                return
              } else {
                // this.list = res.data
                res.data.forEach((ele, index) => {
                  if (ele.translator.type === 'normal') {
                    this.list.push(ele)
                  }
                })
                this.list.forEach((ele, index) => {
                  if (ele.actions) {
                    if (ele.actions.length === 2) {
                      ele.btnNum = 2
                    } else if (ele.actions[0].actionType === '4') {
                      ele.btnNum = 1
                      var interval = 1000
                      // ele.orderTimeout = 5000;
                      var timer = setInterval(() => {
                        if (ele.orderTimeout <= 0) {
                          ele.stateDesc = '支付超时，订单关闭'
                          ele.btnNum = 0
                          // this.orderList();
                          clearInterval(timer)
                          return
                        }
                        ele.orderTimeout -= interval
                      }, interval)
                    } else {
                      ele.btnNum = 0
                    }
                  } else {
                    ele.btnNum = 0
                  }
                })
              }
            } else if (res.code === 401) {
              this.enterTost2('登录过期，请重新登录！', 2000)
              localStorage.clear()
              setTimeout(() => {
                this.$router.push({path: '/'})
              }, 2000)
            } else {
              this.enterTost2('服务异常，请稍后再试', 2000)
            }
          }
        })
      },
       // 确认收货
      confirmGoods (id) {
        this.confirmGoodsId = id
        this.toastBtn = true
        this.enterTost('您确定收货吗？', 1000000)
      },
      // 确认收货弹框--确定
      toastBtnYes () {
        // var userId = localStorage.getItem('user_id')
        // var deviceId = localStorage.getItem('device_id')
        // var token = localStorage.getItem('token')
        $.ajax({
          url: URL + '/api/v1/order/' + this.confirmGoodsId + '/receive',
          type: 'post',
          // contentType:"application/json; charset=utf-8",
          data: {
            user_id: this.userId,
            device_id: this.deviceId,
            token: this.token
          },
          success: res => {
            if (res.code === 200) {
              this.toastBtn = false
              this.enterTost('确认收货成功!', 2000)
              setTimeout(() => {
                location.reload()
                this.confirmGoodsId = ''
                this.tostShow = false
              }, 2000)
            } else if (res.code === 401) {
              this.enterTost2('登录过期，请重新登录！', 2000)
              localStorage.clear()
              setTimeout(() => {
                this.$router.push({path: '/'})
              }, 2000)
            } else {
              this.enterTost2('服务异常，请稍后再试', 2000)
            }
          }
        })
      },
      // 确认收货弹框--取消
      toastBtnNo () {
        this.tostShow = false
        this.toastBtn = false
      },
      // 查看物流信息
      checkInfo (id) {
        // this.infoShow = true;
        // console.log(id);
        // var userId = localStorage.getItem("user_id");
        // var deviceId = localStorage.getItem("device_id");
        // var token = localStorage.getItem("token");
        $.ajax({
          url: URL + '/api/v1.0/order/logistics',
          type: 'get',
          // contentType:"application/json; charset=utf-8",
          data: {
            user_id: this.userId,
            device_id: this.deviceId,
            token: this.token,
            orderId: id
          },
          success: res => {
            // console.log(res);
            if (res.code === 200) {
              // console.log(res.data);
              this.goodsInfo = res.data
              this.infoShow = true
            } else if (res.code === 401) {
              this.enterTost2('登录过期，请重新登录！', 2000)
              localStorage.clear()
              setTimeout(() => {
                this.$router.push({path: '/'})
              }, 2000)
            } else {
              this.enterTost2('服务异常，请稍后再试', 2000)
            }
          }
        })
      },
      GetQueryString (name) {
        var after = window.location.search.split('?')[1]
        if (after) {
          if (after.indexOf('#') > 0) {
            after = after.split('#')[0]
          }
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
        clearTimeout(this.timer)
        return
      },
      goBuy (id, money) {
        this.$router.push({path: '/payment/' + id + '/' + money})
        clearTimeout(this.timer)
        return
      },
      // 获取联系人信息
      getContact () {
        var userId = localStorage.getItem('userId')
        var deviceId = localStorage.getItem('deviceId')
        var token = localStorage.getItem('token')
        $.ajax({
          url: URL + '/api/v1.0/order/' + this.orderId,  // 联系人详情
          type: 'get',
          data: {
            user_id: userId,
            device_id: deviceId,
            token: token
          },
          success: (response) => {
            if (response.code === 200) {
              var coupon = response.data.translator.coupon
              if (coupon === null || coupon === 'null' || coupon === undefined || coupon === 'undefined') {
                this.$refs.userNotName.innerHTML = '联系人：' + response.data.orderContacts.contactsName
                this.$refs.userNotPhone.innerHTML = '联系手机：：' + response.data.orderContacts.mobile
              }
              this.$refs.userName.innerHTML = '联系人：' + response.data.orderContacts.contactsName
              this.$refs.userPhone.innerHTML = '联系手机：：' + response.data.orderContacts.mobile
            }
          }
        })
      },
      loadMore () {
        this.pageNum += 1
        this.orderList(this.userId, this.deviceId, this.token, this.pageNum)
        console.log(this.list.length)
        this.loading = true
        /* setTimeout(() => {
          let last = this.list[this.list.length - 1]
          for (let i = 1; i <= 10; i++) {
            this.list.push(last + i)
          }
          this.loading = false
        }, 2500) */
      },
      enterTost (text, time) {
        var tost = document.getElementsByClassName('tost_')[0]
        var toast = document.getElementsByClassName('toast')[0]
        // console.log(tost);
        // console.log(text)
        if (tost) {
          toast.innerHTML = text
          this.tostShow = true
          setTimeout(() => {
            this.tostShow = false
            this.toastBtn = false
          }, time || 2000)
        }
      },
      enterTost2 (text, time) {
        var toast2 = document.getElementsByClassName('toast_black')[0]
        toast2.innerHTML = text
        this.toastBlack = true
        setTimeout(() => {
          this.toastBlack = false
        }, time || 2000)
      },
      goDetail (n, m) {
        this.$router.push({name: 'detail', params: {orderId: n, btnNum: m}})
      } // 跳转详情页
    },
    filters: {
      countDownTime (deltaTime) {
        // deltaTime -= interval;
        var deltaDate = new Date()
        deltaDate.setTime(deltaTime)
        // 计算出相差天数
        /* var days = Math.floor(deltaDate / (24 * 3600 * 1000)) */
        // 计算出小时数
        var leave1 = deltaDate % (24 * 3600 * 1000)
        // 计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000))
        // 计算相差分钟数
        var leave2 = leave1 % (3600 * 1000)
        // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))
        // 计算相差秒数
        var leave3 = leave2 % (60 * 1000)
        // 计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        return '0' + hours + ':' + minutes + ':' + seconds
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "../../assets/css/app";
  .order {
    position: relative;
    overflow: hidden;
    padding-bottom: rem(50);
    letter-spacing: 1px;
    .toastWrap {
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1999;
      .tost_ {
        position: absolute;
        top: 40%;
        left: 50%;
        margin: 0 0 0 rem(-250);
        width: rem(500);
        // height: 3rem;
        padding: rem(30);
        border-radius: 8px;
        background: #fff !important;
        color: #000;
        text-align: center;
        font-size: rem(28);
        z-index: 2000;
        box-sizing: border-box;
        .toast {
          width: 100%;
          word-wrap: break-word;
          font-size: rem(30);
        }
        .btn {
          margin: rem(50) 0 0;
          .yes {
            height: rem(80);
            width: rem(180);
            background: #34cdd3;
            outline: none;
            border: 0px;
            border-radius: 8px;
            margin-right: 0.15rem;
            color: #fff;
            font-size: rem(28);
            // cursor: pointer;
          }
          .no {
            height: rem(80);
            width: rem(180);
            background-color: #ccc;
            outline: none;
            border: 0px;
            border-radius: 3px;
            color: #fff;
            font-size: rem(28);
            // cursor: pointer;
          }
        }
      }
    }
    .goodsInfo {
      width: 100%;
      height: 100%;
      background: rgba(8, 8, 8, 0.4);
      position: fixed;
      top: 0;
      .goodsInfo_main {
        width: rem(600);
        height: rem(800);
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 10px;
        background-color: #fff;
        min-height:350px;
        min-width: 320px;
        .content {
          width: 90%;
          height: 100%;
          margin: 0 auto;
          // background-color:cadetblue;
          .title {
            // height: 18%;
            // background-color: #ccc;
            border-bottom: 1px solid #999999;
            text-align: center;
            margin: 0.30rem auto 0.10rem;
            padding-bottom: 0.10rem;
            font-size: 0.44rem;
          }
          .infoList {
            height: 80%;
            background-color: #fff;
            overflow-y: auto;
            font-size: rem(28);
            .info {
              // background-color: yellow;/
              border-top: 1px solid #f6f6f6;
              padding: 0.15rem 0 0.15rem 8%;
              text-align: left;
              p {
                margin: 0px 0px 0.05rem;
                word-wrap: break-word;
              }
              p:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
      .del {
        img{
          width: rem(45);
          height: rem(45);
        }
        position: absolute;
        right: rem(-40);
        top: rem(-40);
      }
      ::-webkit-scrollbar {
        width: 0.06rem;
        height: 0.1rem;
        // background-color: red;
      }
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 0.06rem rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        background-color: #f5f5f5;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 0.06rem rgba(0, 0, 0, 0.3);
        background-color: #999999;
      }
    }
    .headBg {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: rem(370);
      background: url('./bgform.png') no-repeat;
      background-size: 100% 100%;
    }
    .headHeight {
      height: rem(460);
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
        background: url("back.png") no-repeat center;
        background-size: 30% auto;
        display: inline-block;
        float: left;
        top: rem(20);
        left: 0;
        cursor: pointer;
        position: absolute;
        z-index: 999;
      }
    }
    .orderLists {
      margin: 0 rem(21);
      padding-top: rem(120);
      > div {
        box-shadow: 0 7px 17px 0 rgba(0, 0, 0, 0.09);
        border-radius: 8px;
        text-align: left;
        color: #A2AEB6;
        font-family: HiraginoSansGB-W3;
        font-size: rem(24);
        line-height: rem(33);
        margin-top: rem(28);
      }
      ul {
        li {
          background: #FFFFFF url("./yidou.png") no-repeat 95% top;
          background-size: rem(195) auto;
          box-shadow: 0 7px 17px 0 rgba(0, 0, 0, 0.09);
          border-radius: 8px;
          text-align: left;
          color: #A2AEB6;
          font-family: HiraginoSansGB-W3;
          font-size: rem(28);
          color: #4A4A4A;
          line-height: rem(33);
          margin-bottom: rem(21);
          > div {
            letter-spacing: 2px;
            padding: rem(20);
            border-bottom: 1px solid #CBCBCB;
          }
          .header {
            span {
              &:nth-child(2) {
                color: #F5A623;
                margin-left: rem(10);
                font-weight: bold;
              }
            }
          }
          .content {
            overflow: hidden;
            padding: rem(16) rem(20);
            > div {
              float: left;
              &:nth-child(1) {
                width: rem(180);
                height: rem(180);
                border-radius: 8px;
                margin-right: rem(30);
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
                }
              }
              &:nth-child(2) {
                h2 {
                  padding: rem(10) 0 rem(30);
                }
                p {
                  color: #A2AEB6;
                  font-size: rem(26);
                }
              }
            }
          }
          .bottom {
            overflow: hidden;
            a {
              font-size: rem(32);
              line-height: rem(80);
              letter-spacing: 0px;
            }
            input {
              background-image: linear-gradient(-85deg, #31C7D4 0%, #44E9C3 100%);
              border-radius: 8px;
              width: rem(180);
              height: rem(80);
              color: #fff;
              border: none;
              float: right;
            }
            .closeBtn{
              background: #D8D8D8;
            }
          }
        }
        .more_loading{
          margin: 0;
          background: none;
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: all .7s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
    .toast_black {
      position: fixed;
      bottom: rem(200);
      left: 50%;
      margin: 0 0 0 rem(-160);
      background: rgba(0, 0, 0, 0.5) !important;
      color: #fff;
      font-size: rem(26);
      width: rem(300);
      padding: rem(30) rem(20);
      border-radius: 15px;
      min-height: rem(50);
      text-align: center;
      letter-spacing: 0px;
      line-height: rem(50);
    }
  }


</style>
