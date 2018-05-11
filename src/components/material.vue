<template>
  <div class="box" style="background:#f6f7f7">
    <Header :headText="header" style="position: relative;z-index:100"  @goBackPage="goBack()"></Header>
    <!-- <section> -->
      <!-- <div class="main-body" :style="{'-webkit-overflow-scrolling': scrollMode}"> -->
    <v-loadmore class="section__body" :bottom-method="loadBottom" :bottomPullText="bottomText" :bottom-all-loaded="allLoaded" ref="loadmore">
      <!-- <ul class="sys_spec_img"> -->
        <li data-aid='1' class="chooseOne" :class="{selected:currentImage.id===val.id}" v-for="(val,index) in ArraySucai" :id='val.id'  @click='currentImage = val'>
          <ol>
            <li class="title">{{val.title}}</li>
            <li class="time">{{val.time | imageTimer}}</li>
            <li class="pic">
              <img class="pictrue" :src="val.photo" style="height:100%;">
              <i class="iconfont check__circle" :class="[(currentImage.id !== val.id) ? 'icon-xuanze' : 'icon-xuanzhong']"></i>
            </li>
            <li class="intrduction">{{val.introduction}}</li>
          </ol>
        </li>
      <!-- </ul> -->
    </v-loadmore>
      <!-- </div> -->
    <!-- </section> -->
    <footer class="footer">
      <button class="choose" v-if="currentImage.id" @click="sureChoose">确认选择</button>
      <button class="forbidden" v-else disabled="disabled">确认选择</button>
    </footer>
  </div>
