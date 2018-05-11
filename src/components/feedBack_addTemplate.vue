<template>
  <div>
    <my_header :headText='headText' @goBackPage='goBackHome'></my_header>
    <div class='inputDiv'>
      <input @input='inputEvent($event)' v-model='content' placeholder="模板长度为15个字">
      <i class="iconfont icon-duigou" :class='readySave?"icon-color":""'></i>
    </div>
    <div class='btnDiv'>
      <a @click='saveOrUpdateReplyTemplate' :class='readySave?"btn-save":"btn"'>保存</a>
    </div>
  </div>
</template>
<script>

import my_header from './common/head.vue';
import itemList from './common/itemList.vue';
import { Toast } from 'mint-ui'
import { saveOrUpdateReplyTemplate } from '@/common/js/api';
export default {
  components: {
    my_header,
    itemList
  },
  data () {
    return {
      headText: '添加回复模板',
      readySave: false,
      content: '',
      replyId: '',
    }
  },
  methods: {
    goBackHome () {
      this.$router.go(-1)
    },
    inputEvent (event) {
      this.content = event.target.value.substring(0, 15)
      if (this.content.length === 0) {
        this.readySave = false
      } else {
        this.readySave = true
      }
    },
    save () {
    },
    // 传id 就是编辑，否则添加
    async saveOrUpdateReplyTemplate () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        replyTemplate: {
          replyContent: this.content,
          account: sessionStorage.account
        }
      }
      if (this.replyId !== '') {
        sendData.replyId = this.replyId
      }
      let req = await saveOrUpdateReplyTemplate(sendData)
      let backData = req.data;
      if (backData.code === 200) {
        Toast("保存成功，正在跳转")
        sessionStorage.templateText = this.content;
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    }
  },
  mounted () {
    if (sessionStorage.replyId) {
      this.replyId = sessionStorage.replyId
      this.content = sessionStorage.templateText
      sessionStorage.removeItem('replyId')
      sessionStorage.removeItem('templateText')
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
.inputDiv {
  font-size: 0;
  padding: 0.37rem 0.28rem 0.37rem 0.36rem;
  position: relative;
  text-align: left;

  input {
    -webkit-appearance: none;
    border: 1px solid #d9d9da;
    width: 6.24rem;
    box-sizing: border-box;
    padding: 0.15rem;
    font-size:0.3rem
  }

  .iconfont {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 0.41rem;
    color: #ccc;
    transform: translate(-50%, -50%);
  }

  .icon-color {
    color: #65bcff;
  }
}

.btnDiv {
  font-size: 0;

  a {
    font-size: 0.4rem;
    display: inline-block;
    padding: 0.2rem 0.3rem;
    border-radius: 0.05rem;
  }

  .btn {
    background: #d9d9da;
  }

  .btn-save {
    background: #56bcff;
    color: #fff;
  }
}
</style>
