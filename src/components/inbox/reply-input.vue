<template>
  <div class="replyInput">
    <input type="text" v-model.trim='content' placeholder="" @focus="focusHandler" @blur="blurHandler">
    <a v-if='btn_visible'  :class='[content.length>0?"btn-primary":"btn-disabled","btn"]'>发送</a>
  </div>
</template>
<script>
export default {
  data () {
    return {
      btn_visible: true,
      content: '',
      st: {},
      height: '',
    }
  },
  mounted () {

  },
  methods: {
    focusHandler () {
      // alert(document.querySelector('.messageWrapper').offsetHeight)
      this.height = document.querySelector('.messageWrapper').offsetHeight
      this.$store.commit('changeFooterVisible', false)
      // 安卓和ios失去焦点的方式不同，
      this.st = setInterval(() => {
        let acutalHeight = document.querySelector('.messageWrapper').offsetHeight
        if (Math.abs(acutalHeight - this.height) < 50) {
          this.$store.commit('changeFooterVisible', true)
          document.querySelector('input').blur()
        }
      }, 800)

    },
    blurHandler () {
      // alert(document.querySelector('.messageWrapper').offsetHeight)
      clearInterval(this.st)
      this.$store.commit('changeFooterVisible', true)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/index.styl';

.replyInput {
  width: 100%;
  padding: 0.16rem 0.26rem;
  display: flex;
  background: #fff;
  box-sizing: border-box;

  input {
    flex: 1;
    height: 0.7rem;
    border-radius: 0.1rem;
    -webkit-appearance: none;
    border: 1px solid $color-border;
    padding: 0.1rem;
    box-sizing: border-box;
    font-size: 0.26rem;
  }

  .btn {
    flex: 0 0 1rem;
    margin-left: 0.28rem;
    font-size: 0.26rem;
    height: 0.7rem;
    line-height: 0.7rem;
    align-self: center;
    box-sizing: border-box;
    padding: 0;
  }
}
</style>

