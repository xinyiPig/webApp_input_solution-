<template>
  <div class="photoList">
    <div class="header">
      <my_header :headText='headText' @goBackPage='goBackHome'></my_header>
      <div class="searchBar">
        <form>
          <input @input='search($event)' :placeholder="placeholderText" v-model='value' type="search">
          <i class="iconfont icon-search1187938easyiconnet"></i>
        </form>
      </div>
    </div>
		<div class="block">
			<div class="block_content">
				<dl v-for="list in usersList">
					<h2 class="content_title title_border"><span class="title_text">{{list.type}}</span></h2>
				  <dt v-for="list1 in list.newArray">
				  		<div class="one" @click="getDetail(list1)">
                <img :src="list1.headUrl" :alt="list1.name">
                <div>
                  <p>{{list1.name}}&nbsp;&nbsp;{{list1.phone}}</p>
                  <p>{{list1.account}}</p>
                  <p>{{list1.email}}</p>
                </div>
              </div>
				  </dt>
        </dl>
      </div>
		</div>
  </div>
</template>

<script>
import my_header from './common/head.vue';
import { findUsersByAcademy, findUsersByLabel } from '@/common/js/api';
import { Pinyin, compare } from '@/common/js/pinyin';
export default {
  data () {
    return {
      headText: '',
      usersList: [],
      type: 1, // 区分label还是academy
      placeholderText: '搜索姓名，手机号，学工号',
      value: '',
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      st: '' // settimeout
    }
  },
  components: {
    my_header
  },
  methods: {
    // 输入框搜索
    search (event) {
      if (this.value === '') {
        return
      }
      if (this.st !== '') {
        window.clearTimeout(this.st)

      }
      this.st = setTimeout(() => {
        this.getGroupUsers(1)
      }, 800)
    },
    goBackHome () {
      this.$router.go(-1)
    },

    async getGroupUsers () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        labelId: this.id,
        academyId: this.id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        value: this.value
      };
      let $this = this;
      let res = {};
      if (this.type === 1) {
        res = await findUsersByAcademy(sendData)
      } else {
        res = await findUsersByLabel(sendData)
      }
      // console.log(res.data);
      $this.usersList = [];
      let obj = res.data.data.list, length = obj.length;
      var arr = [];
      for (let i = 0; i < length; i++) {
        // obj[i].flag = false;
        obj[i].index = i;
        arr.push(obj[i]);
      }

      var arr1 = [];
      arr.forEach(function (val) {
        arr1.push(val.name + "&" + val.index);
      })
      var obj1 = arr1.sort(compare);
      // console.log(obj1);
      var length1 = obj1.length;
      // console.log(length);
      //					    var array=[];     //总数组
      var json = {};
      var array1 = []     //子数组
      obj1.forEach(function (val, ind) {
        // console.log(val)
        var arrayindex = val.split("&")[1];
        var Fname = Pinyin.getFullChars(val).substring(0, 1).toUpperCase();   //取首字母
        if (ind == 0) {
          json.type = Fname;
          array1.push(arr[arrayindex]);
          // array
        } else {
          var Fname1 = Pinyin.getFullChars(obj1[ind - 1]).substring(0, 1).toUpperCase();   //取前一个首字母
          if (Fname1 != Fname) {    //在与上一个不相同时就将之前保存的数据放在array数组中
            json.newArray = array1;
            $this.usersList.push(json);
            json = {};
            array1 = [];
            json.type = Fname;
            array1.push(arr[arrayindex]);
            // console.log(array1)
          } else {   //在还是相同时就继续将数组放进array1数组
            array1.push(arr[arrayindex]);
            // console.log(array1)
          }
        }

        if (ind == length1 - 1) {   //当是最后一个时就将其放入数组中
          json.newArray = array1;
          $this.usersList.push(json);
          json = {};
          array1 = [];
        }

      })
      // console.log($this.usersList)
    },
    getDetail (item) {
      this.$router.push({name:'/mailList_userDetail',query:{desAccount:item.account,headText:item.name}})
    }

  },
  activated () {
    this.headText = this.$route.query.headText;
    console.log(this.headText)
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.getGroupUsers(1)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~@/common/stylus/index.styl';

.photoList {
  position: relative;
  background: #fff;
  height: 100%;
  width: 100%;
  overflow: auto;
  text-align: left;

  .searchBar {
    position: relative;
    font-size: 0;

    input {
      width: 100%;
      padding: 0.2rem 0.2rem 0.2rem 0.8rem;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-appearance: none;
      border: 1px solid #d9d9da;
      // border-radius: 0.05rem;
      font-size: 0.3rem;
    }

    .icon-search1187938easyiconnet {
      font-size: 0.3rem;
      position: absolute;
      top: 50%;
      left: 0.55rem;
      transform: translate(-50%, -50%);
    }
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    z-index: 12;
  }

  .block {
    position: absolute;
    /* height: 100%; */
    top: 1.64rem;
    left: 0;
    width: 100%;
    // height: 100%;
    overflow-y: scroll;
  }
}

.search .searchWrapper input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.12rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 5% 0 10%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100%;
  height: 0.76rem;
  text-align: center;
  font-size: 0.24rem;
  line-height: 0.76rem;
  color: #ccc;
  background-repeat: no-repeat;
  background-position: 4.4% center;
  /* margin-bottom: .20rem; */
}

