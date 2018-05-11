<template>
  <div class="messageBox">
    <ul>
      <li v-for='(m,index) in list' :key='index'>
        <p class="time">{{getDateDiff(m.time)}}</p>
        <!-- body -->
        <div class="message_body">
          <!-- content -->
          <div class="message_content">
              <h2 class="title">{{m.title}}</h2>
              <!-- flex  -->
              <div class="flex">
                <div class="text">{{m.introduction}}</div>
                <div class="image"><img :src="m.url" alt=""></div>
              </div>
              <!-- flex end -->
          </div>
          <!-- contentend -->
           <!-- tip 回执提示-->
              <div class="tip">
                <h3 class='label'>回执提示：</h3>
                <p class="tip_content">{{m.tip}}</p>
                <a class="btn btn-primary">回复</a>
              </div>
              <!-- tip end -->
        </div>
        <!-- body end -->
        <p class="time">{{getDateDiff(m.time)}}</p>
        <!-- body -->
        <div class="message_body">
          <!-- content -->
          <div class="message_content">
              <h2 class="title">{{m.title}}</h2>
              <!-- flex  -->
              <div class="flex">
                <div class="text">{{m.introduction}}</div>
              </div>
              <!-- flex end -->
          </div>
          <!-- contentend -->
           <!-- tip 回执提示-->
              <div class="tip">
                <h3 class='label'>回执提示：</h3>
                <p class="tip_content">{{m.tip}}</p>
                <a class="btn btn-primary">回复</a>
              </div>
              <!-- tip end -->
        </div>
        <!-- body end -->
      </li>
    </ul>
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

.messageBox {
  font-size: 0.24rem;
  text-align: center;

  ul {
    li {
      .time {
        display: inline-block;
        margin-top: 0.16rem;
        padding: 0.1rem 0.18rem;
        background: #dee4e8;
        border-radius: 0.04rem;
        color: white;
        box-sizing:border-box;
      }

      .message_body {
        text-align: left;
        margin-top: 0.22rem;
        background: #fff;
        padding: 0.24rem;
        box-sizing: border-box;
        border-radius: 0.1rem;
        box-shadow: 0 0 5px $color-bg-d;

        .message_content {
          padding-bottom: 0.2rem;
          border-bottom: 1px solid $color-border;

          .title {
            font-size: 0.3rem;
            margin-bottom: 0.15rem;
            color:$color-text-l;
          }
          // 图文
          .flex {
            display: flex;
            justify-content: space-between;

            .text {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              line-height: 1.4;
              color:$color-text;
              padding-right: 0.2rem;
            }

            .image {
              flex: 0 0 1.1rem;

              img {
                width: 100%;
                height: 0.77rem;
              }
            }
          }
          // 文字消息
          .character{
            .text{
              display block
            }
          }
        }
        // 回执提示
        .tip {
          margin-top: 0.2rem;
          display: flex;
          justify-content: space-around;
          line-height: 1.4;
          color:$color-text;
          

          h3 {
            flex: 0 0 auto;
            color:$color-text-l
          }

          .btn {
            flex: 0 0 auto;
            align-self: center;
          }

          p {
            flex: 1;
            padding-right: 0.2rem;
          }
        }
      }
    }
  }
}
</style>



