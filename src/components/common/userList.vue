<template>
    <div id='lists'>
      <div class="listWrapper"  v-for='(item,index) in itemList'>
          <div class='timeWrapper' v-show='index>0?(Math.abs(item.time-itemList[index-1].time)>(10*60*1000))?true:false:true' >
            <p>{{getDateDiff(item.time)}}</p>
            </div>
          <div class='itemList' v-swipe  :data-index='index' @click='routerTo(item,$event)' >
            <div class='middle' @click.stop='reply(item)'>
              <h3>{{item.name}}</h3>
              <!-- v-html='item.showContent?"展开":"收起"' -->
              <p >{{contentFilter(item)}}<a v-show='item.btnShow' @click.stop='toggleContent(item)' ></a></p>
              </div>
              <div :data-content='numFilter(item.remindNum)' :class='item.remindNum>0?"badge":""' class='left '>
                <img :src='item.headUrl'></div>
              <div class='right' >
                <!-- <p>{{dateTranform(item.time)}}</p> -->
                <!-- <p>{{getDateDiff(item.time)}}</p> -->
                <a class='btn btn-parimy' @click.stop='reply(item)'>回复</a>
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
    </div>
</template>
<script type='text/ecmascript-6'>
// 父组件调用格式
//  <itemList :itemList='array' @from-child-msg='routerTo'></itemList>
//  { title: '华园热点1', intro: '热点简介1', time: '昨天', id: 2, btnList: [{ name: '取消关注', type: 0 }, { name: '置顶', type: 1 }] }

// import Vue from 'vue';

import { timeFilter } from '@/common/js/mixin'
export default {
  mixins: [timeFilter],
  props: {
    itemList: {
      type: Array,
      return: {
        default: []
      }
    }
  },
  data () {
    return {
      placeholderStatu: true,
      startx: '',
      starty: ''
    };
  },
  methods: {
    routerTo (item, e) {
      // console.log(e);
      if (document.querySelector('.move') != null) {
        document.querySelector('.move').className = document
          .querySelector('.move')
          .className.replace(' move', '');
        return;
      }
      this.$emit('from-child-msg', item.service);
    },
    operation (bitem, item) {
      this.$emit('from-child-swipe', { type: bitem.type, item: item });
    },
    numFilter (num) {
      return num >= 100 ? '99+' : num
    },
    contentFilter (item) {
      // console.log(item.showContent)
      let content = JSON.parse(JSON.stringify(item.firstContent))

      if (item.firstContent.length > 17) {

        if (item.showContent === undefined || item.showContent === true) {
          this.$set(item, 'btnShow', true)
          this.$set(item, 'showContent', true)
          content = content.substring(0, 17) + '...'
          // console.log(content)
        }

      } else {
        // 不作处理
      }
      if (item.showContent === false) {
        this.$set(item, 'showContent', false)
      }
      // console.log(content)
      return content
    },
    toggleContent (item) {
      // item.showContent = !item.showContent
      // console.log("item.showContent", item.showContent)
    },
    reply (item) {
      this.$emit('from-child-msg', item)
    }
    // 组件初始化是在mounted监听手势事件
  },
  mounted () { },
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
  background: #fff;

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
  padding: 0.25rem 0.25rem;
  border-bottom: 1px solid #eee;
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    display: table;
    height: 0;
    width: 100%;
    clear: both;
  }

  .middle {
    text-align: left;
    padding: 0rem 1.12rem 0.12rem 1.02rem;
    box-sizing: border-box;
    width: 100%;
    /* height: 0.77rem; */
    font-size: 0;
    float: left;

    &>h3 {
      font-size: 0.24rem;
      color: #91a0b7;
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

    .hide {
      no-wrap(3);
    }
  }

  .left {
    width: 0.92rem;
    height: 0.92rem;
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

  .badge {
    position: relative;

    &::after {
      content: attr(data-content);
      color: #fffefe;
      position: absolute;
      right: 0;
      top: 0;
      font-size: 0.2rem;
      border-radius: 3px;
      -webkit-transition: 1s ease;
      transition: 1s ease;
      white-space: nowrap;
      background: red;
      border-radius: 50%;
      padding: 0.05rem 0.1rem;
    }
  }

  .right {
    width: 1.1rem;
    height: 0.92rem;
    float: left;
    margin-left: -1.1rem;
    position: relative;
    line-height: 0.5;

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
      padding: 0.08rem 0.14rem;
      font-size: 0.28rem;
      color: #fff;
      line-height: normal;
      background: #56bcff;
      position: absolute;
      border-radius: 0.05rem;
      bottom: 0;
      box-sizing: border-box;
      left: 0.1rem;
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