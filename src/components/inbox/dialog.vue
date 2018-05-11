<template>
  <div class="dialogWrapper">
    <div class="dialogs" v-for='(d,index) in list' :key='"dialog"+index'>
       <p class="time">{{getDateDiff(d.time)}}</p>
       <!-- 左侧对话框 -->
       <div v-if='d.type==="left"' class="dialogItem itemLeft">
         <div class="sculpture">
           <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=14664630,3884395449&fm=27&gp=0.jpg" alt="" >
         </div>
         <div class="infor">
           <h3 class="name">华工信使</h3>
           <div class="content">
             我打算用信使给老师提个问题
           </div>
         </div>
       </div>
       <!-- 左侧结束 -->
       <!-- 右侧对话框 -->
       <div v-if='d.type==="right"'  class="dialogItem itemRight">
         <div class="infor ">
           <h3 class="name">华工信使</h3>
           <div class="content">
             我打算用信使给老师提个问题
           </div>
         </div> 
         <div class="sculpture">
           <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=14664630,3884395449&fm=27&gp=0.jpg" alt="" >
         </div>
       </div>
       <!-- 右侧结束 -->
    </div>
  </div>
</template>
<script>
import { timeFilter } from '../../common/js/mixin'
export default {
  props: {
    list: {
      type: Array,
      default: {
        return: []
      }
    }
  },
  mixins: [timeFilter],
  data () {
    return {

    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/index.styl';

.dialogWrapper {
  
  .time {
    display: inline-block;
    margin-top: 0.16rem;
    padding: 0.1rem 0.18rem;
    background: #dee4e8;
    border-radius: 0.04rem;
    color: white;
    font-size: 0.22rem;
  }
  .dialogs{
    font-size:0;
  }
  .dialogItem {
    margin-top: 0.22rem;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .sculpture {
      flex: 0 0 0.8rem;
      font-size: 0;
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .infor {
      flex: 1;
      text-align: left;
      font-size: 0;

      .name {
        font-size: 0.3rem;
        color: $color-text-l;
      }

      .content {
        font-size: 0.26rem;
        color: $color-text;
        position: relative;
        display: inline-block;
        margin-top: 0.12rem;
        max-width: 4.5rem;
        border: 1px solid $color-border;
        border-radius: 0.1rem;
        padding: 0.16rem;
        background: #fff;
        word-wrap: break-word;
        line-height: 1.3;
        z-index: 5;

        // a {
        // position: absolute;
        // right: -0.6rem;
        // bottom: 0.11rem;
        // color: #ccc;
        // }
        &:after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          top: 0.1rem;
          left: -0.19rem;
          z-index: 2;
          border-top: 0.1rem solid transparent;
          border-right: 0.2rem solid #fff;
          border-bottom: 0.1rem solid transparent;
        }

        &:before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          top: 0.08rem;
          left: -0.21rem;
          z-index: 1;
          border-top: 0.12rem solid transparent;
          border-right: 0.22rem solid $color-border;
          border-bottom: 0.12rem solid transparent;
        }
      }
    }
  }

  .itemRight {
    .sculpture {
      margin-right: 0;
      margin-left: 0.2rem;
    }

    .infor {
      text-align: right;

      .content {
        &:after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          top: 0.1rem;
          left: 99%;
          z-index: 2;
          border-top: 0.1rem solid transparent;
          border-left: 0.2rem solid #fff;
          border-right: none;
          border-bottom: 0.1rem solid transparent;
        }

        &:before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          top: 0.08rem;
          left: 100%;
          z-index: 1;
          border-top: 0.12rem solid transparent;
          border-left: 0.22rem solid $color-border;
          border-right: none;
          border-bottom: 0.12rem solid transparent;
        }
      }
    }
  }
}
</style>


