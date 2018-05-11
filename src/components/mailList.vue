<template>
  <div>
    <div class="header">
      <my_header :headText='headText' @goBackPage='goBackHome'></my_header>
    </div>
    <div class="container">
      <div class="tabHeader">
        <div  @click='changeIndex(1)'><a :class='activeIndex==1?"active":""'>标签</a></div>
        <div  @click='changeIndex(2)'><a :class='activeIndex==2?"active":""'>学院机构</a></div>
      </div>
      <div class="body">
        <ul class="searchBar" @click='focus_searchInput'>
          <li>
            <input ref='searchInput' @input='search($event)'  :placeholder="placeholderText" v-model='value' type="search">
            <i class="iconfont icon-search1187938easyiconnet"></i>
          </li>
        </ul>
        <div v-show='activeIndex==1' class="content">
            <div>
              <div class="crumbs">
                <a :class='label_currentCrumbs.length>0?"active":""'  @click='showAll_label'>全部 </a><a v-for='cr in label_currentCrumbs' >&nbsp;>&nbsp;{{cr.name}}</a>
              </div>
                <div  v-if="currentLabelList.length>0"  v-for='item in currentLabelList' class="item" >
                <label>
                  <p @click='get_label_Detail(item)'><img class='icon-label' :src="item.type===2||!item.type?labelImg:peopleImg">&nbsp;
                    {{item.name}}
                    <span v-show='item.userSize'>({{item.userSize}})</span>
                  </p>
                </label>
              </div>
            </div>
            <p v-if='label_people_pageIndex>1&&label_people_pageIndex===label_people_totalPage' class='tip'>----没有更多数据----</p>
            <NoData :showNodata='currentLabelList.length==0' ></NoData>
          </div>
          <div v-show='activeIndex==2' class="content">
            <div >
              <div class="crumbs">
                  <a :class='currentCrumbs.length>0?"active":""' @click='showAll'>全部</a><a v-for='cr,index in currentCrumbs' :class='crumbs_a_index!==index?"active":""' @click='showByCrumbs(cr)'>&nbsp;{{cr.name}}</a>
                </div>
                <div v-if='currentAcademyList.length>0'  v-for='item,index in currentAcademyList' class="item" >
                  <p @click.stop='getDetail(item,index)'><img class='icon-academies' :src="item.type===1||!item.type?fileImg:peopleImg">&nbsp;{{item.name}}<span v-show='item.userSize'>({{item.userSize}})</span></p>
                  <!-- <i class='iconfont icon-jiantouyou'></i> -->
              </div>
            </div>
            <p v-if='academy_people_pageIndex>1&&academy_people_pageIndex===academy_people_totalPage' class='tip'>----没有更多数据----</p>            
              <NoData :showNodata='currentAcademyList.length==0' ></NoData> 
          </div>
        
      </div>
    </div>
  </div>
</template>
<script>

