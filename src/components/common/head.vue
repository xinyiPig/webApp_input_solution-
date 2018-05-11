<template>
<div>
    <!-- <div id="head" @click='db_scrollToTop'>
      <div class="headBackImg" @click.stop='goBackPage'><img src="../../common/image/shouye/houtui@2x.png" alt=""></div>
      <p>{{headText}}</p>
    </div> -->
      <div id="head">
      <div class="headBackImg" ></div>
      <select v-model='manageServiceId'   :class="manageServices.length>1?'':'noBorder'" @change='changeManageServiceId()'>
        <option v-for='item,index in manageServices' :value="item.manageServiceId" >{{item.manageServiceName}}</option>
      </select>
    </div>
</div>
</template>

<script>import { getManageServices } from '@/common/js/api';
import { mqtt } from '@/common/js/mqtt';
export default {
  // props: ['headText'],
  mixins: [mqtt],
  data () {
    return {
      manageServices: [],
      manageServiceId: '',
      account: '201525040104',
      code: '833e99c2ef9c3a68bc1c3c1854230f5b',
      ifRemindFeedback: false,
      ifMessageUpdate: false,
      serviceTopics: [],
      index: sessionStorage.nav_index || 0
    }
  },
  methods: {
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
  mounted () {
    let args = this.GetUrl()
    console.log(args['account'])
    if (args['account']) {
      this.account = args['account']
      this.code = args['code']
    }
    if (sessionStorage.account && sessionStorage.code) {
      this.account = sessionStorage.account
      this.code = sessionStorage.code
    }
    // window.webkit.messageHandlers.Offline.postMessage(null)
    this.getManageServices();
  }
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
@import '../../common/stylus/head.styl';

html, body {
  width: 100%;
}

body, p, ul, li, h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}

body {
  font-family: '微软雅黑';
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

a:hover, a:active {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:focus {
  text-decoration: none;
}

.banner {
  height: 547px;
  width: 100%;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

div {
  box-sizing: border-box;
}

#head {
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  background-color: #fff;
  border-bottom: 1px solid #f5f6f6;
  position: relative;
  text-align: center;

  p {
    color: #000000;
    font-size: 0.34rem;
    font-weight: bold;
  }

  .headBackImg {
    width: 0.21rem;
    height: 0.27rem;
    position: absolute;
    left: 0.2rem;
    top: 0.3rem;
    padding: 0 0.2rem;

    img {
      width: 0.21rem;
      height: 0.27rem;
      position: absolute;
      left: 0;
    }
  }
}

select {
  padding: 0.1rem 0.2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.3rem;
  border-radius: 0.06rem;
  border: 1px solid transparent;
  background: #fff;
  /* 很关键：将默认的select选择框样式清除 */
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  /* 为下拉小箭头留出一点位置，避免被文字覆盖 */
  padding-right: 0.44rem;
  /* 在选择框的最右侧中间显示小箭头图片 */
  background: url('http://ourjs.github.io/static/2015/arrow.png') no-repeat scroll right center transparent;
}

.noBorder {
  /* 很关键：将默认的select选择框样式清除 */
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  border: none;
  background: #fff;
}
</style>
