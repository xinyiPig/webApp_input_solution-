<template>
<div style='height:100%'>
  <div id="loadingToast" v-show='loading' >
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
          <i class="weui-loading weui-icon_toast"></i>
          <p class="weui-toast__content">请稍后</p>
      </div>
  </div>
    <v-head class='headerWrapper'></v-head>
    <div :class="['body',footer_visible?'':'body_footer_hide']">
      <keep-alive><router-view v-if='!$route.meta||!$route.meta.keepAlive'/></keep-alive>
    <router-view v-if='$route.meta.keepAlive'/>
    </div>
    <div class="footer" v-show="footer_visible">
      <div class="footerWrapper">
        <ul>
          <li v-for='(l,index) in list' :key='index' :class='index===attrs_index?"active":""' @click='changeIndex(index)'>
            <img :src="l.src" alt="">
            <p>{{l.value}}</p>
          </li>
        </ul>
      </div>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import head from './common/head'
const paths = { '收件箱': '/inbox', "发件箱": '/history', "反馈中心": "/FeedBack", "我的": '/personal' }
export default {
  components: {
    'v-head': head
  },
  data () {
    return {
      attrs_index: 0,
      list: [
        { src: '', value: '收件箱' },
        { src: '', value: '发件箱' },
        { src: '', value: '反馈中心' },
        { src: '', value: '我的' }
      ],
      account: 201525040104,
      code: '833e99c2ef9c3a68bc1c3c1854230f5b'
    }
  },
  methods: {
    changeIndex (index) {
      this.attrs_index = index
      sessionStorage.attrs_index = index
      this.$router.push({ path: paths[this.list[index].value] })
    },
    GetUrl () {
      var url = "?" + location.hash.split("?")[1]; //获取url中"?"符后的字串
      var theUrl = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let substr = str.split("&");
        for (var i = 0; i < substr.length; i++) {
          theUrl[substr[i].split("=")[0]] = unescape(substr[i].split("=")[1]);
        }
      }
      return theUrl;
    },
    // /* H5查询自己账号的管理群组 */
    async getManageServices () {
      let sendData = {
        account: this.account,
        code: this.code
      }
      let req = await getManageServices(sendData)
      let backData = req.data;
      this.manageServices = backData.data
      let firstManageService = backData.data[this.index];
      let manageServiceId = firstManageService.manageServiceId


      this.ifRemindFeedback = firstManageService.remind.ifRemindFeedback
      this.ifMessageUpdate = firstManageService.remind.ifMessageUpdate
      this.serviceTopics = firstManageService.serviceTopics

      sessionStorage.manageServiceId = manageServiceId;
      sessionStorage.account = this.account
      sessionStorage.code = this.code
      this.subscribe(this.serviceTopics, this.handleMessage)
      this.manageServiceId = manageServiceId


    },
    handleMessage (message) {
      console.log("message:", message)
    },
    changeManageServiceId () {

      let self = this
      this.index = this.manageServices.findIndex(value => {
        console.log(value)

        return value.manageServiceId === self.manageServiceId
      })
      sessionStorage.nav_index = this.index
      // alert(sessionStorage.nav_index)
      // this.getManageServices()
      window.location.reload();
    }

  },
  computed: mapState({
    // 箭头函数可使代码更简练
    loading: state => state.loading,
    footer_visible:state=> state.footer_visible
  }),
  mounted () {
    let args = this.GetUrl()
    if (args['account']) {
      this.account = args['account']
      this.code = args['code']
    }
    if (sessionStorage.account && sessionStorage.code) {
      this.account = sessionStorage.account
      this.code = sessionStorage.code
    }
    // 记录当前选了哪个index
    if (sessionStorage.attrs_index) {
      let index = parseInt(sessionStorage.attrs_index)
      this.changeIndex(index)
    }
    // window.webkit.messageHandlers.Offline.postMessage(null)
    this.getManageServices();
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel="stylesheet/stylus">
@import '../common/stylus/head.styl';
@import '../common/stylus/variable.styl';

html, body {
  height: 100%;
  background-color: $color-bg-d;
}

.headerWrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 11;
}

.body {
  height: 100%;
  padding-bottom: 1rem;
  padding-top: 0.88rem;
  // position relative;
}
.body_footer_hide{
  padding-bottom:0rem;
}

.footer {
  border-top: 1px solid $color-border;
  // margin-top: -1rem;
  position absolute;
  bottom:0;
  left:0;
  width:100%;
  font-size: 0;
}

.footerWrapper {
  font-size: 0;

  ul {
    margin: 0;
    padding: 0.05rem 0;
    display: flex;
    justify-content: space-between;

    li {
      flex: 1;
      text-align: center;
      font-size: 0.3rem;

      img {
        width: 0.5rem;
        height: 0.5rem;
      }
    }

    .active {
      p {
        font-weight: bolder;
      }
    }
  }
}

.weui-mask_transparent {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
}

.weui-toast {
  position: fixed;
  z-index: 5000;
  width: 2rem;
  min-height: 0.76rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  margin-left: 0 !important;
  background: rgba(17, 17, 17, 0.7);
  text-align: center;
  border-radius: 0.05rem;
  color: #FFFFFF;
}

.weui-loading {
  width: 0.2rem;
  height: 0.2rem;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: weuiLoading 1s steps(12, end) infinite;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url('~@/common/image/loading.svg') no-repeat;
  background-size: 100%;
}

@keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

@keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

.weui-icon_toast.weui-loading {
  margin: 11px auto;
  width: 38px;
  height: 38px;
  vertical-align: baseline;
}

.weui-toast__content {
  margin: 0 0 0.15rem;
  font-size: 0.2rem;
}

.weui-icon_toast {
  margin: 22px 0 0;
  display: block;
}

/* WEUI---------------------------loading  end */
</style>
