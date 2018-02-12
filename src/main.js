// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
/* import autoTextarea from 'auto-textarea' */
Vue.prototype.$http = axios
Vue.use(VueAxios, axios)
/* Vue.use(autoTextarea) */
Vue.config.productionTip = false
/* import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client' */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
