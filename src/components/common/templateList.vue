<template>
    <div id='lists'>
      <div class="listWrapper" v-show='!showAdd'>
          <div style='max-height: 3rem;overflow-y: scroll;'>
            <div class='itemList' v-for='(item,index) in itemList' v-swipe  :data-index='index' @click='reply(item,$event)' >
              <div class='middle' >
                <span>{{item.replyContent}}</span>
                </div>
                <div class='left '>
                </div>
                <div class='right' >
                </div>
                <div class='operateBtn'>
                    <div v-for='(bItem,bIndex) in item.btnList' @click.stop='operation(bItem,item)' >
                      <div>
                        <a>{{bItem.name}}</a>
                      </div>
                    </div>
                </div>
            </div> 
          </div>
          <div class='itemList' >
            <div class='middle' >
              <i class='iconfont icon-plus1' @click='addTemplate'></i>
            </div>
            <div class='left '>
             </div>
            <div class='right' >
            </div> 
          </div> 
          
      </div>        
    </div>
</template>
<script type='text/ecmascript-6'>
// 父组件调用格式
//  <itemList :itemList='array' @from-child-msg='routerTo'></itemList>
//  { title: '华园热点1', intro: '热点简介1', time: '昨天', id: 2, btnList: [{ name: '取消关注', type: 0 }, { name: '删除', type: 1 }] }