.search .searchWrapper {
  height: auto;
}

.jgMessage-header img {
  float: left;
  height: 0.3rem;
  margin-left: 0.26rem;
}

/* .block>*{
   background: #ebf1f5;
   }
   .block p{
   padding: .13rem;
   
   } */
.floatRight {
  float: right;
}

.jgMessage-txl-add {
  color: #00a0ea;
}

.jgMessage-header {
  font-size: 0.3rem;
  color: #010000;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  text-align: center;
  font-weight: 700;
  background: #fff;
}

.jgMessage-header img {
  float: left;
}

.photoList .block p {
  font-size: 0.2rem;
  padding: 0.26rem;
  padding-bottom: 0;
  color: #ccc;
}

.photoList .block p.first {
  padding-top: 0.26rem;
}

.photoList .block p.last {
  padding-bottom: 0.26rem;
}

.photoList .block .block_content {
  box-shadow: none;
  background: transparent;
}

.photoList .block .block_content .content_title .title_right {
  height: 0.22rem;
}

.photoList .block .block_content dl div {
  background: #fff;
}

.photoList {
  .block {
    .block_content {
      dl {
        div {
          padding: 0.1rem 0.4rem;
          font-size: 0;

          .one {
            color: #666;
            font-size: 0;
            // height: 0.64rem;
            // line-height: 0.64rem;
            padding: 0 0.4rem;
            font-size: 0;
          }

          img {
            vertical-align: middle;
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
          }

          &>div {
            vertical-align: middle;
            display: inline-block;

            &>p {
              padding: 0.05rem 0;
              font-size: 0.3rem;
              color: #333;
            }
          }
        }
      }
    }
  }
}

.photoList .block dl dt {
  padding: 0;
}

.photoList .block dl {
  background: transparent;
  margin: 0rem;
}

.photoList .block .block_content dl div.two {
  margin: 0.06rem 0.25rem;
}

.search {
  margin-bottom: 0.26rem;
}

.photoList .block .block_content dl div.two p span {
  float: right;
  color: #666;
}

.photoList .block .block_content dl div.two p input {
  float: right;
  text-align: right;
  width: 70%;
  color: #666;
  /* border:1px solid #ddd; */
}

.photoList .block .block_content .content_title.title_border {
  font-size: 0;
  padding: 0.1rem 0.4rem;
  background: #ddd;
}

.photoList .block .block_content .content_title .title_text {
  color: #666;
}

.photoList .block .block_content dl .content_title .title_text {
  // color: #00a0ea;
  // font-size: 0.24rem;
  // font-weight: 500;
  font-size: 0.3rem;
  font-weight: bolder;
}

.photoList .block .block_content .content_search {
  margin-bottom: 0.2rem;
}
</style>
