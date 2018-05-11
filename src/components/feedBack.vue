<template>
<div class='container'>
    <div class="itemWrapper">
      <scroller v-show='array.length>0' :on-refresh="refresh"  ref='scroller' style='user-select:text'>
        <itemList  :itemList='array' @from-child-msg='getDetail'></itemList>
        
      </scroller>
      <NoData :showNodata='array.length==0' ></NoData> 
    </div>
</div>
</template>
<script>
import NoData from './common/noData.vue';
import my_header from './common/head.vue';
import itemList from './common/itemList.vue';
import { findFeedbacks } from '@/common/js/api';
import { mqtt } from '@/common/js/mqtt';
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
export default {
  mixins: [mqtt],
  components: {
    my_header,
    itemList,
    NoData
  },
  data () {
    return {
      headText: '反馈中心',
      serviceTopics: [],
      pageSize: 15,
      array: [
        // {
        //   firstUserName: '洪',
        //   firstContent: '啊啊啊',
        //   service: {
        //     "serviceId": 0,
        //     "serviceName": "宣传部",
        //     "url": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1019479866,842123333&fm=27&gp=0.jpg"
        //   },
        //   time: 1483200000000,
        //   remindNum: 10,
        //   btnList: [{ name: '取消关注', type: 0 },
        //   { name: '置顶', type: 1 }]
        // }
      ]
    }
  },
  methods: {
    goBackHome () {
      this.$router.go(-1)
    },
    getDetail (data) {
      console.log(data.serviceName)
      this.$router.push({ name: "/feedBack_userList", query: { serviceName: data.serviceName, serviceId: data.serviceId } })
    },
    async findFeedbacks () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId
      }
      let req = await findFeedbacks(sendData)
      let backData = req.data;
      this.array = backData.data
    },
    refresh (done) {
      console.log('pull down')
      var start = this.top - 1
      this.top = this.top - 10
      this.findFeedbacks()
      done()
    },
    // 接收消息
    handleMessage (message) {

      message = JSON.parse(message).mqttObj
      console.log('第一级订阅：',message)
      let item = this.array.find((item, index, arr) => {

        return item.service.serviceId == message.msg.serviceId
      });
      item.firstUserName = message.name
      item.firstContent = message.msg.content
      item.time = message.time
      item.remindNum++
    }
  },
  mounted () {
    
  },
  activated () {
    this.findFeedbacks()
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
@import '~@/common/stylus/index';
.container{
  position relative;
  height:100%;
}
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
  top: 0;
  // background :$color-bg-d
  
}
</style>