// import Vue from 'vue';
import { timeFilter } from '@/common/js/mixin'
import { Toast, MessageBox } from 'mint-ui'
import { getReplyTemplates, deleteReplyTemplate } from '@/common/js/api'
export default {
  mixins: [timeFilter],

  data () {
    return {
      placeholderStatu: true,
      startx: '',
      starty: '',
      showAdd: false,
      itemList: [],
    };
  },
  methods: {
    reply (item, e) {
      // console.log(e);
      if (document.querySelector('.move') != null) {
        document.querySelector('.move').className = document
          .querySelector('.move')
          .className.replace(' move', '');
        return;
      }
      this.$emit('from-child-msg', item);
    },
    operation (bitem, item) {
      if (bitem.type === 0) {
        this.$router.push({ name: '/feedBack_addTemplate' })
        sessionStorage.replyId = item.replyId;
        sessionStorage.templateText = item.replyContent;
      } else {
        MessageBox.confirm('确定删除此条模板吗?').then(action => {
          this.deleteReplyTemplate(item)
        });
      }
    },
    addTemplate () {
      this.$emit("from-child-add", '')
    },
    // 获取
    async getReplyTemplates () {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code
      }
      let req = await getReplyTemplates(sendData)
      let backData = req.data
      let tempArray = backData.data
      console.log(tempArray)
      tempArray.forEach(item => {
        Object.assign(item, { btnList: [{ name: '编辑', type: 0 }, { name: '删除', type: 1 }] })
      })
      this.itemList = tempArray
    },
    // 删除
    async deleteReplyTemplate (item) {
      let sendData = {
        account: sessionStorage.account,
        code: sessionStorage.code,
        replyTemplate: {
          replyContent: this.content,
          replyId: item.replyId,
        }
      }
      let req = await deleteReplyTemplate(sendData)
      let backData = req.data
      if (backData.code === 200) {
        this.itemList.splice(item.index, 1)
      }
      Toast("删除成功")
    }
    // 组件初始化是在mounted监听手势事件
  },
  mounted () {
    this.getReplyTemplates()
  },
  filters: {},
  directives: {
    // 左右滑
    swipe: {
      bind (el) {
        function getAngle (angx, angy) {
          return Math.atan2(angy, angx) * 180 / Math.PI;
        }
        function getDirection (startx, starty, endx, endy) {
          var angx = endx - startx;
          var angy = endy - starty;
          var result = 0;

          // 如果滑动距离太短
          if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result;
          }

          var angle = getAngle(angx, angy);
          if (angle >= -135 && angle <= -45) {
            result = 1;
          } else if (angle > 45 && angle < 135) {
            result = 2;
          } else if (
            (angle >= 135 && angle <= 180) ||
            (angle >= -180 && angle < -135)
          ) {
            result = 3;
          } else if (angle >= -45 && angle <= 45) {
            result = 4;
          }
          return result;
        }
        let startx = '';
        let starty = '';
        // 手指接触屏幕
        el.addEventListener(
          'touchstart',
          function (e) {
            // console.log(e);
            startx = e.touches[0].pageX;
            starty = e.touches[0].pageY;
          },
          false
        );
        // 手指在屏幕上移动
        el.addEventListener('touchmove', function (e) {
          let moveInstance = startx - e.changedTouches[0].pageX;
          let parentRealWidth = el.offsetWidth;
          let currentRealWidth = el.childNodes[6].offsetWidth;
          let movePercent = 0;
          let temp = el.childNodes[6];
          // 左滑
          if (moveInstance > 0) {
            if (temp.className.search('move') > 0) {
              return;
            }
            console.log(1);

            document.querySelectorAll('.operateBtn').forEach(function (element) {
              if (el.className.search('move') < 0) {
                element.className = element.className.replace(' move', '');
              }
            }, this);
            if (temp.className.search('move') < 0) {
              temp.className = temp.className + ' move';
            }
          } else { // 右滑
            if (temp.className.search('move') < 0) {
              return;
            }
            console.log(temp.className);
            if (temp.className.search('move') > 0) {
              temp.className = temp.className.replace(' move', '');
            }
          }
        });
        // 手指离开屏幕
        // el.addEventListener(
        //   "touchend",
        //   function(e) {
        //      el.childNodes[6].style.right=''
        //     let temp = el.childNodes[6];
        //     var endx, endy;
        //     endx = e.changedTouches[0].pageX;
        //     endy = e.changedTouches[0].pageY;
        //     var direction = getDirection(startx, starty, endx, endy);
        //     switch (direction) {
        //       case 0:
        //         if (temp.className.search("move") > 0) {
        //           temp.className = temp.className.replace(" move", "");
        //         }
        //         //  el.childNodes[6].style.right='-100%'
        //         //alert("未滑动！");
        //         break;
        //       case 1:
        //         //alert("向上！",e.target);
        //         break;
        //       case 2:
        //         //alert("向下！");
        //         break;
        //       case 3:
        //         document
        //           .querySelectorAll(".operateBtn")
        //           .forEach(function(element) {
        //             if (el.className.search("move") < 0) {
        //               element.className = element.className.replace(
        //                 " move",
        //                 ""
        //               );
        //             }
        //           }, this);
        //         console.log("向左！", el.childNodes[6]);

        //         console.log(temp.className);
        //         if (temp.className.search("move") < 0) {
        //           temp.className = temp.className + " move";
        //         }
        //         break;

        //       case 4:
        //         //  alert("向右！");

        //         console.log(temp.className);
        //         if (temp.className.search("move") > 0) {
        //           temp.className = temp.className.replace(" move", "");
        //         }
        //         //  el.childNodes[6].style.right='-100%'
        //         break;
        //       default:
        //     }
        //   },
        //   false
        // );
      }
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
@import '~@/common/stylus/reset.styl';

.listWrapper {
  .timeWrapper {
    padding: 0.2rem 0;
    font-size: 0;

    p {
      background: #ebebf0;
      display: inline-block;
      padding: 0.05rem 0.1rem;
      border-radius: 0.05rem;
      font-size: 0.22rem;
    }
  }
}

.itemList {
  // padding: 0.25rem 0.25rem;
  border-bottom: 1px solid #eee;
  position: relative;
  overflow: hidden;
  font-size: 0;

  &:after {
    content: '';
    display: table;
    height: 0;
    width: 100%;
    clear: both;
  }

  .middle {
    text-align: left;
    padding: 0.23rem 0;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    /* height: 0.77rem; */
    font-size: 0;
    float: left;

    .icon-plus1 {
      font-size: 0.56rem;
      color: #56bcff;
    }

    &>h3 {
      font-size: 0.24rem;
      color: $color-text;
      line-height: 0.3rem;
      width: 4.86rem;
      no-wrap(1);
    }

    &>p {
      position: relative;
      display: inline-block;
      margin-top: 0.12rem;
      font-size: 0.28rem;
      color: #444;
      max-width: 4.5rem;
      border: 1px solid #d7d7d7;
      border-radius: 0.1rem;
      padding: 0.1rem;
      background: #fff;

      a {
        position: absolute;
        right: -0.6rem;
        bottom: 0.11rem;
        color: #ccc;
      }

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
        border-right: 0.22rem solid #d7d7d7;
        border-bottom: 0.12rem solid transparent;
      }
    }

    &>span {
      font-size: 0.28rem;
      color: #444;
    }

    .hide {
      no-wrap(3);
    }
  }

  .left {
    width: 0.92rem;
    // height: 0.92rem;
    float: left;
    margin-left: -100%;
    font-size: 0;
    position: relative;

    &>img {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
    }
  }

  .right {
    width: 1.1rem;
    // height: 0.92rem;
    float: left;
    margin-left: -1.1rem;
    position: relative;
    line-height: 0.92rem;

    &>p {
      font-size: 0.16rem;
      color: #ccc;
      position: absolute;
      top: 50%;
      left: 0%;
      transform: translate(0%, -50%);
      position: relative;
    }

    &>a {
      display: inline-block;
      padding: 0.09rem 0.12rem;
      font-size: 0.28rem;
      color: #fff;
      line-height: normal;
      background: #56bcff;
      border-radius: 0.05rem;
    }
  }

  .operateBtn {
    position: absolute;
    right: -100%;
    top: 0;
    font-size: 0px;
    height: 100%;
    transition: right 0.5s;

    &>div {
      float: left;
      height: 100%;

      &>div {
        height: 100%;
        align-items: center;
        display: -webkit-flex;
        padding: 0.2rem;
        box-sizing: border-box;

        a {
          font-size: 0.22rem;
          text-align: center;
          display: inline-block;
          vertical-align: middle;
          color: #fff;
        }
      }
    }

    &>div:nth-child(1) {
      background: #ccc;
    }

    &>div:nth-child(2) {
      background: red;
    }

    &:after {
      content: '';
      display: table;
      height: 0;
      width: 100%;
      clear: both;
    }
  }

  .move {
    right: 0;
  }
}
</style>