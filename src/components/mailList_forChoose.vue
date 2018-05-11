<template>
  <div>
    <div class="header">
      <my_header :headText='headText' @goBackPage='goBackHome'></my_header>
      <a class='btn-select' @click='selectObj'>确定</a>
    </div>
    <div class="container">
      <div class="tabHeader">
        <div  @click='changeIndex(1)'><a :class='activeIndex==1?"active":""'>标签</a></div>
        <div  @click='changeIndex(2)'><a :class='activeIndex==2?"active":""'>学院机构</a></div>
      </div>
      <div class="body">
        <ul class="searchBar" @click='focus_searchInput'>
          <li v-for='obj,index in selectedObj'><p class="searchBar_text">{{obj.name}}</p><i @click.stop='removeObj(index)' class='iconfont icon-chahao'></i></li>
          <li>
            <input ref='searchInput' @input='search($event)' @blur="hideResult" :placeholder="selectedObj.length==0?placeholderText:''" v-model='value' type="search">
            <i class="iconfont icon-search1187938easyiconnet"></i>
          </li>
        </ul>
        <div class="searchResult" >
          <div v-if='searchResult.length>0'>
            <label v-for='rs in searchResult'>
            <!-- 1是标签，2是机构，3是具体的人 -->
            <p @click='hideResult' ><img class='icon-label' :src="rs.type==1?labelImg:rs.type==2?fileImg:peopleImg">&nbsp;
              {{rs.name}}
            </p>
             <input  style='display:none' :id='rs.id' @click.stop='checkStatu' class='item-checkbox' :value='rs' v-model='selectedObj' type='checkbox'>
            </label>
          </div>
          
        </div>
        <div v-show='activeIndex==1' class="content">
          <div v-if="labelList.length>0">
              <div  v-for='item in labelList' class="item" >
              <label>
                <p><img class='icon-label' src='../common/image/lable.jpg'>&nbsp;
                  {{item.name}}
                  <span v-show='item.userSize'>({{item.userSize}})</span>
                </p>
                <input :id='item.id' @click.stop='checkStatu' class='item-checkbox' :value='item' v-model='selectedObj' type='checkbox'>
              </label>
            </div>
          </div>
          <NoData :showNodata='labelList.length==0' ></NoData>
        </div>
       <div v-show='activeIndex==2' class="content">
         <div v-if='academyList.length>0'>
           <div class="crumbs">
              <a :class='currentCrumbs.length>0?"active":""' @click='showAll'>全部</a><a v-for='cr,index in currentCrumbs' :class='crumbs_a_index!==index?"active":""' @click='showByCrumbs(cr)'>&nbsp;{{cr.name}}</a>
              <!-- <a :class='currentCrumbs.length>0?"active":""' @click='showAll'>全部</a><a v-for='cr in currentCrumbs' @click='showByCrumbs(cr)'>&nbsp;{{cr.name}}</a> -->
            </div>
            <div  v-for='item,index in currentAcademyList' class="item" >
              <p @click.stop='getDetail(item,index)'><img class='icon-academies' :src="item.type===1||!item.type?fileImg:peopleImg">&nbsp;{{item.name}}<span v-show='item.userSize'>({{item.userSize}})</span></p>
              <!-- <i class='iconfont icon-jiantouyou'></i> -->
              <input  :id='"id"+item.account' @click.stop='checkStatu' class='item-checkbox' :value='item' v-model='selectedObj' type='checkbox'>
          </div>
         </div>
          <NoData :showNodata='academyList.length==0' ></NoData> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import my_header from './common/head.vue';