import my_header from './common/head.vue';
import NoData from './common/noData.vue';
import { getAcademies, getLabels, findUsersByAcademy, findUsersByLabel, getSendObjects } from '@/common/js/api';
import templateListVue from './common/templateList.vue';
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
export default {
  components: {
    my_header,
    NoData
  },
  data () {
    return {
      // type 1机构 2标签，3人
      headText: '通讯录',
      activeIndex: 1,
      placeholderText: '搜索标签',
      academies: [],
      value: '',
      label_pageIndex: 1,
      label_pageSize: 15,
      label_totalPage: 1,
      label_people_pageIndex: 1,
      label_people_pageSize: 15,
      label_people_totalPage: 1,
      academy_pageIndex: 1,
      academy_pageSize: 15,
      academy_totalPage: 1,
      academy_people_pageIndex: 1,
      academy_people_pageSize: 15,
      academy_people_totalPage: 1,
      labels: [],
      labelList: [],
      currentLabelList: [],
      academyList: [],// 所有机构的列表
      currentAcademyList: [],// 当前需要显示的机构
      selectedObj: [],// 已选的对象
      searchResult: [],// 搜索结果
      crumbs: [],// 用来记录面包屑
      currentCrumbs: [],// 显示当前的面包屑
      crumbsIndex: '',// 1-x-x-x的形式去记录是当前显示的是某一级的下一级的下一级,当显示全部时，此值为空
      crumbs_a_index: '',
      label_crumbs: [],// 用来记录面包屑
      label_currentCrumbs: [],// 显示当前的面包屑
      label_crumbsIndex: '',// 1-x-x-x的形式去记录是当前显示的是某一级的下一级的下一级,当显示全部时，此值为空
      st: '',
      labelImg: require('../common/image/lable.jpg'),
      peopleImg: require('../common/image/people.png'),
      fileImg: require('../common/image/file.png'),
      scrollLock: false,//滚动锁
    }
  },
  methods: {
    changeIndex (type) { // 1为标签 2为机构
      this.activeIndex = type;
      this.getByType(1)
      this.placeholderText = type === 1 ? '搜索标签' : '搜索机构'
    },
    search (event) {
      if (this.st !== '') {
        window.clearTimeout(this.st)
      }
      let self = this

      this.st = window.setTimeout(function () {
        self.getByType(1)
        console.log(self.value)

      }, 1000)
    },
    goBackHome () {
      this.$router.go(-1)
    },
    // 获取机构的下一级
    getDetail (item, index) {
      let flag = false;// 判断是否需要把点击项添加到面包屑
      if (this.currentAcademyList[index].lowerAcademies) {
        if (this.currentAcademyList[index].lowerAcademies.length === 0) {
          this.getGroupUsers(item.id, 1)
          flag = true
        } else {
          this.currentAcademyList[index].lowerAcademies.forEach(element => {
            element.type = 1 // type 1机构 2标签，3人
          })
          this.currentAcademyList = this.currentAcademyList[index].lowerAcademies
          this.getGroupUsers(item.id, 2)
          flag = true
        }

      }
      else {
        // 避免当列表中显示的是人还去搜索
        if (item.type !== 3) {
          this.getGroupUsers(item.id, 1)
          flag = true
        } else {
          this.$router.push({ name: '/mailList_userDetail', query: { desAccount: item.account, headText: item.name } })
        }
      }
      if (flag) {
        this.downCrumbs(item, index)
      }
    },
    // 往下级去增加面包屑
    downCrumbs (item, index) {
      this.academy_people_pageIndex = 1
      if (this.crumbsIndex === '') {
        this.crumbsIndex = 0
      } else {
        this.crumbsIndex = this.crumbsIndex + "-" + index
      }
      this.crumbs.push({ index: this.crumbsIndex, name: '> ' + item.name })

      if (this.crumbs.length >= 3) {
        this.currentCrumbs = this.crumbs.slice(this.crumbs.length - 2, this.crumbs.length)
        this.currentCrumbs.unshift({ index: -1, name: '> ...' })
      } else {
        this.currentCrumbs = this.crumbs
      }
      this.crumbs_a_index = this.currentCrumbs.length - 1
    },
    // 往上级去减少面包屑
    upCrumbs (item) {
      this.academy_people_pageIndex = 1
      let sliceIndex = this.crumbs.findIndex(value => {
        return value.index ? -1 : value.index == item.index
      })
      this.crumbs = this.crumbs.slice(0, sliceIndex + 1)

      if (this.crumbs.length >= 3) {
        this.currentCrumbs = this.crumbs.slice(this.crumbs.length - 2, this.crumbs.length)
        this.currentCrumbs.unshift({ index: -1, name: '...' })
      } else {
        this.currentCrumbs = this.crumbs
      }
      this.crumbs_a_index = this.currentCrumbs.length - 1
    },
    // input 勾选,用来阻止getDetail
    checkStatu () {
      window.setTimeout(() => {
        let searchBar = document.querySelector('.searchBar')
        let scr_height = searchBar.scrollHeight
        let offset_heigth = searchBar.offsetHeight
        document.querySelector('.searchBar').scrollTop = (scr_height - offset_heigth)
      }, 200)

    },
    // 获取机构下的用户 type 1 找下级的人，2找自己同级的人
    async getGroupUsers (id, type) {
      if (id !== '') {
        sessionStorage.maliList_academyId = id

      } else {

      }
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        academyId: id === '' ? sessionStorage.maliList_academyId : id,
        pageIndex: this.academy_people_pageIndex,
        pageSize: 15,
        value: this.value
      };

      let $this = this;
      let res = {};
      res = await findUsersByAcademy(sendData)
      res.data.data.list.forEach(value => {
        value.type = 3
      })
      this.academy_people_totalPage = res.data.data.totalPage;
      if (type === 1) {
        this.currentAcademyList = res.data.data.list
      } else if (type === 2) {
        this.currentAcademyList.push(...res.data.data.list)
      }
    },
    // 获取标签下的用户
    async get_label_Detail (item = '') { // item为空就是加载其他页的状态,而不是往下级
      if (item !== '') {
        this.label_people_pageIndex = 1;
        if (item.type === 3) {
          this.$router.push({ name: '/mailList_userDetail', query: { desAccount: item.account, headText: item.name } })
          return
        }
        this.label_currentCrumbs.push(item)
        sessionStorage.maliList_labelId = item.id
      }
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        labelId: item.id ? item.id : sessionStorage.maliList_labelId,
        pageIndex: this.label_people_pageIndex,
        pageSize: this.label_people_pageSize,
        value: this.value
      };
      let $this = this;
      let res = {};
      res = await findUsersByLabel(sendData)
      res.data.data.list.forEach(value => {
        value.type = 3
      });

      this.label_people_totalPage = res.data.data.totalPage
      if (this.label_people_pageIndex === 1) {
        this.currentLabelList = res.data.data.list
      } else {
        this.currentLabelList.push(...res.data.data.list)
        // console.log(this.currentLabelList)
      }

    },
    // 显示所有用户
    showAll () {
      this.academy_people_pageIndex = 1
      this.currentAcademyList = this.academyList
      this.currentCrumbs = []
      this.crumbs = []
      this.crumbsIndex = ''
    },
    // 显示所有用户
    showAll_label () {
      this.label_people_pageIndex = 1
      this.currentLabelList = this.labelList
      this.label_currentCrumbs = []
      this.label_crumbs = []
    },
    showByCrumbs (cr) {
      this.academy_people_pageIndex = 1
      console.log(cr)
      if (cr.name == '> ...') {
        return
      }
      this.crumbsIndex = cr.index
      let indexList = cr.index === 0 ? [0] : cr.index.split("-"); // 如1-4-5 得出[1,4,5]，遍历此数组获取下级
      console.log(indexList)
      // 如果点击的是最后一个
      if (indexList.length === this.crumbs.length) {
        return
      }
      let tmpAcademyList = this.academyList
      let id = ''
      // 改变显示的数据
      indexList.forEach((value, index) => {
        // if (index === indexList.length - 1) {

        // } else {
        tmpAcademyList = tmpAcademyList[value].lowerAcademies
        id = tmpAcademyList[value].id
        // }
      })
      this.currentAcademyList = tmpAcademyList;
      // 改面包屑
      this.upCrumbs(cr)

      console.log(tmpAcademyList)
      // 获取同级的人员
      this.getGroupUsers(id, 2)
    },
    removeObj (index) {
      this.selectedObj.splice(index, 1)
    },
    // 隐藏搜索结果
    hideResult () {
      this.searchResult.length = 0;
      this.value = ""
    },
    // 搜索标签，机构，用户
    async getSendObjects () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        value: this.value
      }
      let req = await getSendObjects(sendData)
      let list = []
      let backData = req.data;
      if (this.selectedObj.length === 0) {
        list = backData.data
      } else {
        backData.data.forEach((value, index) => {
          index = this.selectedObj.findIndex(obj => {
            obj.id = obj.id || obj.account
            return obj.id === value.id
          })
          if (index < 0) {
            list.push(value)
          }
        })
      }
      this.searchResult = list;
    },
    async getByType (pageIndex) {
      if (this.activeIndex === 1) { // label 存着，用于和各自的totalPage比较判断是否还需滑动加载
        this.label_pageIndex = pageIndex
      } else {
        this.academy_pageIndex = pageIndex
      }
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        pageIndex: pageIndex,
        pageSize: 1000,
        value: this.value
      }
      let req = {}
      let backData = {}

      if (this.activeIndex === 1) {

        req = await getLabels(sendData)
        backData = req.data;
        this.labelList = backData.data
        this.currentLabelList = backData.data
        this.label_totalPage = backData.totalPage
        this.label_currentCrumbs = []
        this.label_crumbs = []
        this.label_crumbsIndex = ''
      } else {

        req = await getAcademies(sendData)
        backData = req.data;
        let academyList = backData.data
        this.academyList = academyList
        this.currentAcademyList = academyList
        this.academy_totalPage = backData.totalPage
        this.currentCrumbs = [];
        this.crumbsIndex = [];
        this.crumbs = []

      }
    },
    focus_searchInput () {
      this.$refs.searchInput.focus()
    },
    selectObj () {

    },
    // 上滑刷新标签中的人
    label_infinite () {
      if (this.label_people_totalPage > this.label_people_pageIndex) {
        this.label_people_pageIndex += 1
        this.get_label_Detail()
      }
    },
    // 上滑刷新机构中的人
    academy_infinite () {
      if (this.academy_people_totalPage > this.academy_people_pageIndex) {
        this.academy_people_pageIndex += 1
        console.log(this.academy_people_pageIndex)
        this.getGroupUsers('', 2)
      }
    },
    scroll () {
      let scrollTop = document.querySelector('.container').scrollTop
      let clientHeight = document.querySelector('.container').clientHeight
      let scrollHeight = document.querySelector('.container').scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        console.log('scroll')
        if (this.activeIndex === 1) {
          this.label_infinite()
        } else {
          // 第一级不用取同级的人
          if (this.currentCrumbs.length > 0) {
            this.academy_infinite()
          }

        }


      }

    }
  },

  mounted () {
    this.getByType(1);
    // document.querySelector('.container').addEventListener('scroll', this.scroll())
    document.querySelector('.container').addEventListener('scroll', this.scroll)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  z-index: 12;
}