</template>
<script>
  import axios from 'axios';
  import {timeFilter} from '@/common/js/mixin'
  import Header from './common/head.vue'
  import {Loadmore} from 'mint-ui';
  import {mapMutations, mapState} from 'vuex'
  import {URL} from '@/common/js/url.js'
  export default {
//    mixins:[timeFilter],
    components:{
      'v-loadmore':Loadmore,
      Header
    },
    data () {
      return {
        header:'素材库',
        // forbidden:true,
        chooseShow:false,//禁用按钮或确认按钮
        gouShow:false,//选中素材换图标
        kongShow:true,
        ArraySucai:[],    //存放所有素材数组
        pageIndex:1,//当前页
        // allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode:"auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        pageIndex: 1,
        totalPage:0,
        loading:false,
        bottomText: '下拉加载',
        allLoaded: false,
        // 当前选中的图文
        currentImage: {}
      }
    },
    computed: {
      ...mapState(['imageText'])
    },
    filters: {
      imageTimer(e) {
        const y = new Date(e)
        return y.toLocaleDateString().replace(/\//g, '-')
      }
    },
    methods:{
      ...mapMutations(['updateImageText']),
      goBack(){
        this.$router.push({path: '/newsSend'});
      },
      //获取所有素材
      getMaterial(){
        let sendData={
          "account": sessionStorage.account,
          "code": sessionStorage.code,
          "manageServiceId": sessionStorage.manageServiceId,
          "value": '',
          "pageIndex":this.pageIndex,
          "pageSize": 15
        };
        axios.get(`${URL}/h5/manager/getSources`, {params: sendData}).then(res => {
          if (res.data.code !== 200) return
          this.ArraySucai.push(...res.data.data.list);
          this.pageIndex=res.data.data.pageIndex;
          this.totalPage=res.data.data.totalPage;
          // if (this.pageIndex === this.totalPage) {
          //   this.bottomText = "已加载全部"
          // } else {
          //   this.bottomText = "下拉加载"
          // }
          this.$refs.loadmore.onBottomLoaded()
        });
      },
      // 上拉加载
      loadBottom(){
        if (this.totalPage === this.pageIndex) {
          this.bottomText = '没有更多数据了'
          this.allLoaded = true
          this.$refs.loadmore.onBottomLoaded()
          return false
        } else {
          this.pageIndex++;
          this.getMaterial()
        }
      },
      //确定选择
      sureChoose(){
        // sessionStorage.defaultPhotoOrText=JSON.stringify(this.ArraySucai[this.num]);
        this.updateImageText({content: this.currentImage})
        //跳转到发消息页面
        this.$router.push({path: '/NewsSend'});
      },
    },
    mounted(){
      this.getMaterial(1);
    }
  }
</script>
<style scoped lang="stylus">
  import './common/stylus/index.styl'
  #app{
    height:100%;
  }
  .box{
    width:100%;
    height:100%;
    overflow:auto;
    // position:relative;
    background:f6f7f7
    display flex
    flex-direction column
  }
  img{
    vertical-align:middle;
  }
  // header{
  //   text-align:center;
  //   background:#fff;
  //   font-size:.34rem;
  //   height:0.9rem;
  //   line-height:0.9rem;
  //   border-bottom:1px solid #ccc;
  //   box-shadow:0 0 1px 0 #ccc;
  //   position:relative;
  // }
  header span{
    position:absolute;
    left:.36rem;
    top:0;
  }
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .clear{
    clear:both
  }
  .section__body
    flex 1
    overflow-y auto
    -webkit-overflow-scrolling : touch
    position relative
    text-align left
    background-color #f6f6f6
    // position absolute
    // top 0
    // bottom 0
    // width 100%
    // padding-top .88rem
    // padding-bottom 1.26rem
  // .section__body ul
  //   background:#f6f7f7;
  //   text-align:left;
  //   position relative
  .section__body li.selected
      outline: 2px solid #37A8EC;
      padding: 0;
      position: relative;
      z-index: 0;
    li.chooseOne
      background:#fff;
      text-align:left;
      margin:0.2rem 0.2rem;
      height:4.6rem
      border-radius:6px;
      ol
        height:100%
        .title
          padding:0.3rem 0.2rem 0.1rem 0.2rem
          color:#444
          font-size:.27rem;
          width:90%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          line-height .4rem
        .time
          padding:0 0.2rem  0.1rem  0.2rem
          color:#91a0b7
          font-size:.24rem;
          line-height .4rem
          span
            margin-left:0.22rem;
        .pic
          padding:0 0.2rem  0.2rem  0.2rem
          height:2.37rem;
          position relative
          .pictrue
            border-radius:6px;
          .check__circle
            font-size 25px
            position absolute
            top 50%
            right 10px
            transform translateY(-50%)
          .icon-xuanze
            color #cccccc
          .icon-xuanzhong
            color #56bcff
        .intrduction
          padding:0 0.2rem  0.2rem  0.2rem
          color:#444
          font-size:.26rem
          width:90%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          line-height .4rem
  footer
    // position:fixed;
    // bottom:0;
    // left:0;
    background:#fff;
    height:1.26rem;
    width:100%;
    // z-index:100
    button.forbidden
      border:none;
      width:90%;
      height:.86rem
      margin:.2rem 5%;
      background:#d9d9d9;
      color:#fff;
      font-size:.34rem;
      border-radius:6px;
      display:block;
    button.choose
      border:none;
      width:90%;
      height:.86rem
      margin:.2rem 5%;
      background:#56bcff;
      color:#fff;
      font-size:.34rem;
      border-radius:6px;
      display:block;
  //   选中样式
  // .sys_spec_img
  //   position:relative
    // li.selected
    //   outline: 2px solid #37A8EC;
    //   padding: 0;
    //   position: relative;
    //   z-index: 0;

  // .sys_spec_img
  //   li.selected
  //     i
  //       display: block;
  // .sys_spec_img
  //   li
  //     i
  //       position: absolute;
  //       width: 50px;
  //       height: 50px;
  //       font-size: 0;
  //       line-height: 0;
  //       right: -2px;
  //       bottom: -2px;
  //       background: url(../common/image/gou.jpg) no-repeat right bottom;
  //       z-index: 99;
  //       display:none;

</style>
