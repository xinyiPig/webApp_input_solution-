import Vue from 'vue'
import App from './App'
import router from './router'
import es6Promise from 'es6-promise'
import fontadaptation from './common/js/fontadaptation.js'
import store from './common/js/store'
// axios拦截
import '@/common/js/axios_set.js'

// import '@/common/js/vconsole.js'
import '@/common/stylus/index.styl'
Vue.config.productionTip = false

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
window.addEventListener("change", function () {
  // 得到屏幕尺寸 (内部/外部宽度，内部/外部高度)  
  let clientHeight =  document.documentElement.clientHeight
  alert(clientHeight)
}, false)
// let mqtt = require('@/common/js/mqttws.min.js')
// let client = new Paho.MQTT.Client("202.116.162.42", Number(8080), "a1111"); //建立客户端实例
var mqtt = require('mqtt')

es6Promise.polyfill();
Vue.use(Mint);
Vue.prototype.mqtt = mqtt;
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