.btn-select {
  position: fixed;
  top: 0;
  right: 0;
  transform: translate(-50%, 25%);
  font-size: 0.34rem;
  padding: 0.1rem 0.2rem;
  background: #56bcff;
  border-radius: 0.04rem;
  color: white;
}

.container {
  height: 100%;
  position: absolute;
  padding-top: 0.88rem;
  overflow-y: scroll;
  box-sizing: border-box;
  /* padding-bottom: 1rem; */
  overflow: scroll;
  width: 100%;
  background: #fff;

  .tip {
    color: #999;
    text-align: center;
    font-size: 0.34rem;
  }
}

.tabHeader {
  font-size: 0;

  &>div {
    display: inline-block;
    width: 50%;
    text-align: center;
    border-bottom: 1px solid #ccc;
    background: #fff;

    a {
      font-size: 0.3rem;
      padding: 0.3rem;
      display: inline-block;
      font-weight: bold;
      color: #ccc;
      border-bottom: 2px solid transparent;
    }

    .active {
      border-bottom: 2px solid #56bcff;
      color: #56bcff;
    }
  }
}

.body {
  font-size: 0;
  padding: 0.2rem 0.4rem;
  position: relative;

  .icon-academies {
    width: 0.44rem;
    height: 0.44rem;
    vertical-align: middle;
  }

  .icon-label {
    width: 0.44rem;
    height: 0.44rem;
    vertical-align: middle;
  }

  .searchBar {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 0.04rem;
    text-align: left;
    box-sizing: border-box;
    overflow: auto;

    li {
      position: relative;
      text-align: left;
      display: inline-block;
      vertical-align: middle;
      width: 100%;

      .icon-chahao {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-20%, -50%);
        color: #e16531;
        font-size: 0.4rem;
      }

      p {
        padding: 0.2rem 0.1rem 0.2rem 0.1rem;
        width: 1.4rem;
        overflow: hidden; /* 超出部分隐藏 */
        white-space: nowrap; /* 不换行 */
        text-overflow: ellipsis; /* 超出部分文字以...显示 */
      }

      input {
        width: 100%;
        padding: 0.2rem 0.2rem 0.2rem 0.5rem;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-appearance: none;
        font-size: 0.3rem;
        border: 1px solid transparent;
        border-radius: 0;
      }
    }

    .icon-search1187938easyiconnet {
      font-size: 0.3rem;
      position: absolute;
      top: 50%;
      left: 0.3rem;
      transform: translate(-50%, -50%);
    }
  }

  .searchResult {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 8;
    max-height: 6rem;
    box-sizing: border-box;
    overflow: auto;
    font-size: 0.3rem;
    text-align: left;
    padding: 0rem 0.4rem 0.1rem 0.4rem;

    div {
      background: #f5f5f5;
      padding: 0rem 0.2rem;

      label {
        p {
          padding: 0.25rem 0;
        }
      }
    }
  }

  .content {
    .crumbs {
      font-size: 0.3rem;
      text-align: left;
      padding: 0.25rem 0;
      border-bottom: 1px solid #ccc;

      a {
        font-size: 0.3rem;
      }

      .active {
        color: #56bcff;
      }
    }

    .itemBorder {
      border-bottom: 1px solid #ccc;
    }

    .item {
      position: relative;
      font-size: 0.3rem;
      text-align: left;
      padding: 0.25rem 0;

      .academyWrapper {
        position: relative;
      }

      .item-checkbox {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-50%, -50%);
        display: inline-block;
        border: 0;

        &:before {
          content: url('../common/image/checkbox.png');
          display: block;
        }

        &:checked:before {
          content: url('../common/image/checkbox_check.png');
          display: block;
        }
      }
    }

    .itemLast {
      padding-bottom: 0;
    }
  }
}
</style>
