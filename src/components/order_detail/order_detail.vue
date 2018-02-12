<template>
  <div class=order>
    <div class="headBg"></div>
    <div class="bg"></div>
    <nav><em @click='goback'></em>订单详情</nav>
    <div class="orderState">
      <p>{{lists.stateDesc}}</p>
      <p v-show='isWaiting'>剩余支付时间 {{lists.orderTimeout | countDownTime}}</p>
    </div>
    <div class=orderFrom>
      <div class='priceInfo'>
        <div><label>订单总金额</label><input v-model='productPrice' readonly/></div>
      </div>
      <div class=helper>
        <h1>{{lists.orderTitle}}</h1>
        <div class=product>
          <div><label>种类：</label><input type=text   v-model='productType' readonly/></div>
          <div><label>颜色：</label><input type=text   v-model='productColor' readonly/></div>
          <div><label>数量：</label><input type=text   v-model='count' readonly/></div>
        </div>
      </div>
      <div class=contactInfo>
        <h1>联系信息</h1>
        <div><label>中文姓名</label><input type=text   v-model='contactsName' readonly/></div>
        <div><label>联系手机</label><input type=text   v-model='contactsPhone' readonly/></div>
        <div><label style='float: left'>配送地址</label>
          <div id=txt></div>
        </div>
      </div>
      <div class='detailBill'>
        <h1>发票</h1>
        <div v-show='!isCompany'><input type=text   v-model='billType' readonly/></div>
        <div v-show='isCompany'><label>发票抬头</label><input type=text   v-model='companyName' readonly/></div>
        <div v-show='isCompany'><label>纳税人识别号</label><input type=text   v-model='companyNum' readonly/></div>
      </div>
      <div class=orderInfo>
        <h1>订单信息</h1>
        <div><label>订单编号</label><input type=text   v-model='orderId' readonly/></div>
        <div><label>预订日期</label><input type=text   v-model='orderDate' readonly/></div>
      </div>
    </div>
    <div class=footer>
      <div class=total   v-show="btnNum != 2">总额<span>￥{{productPrice}}</span></div>
      <input v-show="btnNum == 1" type=button   value='立即支付' @click='goBuy(orderId,productPrice)'/>
      <input v-show="btnNum == 2" type="button" class='logistics' style="margin-right:0.2rem"
             @click='checkInfo(orderId)' value='查看物流'/>
      <input v-show="btnNum == 2" type="button" class='getGoods' @click="confirmGoods(orderId)" value='确认收货'/>
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
        orderId: '',
        token: '',
        userId: '',
        deviceId: '',
        lists: '',
        count: '',
        billType: '',
        companyName: '',
        companyNum: '',
        isCompany: false,
        productType: '',
        productColor: '',
        productPrice: '',
        contactsName: '',
        contactsPhone: '',
        contactsAdd: '',
        orderDate: '',
        isWaiting: false,
        btnNum: '',
        tostShow: false,
        toastBlack: false,
        toastBtn: false,
        infoShow: false,
        goodsInfo: ''
      }
    },
    created () {
      document.title = '订单详情'
      this.getId()
      this.userId = localStorage.getItem('userId')
      this.deviceId = localStorage.getItem('deviceId')
      this.token = localStorage.getItem('token')
      this.getDetails()
    },
    mounted () {
    },
    methods: {
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
      }, // 获取参数
      enterTost2 (text, time) {
        var toast2 = document.getElementsByClassName('toast_black')[0]
        toast2.innerHTML = text
        this.toastBlack = true
        setTimeout(() => {
          this.toastBlack = false
        }, time || 2000)
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
      getDetails () {
        var _this = this
        $.ajax({
          url: URL + '/api/v1.0/order/' + _this.orderId,
          type: 'get',
          contentType: 'application/json; charset=utf-8',
          data: {
            user_id: _this.userId,
            device_id: _this.deviceId,
            token: _this.token
          },
          success: res => {
            if (res.code === 200) {
              _this.lists = res.data
              if (_this.lists.orderTimeout) {
                _this.isWaiting = true
                var interval = 1000
                var timer = setInterval(() => {
                  if (_this.lists.orderTimeout <= 0) {
                    _this.lists.stateDesc = '支付超时，订单关闭'
                    clearInterval(timer)
                    return
                  }
                  _this.lists.orderTimeout -= interval
                }, interval)
              } else {
                _this.isWaiting = false
              }
              _this.count = _this.lists.translator.count + '台'
              _this.productType = _this.lists.translator.cate
              _this.productColor = _this.lists.translator.color
              _this.contactsName = _this.lists.orderContacts.contactsName
              _this.contactsPhone = _this.lists.orderContacts.mobile
              $('#txt').html(_this.lists.orderContacts.address)
              _this.orderDate = _this.lists.createTime
              _this.productPrice = _this.lists.orderMoney
              _this.getBill(_this.lists.invoice.status)
            } else if (res.code === 401) {
              _this.enterTost2('登录过期，请重新登录！', 2000)
              localStorage.clear()
              setTimeout(() => {
                _this.$router.push({path: '/'})
              }, 2000)
            } else {
              _this.enterTost2('服务异常，请稍后再试', 2000)
            }
          }
        })
      },
      getBill (n) {
        if (n === 1) {
          this.isCompany = true
          this.billType = '公司'
          this.companyName = this.lists.invoice.title
          this.companyNum = this.lists.invoice.number
        } else if (n === 2) {
          this.isCompany = false
          this.billType = '个人发票'
        } else if (n === 0) {
          this.isCompany = false
          this.billType = '不需要发票'
        }
      },
      goback () {
        window.history.go(-1)
      },
      getId () {
        this.orderId = this.$route.params.orderId
        this.btnNum = this.$route.params.btnNum
      },
      goBuy (id, money) {
        this.$router.replace({path: '/payment/' + id + '/' + money})
        clearTimeout(this.timer)
        return
      },
      // 确认收货弹框--确定
      toastBtnYes () {
        $.ajax({
          url: URL + '/api/v1/order/' + this.orderId + '/receive',
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
                this.btnNum = 13
                this.orderId = ''
                this.tostShow = false
                location.reload()
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
      // 确认收货
      confirmGoods () {
        this.toastBtn = true
        this.enterTost('您确定收货吗？', 1000000)
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
      }
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
<style lang="scss" scoped>
  @import "../../assets/css/app";
  @import "../../assets/css/footer";

  .order {
    /*position: relative;*/
    overflow: hidden;
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
        min-height: 350px;
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
        img {
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
    nav {
      font-size: rem(36);
      width: 100%;
      color: #fff;
      text-align: center;
      background: url("./bg.png") no-repeat top;
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
    .headBg {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: rem(360);
      background: url('./bg.png');
      background-size: 100% 100%;
    }
    .orderState {
      padding: rem(40) rem(43) rem(20);
      line-height: rem(45);
      color: #fff;
      font-size: rem(30);
      text-align: left;
      margin-top: rem(90);
    }
    .orderFrom {
      margin: 0 rem(21);
      padding-bottom: rem(220);
      > div {
        background: #fff;
        box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        text-align: left;
        font-size: rem(30);
        line-height: rem(50);
        margin-bottom: rem(20);
        * {
          padding: 0 rem(23);
        }
        h1 {
          padding: rem(30) rem(23);
          border-bottom: 1px solid #CBCBCB;
          font-size: rem(32);
          font-family: HiraginoSansGB-W6;
          line-height: rem(45);
        }
        > div {
          padding: rem(24) 0;
          border-bottom: 1px solid #CBCBCB;
          overflow: hidden;
          &:last-child {
            border-bottom: none;
          }
          input {
            border: none;
          }
          #txt {
            width: 65%;
            display: inline-block;
            resize: none;
            float: left;
            margin-top: rem(5);
            line-height: rem(43);
            word-wrap: break-word;
          }
        }
        .product {
          div {
            padding: 0;
          }
        }
      }
      .priceInfo {
        input {
          color: #F5A623;
        }
      }
      .priceInfo, .helper {
        label {
          padding-right: 0;
        }
      }
      .detailBill{
        input{
          width: 61%!important;
        }
      }
    }
    .footer {
      border-top: none;
      .logistics {
        float: left;
        width: 45%;
      }
      .getGoods {
        width: 45%;
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
      margin: 0 0 0 rem(-150);
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

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .footer {
      padding-bottom: 34px !important;
    }
  }
</style>
