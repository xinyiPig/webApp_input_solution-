<template>
  <div class="box">
    <Header :headText="header" @goBackPage="goBack()"></Header>
    <v-loadmore class="content-list" :bottom-method="loadBottom" :bottomPullText="bottomText" :auto-fill="false" ref="loadmore">
      <ul class="content-list__ul">
        <li v-for="(val,index) in list"
            @click="chooseTemplate(val)"
            class="content-list__ul_li">
          <mt-cell-swipe
            class="content-list__ui_cell"
            :title="val.content"
            :right="[
              {
                content: '删除',
                style: { background: 'red', color: '#fff' },
                handler: () => deleteListe(val, index)
              }
            ]"></mt-cell-swipe>
        </li>
        <!-- <li v-for="(val,index) in list" class="content-list__ul_li" :key="index" @click="chooseTemplate(val)">{{val.content}}</li> -->
      </ul>
      <div @click="addTemplate" class="addTemplate">
        <img src="../common/image/tianjiasucai.png"></br>
        <span class="addTemplate-span">请点击添加模板</span>
      </div>
    </v-loadmore>
    <div class="master" @click="addContent=false" v-show="addContent"></div>
    <footer v-show="addContent" class="add-box">
        <input type="text" placeholder="请输入回执内容(15字以内)" @blur="blur" v-focus="focusState" class="input" v-model="content">
        <mt-button class="btn" @click="saveReceipt" type="primary">保存</mt-button>
    </footer>
  </div>
</template>
<script>
  import axios from 'axios';
  import Header from './common/head.vue';
  import {Loadmore} from 'mint-ui';
  import {mapMutations} from 'vuex'
  import {URL} from '@/common/js/url.js'
  export default {
    components:{
      'v-loadmore':Loadmore,
      Header
    },
    data(){
      return {
        header:'回执',
        // addShow:true,//添加模板
        addContent:false,
        focusState:false,
        pageIndex:1,
        list:[],//模板数组
        content:'',//输入
        // allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        // 当前pageindex
        pageIndex: 1,
        totalPage:0,
        loading:false,
        bottomText: '上拉加载',
      }
    },
  directives: {
    focus: {
      update: function (el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  computed: {
    allLoaded() {
      return this.pageIndex === this.totalPage
    }
  },
    methods:{
      ...mapMutations(['updateReceiptId']),
      deleteListe (e, index) {
        axios.post(URL + '/h5/manager/deleteReceiptTemplate', {
          account: sessionStorage.account,
          code: sessionStorage.code,
          id: e.id,
          manageServiceId: sessionStorage.manageServiceId
        }).then(res => {
          if (res.data.code !== 200) return
          this.list.splice(index, 1)
          this.$toast('删除成功')
        })
      },
      goBack(){
        this.$router.push({path: '/newsSend'});
      },
      addTemplate(){
          // this.addShow=false;
          this.addContent=true;
          this.focusState = true
      },
      blur(){
          this.focusState=false;
          // this.addShow=true;
          this.addContent=false;
      },
      getReceipt(){
        let sendData={
          "account": sessionStorage.account,
          "code": sessionStorage.code,
          "manageServiceId":1,
          "pageIndex":this.pageIndex,
          "pageSize": 4
        };
        axios.get(`${URL}/h5/manager/getReceiptTemplate`, {params: sendData}).then(res => {
          this.list.push(...res.data.data.list);
          this.totalPage = res.data.data.totalPage;
          (this.pageIndex !== 1) && this.$toast('已跟新')
          this.$refs.loadmore.onBottomLoaded()
        });
      },
      // 上拉加载
      loadBottom(){
        if (this.totalPage === this.pageIndex) {
          setTimeout(() => {
            this.bottomText = '没有更多数据了'
            this.$refs.loadmore.onBottomLoaded()
            return false
          }, 500)
        } else {
          this.pageIndex++;
          this.getReceipt()
        }
      },
      //选择某一个模板
      chooseTemplate(e){
        this.updateReceiptId({status: true, id: e.id})
        this.$router.push({path: '/NewsSend'});
      },
      //保存
      saveReceipt(){
          let _this=this;
          if(this.content.length>15) {
            this.$toast('不得超过15字')
            return
          }
          let sendData={
            "account": sessionStorage.account,
            "code": sessionStorage.code,
            "manageServiceId":1,
            "content":_this.content,
          };
        axios.post(URL + '/h5/manager/saveReceiptTemplate',sendData,{}).then(function (res){
          if (res.data.code !== 200) {
            this.$toast('保存失败')
            return
          }
            _this.list.push({
                "content":_this.content,
                "id":res.data.data
            });
            _this.content = ''
        });
      },
    },
    blur () {
      this.focusState = false;
      this.addShow = true;
      this.addContent = false;
    },
    //保存
    // saveReceipt () {
    //   this.$emit('saveReceipt', this.content)
    // },
  mounted () {
    this.getReceipt();
  }
}
</script>
<style scoped lang="stylus">
  /*import './common/stylus/index.styl'*/
  @import '../common/stylus/head.styl'
  .box{
    width:100%;
    height:100%;
    overflow:auto;
    position:relative;
    background:fff;
    display flex
    flex-direction column
    overflow-y auto
  }
  .content-list{
    flex 1
    overflow-y auto
    -webkit-overflow-scrolling : touch
    background-color #f6f7f7
    padding-top 10px
    .content-list__ul {
      background-color #ffffff
      border 0
      .content-list__ul_li{
        // border-bottom 1px solid #cccccc
        // height: 0.9rem;
        // line-height: 0.9rem;
        font-size: 0.26rem;
        // color #444444
        // border 0
        // .content-list__ui_cell {
        //   border 0
        // }
      }
    }
    .addTemplate {
      padding 20px 0
      font-size: 0.26rem;
      background-color #ffffff
      .addTemplate-span{
        margin-top 8px
        display inline-block
      }
    }
  }
  .add-box{
    position absolute
    bottom 0
    width 100%
    display flex
    flex-direction row
    background-color #ffffff
    padding: 6px 10px
    box-sizing border-box
    .input {
      flex 1
      border 1px solid #cccccc
      border-radius 4px
      text-indent 10px
      margin-right 6px
    }
    // .btn {
    //   width 40px
    // }
  }
  .master{
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    background-color rgba(0,0,0,.5)
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

  // div {
  //   height: 0.9rem;
  //   line-height: 0.9rem;
  //   font-size: 0.26rem;
  //   color: #ccc;

  //   img {
  //     margin-right: 0.18rem;
  //     width: 0.3rem;
  //   }
  // }
</style>
