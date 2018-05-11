<template>
  <div class='container'>
    <div class="header">
      <my_header :headText='headText' @goBackPage='goBack'></my_header>
    </div>
    
    <div class="body" >
      <!-- :class='showTemplate?"body-pB6":""' -->
        <scroller  style="padding-bottom:1rem;box-sizing:border-box;user-select:text" :on-refresh="refresh" ref='scroller' >
        <div class="itemWrapper">
          <detail-list :itemList='array' ></detail-list>
        </div>
        </scroller> 
    </div>
    <div class="footer" id='footer' :class="">
      <div v-show='!hideInput' class='sendArea'>
        <i class="iconfont icon-liebiao2" @click='showTemplateList'></i>
        <form action='' @submit.prevent="wsSend"><input id='ftInput' @focus='fixInputStart' @blur="fixInputEnd" v-model='content' type="text"></form>
        <a class='btn btn-send' @click='wsSend'>发送</a>
      </div>
      <template-list id='templateList' v-show="showTemplate===true" ref='templateList' @from-child-msg='selectText' @from-child-add='from_child_add'></template-list>
    </div>
  </div>
</template>
<script>

import my_header from './common/head.vue';
import detailList from './common/detailList.vue';
import templateList from './common/templateList.vue';
import { findBoxMessageDetail, sendMessage } from '@/common/js/api';
import { mqtt } from '@/common/js/mqtt';
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
export default {
  mixins: [mqtt],
  name: 'mqttws',
  components: {
    my_header,
    detailList,
    templateList
  },
  data () {
    return {
      headText: '',
      array: [
        {
          // account: '洪',
          // name: '洪',
          // content: '啊啊啊',
          // direction: 0,
          // headUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1019479866,842123333&fm=27&gp=0.jpg",
          // time: 1483200000000,
        },
      ],
      serviceId: '',
      boxId: '',
      userAccount: '',
      pageIndex: 1,
      pageSize: 6,
      showTemplate: false,
      content: '',
      hideInput: false,
      ws: {},
      topic: '',
      isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,
      isiOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      // client_d: new Paho.MQTT.Client("202.116.162.42", Number(8080), "a1111"), //建立客户端实例
      // topic: "chat"// 订阅的主题
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    async findBoxMessageDetail () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        serviceId: this.serviceId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        boxId: this.boxId,
        userAccount: this.userAccount,
      }
      let req = await findBoxMessageDetail(sendData)
      let backData = req.data;
      if (this.pageIndex > 1) {
        this.array.unshift(...(backData.data.list.reverse()))
      } else {
        this.array = backData.data.list.reverse()
      }

      console.log(this.array)
    },
    selectText (item) {
      this.content = item.replyContent;
      this.showTemplateList()
    },
    from_child_add () {
      this.$router.push({ name: '/feedBack_addTemplate' })
    },

    mqttFunc () {
      console.log('client', this.client)
      let _this = this;
      _this.client.subscribe('chat')
      // this.client.on('connect', function () {
      //   console.log("开始连接")
      //   _this.client.subscribe('chat')
      //   // _this.client.publish('chat', 'Hello mqtt')
      // })

      this.client.on('message', function (topic, message) {
        // message is Buffer
        // console.log(topic)
        console.log(message.toString())
        // console.log(message.toString())
        // console.log(_this.client)
        // _this.client.end()
      })

    },
    async wsSend () {
      if (this.content.replace(/(^\s*)|(\s*$)/g, "") === '') {
        Toast("发送的消息不能为空")
        return
      }
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        msg: {
          boxId: this.boxId,
          content: this.content,
          serviceId: this.serviceId
        },
        type: 2
      }
      let req = await sendMessage((sendData))
      let backData = req.data
      if (backData.code === 200) {
        this.content = ''
      }
      document.getElementById('ftInput').blur();
      return false;
    },
    refresh (done) {
      console.log('pull down')
      var start = this.top - 1
      this.top = this.top - 10
      this.pageIndex += 1
      this.findBoxMessageDetail()
      done()
    },
    // 接收消息
    handleMessage (message) {
      message = JSON.parse(message).mqttObj
      console.log('第三级订阅:', message)
      var newChat = {
        content: message.msg.content,
        direction: message.type,
        headUrl: message.headUrl,
        name: message.name,
        time: message.time
      }
      this.array.shift();
      this.array.push(newChat)
      // console.log(this.array)
    },
    // 解决ios下fixed定位的bug
    fixInputStart () {
      if (!this.isAndroid) {
        setTimeout(() => {
          let footer = document.querySelector('#footer')

          // footer.style.position = "relative";
          // this.content = footer.getBoundingClientRect().height

          footer.style.marginTop = -2 * footer.offsetHeight / 100 + 'rem';
          // ftInput.scrollIntoView(true);
          //  ()
          // footer.scrollIntoView(false);
          //footer.scrollIntoViewIfNeeded();
        }, 500)
      }

    },
    fixInputEnd () {
      if (!this.isAndroid) {
        let footer = document.querySelector('#footer')
        footer.style.marginTop = '0'
      }


      // footer.style.position = "fixed";
      // footer.scrollIntoView();
    },
    showTemplateList () {
      this.showTemplate = !this.showTemplate
      if (this.showTemplate) {
        this.$nextTick(() => {
          let height = document.querySelector('#templateList').offsetHeight;
          let body = document.querySelector('.body')
          document.querySelector('.footer').style.marginTop = '-' + height + 'px'
          body.style.transform = `translateY(-${height}px)`
          body.style.WebkitTransform = `translateY(-${height}px)`
        })

      } else {
        let body = document.querySelector('.body')
        document.querySelector('.footer').style.marginTop = '0px'
        body.style.transform = `translateY(${0}px)`
        body.style.WebkitTransform = `translateY(${0}px)`

      }
    }
  },
  mounted () {

    // this.websck()
    // this.mqttFunc()
    // console.log(this.client_d)
    // 如果是从addTemplate.vue回来的
    let headHeight = document.querySelector('.header').offsetHeight;
    let footerHeight = document.querySelector('.footer').offsetHeight;
    document.querySelector('.body').style.height = document.documentElement.clientHeight - headHeight - footerHeight + 'px'
  },
  activated () {
    this.pageIndex = 1
    let name = this.$route.query.name
    let serviceId = this.$route.query.serviceId
    this.headText = name;
    this.serviceId = serviceId;
    this.boxId = this.$route.query.boxId
    this.userAccount = this.$route.query.account
    this.findBoxMessageDetail()
    if (sessionStorage.templateText) {
      this.content = sessionStorage.templateText;
      sessionStorage.removeItem('templateText')
      this.showTemplateList();
      this.$refs.templateList.getReplyTemplates()
    }
    this.topic = this.$route.query.serviceId + '_' + this.$route.query.account
    console.log(this.topic)
    this.subscribe(this.topic, this.handleMessage)
    // 保证文字显示正常
    window.setTimeout(() => {
      let clientHeight = document.body.clientHeight
      let itemHeight = document.querySelector('.itemWrapper').offsetHeight
      let footerHeight = document.querySelector("#footer").offsetHeight
      if (clientHeight - itemHeight > 25) {
        return
      }
      let height = (document.body.clientHeight - document.querySelector('.itemWrapper').offsetHeight) - footerHeight + 'px'
      // this.content = `${document.body.clientHeight},${document.querySelector('.itemWrapper').offsetHeight}`
      this.$refs.scroller.$el.children[0].style.WebkitTransform = "translate3d(0px, " + height + ", 0px) scale(1)"
    }, 500)

  },
  // keep-alive离开
  deactivated () {
    // 取消订阅
    this.unsubscribe(this.topic)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
@import '~@/common/stylus/variable.styl';

p {
  -webkit-user-select: text;
  user-select: text;
}

.iconfont {
  font-size: 0.56rem;
}

.container {
  height: 100%;
  position: relative;
  font-size: 0;
}

.header {
  // position: fixed;
  // top: 0;
  // left: 0;
  // background: #fff;
  // width: 100%;
  // z-index: 12;
  float: left;
  width: 100%;
  background: #fff;
  z-index: 20;
  position: relative;
}

.body {
  // float: left;
  // height: 100%;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1.3rem;
  box-sizing: border-box;
  overflow: auto;
}

.body-pB6 {
  transform: translate(0, -4rem);
}

.body-pB2 {
  padding-bottom: 2rem;
}

.footer {
  // float: left;
  // margin-top: -1rem;
  width: 100%;
  position: relative;
  z-index: 10;
  background: #fff;

  .sendArea {
    border-top: 1px solid #d9d9da;
    height: 1rem;
    line-height: 1rem;
    // padding: 0.14rem 0.39rem;
  }

  .iconfont {
    vertical-align: middle;
    display: inline-block;
    margin-right: 0.16rem;
  }

  form {
    width: 4.34rem;
    display: inline-block;
  }

  input {
    width: 4.34rem;
    vertical-align: middle;
    display: inline-block;
    padding: 0.18rem 0.24rem;
    font-size: 0.28rem;
    border: 1px solid #dddd;
    border-radius: 0.1rem;
    box-sizing: border-box;
    -webkit-appearance: none;
  }

  .btn-send {
    margin-left: 0.31rem;
    vertical-align: middle;
    border-radius: 0.1rem;
    display: inline-block;
    background: #56bcff;
    width: 1.3rem;
    height: 0.72rem;
    color: #fff;
    line-height: 1;
    font-size: 0.32rem;
    padding: 0.22rem 0.32rem;
    box-sizing: border-box;
  }
}
</style>
