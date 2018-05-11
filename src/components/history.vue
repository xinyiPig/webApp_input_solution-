<template>
<div  class="box">
    <div id="aa">
        <!-- <Header :headText="header" @goBackPage='goBackPage'></Header> -->
        <div id="selCheck" >
            <div @click="changefootUrl(0)"><router-link to="/history/hiSend" :class="this.num==0?'defaultCss2':''" class="defaultCss">已审核</router-link></div>
            <div @click="changefootUrl(1)"><router-link to="/hisWaitCheck" :class="this.num==1?'defaultCss2':''" class="defaultCss">待审核</router-link></div>
            <div keep-alive @click="changefootUrl(2)"><router-link to="/hisGoCheck" :class="this.num==2?'defaultCss2':''" class="defaultCss">去审核</router-link></div>
            <div @click="changefootUrl(3)"><router-link to="/hisFail" :class="this.num==3?'defaultCss2':''" class="defaultCss">未通过</router-link></div>
        </div>
    </div>
    
    <div id="child" >
        <keep-alive><router-view></router-view></keep-alive>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import Header from './common/head.vue';
import {mapStart,mapMutations} from 'vuex'
//import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
export default {
    data(){
        return{
            header:'发送历史',
            num:0,
        }
    },
    methods:{
        goBackPage(){
            // this.$router.go(-1)
            sessionStorage.modul=''
            this.$store.state.loadPageIndex = 1 //点击返回时存储到store的值变为初始值
              this.$router.push({path:'/index'})
        },
        changefootUrl(idx){
            this.$store.state.loadPageIndex = 1 //点击返回时存储到store的值变为初始值
            $($(".defaultCss")).css("color","#d7d7d7")
            $($(".defaultCss")[idx]).css('color','#56bcff')
            this.$store.commit('num',idx)
            sessionStorage.modul = idx
        },
    },
    mounted(){
        if(!sessionStorage.modul){
            this.num = 0  //默认加载的页面与样式
             this.$router.push({path:'/history/hiSend'})}
        else{
            this.num = sessionStorage.modul; //另一个页面返回时获取保留起来的值
           
            var arr=['/history/hiSend','/hisWaitCheck','/hisGoCheck','/hisFail']
            this.$router.push({path:arr[sessionStorage.modul]})
        } 
    },
    components: {
        Header,
    }
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
@import '../common/stylus/head.styl'
  .box{
    width:100%;
    height:100%;
    overflow:auto;
    position:relative;
    background:#f6f7f7
  }
#selCheck
    width 100%
    padding 0 0.73rem 0
    height 0.9rem

    border-bottom:1px #e0e0e0 solid 
    display flex
    align-items center
    background-color #fff

    div
        flex 1
        font-size 0.32rem
        .defaultCss
            color: #d7d7d7;
            // color  #56bcff
            text-decoration: none;
            font-size:0.32rem
        .defaultCss2
            color  #56bcff

#child{
    // height:calc(100% - 2rem)
    // height:10.2rem
    width:100%
    position:absolute;
    top:1.98rem
    left:0
    overflow-y:scroll
}
#aa{
    width:100%
    position:fixed
}
</style>
