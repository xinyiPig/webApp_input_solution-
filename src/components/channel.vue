<template>
    <div class="box">
      <div class="channel" v-show="channelShow">
        <p>选泽渠道</p>
        <ul>
          <li><img src="../common/image/waitChoose.png">短信(<span>剩余590条</span>)</li>
          <li><img src="../common/image/waitChoose.png">邮件<span></span></li>
          <li><img src="../common/image/waitChoose.png">QQ公众号(<span>400人关注</span>)</li>
          <li><img src="../common/image/waitChoose.png">微信企业号(<span>400人关注</span>)</li>
          <li><img src="../common/image/waitChoose.png">微信公众号(<span>400人关注</span>)</li>
          <li><img src="../common/image/waitChoose.png">信使App(<span>100人安装</span>)</li>
        </ul>
        <button>确定发送</button>
      </div>
      <div class="mask" v-show="shutShow"></div>
    </div>
</template>
<script>
  import axios from 'axios';
//  import {}
  export default {
    components: {},
    data(){
      return {
        channelShow:true,
        shutShow:true,//遮罩层
      }
    },

    methods:{

    },
    mounted(){
    }
  }
</script>
<style scoped lang="stylus">
  /*import './common/stylus/index.styl'*/
  @import '../common/stylus/head.styl'
  #app{
    height:100%;
  }
  .box{
    width:100%;
    height:100%;
    position:relative;
    background:fff
  }
  .channel
    width:5.04rem;
    height:6.4rem;
    background:#fff;
    border-radius:6px;
    position: absolute
    top:50%;
    left:50%
    margin-left:-140px;
    margin-top:-174px;
    z-index:300
    text-align:left;
    p
      color:#000;
      font-size:0.28rem;
      padding:0.2rem 0.3rem;
      text-align:center;
      border-bottom:1px solid #ccc;
    ul
      padding:0 0.3rem 0.3rem 0.3rem;
      margin:0
      li
        padding:0.1rem 0 0 0
        font-size:0.27rem;
        line-height:0.6rem;
        img
          margin-right:0.2rem;
          vertical-align:middle;
    button
      background:#56bcff;
      border:none;
      outline:none;
      width:2.502rem;
      margin:0 auto;
      display:block;
      line-height:0.8rem;
      color:#fff;
      font-size:0.34rem;
      border-radius:4px;
  .mask
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background:#ccc;
    opacity:0.5;
    z-index:100
</style>
