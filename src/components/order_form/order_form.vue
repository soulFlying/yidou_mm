<template>
  <div class=order>
    <div class="headBg" v-bind:class='{ headHeight:!weixinStatus  }'></div>
    <div class="bg"></div>
    <div class=orderFrom>
      <nav v-show=navShow><em @click=goback></em>订单填写</nav>
      <div class="types">
        <h1>选择种类</h1>
        <ul>
          <li v-for='(detail,index) in detail_arr' @click='selectType (index)'
              :class='{typeActive:index === typeIndex}'>
            {{detail.name}}
          </li>
        </ul>
      </div>
      <div class=colors>
        <h1>选择颜色</h1>
        <ul>
          <li v-for='(color,index) in color_arr' @click='selectColor (index)' :class='{active:index === activeIndex}'>
            {{color.name}}
          </li>
        </ul>
      </div>
      <div class=preOrder>
        <h1>选择数量<a>库存({{nomber}}台)</a></h1>
        <div>
          <a class="reduce" @click='reduceCount'></a>
          <input type=number  v-model='buyNom' readonly>
          <a class="add" @click='addCount'></a>
        </div>
      </div>
      <div class="delivery">
        <h1>配送方式</h1>
        <div class="deliveryWay">快速配送</div>
      </div>
      <div class=contactInfo>
        <h1>联系信息</h1>
        <div><label>中文姓名</label><input ref=name   type=text   v-model='nameText' placeholder='请输入联系人姓名'></div>
        <div><label>联系手机</label><input v-model="phoneText" ref=phone   type=tel   placeholder='请输入手机号码' maxlength='11'>
        </div>
        <div style='border-bottom: none'><label style='vertical-align: top'>配送地址</label>
          <textarea id='txtContent' v-model='addressText' type=text ref=adress placeholder='请输入地址'></textarea>
        </div>
      </div>
      <div class="bills">
        <div @click='goBills'><label>发票</label><input v-model="billText" type=text   readonly>
        </div>
      </div>
      <transition name=fade>
        <div v-show=tostShow class="tost"></div>
      </transition>
      <div class=footer>
        <div class=total>总额<span>￥{{total}}</span></div>
        <input @click=isNan type=button value='去支付' :disabled='noGoods' :class='{noBtn:noGoods}'/>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  var URL = 'https://yidou.easyto.com/mall'
  export default {
    data () {
      return {
        color_arr: [],
        detail_arr: [],
        activeIndex: '',
        typeIndex: '',
        tostShow: false,
        navShow: true,
        nameText: '',
        phoneText: '',
        addressText: '',
        billText: '个人',
        total: 0,
        sku: '',
        color: '',
        weixinStatus: false,
        nomber: '',
        buyNom: 1,
        orderId: '',
        price: '',
        billStatu: 2,
        billTitle: '',
        billCode: '',
        amount: '',
        companyAddress: '',
        taxNum: '',
        noGoods: false
      }
    },
    created () {
      document.title = '订单填写'
      /* this.isWeiXin() */
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getDetails()
        vm.getParam()
      })
      next()
    },
    mounted () {
      $('#txtContent').bind('keydown keyup', function () {
        $(this).height('0.34rem')
        var setheight = $(this).get(0).scrollHeight
        if ($(this).attr('height') !== setheight) {
          $(this).height(setheight + 'px').attr('height', setheight)
        } else {
          $(this).height($(this).attr('height') + 'px')
        }
      })
    },
    methods: {
      // 选择商品类型
      selectColor (m) {
        var _this = this
        var index = $('.typeActive').index()
        var num = _this.detail_arr[index].goods[m].stock
        if (num > 0) {
          _this.activeIndex = m
          _this.nomber = _this.detail_arr[index].goods[m].stock
          _this.price = _this.detail_arr[index].goods[m].price
          _this.total = parseInt(_this.price) * _this.buyNom
          _this.sku = _this.detail_arr[index].goods[m].sku
          _this.color = _this.detail_arr[index].goods[m].name
        } else {
          this.enterTost('已售磬~', 2000)
        }
      }, // 选择类型
      selectType (n) {
        var _this = this
        var a = _this.detail_arr[n].goods.every((item, index) => {
          if (item.stock > 0) {
            _this.typeIndex = n
            _this.color_arr = _this.detail_arr[n].goods
            _this.activeIndex = index
            _this.price = item.price
            _this.total = parseInt(_this.price) * _this.buyNom
            _this.sku = item.sku
            _this.color = item.name
            _this.nomber = item.stock
            return false
          }
          return true
        })
        if (a) {
          this.enterTost('已售磬~', 2000)
        }
      },
      addCount () {
        if (this.buyNom < this.nomber) {
          this.buyNom += 1
        } else {
          this.enterTost('最多只能购买' + this.nomber + '台哦~', 2000)
        }
        this.total = parseInt(this.price) * this.buyNom
      }, // 计算价格-加
      reduceCount () {
        if (this.buyNom > 1) {
          this.buyNom -= 1
        } else {
          this.enterTost('不能再少啦~', 2000)
        }
        this.total = parseInt(this.price) * this.buyNom
      }, // 计算价格-减
      isNan () {
        if (!$('.typeActive')) {
          this.enterTost('请选择商品种类~', 2000)
          return false
        }
        if (!$('.active')) {
          this.enterTost('请选择商品颜色~', 2000)
          return false
        }
        if (this.nameText <= 0) {
          this.enterTost('请输入联系人姓名~', 2000)
          return false
        }
        if (this.phoneText.length <= 0) {
          this.enterTost('请输入手机号码~', 2000)
          return false
        }
        if (!/^1[3|4|5|7|8|9]\d{9}$/.test(this.phoneText)) {
          this.enterTost('手机号码格式有误~', 2000)
          return false
        }
        if (this.addressText <= 0) {
          this.enterTost('请输入配送地址~', 2000)
          return false
        }
        this.goBuy()
      },
      enterTost (text, timer) {
        let tost = document.getElementsByClassName('tost')[0]
        if (tost) {
          tost.innerHTML = text
          this.tostShow = true
          setTimeout(() => {
            this.tostShow = false
          }, timer || 3000)
        }
      }, // 获取数据
      getDetails () {
        var _this = this
        this.$http.get(URL + '/api/v1.0/translator/crowdfunding/buying') // 后台获取验证码地址
          .then((response) => {
            if (response.data.code === 200) {
              _this.detail_arr = response.data.data
            } else if (response.data.code === 401) {
              this.enterTost('登录过期，请重新登录！', 3000)
              localStorage.removeItem('deviceId')
              localStorage.removeItem('token')
              localStorage.removeItem('userId')
              setTimeout(function () {
                _this.$router.push({path: '/'})
              }, 3000)
            } else if (response.data.code === 416) {
              _this.noGoods = true
            } else {
              this.enterTost(response.data.msg, 3000)
            }
            _this.detail_arr.every((item, index) => {
              _this.color_arr = item.goods
              var a = _this.color_arr.every((val, x) => {
                if (val.stock > 0) {
                  _this.typeIndex = index
                  _this.activeIndex = x
                  _this.price = val.price
                  _this.total = parseInt(_this.price) * _this.buyNom
                  _this.sku = val.sku
                  _this.color = val.name
                  _this.nomber = val.stock
                  return false
                } else {
                  _this.total = 0
                  _this.nomber = val.stock
                }
                return true
              })
              if (a === true) {
                return true
              }
            })
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
          this.navShow = true
        } else {
          if (uaTest[0] && ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
            this.weixinStatus = true
            this.navShow = false
          }
        }
      }, // 支付
      goBuy () {
        var userId = localStorage.getItem('userId')
        var deviceId = localStorage.getItem('deviceId')
        var token = localStorage.getItem('token')
        var _this = this
        $.ajax({
          url: URL + '/api/v1.0/order/translator/crowdfunding?user_id=' + userId + '&device_id=' + deviceId + '&token=' + token,
          type: 'post',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          /* headers: {
           'os_type': 'WX'
           }, */
          data: JSON.stringify({
            'goods': {
              'sku': _this.sku,
              'count': _this.buyNom
            },
            'delivery': $('.deliveryWay').html(),
            'express': {
              'contactsName': _this.nameText,
              'address': _this.addressText,
              'mobile': _this.phoneText
            },
            'invoice': {
              'status': _this.billStatu,
              'title': _this.companyAddress,
              'number': _this.taxNum
            }
          }),
          success: (response) => {
            if (response.code === 200) {
              _this.orderId = response.data.orderId
              _this.amount = parseInt(response.data.moneyOrder)
              _this.$router.push({name: 'payment', params: {orderId: _this.orderId, 'price': _this.amount}})
            } else if (response.code === 401) {
              this.enterTost('登录过期，请重新登录！', 3000)
              localStorage.removeItem('deviceId')
              localStorage.removeItem('token')
              localStorage.removeItem('userId')
              setTimeout(function () {
                _this.$router.push({path: '/'})
              }, 3000)
            } else {
              this.enterTost(response.msg, 3000)
              /* setTimeout(function () {
               _this.$router.push({path: '/orderLists'})
               }, 4000) */
            }
          }
        })
      }, // 返回上一级
      goback () {
        window.history.go(-1)
      }, // 选择发表
      goBills () {
        if (this.$route.query.billDetail) {
          this.$router.push({path: '/bills', query: {billDetail: this.$route.query.billDetail}})
        } else {
          this.$router.push({path: '/bills'})
        }
      },
      getParam () {
        if (this.$route.query.billDetail) {
          var bj = JSON.parse(this.$route.query.billDetail)
          console.log(bj)
          this.billText = bj.type
          if (bj.address) {
            this.companyAddress = bj.address
            this.taxNum = bj.tax
          }
        }
      } // 获取路由参数
    },
    watch: {
      '$route': function () {
        if (this.$route.query.billDetail) {
          var bj = JSON.parse(this.$route.query.billDetail)
          this.billText = bj.type
          if (this.billText === '不需要发票') {
            this.billStatu = 0
            this.companyAddress = ''
            this.taxNum = ''
          } else if (this.billText === '个人') {
            this.billStatu = 2
            this.companyAddress = ''
            this.taxNum = ''
          } else if (this.billText === '公司') {
            this.billStatu = 1
            this.companyAddress = bj.address
            this.taxNum = bj.tax
          }
        }
        /* this.billText = bj.type */
      },
      nameText: function () {
        var _this = this
        _this.nameText = _this.nameText.replace(/[^\u4e00-\u9fa5]/g, '')
      },
      addressText: function () {
        var _this = this
        _this.addressText = _this.addressText.replace(/[^a-zA-Z\d\u4e00-\u9fa5,.!?()_，．；;？]/g, '')
      },
      phoneText: function () {
        var _this = this
        _this.phoneText = _this.phoneText.replace(/\D/g, '')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "../../assets/css/app";
  @import "../../assets/css/footer";

  .order {
    position: relative;
    overflow: hidden;
    /* background: #F1F0F6;*/
    .headBg {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      height: rem(200);
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
    .orderFrom {
      margin: 0 rem(21);
      padding-bottom: rem(200);
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
      > div {
        background: #fff;
        box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        text-align: left;
        font-size: rem(30);
        line-height: rem(50);
        margin-bottom: rem(20);
        padding-left: rem(23);
        * {
          padding-right: rem(23);
        }
        h1 {
          padding: rem(30) rem(23) rem(30) 0;
          border-bottom: 1px solid #CBCBCB;
          font-size: rem(32);
          font-family: HiraginoSansGB-W6;
          font-weight: bold;
          line-height: rem(45);
          a {
            font-size: rem(28);
            color: #A2AEB6;
            font-weight: normal;
            text-decoration: none;
          }
        }
        > div {
          padding: rem(24) 0;
          border-bottom: 1px solid #CBCBCB;
          overflow: hidden;
          input, textarea {
            border: none;
          }
          textarea {
            width: 70%;
            display: inline-block;
            overflow-x: hidden;
            height: rem(35);
            margin-top: rem(6);
            line-height: rem(40);
          }
        }
      }
      .footer {
        margin-bottom: 0;
        border-top: none;
        .total {
          border: none;
          line-height: rem(100);
        }
        .noBtn{
          background-image: linear-gradient(10deg, rgba(49,199,212,0.5) 0%, rgba(68,233,195,0.5) 100%);
          background-image: -webkit-linear-gradient(10deg, rgba(49,199,212,0.5) 0%, rgba(68,233,195,0.5) 100%);
        }
      }
      .types {
        margin-top: rem(120);
      }
      .colors, .types {
        ul {
          overflow: hidden;
          li {
            float: left;
            width: rem(149);
            height: rem(58);
            margin: rem(27) rem(21) rem(27) 0;
            margin-right: rem(21);
            padding: 0;
            text-align: center;
            background: #F4F5F5;
            border-radius: 8px;
            line-height: rem(58);
            &:last-child {
              margin-right: 0;
            }
          }
          .active, .typeActive {
            background: #2EC9CF;
            color: #fff;
          }
        }
      }
      .preOrder {
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
        h1 {
          padding-right: 0;
          border-bottom: none;
          a {
            padding: 0 0 0 rem(15);
          }
        }
        div {
          padding: rem(30) rem(23) rem(30) 0;
          display: -webkit-flex; /* Safari */
          display: flex;
          align-items: center;
          border-bottom: none;
          * {
            text-align: center;
            border-radius: rem(8);
            height: rem(60);
            display: inline-block;
          }
          a {
            width: rem(60);
            background: #2EC9CF;
            color: #fff;
            padding: 0;
            font-size: rem(50);
            vertical-align: middle;
            text-decoration: none;
            cursor: pointer;
            line-height: rem(60);
          }
          .reduce{
            background: #2EC9CF url("./reduce.png") no-repeat center;
            background-size: 60% auto;
          }
          .add{
            background: #2EC9CF url("./add.png") no-repeat center;
            background-size: 80% auto;
          }
          input {
            width: rem(120);
            background: #F5F5F5;
            margin: 0 rem(10);
            padding-right: 0;
          }
        }
      }
      .delivery {
        div {
          padding: rem(30) rem(23) rem(30) 0;
          border-bottom: none;
        }
      }
      .bills {
        cursor: pointer;
        div {
          border-bottom: none;
          input {
            width: 75%;
            text-align: right;
            background: url("./beMore.png") no-repeat right;
            background-size: auto 100%;
            padding-right: rem(40);
          }
        }
      }
      .fade-enter-active, .fade-leave-active {
        transition: all .7s
      }
      .fade-enter, .fade-leave-to {
        opacity: 0
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
        letter-spacing: 1px;
      }
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .footer {
      padding-bottom: 34px !important;
    }
  }

</style>
