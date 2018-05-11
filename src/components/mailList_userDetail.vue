<template>
  <div class="photoList">
    
		<div class="header">
      <my_header :headText='headText' @goBackPage='goBackHome'></my_header>
      <div class="line"></div>
      <a class="mint-cell">
         <div class="mint-cell-left"></div> 
         <div class="mint-cell-wrapper">
           <div class="mint-cell-title">
             <span class="mint-cell-text">头像</span> 
             </div> 
             <div class="mint-cell-value">
               <img :src='person.headUrl'></img></div>
               </div> 
               <div class="mint-cell-right"></div>
            </a>
     <mt-cell title="姓名" :value="person.name"></mt-cell>
     <mt-cell title="性别" :value="person.gender===0?'保密':person.gender===1?'男':'女'"></mt-cell>
     <mt-cell title="学号" :value="person.account"></mt-cell>
     <mt-cell title="身份" :value="person.type"></mt-cell>
     <mt-cell title="宿舍" :value="person.roomName"></mt-cell>
     <a @click='objShow=true'>
       <mt-cell title="标签"  :value="person.labels.length>0?person.labels.length===1?person.labels[0].name:person.labels[0].name+'...':'无'"></mt-cell>
     </a>
    <div class="line"></div>
    <mt-cell title="手机号" :value="person.phone"></mt-cell>
    <mt-cell title="邮箱" :value="person.email"></mt-cell>
    <mt-cell title="微信企业号" :value="person.ifWxSub===0?'未关注':'已关注'"></mt-cell>
    <mt-cell title="QQ公众号" :value="person.ifQqSub===0?'未关注':'已关注'"></mt-cell>
    <mt-cell title="APP" :value="person.ifAppInstall===0?'未下载':'已下载'"></mt-cell>
    <div class="selectObj" v-show="objShow" @click='objShow=false'>
        
        <ul>
          <li v-for='l in person.labels'><img src="../common/image/biaoqian.png"><span>{{l.name}}</span></li>
          
        </ul>
    </div>
    </div>
		
  </div>
</template>

<script>
import my_header from './common/head.vue';
import { getUserDetail } from '@/common/js/api';
import Vue from 'vue';
import { Cell } from 'mint-ui';
import { Popup } from 'mint-ui';
Vue.component(Popup.name, Popup);
Vue.component(Cell.name, Cell);
export default {
  data () {
    return {
      headText: '',
      objShow: false,
      person: {
        labels: []
      }
    }
  },
  components: {
    my_header
  },
  methods: {
    goBackHome () {
      this.$router.go(-1)
    },
    async getUserDetail () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        desAccount: this.desAccount
      }
      let req = await getUserDetail(sendData)
      this.person = req.data.data;
    }
  },
  mounted () {
    this.desAccount = this.$route.query.desAccount;
    this.headText = this.$route.query.headText;
    this.getUserDetail()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" >
@import '~@/common/stylus/index.styl';

.header {
  text-align: left;

  .mint-cell {
    border-bottom: 1px solid #eee;

    .mint-cell-wrapper {
      background-image: none;
    }
  }

  .line {
    background: #eee;
    height: 0.2rem;
  }
}

.selectObj {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(33, 33, 33, 0.7);
  z-index: 10;

  p {
    color: #000;
    font-size: 0.28rem;
    padding: 0.2rem 0.3rem;
  }

  ul {
    padding: 0.2rem;
    background: #fff;
    border-radius: 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -140px;
    margin-top: -50px;
    z-index: 300;
    text-align: left;

    li {
      padding: 0.1rem 0 0 0;
      font-size: 0.27rem;

      img {
        margin-right: 0.2rem;
        vertical-align: middle;
      }

      span {
        font-size: 0.32rem;
        vertical-align: middle;
      }
    }
  }
}

.mint-cell img {
    vertical-align: middle;
    padding: 0.1rem;
    max-width: 0.6rem;
}
</style>
