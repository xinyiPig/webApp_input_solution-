import axios from 'axios'
import router from '@/router'
import store from './store.js'
import { Toast } from 'mint-ui';
import { read } from 'fs';
// 后台返回不需要提示code
const IGNOREBACKCODE = [
  // 成功
  200,
]
// 错误error
const errorCode = [
  500
]
// cookie
axios.defaults.withCredentials = true
// 请求数据处理
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = {
        ...config.data,
        _t: Date.parse(new Date()) / 1000
      }
    } else if (config.method === 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }
    if (!/\/getReceiptTemplate$/.test(config.url)) {
      store.commit('loading', true)
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
const is_weixin = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    // ("微信浏览器");
    return true
  } else {
    // ("不是微信浏览器");
    return false
  }
};
// 返回数据处理
axios.interceptors.response.use(response => {
 

  // 500跳转
  if (errorCode.includes(code)) {
    router.push('/error')
    return
  }
  if (code === 601) {
    if (is_weixin()) {
      let instance = Toast('此账户已在其他设备登录，请重新打开此界面');
    } else {
      if (typeof window.webkit.messageHandlers !== 'undefined') {
        window.webkit.messageHandlers.Offline.postMessage(null)
      }
    }
    // setTimeout(() => {
    //   instance.close();
    // }, 2000);
  }
  console.log(response)
    // 取消加载动画
    store.commit('loading', false)
    console.log(store.state.loading)
    const code = response.data.code
  return response
})