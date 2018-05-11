<template>
  <div class="inboxWrapper">
    <div class="messageWrapper">
      <v-message :list='messageList'></v-message>
      <v-dialog :list='dialogList'></v-dialog>
    </div>
    <!-- 回复用输入框 -->
    <div class="replyWrapper">
      <v-replyInput></v-replyInput>
    </div>
  </div>
</template>
<script>
import message from './message.vue'
import dialog from './dialog.vue'
import replyInput from './reply-input.vue'
export default {
  components: {
    'v-message': message,
    'v-dialog': dialog,
    'v-replyInput': replyInput
  },
  data () {
    return {
      messageList: [
        {
          time: 1524824851588,
          title: '华园U味',
          introduction: '快来关注啊，每天都有福利（红包，优惠券派发），又吃又拿，等你啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524835063980&di=c6fa51359fcaf48c547ab6f613886210&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F0b7b02087bf40ad1164f54375d2c11dfa8eccebf.jpg'
          , tip: '记得回复啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
        }
      ],
      dialogList: [
        {
          time: 1524824851588,
          type: 'left'
        },
        // {
        //   time:1524824851588,
        //   type:'right'
        // }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
.inboxWrapper {
  height: 100%;
  background: #ebf1f5;
  box-sizing: border-box;
  overflow: auto;

  .messageWrapper {
    height: 100%;
    padding: 0 0.24rem 1.1rem;
    overflow auto;
    box-sizing: border-box;
  }

  .replyWrapper {
    margin-top: -1rem;
    position: relative;
    z-index: 1000;
  }
}
</style>

