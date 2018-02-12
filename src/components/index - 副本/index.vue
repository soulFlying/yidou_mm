<template>
  <div class=index>
    <nav>
      <a><img src="./yidou-logo.png"/> 逸豆</a>
      <div class='middleContent'><i></i>400-178-6881 <button>立即抢购</button></div>
      <a class=loading @click='showdetail' v-show=!hasLoad>登录</a>
      <div class=exit  v-show=hasLoad>
        <h1 @click=isExitShow>用户</h1>
        <ul v-show=exitShow>
          <!--<li @click='ourOrder' :class='{activeLi:activeIndex === 0}'>订单</li>-->
          <li @click=isExit :class='{activeLi:activeIndex === 1}'>退出</li>
        </ul>
      </div>
    </nav>
    <div class=banner>
      <img src="./bgT.png"/>
      <ul>
        <!--<li><label>张天爱限量版：</label><a>￥<em>3999</em>/台</a></li>-->
        <li><label>逸豆尊贵版：</label><a>￥<em>{{diamondSalePrice}}</em>/台</a><span>原价：￥{{diamondOriginalPrice}}/台</span></li>
        <li><label>逸豆通用版：</label><a>￥<em>{{standardSalePrice}}</em>/台</a><span>原价：￥{{standardOriginalPrice}}/台</span></li>
        <li><label>逸豆租赁价格：</label><a>￥<em>{{standardRentPrice}}</em>/台/天</a></li>
      </ul>
      <div><input type=button value="立即购买" @click='goBuy("rent")'/></div>
    </div>
    <div class="content content1">
      <div class=top></div>
      <h1 class=title>设计理念</h1>
      <p>设计灵感来源于德国包豪斯现代美学。采用简约轻奢的风格，时尚大方的色系，机身线条流畅，为您打造舒适手握感。</p>
      <img src="./content1Img.png"/>
    </div>
    <div class="content content2">
      <h1 class=title>制造工艺</h1>
      <img src="./content2bg.png" alt=制造工艺 >
    </div>
    <div class="content content3">
      <div class=top></div>
      <h1 class=title>多语言即时互译</h1>
      <p>出国旅行、留学、购物、商务谈判，逸豆不仅能翻译英语，还能即时翻译多种语言，集多种语言对中文同声互译，包括英语、法语、日语和韩语、西班牙语、俄语等。同时，它还可识别20多种中国方言。</p>
      <img src="./content3img.png" alt=语音翻译 />
    </div>
    <div class="content content4">
      <div class=top></div>
      <h1 class=title>景点语音导览</h1>
      <p>随叫随到的智能语音导游。整合世界全网旅游景点大数据，自动为您定位周边景点。
        选择喜欢的景点播放，即可get景点详细信息。</p>
      <img src="./content4img.png" alt=语音导览 />
    </div>
    <div class="content content45">
      <div class=top></div>
      <h1 class=title>智能问答</h1>
      <p>逸豆采用深度人工交互语音系统，在世界各地随时随地问询目的地、行程路线，美食交通等，
        手握逸豆，让您轻松融入当地生活。</p>
      <img src="./content45img.png" alt=语音导览 />
    </div>
    <div class="content content5">
      <div class=top></div>
      <h1 class=title>随身MI-FI</h1>
      <p>出国游，没有流量怎么行？<br/>
        插入sim卡，超快网速瞬息可达。</p>
      <img src="./content5img.png" alt=随身MI-FI />
    </div>
    <div class="content content6">
      <div class=top></div>
      <h1 class=title>参数详情</h1>
      <ul>
        <li><label>移动网络：</label><input type=text     value='支持2~4G；' readonly/></li>
        <li><label>联网方式：</label><input type=text     value='wi-fi/移动网络；' readonly/></li>
        <li><label>系统：</label><input type=text     value='Android 6.0；' readonly/></li>
        <li><label>翻译语言：</label><input type=text     value='汉语与英日韩法西俄语的互译；' readonly/></li>
        <li><label>联机方式：</label><input type=text     value='蓝牙（ios & Android）；' readonly/></li>
        <li class=borderBot></li>
        <li><label>机身颜色：</label><input type=text     value='黑、白、粉、红；' readonly/></li>
        <li><label>电池：</label><input type=text     value='2400毫安；' readonly/></li>
        <li><label>屏幕尺寸：</label><input type=text     value='1.3英寸' readonly/></li>
        <li><label>麦克风：</label><input type=text     value='降噪双硅麦；' readonly/></li>
        <li><label>蓝牙耳机：</label><input type=text     value='支持；' readonly/></li>
        <li><label>机身尺寸：</label><input type=text     value='支长137mm、宽50mm、厚14mm；' readonly/></li>
        <li><label>喇叭：</label><input type=text     value='外置、K类；' readonly/></li>
        <li><label>GPS：</label><input type=text     value='支持；' readonly/></li>
      </ul>
    </div>
    <div class='content content7'>
      <img src="./bill.png"/>
      <h2>包装清单</h2>
      <ul>
        <li><em></em>逸豆-智能旅行管家*1</li>
        <li><em></em>说明书*1</li>
        <li><em></em>电源适配器*1</li>
        <li><em></em>三宝卡*1</li>
        <li><em></em>USB数据线*1</li>
      </ul>
    </div>
    <div class='content8'>
      <img src="./footer_bg.png"/>
    </div>
    <transition name=fade>
      <div class="login" v-show=loadShow ref='login' v-if=loadShow @touchmove.prevent>
        <div class="box">
          <div class="del" @click='allFalse' v-show=!loadSuccess></div>
          <div class="main" v-show=isLoading&&loadShow>
            <p>快速登录</p>
            <input type="tel" id="mobile" placeholder="请输入您的手机号" v-model="mobile" maxlength='11'
                   onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)">
            <div class="check">
              <input type="number" id="ChkNum" placeholder="请输入验证码" v-model="ChkNum" maxlength='6'>
              <button type="button" ref="getChkNum" @click="getChkNum" :disabled='btnTime'>{{ChkNumInfo}}</button>
            </div>
            <button type="button" id="loginBtn" @click="longinQuick">登录</button>
          </div>
          <!--登陆成功-->
          <div class='loadSuccess' v-show=loadSuccess&&loadShow>
            <img src="./pay.png"/>
            <p>登录成功！</p>
          </div>
          <!--目的地-->
          <div class="selectColor" v-show=rentBtn&&loadShow>
            <img src="./buy_qr.png"/>
          </div>
        </div>
      </div>
    </transition>
    <div class="tost"></div>
    <div class="downTime"></div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import uuid from 'uuid/v1'
  var URL = 'https://yidou.easyto.com/mall'
  export default {
    data () {
      return {
        token: '',
        userId: '',
        deviceId: '',
        mobile: '',
        mobileNav: '',
        ChkNum: '',
        uuid: '',
        loadShow: false,
        hasLoad: false,
        exitShow: false,
        activeIndex: 0,
        disabled: false,
        btnTime: false,
        loadSuccess: false,
        isSubmited: false,
        showSubmit: false,
        entSubmit: false,
        isLoading: false,
        hasPrice: false,
        ChkNumInfo: '获取验证码',
        colorList: ['经典白', '传奇黑', '樱花粉', '中国红'],
        colorIndex: 0,
        colorText: '请选择颜色',
        cityText: '',
        nameText: '',
        rentNameText: '',
        rentBtn: false,
        noColor: false,
        rentNum: '0',
        buyNum: '0',
        timerNum: '',
        timerPrice: '',
        diamondSalePrice: '2699',
        standardSalePrice: '1799',
        standardRentPrice: '49.9',
        diamondOriginalPrice: '3999',
        standardOriginalPrice: '2799',
        ranks: '',
        markWord: '',
        timer: ''
      }
    },
    created () {
      if (localStorage.getItem('token')) {
        this.hasLoad = true
        this.mobileNav = localStorage.getItem('mobile')
      } else {
        this.hasLoad = false
      }
    },
    mounted () {
      // 价格实时获取
//      this.getPrice()
    },
    methods: { // 获取验证码
      getChkNum () {
        let _this = this
        _this.ChkNum = ''
        if (this.mobile === '') {
          _this.enterTost('请输入您的手机号码哦~', 3000)
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
          _this.enterTost('手机号码格式有误哦~', 3000)
          return false
        } else {
          $.ajax({
            url: URL + '/api/v1/user/sendNum',  // 后台获取验证码地址
            type: 'post',
            // contentType:"application/json; charset=utf-8",
            data: {
              phone: '86,' + this.mobile
            },
            success: (res) => {
              // 获取验证码成功
              if (res.res_code === '000000') {
                this.btnTime = true
                var ss = 60
                _this.ChkNumInfo = '获取验证码(' + ss + 's)'
                _this.$refs.getChkNum.style.background = '#cccccc'
                _this.timer = setInterval(() => {
                  ss--
                  _this.ChkNumInfo = '获取验证码(' + ss + 's)'
                  if (ss < 10) {
                    ss = '0' + ss
                  }
                  if (ss === '00') {
                    clearInterval(_this.timer)
                    this.btnTime = false
                    _this.ChkNumInfo = '获取验证码'
                    _this.$refs.getChkNum.style.background = 'linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%)'
                    _this.$refs.getChkNum.style.background = '-webkit-linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%)'
                  }
                }, 1000)
                _this.enterTost('验证码已发送~', 2000)
              } else if (res.res_code === '000009') {
                _this.enterTost('获取验证码过于频繁，请稍后再尝试', 2000)
                return false
              } else {
                _this.enterTost('服务器异常', 2000)
                return false
              }
            }
          })
        }
      }, // 登录
      longinQuick () {
        var _this = this
        if (_this.mobile === '') {
          _this.enterTost('请输入您的手机号码哦~', 2000)
          return false
        }
        if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
          _this.enterTost('手机号码格式有误哦~', 2000)
          return false
        }
        if (_this.ChkNum === '') {
          _this.enterTost('请输入验证码哦~', 2000)
          return false
        }
        var device = localStorage.getItem('uuid')
        if (device === 'null' || device === null || device === 'undefined' || device === undefined) {
          this.uuid = uuid()
          localStorage.setItem('uuid', _this.uuid)
        } else {
          this.uuid = localStorage.getItem('uuid')
        }
        // console.log(uuid())

        $.ajax({
          url: URL + '/api/v1/user/userLoginQuick',  // 后台登录地址
          type: 'post',
          // contentType:"application/json; charset=utf-8",
          data: {
            phone: '86,' + this.mobile,
            chk_num: this.ChkNum,
            device_id: this.uuid
          },
          success: (res) => {
            // 登陆成功
            if (res.res_code === '000000') {
              _this.isLoading = false
              _this.hasLoad = true
              _this.loadSuccess = true
              _this.token = res.token
              _this.userId = res.user_id
              _this.deviceId = res.deviceId
              localStorage.setItem('token', _this.token)
              localStorage.setItem('userId', _this.userId)
              localStorage.setItem('deviceId', _this.deviceId)
              localStorage.setItem('mobile', _this.mobile)
              _this.mobileNav = _this.mobile
              setTimeout(function () {
                _this.loadShow = false
                _this.loadSuccess = false
              }, 1000)
            } else {
              this.enterTost(res.res_msg, 3000)
              return false
            }
          }
        })
      }, // 弹框
      showdetail () {
        if (window.orientation) {
          if (window.orientation !== 0) {
            var obj = document.getElementById('orientation')
            alert('请使用竖屏操作！')
            obj.style.display = 'block'
            return false
          }
          window.onorientationchange = function () {
            var obj = document.getElementById('orientation')
            if (window.orientation === 0) {
              obj.style.display = 'none'
            } else {
              alert('请使用竖屏操作！')
              obj.style.display = 'block'
              return false
            }
          }
        }
        clearInterval(this.timer)
        this.loadShow = !this.loadShow
        this.isLoading = true
        this.ChkNum = ''
        this.ChkNumInfo = '获取验证码'
        this.btnTime = false
      }, // 下拉
      isExitShow () {
        this.exitShow = !this.exitShow
      }, // 购买
      leaveTost () {
        let tost = document.getElementsByClassName('tost')[0]
        if (tost) {
          tost.style.opacity = 0
          tost.style.left = '-100%'
        }
      },
      enterTost (text, timer) {
        let tost = document.getElementsByClassName('tost')[0]
        if (tost) {
          tost.innerText = text
          tost.style.opacity = 1
          tost.style.left = '50%'
          setTimeout(() => {
            this.leaveTost()
          }, timer || 3000)
        }
      },
      isExit () {
        this.activeIndex = 1
        localStorage.removeItem('deviceId')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('mobile')
        this.exitShow = false
        this.hasLoad = false
      },
      ulShow () {
        this.noColor = !this.noColor
      },
      getPrice () {
        let _this = this
        _this.$http.get(URL + '/api/v1/publish/price') // 后台获取
          .then((response) => {
            if (response.data.code === 200) {
              var datas = response.data.data
              _this.standardRentPrice = datas.standardRentPrice
              _this.standardSalePrice = datas.standardSalePrice
              _this.diamondSalePrice = datas.diamondSalePrice
              _this.diamondOriginalPrice = datas.diamondOriginalPrice
              _this.standardOriginalPrice = datas.standardOriginalPrice
            }
          })
      },
      goBuy () {
        if (window.orientation) {
          if (window.orientation !== 0) {
            var obj = document.getElementById('orientation')
            alert('请使用竖屏操作！')
            obj.style.display = 'block'
            return false
          }
          window.onorientationchange = function () {
            var obj = document.getElementById('orientation')
            if (window.orientation === 0) {
              obj.style.display = 'none'
            } else {
              alert('请使用竖屏操所！')
              obj.style.display = 'block'
              return false
            }
          }
        }
        this.loadShow = true
        this.rentBtn = true
      },
      allFalse () {
        this.loadShow = false
        this.loadSuccess = false
        this.isSubmited = false
        this.showSubmit = false
        this.rentBtn = false
        this.isLoading = false
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/css/app";

  @mixin img {
    display: block;
    margin: 0 auto;
    height: auto;
  }

  .index {
    a {
      text-decoration: none;
    }
    letter-spacing: 1px;
    position: relative;
    nav {
      height: rem(90);
      line-height: rem(90);
      font-family: PingFangSC-Regular;
      font-size: rem(26);
      color: #fff;
      background: #282828;
      padding: 0 rem(16) 0 rem(32);
      a {
        float: left;
        &:first-child {
          text-decoration: none;
        }
        display: block;
        overflow: hidden;
        height: 100%;
        font-family: PingFangSC-Regular;
        font-size: rem(26);
        img {
          display: block;
          width: rem(45);
          float: left;
          margin-right: 5px;
          margin-top: rem(23);
        }
      }
      .middleContent{
        display: inline-block;
        margin-left: rem(110);
        margin-right: rem(18);
        i{
          display: inline-block;
          width: rem(26);
          height: rem(26);
          background: url("./phone.png") no-repeat center;
          background-size:100% 100% ;
          vertical-align: middle;
          margin-right: rem(10);
        }
        button{
          height: rem(50);
          line-height: rem(50);
          padding: 0 rem(20);
          border-radius: rem(25);
          font-size: rem(25);margin-left: rem(15);
          color: #fff;
          border: none;
          outline: none;
          cursor: pointer;
          background-image: linear-gradient(10deg, #31C7D4 0%, #44E9C3 100%);
          background-image: -webkit-linear-gradient(10deg, #31C7D4 0%, #44E9C3 100%);
        }
      }
      .loading {
        float: right;
      }
      .exit {
        min-width: rem(80);
        float: right;
        position: relative;
        color: #eee;
        font-size: rem(26);
        ul {
          position: absolute;
          left: 0;
          top: rem(105);
          font-size: rem(26);
          width: 100%;
          background: #242C39;
          border-radius: 8px;
          li {
            height: rem(70);
            line-height: rem(70);
          }
          .activeLi {
            background: #313536;
          }
        }
      }
    }
    .nav {
      a {
        display: block;
        overflow: hidden;
        height: 100%;
        font-family: PingFangSC-Regular;
        font-size: rem(32);
        img {
          display: block;
          width: rem(80);
          float: left;
          margin-right: rem(15);
          margin-top: rem(13);
        }
      }
    }
    .banner {
      letter-spacing: 2px;
      color: #242c39;
      padding-top: rem(124);
      background: url("./bg.png") no-repeat center;
      background-size: 100% 100%;
      padding-bottom: rem(540);
      > img{
        width: rem(538);
        height: auto;
      }
      h2 {
        font-size: rem(29);
        font-weight: bold;
        display: -webkit-flex; /* Safari */
        display: flex;
        align-items: baseline;
        justify-content: center;
        span {
          padding: rem(10) rem(20);
          background: url("./rest.png") no-repeat center;
          background-size: 100% 100%;
          font-size: rem(54);
          text-align: center;
          color: #3bcbd0;
          margin: 0 rem(5);
          letter-spacing: 0px;
        }
      }
      div {
        margin-top: rem(100);
        &:nth-child(4) {
          margin-bottom: rem(30);
        }
        input {
          width: rem(300);
          height: rem(80);
          font-size: rem(33);
          color: #fff;
          background-image: linear-gradient(10deg, #31C7D4 0%, #44E9C3 100%);
          background-image: -webkit-linear-gradient(10deg, #31C7D4 0%, #44E9C3 100%);
          border-radius: 10px;
          border: none;
          line-height: rem(80);
          z-index: 99;
        }
      }
      ul {
        padding-top: rem(78);
        li{
          text-align: left;
          &:nth-child(4){
           a{
             width: 30%;
           }
          }
          label{
            width: 37%;
            text-align: right;
            display: inline-block;
            margin: rem(10) 0;
          }
          a{
            display: inline-block;
            width: 25%;
            text-align: left;
            em {
              display: inline-block;
              font-size: rem(36);
              color: #e3504e;
              letter-spacing: 0px;
            }
          }
          span {
            letter-spacing: 0px;
            width: 30%;
            font-size: rem(24);
            color: #566275;
            display: inline-block;
            text-decoration: line-through;
          }
        }
      }
      p {
        font-size: rem(26);

      }
      a {

      }
    }
    .content {
      overflow: hidden;
      position: relative;
      font-family: PingFangSC-Light;
      .top {
        height: rem(10);
        background-image: linear-gradient(left, #31C7D4 0%, #44E9C3 100%);
        background-image: -webkit-linear-gradient(left, #31C7D4 0%, #44E9C3 100%);
      }
      .title {
        width: rem(361);
        height: rem(87);
        background: url("title.png") no-repeat center;
        background-size: 100% 100%;
        font-size: rem(36);
        margin: 0 auto;
        margin-top: rem(48);
        color: #fff;
        line-height: rem(87);
        font-weight: bold;
        text-shadow: 0px 5px 18px rgba(0, 0, 0, 0.2);
      }
      p {
        font-size: rem(28);
        text-align: justify;
        color: #3d3d3d;
        padding: rem(0) rem(50);
        margin-top: rem(48);
      }
      img {
        width: rem(650);
        @extend img;
        margin-top: rem(112);
        margin-bottom: rem(175);
      }
    }
    .content2 {
      position: relative;
      overflow: hidden;
      .title {
        margin: 0;
        position: absolute;
        top: rem(64);
        left: 50%;
        margin-left: rem(-180);
      }
      img {
        width: 100%;
        height: auto;
        margin: 0;
        display: block;
      }
    }
    .content3 {
      img {
        width: 100%;
        @include img;
        margin-top: rem(60);
        margin-bottom: rem(132);
      }
    }
    .content4, .content45, .content5 {
      .title {
        margin-top: rem(64);
      }
      p {
        margin-top: rem(62);
      }
      img {
        width: 100%;
        @include img;
        margin-top: rem(20);
      }
    }
    .content45 {
      p {
        margin-top: rem(60);
      }
      img {
        margin-top: rem(66);
      }
    }
    .content5 {
      p {
        color: #808080;
      }
      img {
        margin-top: rem(0);
      }
    }
    .content6 {
      font-size: rem(28);
      color: #121212;
      background: #F6F5F5;
      ul {
        padding: 0 rem(56);
        margin: rem(80) 0;
        line-height: rem(56);
        text-align: left;
        font-size: rem(28);
        li {
          label {
            width: 25%;
            margin-right: 5%;
            display: inline-block;
            letter-spacing: 0;
          }
          input {
            border: none;
            color: #121212;
            width: 70%;
            background: #F6F5F5;
          }
        }
        .borderBot {
          border-bottom: 1px solid #7b7b7b;
          height: rem(28);
          margin-bottom: rem(28);
          margin-right: rem(-56);
        }
      }
    }
    .content7{
      color: #252f3c;
      padding-bottom: rem(66);
      img{
        display: block;
        width: rem(44);
        height: auto;
        margin: rem(66) auto rem(18);
      }
      h2{
        font-size:rem(28);
        font-weight: bold;
      }
      ul{
        margin-top: rem(30);
        overflow: hidden;
        padding: 0 rem(80) 0 rem(110);
        li{
          width: rem(350);
          float: left;
          font-size: rem(24);
          text-align: left;
          height: rem(50);
          line-height: rem(50);
          &:nth-child(2),&:nth-child(4){
            width: rem(200);
          }
          em{
            display: inline-block;
            width: rem(27);
            height: rem(26);
            background: url("./tick.png") no-repeat center;
            background-size: 100% 100%;
            margin-right: 12px;
            vertical-align: middle;
          }
        }
      }
    }
    .content8{
      img{
        width: 100%;
        height: auto;
        display: block;
      }
    }
    /*弹框*/
    .login {
      background-color: rgba(8, 8, 8, 0.43);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      .box {
        width: 80%;
        margin: 26% auto rem(20);
        position: relative;
        .main {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          p {
            font-size: rem(34);
            color: #575757;
            text-align: center;
            margin: rem(30) 0;
          }
          input {
            line-height: normal;
          }
          input::-webkit-input-placeholder {
            color: #cbcbcb;
          }
          #mobile {
            height: rem(80);
            width: 85%;
            display: block;
            margin: 0 auto rem(20);
            font-size: rem(28);
            border: 1px solid #cbcbcb;
            text-indent: 1em;
            border-radius: 8px;
          }
          .check {
            text-align: center;
            width: 85%;
            margin: 0 auto;
            #ChkNum {
              height: rem(80);
              width: 49%;
              color: #cbcbcb;
              font-size: rem(28);
              border-radius: 8px;
              border: 1px solid #cbcbcb;
              margin-right: 3%;
              display: inline-block;
              text-indent: 1em;
              color: #4a4a4a;
            }
          ;
            button {
              height: rem(80);
              width: 45%;
              font-size: rem(28);
              color: #ffffff;
              background-image: linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%);
              background-image: -webkit-linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%);
              border: none;
              border-radius: 8px;
              display: inline-block;
            }
          }
          #loginBtn {
            height: rem(80);
            width: 85%;
            background-image: linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%);
            background-image: -webkit-linear-gradient(129deg, #31c7d4 0%, #44e9c3 100%);
            color: #ffffff;
            font-family: "MicrosoftYaHei";
            font-size: rem(30);
            display: block;
            margin: rem(20) auto rem(46);
            border: none;
            border-radius: 8px;
            box-shadow: 0px 2px 18px rgba(80, 227, 194, 0.33);
          }
        }
        .loadSuccess {
          background-color: #fff;
          border-radius: 8px;
          padding-bottom: rem(100);
          img {
            margin-top: rem(100);
            width: rem(91);
            height: auto;
          }
          p {
            color: #35CDD1;
            font-size: rem(32);
            margin-top: rem(30);
          }
        }
        .submitSuccess {
          padding-bottom: rem(60);
          p {
            font-size: rem(28);
            color: #575757;
          }
          a {
            display: block;
            margin-top: rem(15);
            color: #9d9d9d;
          }
          img {
            margin-top: rem(80);
          }
          @extend .loadSuccess
        }
        .selectColor{
          background: #fff;
          border-radius: 8px;
          img{
            width: rem(500);
            height: auto;
            display: block;
            margin: 0 auto;
          }
        }
      ;
        .del {
          height: rem(50);
          width: rem(50);
          float: right;
          background: url("close.png") no-repeat center;
          background-size: cover;
          position: absolute;
          right: rem(-45);
          top: rem(-45);
        }
        .fade-enter-active, .fade-leave-active {
          transition: all .7s
        }
        .fade-enter, .fade-leave-to {
          opacity: 0
        }
      }
    }
    // 弹框
    .tost {
      padding: rem(20);
      width: 40%;
      background: rgba(0, 0, 0, 0.6);
      position: absolute;
      top: rem(350);
      color: #fff;
      font-size: rem(25);
      opacity: 0;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      left: -100%;
      transition: all linear 1s;
      -webkit-transition: all linear 1s;
      z-index: 999;
      border-radius: 8px;
    }
  }
</style>
