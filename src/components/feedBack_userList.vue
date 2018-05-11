<template>
  <div>
    <div class="header">
      <my_header :headText='headText' @goBackPage='goBack'></my_header>
    </div>
    <div class="itemWrapper">
      
      <scroller :on-refresh="refresh" :on-infinite="infinite" ref='scroller' style='user-select:text'>
        <!-- content goes here -->
        <user-list :itemList='array' @from-child-msg='getDetail'></user-list>
      </scroller>
    </div>
  </div>
</template>
<script>

import my_header from './common/head.vue';
import userList from './common/userList.vue';
import { findUserMessageByService } from '@/common/js/api';
import { mqtt } from '@/common/js/mqtt';
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
export default {
  mixins: [mqtt],
  components: {
    my_header,
    userList
  },
  data () {
    return {
      headText: '',
      array: [
        // {
        //   account: '111',
        //   name: '洪',
        //   firstContent: '啊啊啊',
        //   headUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1019479866,842123333&fm=27&gp=0.jpg",
        //   time: 1483200000000,
        //   messageBoxId: 0,
        //   remindNum: 10,
        //   btnList: [{ name: '取消关注', type: 0 },
        //   { name: '置顶', type: 1 }]
        // },
      ],
      serviceId: '',
      pageIndex: 1,
      pageSize: 10,
      serviceTopics: []
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getDetail (item) {
      this.$router.push({ name: '/feedBack_detail', query: { boxId: item.messageBoxId, serviceId: this.serviceId, account: item.account, name: item.name } })
    },
    async findUserMessageByService () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        serviceId: this.serviceId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      let req = await findUserMessageByService(sendData)
      let backData = req.data;
      this.totalPage = backData.data.totalPage;
      if (this.pageIndex === 1) {
        this.array = ((backData.data.list))
      } else {
        if (backData.data.list.length === 0) {
          this.pageIndex -= 1;
          this.$refs.scroller.finishInfinite(true)
        } else {
          this.array.push(...(backData.data.list))
        }
      }
      // console.log(this.array)
    },
    refresh (done) {
      console.log('pull down')
      var start = this.top - 1
      this.top = this.top - 10
      this.pageIndex = 1
      this.findUserMessageByService()
      done()
    },
    infinite (done) {
      console.log("pull up")
      var start = this.bottom + 1
      this.bottom = this.bottom + 10
      console.log(this.pageIndex < this.totalPage)
      console.log(this.pageIndex)
      console.log(this.totalPage)
      if (this.pageIndex < this.totalPage) {
        this.pageIndex += 1
        this.findUserMessageByService()

      }
      done(true)
    },
    // 接收消息
    handleMessage (message) {

      message = JSON.parse(message).mqttObj
      console.log('第二级订阅',message)

      let index = this.array.findIndex((item, index, arr) => {
        return item.messageBoxId == message.msg.boxId
      });
      let item = this.array[index];
      let tempArray = Object.assign([], this.array)
      let tempItem = tempArray.splice(index, 1)
      item.firstUserName = message.name
      item.firstContent = message.msg.content
      item.time = message.time
      item.remindNum++

      tempArray.unshift(...tempItem)
      this.array = tempArray
      // console.log(this.array)
    }
  },
  mounted () {

  },
  activated () {
    let serviceName = this.$route.query.serviceName
    let serviceId = this.$route.query.serviceId
    this.headText = serviceName;
    this.serviceId = serviceId;
    this.findUserMessageByService()
    this.serviceTopics = sessionStorage.serviceTopics.split(",")
    this.subscribe(this.serviceTopics, this.handleMessage)
  },
  // keep-alive离开
  deactivated () {
    // 取消订阅
    this.unsubscribe(this.serviceTopics)
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

.itemWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 1rem;
  background: #fff;
}
</style>
