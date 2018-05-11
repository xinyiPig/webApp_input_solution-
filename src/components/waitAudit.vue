<template>
  <div class="box1" style="background:#f6f7f7">
    <header>
      <span class="left"><img src="../common/image/houtui.png" @click="returnBack">等待审核</span>
      <a class="right" @click="viewHistory">查看历史</a>
    </header>
    <section>
          <ul>
            <li><img src="../common/image/shenhezhong.png"><!--<i class="icon-information"></i>--></li>
            <li>等待管理员审核</li>
          </ul>
    </section>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    components: {},
    data(){
      return {
      }
    },
    methods:{
      returnBack(){
        this.$router.push({path: '/history'});
      },
      viewHistory(){
        sessionStorage.modul= 1;
        this.$router.push({path:'/history'});
      },
    },
    mounted(){}
  }
</script>
<style scoped lang="stylus">
  /*import './common/stylus/index.styl'*/
  @import '../common/stylus/head.styl'
  #app{
    height:100%;
  }
  .box1{
    width:100%;
    height:100%;
    position:relative;
    background:#f6f7f7
  }
  img{
    vertical-align:middle;
  }
  header{
    text-align:center;
    background:#fff;
    font-size:.34rem;
    height:0.9rem;
    line-height:0.9rem;
    border-bottom:1px solid #ccc;
    box-shadow:0 0 1px 0 #ccc;
    position:relative;
  }
  header
    background:#fff;
    span
      display:block;
      margin-left:0.3rem;
      height:100%
      img
        margin-right:0.3rem;
    a
      display:block;
      height:100%
      margin-right:0.3rem;
      color:#56bcff;
      font-size:0.27rem;
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .clear{
    clear:both
  }
  section
    ul
      width:100%;
      text-align:center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      li
        font-size:0.27rem;
        img
          margin-bottom:0.28rem;
          width:8%;
</style>
