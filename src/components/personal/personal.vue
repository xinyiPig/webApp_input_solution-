<template>
  <div class="container">
      <div class="header">
        <div class="sculpture">
          <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526608169&di=ba25fc41682e62eb3a551c4a69798250&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.qqwangming.org%2Fuserup%2F8594%2F131212104027.jpg" alt="头像">
        </div>
        <div class="infor">
          <h2 class='name'>梁振中</h2>
          <p>学号： 201330612042</p>
        </div>
      </div>
      <!-- 头部结束 -->
      <div class="line"></div>
      <!-- 消息盒子 -->
      <div class="messageBox">
        <div class="title">
            消息
        </div>
        <div class="content">
           <div class="sect">
              <img src="" alt="" >
              <p class='name'>机构信箱</p>
           </div>
       
        </div>
      </div>
      <!-- 消息盒子end -->
      <div class="line"></div>
      <!-- 功能条 -->
      <div class="toolsBar">
        <div class="toolsItem clear">
          <div class="left">
              <i class='icon'></i><span>收藏</span>
          </div>
          <div class="right"></div>
        </div>
      </div>
      <!-- 功能条end -->
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/index.styl';

.container {
  height 100%;
  padding: 0.26rem;
  background $color-bg-d;
  text-align:left;
  font-size:0;
  &>.header {
    padding: 0.28rem 0.1rem;
    background #fff;
    border-radius:0.1rem;
    box-shadow:0 0 0.1rem #fff;
    
    .sculpture {
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.32rem;

      img {
        width: 1.24rem;
        height: 1.24rem;
        border-radius: 50%;
      }
    }

    .infor {
      display: inline-block;
      vertical-align: middle;
      .name {
        font-size: 0.44rem;
        color: #080808;
      }

      p {
        font-size: 0.30rem;
        color:$color-text;
        margin-top 0.44rem;
      }
    }
  }
  .messageBox {
    background #fff;
    border-radius:0.1rem;
    box-shadow:0 0 0.5rem #fff;
    .title{
      padding:0.16rem 0 0.16rem 0.4rem;
      position relative;
      font-size:0.32rem;
      color:$color-text;
      font-weight:600;
      border-bottom:1px solid $color-border
      &:before{
        content '';
        position absolute;
        top:50%;
        left:0;
        height 80%;
        width:0.12rem;
        transform translate(0,-50%)
        background:#11A2F3
      }
    }
    .content{
      padding:0.4rem;
      display flex;
      justify-content flex-start;
      .sect{
        text-align center
        flex:0 0 25%;
        .name{
          font-size:0.26rem;
          color:$color-text;
          font-weight:600;
        }
      }
    }
  }
  .toolsBar{
    background #fff;
    border-radius:0.1rem;
    box-shadow:0 0 0.5rem #fff;
    .toolsItem{
      padding:0.26rem 0.26rem 0.26rem 0.36rem
      font-size:0;
      .icon{
        margin-right 0.26rem;
      }
      span{
        font-size:0.32rem;
        color:$color-text;
        font-weight:600;

      }
    }
  }
}
</style>
