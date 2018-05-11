import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    // CurpageIndex:1,
    // position:0,
    num: 0,
    // 回复消息时底部栏隐藏状态
    footer_visible: true,
    /**
    * 发消息
    */
    // 回执
    receiptId: {
      status: false,
      id: ''
    },
    // 定时
    timer: {
      status: false,
      t: new Date(new Date().getTime() + 60 * 60 * 1000)
    },
    // 图文素材
    imageText: {
      flag: 1,
      content: {}
    },
    // 已选择的标签
    label: {
      tag1: [],
      tag2: []
    },
    //历史中心开始显示第一页
    loadPageIndex: 1,
    selUl: {},
    search: ''

  },
  mutations: {
    loading (state, payload) {
      this.state.loading = payload
    },
    changeFooterVisible (state, payload) {
      this.state.footer_visible = payload
    },
    // CurpageIndex(state, CurpageIndex){  //下拉的总页数
    //   this.state.CurpageIndex = CurpageIndex
    // },
    // save_position(state, value){
    //   this.state.position = value
    //   console.log(this.state.position)
    // },
    num (state, value) {
      this.state.num = value
    },
    /* 发消息 */
    // 更新回执
    updateReceiptId (state, obj) {
      state.receiptId = { ...state.receiptId, ...obj }
    },
    // 跟新图文-文字
    updateImageText (state, obj) {
      state.imageText = { ...state.imageText, ...obj }
    },
    // 更新标签
    updateLabel (state, obj) {
      state.label = { ...state.label, ...obj }
    },
    //历史中心
    loadPageIndex (state, value) {
      this.state.loadPageIndex = value
    },
    selUl (state, value) { //去审核保存选择的查询数据
      this.state.selUl = value
    },
    search (state, cont) { //去审核input的搜索内容
      this.state.search = cont
    }

  }
})