import NoData from './common/noData.vue';
import { getAcademies, getLabels, findUsersByAcademy, getSendObjects } from '@/common/js/api';
import templateListVue from './common/templateList.vue';
import { mapMutations } from 'vuex'
export default {
  components: {
    my_header,
    NoData
  },
  data () {
    return {
      headText: '选择对象',
      activeIndex: 1,
      placeholderText: '搜索',
      academies: [],
      value: '',
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      labels: [],
      labelList: [],
      academyList: [],// 所有机构的列表
      currentAcademyList: [],// 当前需要显示的机构
      selectedObj: [],// 已选的对象
      searchResult: [],// 搜索结果
      crumbs: [],// 用来记录面包屑
      currentCrumbs: [],// 显示当前的面包屑
      crumbs_a_index: '',
      crumbsIndex: '',// 1-x-x-x的形式去记录是当前显示的是某一级的下一级的下一级,当显示全部时，此值为空
      st: '',
      labelImg:require('../common/image/lable.jpg'),
      peopleImg:require('../common/image/people.png'),
      fileImg:require('../common/image/file.png'),
    }
  },
  watch: {
    $route (to, from) {
      if ((to.path === "/mailList_forChoose") && (from.path === "/newsSend")) {
        this.selectedObj = []
      }
    }
  },
  methods: {
    ...mapMutations(['updateLabel']),
    changeIndex (type) { // 1为标签 2为机构
      this.activeIndex = type;
      this.getByType(1)
    },
    search (event) {
      if (this.value === '') {
        return
      }
      if (this.st !== '') {
        window.clearTimeout(this.st)

      }
      this.st = setTimeout(() => {
        this.getSendObjects()
        let height = document.querySelector('.searchBar').offsetHeight
        document.querySelector('.searchResult').top = height + 2 + 'px'
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
          this.getGroupUsers(item.id)
          flag = true
        } else {
          this.currentAcademyList[index].lowerAcademies.forEach(element => {
            element.type = 1
          })
          this.currentAcademyList = this.currentAcademyList[index].lowerAcademies
          flag = true
        }

      }
      else {
        // 避免当列表中显示的是人还去搜索
        if (item.type !== 3) {
          this.getGroupUsers(item.id)
          flag = true
        } else {
          index = this.selectedObj.findIndex(obj => {
            obj.id = obj.id || obj.account
            return obj.id === item.account
          })
          if (index < 0) {
            this.selectedObj.push(item)
          } else {
            this.selectedObj.splice(index, 1)
          }
        }
      }
      if (flag) {
        this.downCrumbs(item, index)
      }
    },
    // 往下级去增加面包屑
    downCrumbs (item, index) {
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
    // 获取机构下的用户
    async getGroupUsers (id) {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        academyId: id,
        pageIndex: this.pageIndex,
        pageSize: 1000,
        value: this.value
      };
      let $this = this;
      let res = {};
      res = await findUsersByAcademy(sendData)
      res.data.data.list.forEach(value => {
        value.type = 3
      })
      this.currentAcademyList = res.data.data.list
    },
    // 显示所有用户
    showAll () {
      this.currentAcademyList = this.academyList
      this.currentCrumbs = []
      this.crumbs = []
    },
    showByCrumbs (cr) {
      console.log(cr)
      if (cr.name == '> ...') {
        return
      }
      this.crumbsIndex = cr.index
      let indexList = cr.index === 0 ? [0] : cr.index.split("-"); // 如1-4-5 得出[1,4,5]，遍历此数组获取下级
      // 如果点击的是最后一个
      if (indexList.length === this.crumbs.length) {
        return
      }
      let tmpAcademyList = this.academyList
      // 改变显示的数据
      indexList.forEach((value, index) => {
        // if (index === indexList.length - 1) {

        // } else {
        tmpAcademyList = tmpAcademyList[value].lowerAcademies
        // }
      })
      this.currentAcademyList = tmpAcademyList;
      // 改面包屑
      this.upCrumbs(cr)
      console.log(tmpAcademyList)
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
    async  getByType (pageIndex) {
      this.pageIndex = pageIndex
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        manageServiceId: sessionStorage.manageServiceId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        value: ''
      }
      let req = {}
      let backData = {}
      if (this.activeIndex === 1) {
        if (this.labelList.length === 0) {
          req = await getLabels(sendData)
          backData = req.data;
          backData.data.list.forEach((e) => {
            e.type = 2
          })
          this.labelList = backData.data.list
          this.totalPage = backData.totalPage
        }
      } else {
        if (this.academyList.length === 0) {
          req = await getAcademies(sendData)
          backData = req.data;
          // let academyList = [{            id: 1741,
          //   lowerAcademies: [{              id: 1742,
          //     lowerAcademies: [{                id: 1743,

          //       name: "13信管1-3", userSize: 26              }],
          //     name: "13信管1-2", userSize: 26            }]
          //   , name: "13信管1", userSize: 26          },
          // {            id: 1744,
          //   lowerAcademies: [{              id: 1745,
          //     lowerAcademies: [{                id: 1746,
          //       lowerAcademies: [],
          //       name: "13信管1-3", userSize: 26              }],
          //     name: "13信管1-2", userSize: 26            }]
          //   , name: "13信管1", userSize: 26          }]//backData.data.list
          backData.data.list.forEach((e) => {
            e.type = 1
          })
          this.academyList = backData.data.list
          this.currentAcademyList = backData.data.list
          this.totalPage = backData.totalPage
        }
      }
    },
    focus_searchInput () {
      this.$refs.searchInput.focus()
    },
    selectObj () {
      // add zhang
      const obj = {}
      const tag = `tag${this.$route.query.type}`
      // const arr = this.selectedObj.concat()
      // console.log(arr)
      // const type = {
      //   academy: 1,
      //   label: 2,
      //   people: 3
      // }
      // arr.forEach(e => {
      //   e.type = type[e.type]
      // })
      // console.log(arr)
      obj[tag] = this.selectedObj
      console.log(obj)
      // 跟新label
      this.updateLabel(obj)
      this.$router.push({ path: '/newsSend' })
    }
  },
  mounted () {
    this.getByType(1)
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
  top: 0.88rem;
  overflow-y: scroll;
  padding-bottom: 1rem;
  width: 100%;
  background: #fff;
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
    min-height: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 0.04rem;
    max-height: 2rem;
    text-align: left;
    padding: 0.05rem;
    box-sizing: border-box;
    overflow: auto;

    // .searchBar_text {

    // }
    li {
      position: relative;
      text-align: left;
      display: inline-block;
      vertical-align: middle;
      width: 32%;
      background: #eee;
      margin-left: 0.05rem;
      margin-top: 0.05rem;

      .icon-chahao {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-20%, -50%);
        color: #e16531;
        font-size: 0.4rem;
      }

      p {
        padding: .1rem;
        line-height: .4rem;
        width: 1.4rem;
        font-size .24rem
        overflow: hidden; /* 超出部分隐藏 */
        white-space: nowrap; /* 不换行 */
        text-overflow: ellipsis; /* 超出部分文字以...显示 */
      }

      input {
        width: 100%;
        padding: 0.2rem 0.2rem 0.2rem 0.5rem;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 0.3rem;
        -webkit-appearance: none;
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

      .active {
        font-size: #56bcff;
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
