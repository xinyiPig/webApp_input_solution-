<template>
  <div>
    <div id="head">
      <div class="headBackImg" ></div>
      <select v-model='manageServiceId'   :class="manageServices.length>1?'':'noBorder'" @change='changeManageServiceId()'>
        <option v-for='item,index in manageServices' :value="item.manageServiceId" >{{item.manageServiceName}}</option>
      </select>
    </div>
    <div style="margin-top:2.4rem">
        <div class="ChangeWrap">
            <div class="changeModul"  @click="send">
                <img src="../common/image/shouye/faxiaoxi@2x.png" alt="">
                <p>发消息</p>
            </div>
            <div class="changeModul" @click="history">
                <img src="../common/image/shouye/fasonglis2@2x.png" alt="">
                <p>发送历史</p>
            </div>
        </div>
        <div class="ChangeWrap" >
            <div class="changeModul" @click="contacts">
                <img src="../common/image/shouye/tongxun@2x.png" alt="">
                <p>通讯录</p>
            </div>
            <div class="changeModul" @click="feedback">
                <img src="../common/image/shouye/fankuizhongx2@2x.png" alt="">
                <p>反馈中心</p>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { getManageServices } from '@/common/js/api';
import { mqtt } from '@/common/js/mqtt';

// document.documentElement.style.background = '#' + 'f6f7f7';
export default {
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
    //发消息
    send () {
      this.$router.push({ path: '/NewsSend' });
    },
    //历史记录
    history () {
      this.$router.push({ path: '/history' });

    },
    //通讯录
    contacts () {
      this.$router.push({ path: '/mailList' });
    },
    //反馈
    feedback () {
      this.$router.push({ path: '/FeedBack' });
    },
    GetUrl () {
      var url = "?"+location.hash.split("?")[1]; //获取url中"?"符后的字串
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
  // 组件创建时
  mounted () {
    
    // this.client.on('message', function (topic, message) {
    //   // message is Buffer
    //   console.log('top:', topic)
    //   console.log('message:', message.toString())
    // })
  },
  // keep-alive进入时
  activated () {
    let args = this.GetUrl()
    console.log(args['account'])
    if (args['account']) {
      this.account = args['account']
      this.code = args['code']
    }
    if(sessionStorage.account&&sessionStorage.code){
      this.account  =sessionStorage.account
      this.code  =sessionStorage.code
    }
    // window.webkit.messageHandlers.Offline.postMessage(null)
    this.getManageServices();
  },
  // keep-alive离开
  deactivated () {
    // 取消订阅
    this.unsubscribe(this.serviceTopics)
    sessionStorage.serviceTopics = this.serviceTopics.join(",")
  },
  // 销毁
  beforeDestroy () {
    // alert("准备销毁")
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel="stylesheet/stylus">
@import '../common/stylus/head.styl';

html, body {
  height: 100%;
  background-color: #f6f7f7;
}

#head {
  border-bottom: 1px solid #f5f6f6;
}

.ChangeWrap {
  width: 100%;
  height: 2.64rem;
  padding: 0 0.91rem;
  margin: 0 auto 0.39rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .changeModul {
    width: 2.64rem;
    height: 2.64rem;
    background-color: #fff;
    text-align: center;
    color: #444444;
    font-size: 0.3rem;
    border-bottom: 1px solid #eee;

    img {
      width: 0.89rem;
      height: 0.89rem;
      margin: 0.64rem 0 0.34rem;
    }

    p {
      line-height: 0.3rem;
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
