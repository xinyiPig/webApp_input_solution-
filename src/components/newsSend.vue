<template>
  <div class="box">
    <Header :headText="header" @goBackPage="goBack()"></Header>
    <section class="section">
        <ul class="pattern">
          <li class="swindow">服务窗口</li>
          <li class="service" style="height:1rem;position: relative;">
            <div class="select_showbox" @click="chooseModel">
              <div class="left">{{selectedModel.serviceName}}</div>
              <p class="right"><img src="../common/image/down1.png"></p>
            </div>
            <ul class="select_option" v-if="selectShow">
              <li class="option" @click="intersection(val)" v-for="(val,index) in services">{{val.serviceName}}</li>
            </ul>
          </li>
          <li class="model1 model">
              <div @click="sendModel=0" class="model_wrap">
                <i class="iconfont" style="font-size: 17px" :class="[(sendModel === 0) ? 'icon-xuanze-danxuan' : 'icon-xuanze']"></i>
                <span>普通模式</span>
              </div>
          </li>
          <li class="model2 model">
              <div @click="sendModel=1" class="model_wrap">
                <i class="iconfont" style="font-size: 17px" :class="[(sendModel === 1) ? 'icon-xuanze-danxuan' : 'icon-xuanze']"></i>
                <span>高级模式</span>
              </div>
          </li>
          <li class="clear"></li>
        </ul>
        <ol class="consignee">
          <li class="left adress">收件人：</li>
          <ul class="mark-institution left" @click="moreAddress(1)">
            <li v-for="item in label.tag1" class="mark">{{item.name}}</li>
            <span class="mar-institution__a" v-if="sendModel === 1 && label.tag1.length === 0">A:</span>
          </ul>
          <li class="left addIcon">
            <i @click="choosePerson(1)" class="iconfont icon-tianjia addIcon__icon"></i>
          </li>
        </ol>
        <ul class="intersection" v-show="sendModel === 1"><!--交集-->
            <li class="left adress">
              <img src="../common/image/jiaoji.png"  v-if="addressShow">
              <img src="../common/image/chuqu.png"  v-if="!addressShow">
            </li>
            <li class="left markInstitution">
              <ul class="mark-institution mark-institution__bottom" @click="moreAddress(2)">
                <li v-for="item in label.tag2" class="left mark" style="margin-bottom: 7px">{{item.name}}</li>
                <span class="mar-institution__a" style="margin-bottom: 10px" v-if="label.tag2.length === 0">B:</span>
              </ul>
            </li>
            <li class="left addIcon">
              <i @click="choosePerson(2)" style="margin-bottom: 10px" class="iconfont icon-tianjia addIcon__icon addTcon__icon_bottom"></i>
              <!-- <img @click="choosePerson(2)" src="../common/image/jiahao.png"> -->
            </li>
            <li class="intersectionText">
                <div class="occur" style="position: relative;">
                  <div class="occurText" @click="chooseOccur">
                    <div class="left">{{occurText}}</div>
                    <p class="right"><img src="../common/image/down1.png"></p>
                  </div>
                  <ul class="occurSelect" v-if="occurShow">
                    <li class="option" @click="occur">交集</li>
                    <li class="option" @click="cancel">除去</li>
                  </ul>
                </div>
            </li>
        </ul>
        <div style="width:100%;background:#f6f7f7;height:.2rem;" v-if="imageText.flag === 2"></div>
        <div class="theme" v-if="imageText.flag === 2">
          <span class="themText left">主题：</span>
          <input type="text left" style="color: #000" placeholder="请输入主题" v-model="theme" id="themeTitle">
          <!-- <input v-show="!themeShow" type="text left" placeholder="请输入主题" v-model="theme1" id="themeTitle1" maxlength="15"> -->
          <span class="fiften right">15字以内</span>
        </div>
        <div style="width:100%;background:#f6f7f7;height:.2rem;"></div>
        <!--选择图文或文字-->
        <!-- <div class="gangBox"> -->
        <ul class="gangContent">
            <li class="left" :class="{cur:imageText.flag === 1}"  @click="updateImageText({flag: 1})">图文</li>
            <li class="left" :class="{cur:imageText.flag === 2}" @click="updateImageText({flag: 2})">文字</li>
            <div class="triangle-up" v-show="imageText.flag === 1"></div>
            <div class="triangle-up1" v-show="imageText.flag === 2"></div>
        </ul>
        <!-- </div> -->
        <!-- <div class="choose"> -->
        <div class="addImg" v-if="imageText.flag === 1"  @click="addMaterial">
          <div class="addImg__content_add" v-if="!imageText.content.time">
            <img class="add-icon" src="../common/image/tianjiasucai.png">
          </div>
          <ol :id="materialId" v-else class="addImg__content_img">
            <li class="title">{{imageText.content.title}}</li>
            <li class="time">{{imageText.content.time | imageTimer}}</li>
            <li class="pic"><img class="pictrue" :src="imageText.content.photo" style="height:100%;"></li>
            <li class="intrduction">{{imageText.content.introduction}}</li>
          </ol>
        </div>
        <div class="textarea_wrap" v-else>
          <textarea class="textarea__inner" placeholder="请输入发送的文字内容" v-model="sendText">
          </textarea>
          <span class="textarea__inner_tips">600个字以内</span>
        </div>
        <!-- </div> -->
        <!--发送按钮-->
        <button class="send" @click="getTerrace">发送</button>
        <!--定时和回执-->
        <ul class="receipt">
          <li class="left timing">
            <i class="iconfont" style="font-size: 17px" @click="openPicker(!timing ? 'unchecked' : 'checked')" :class="[!timing ? 'icon-xuanzekuang' : 'icon-xuanzekuanghou']"></i>
            <span class="addReceipt__span" @click="openPicker('text')">定时<a v-if="timing">(<span>{{pickerValue | timer}}</span>)</a></span>
          </li>
          <li class="left addReceipt">
            <i class="iconfont" style="font-size: 17px" @click="receiptTab(!receiptId.status ? 'unchecked' : 'checked')" :class="[!receiptId.status ? 'icon-xuanzekuang' : 'icon-xuanzekuanghou']"></i>
            <span class="addReceipt__span" @click="receiptTab('text')">增加回执</span>
          </li>
          <li class="clear"></li>
        </ul>
        <!--省略号弹窗-->
          <div class="selectObj" v-show="objShow">
            <p>选中对象</p>
            <ul>
              <li v-for="item in currentTab" class="selectObj__li">
                <i class="iconfont selected__icon" :class="(item.type === 3) ? 'icon-wo' : (item.type === 2) ? 'icon-tag' : 'icon-zuzhijigou'"></i>
                <span>{{item.name}}</span>
              </li>
            </ul>
          </div>
        <!--选择时间-->
        <!-- <div class="timeMask" v-show="timeMask">
          <p>定时邮件将在指定时间发出</p>
          <div class="dataHour">
            <span class="left">{{chooseTime}}</span>
          </div>
          <div class="datePicker"> -->
            <mt-datetime-picker
              ref="picker"
              type="datetime"
              @confirm="handleConfirm"
              v-model="pickerValue">
            </mt-datetime-picker>
          <!-- </div>
        </div> -->
        <!--选择渠道-->
        <div class="channel" v-show="channelShow">
          <p>选泽渠道</p>
          <ul>
            <li @click="checkPlat('sms')">
              <i class="iconfont channel__icon" :class="[{'icon-xuanzekuang' : !pushPlatform.sms},{ 'icon-xuanzekuanghou' : pushPlatform.sms}, {'auth__color': !terrace.smsAuth}]"></i>
              <a :class="{'auth__color': !terrace.smsAuth}">短信（<span>剩余{{terrace.smsNum}}条</span>）</a>
            </li>
            <li @click="checkPlat('email')">
              <i class="iconfont channel__icon" :class="[{'icon-xuanzekuang' : !pushPlatform.email},{ 'icon-xuanzekuanghou' : pushPlatform.email}, {'auth__color': !terrace.emailAuth}]"></i>
              <a :class="{'auth__color': !terrace.emailAuth}">邮件<span></span></a>
            </li>
            <li @click="checkPlat('qq')">
              <i class="iconfont channel__icon" :class="[{'icon-xuanzekuang' : !pushPlatform.qq},{ 'icon-xuanzekuanghou' : pushPlatform.qq}, {'auth__color': !terrace.qqAuth}]"></i>
              <a :class="{'auth__color': !terrace.qqAuth}">QQ公众号（<span>{{terrace.qqSubNum}}人关注</span>）</a>
            </li>
            <li @click="checkPlat('wx')">
              <i class="iconfont channel__icon" :class="[{'icon-xuanzekuang' : !pushPlatform.wx},{ 'icon-xuanzekuanghou' : pushPlatform.wx}, {'auth__color': !terrace.wxAuth}]"></i>
              <a :class="{'auth__color': !terrace.wxAuth}">微信公众号（<span>{{terrace.wxSubNum}}人关注</span>）</a>
            </li>
            <li @click="checkPlat('app')">
              <i class="iconfont channel__icon" :class="[{'icon-xuanzekuang' : !pushPlatform.app},{ 'icon-xuanzekuanghou' : pushPlatform.app}, {'auth__color': !terrace.appAuth}]"></i>
              <a :class="{'auth__color': !terrace.appAuth}">信使App（<span>{{terrace.appInstallNum}}人安装</span>）</a>
            </li>
          </ul>
          <button @click="sendNews">确定发送</button>
        </div>
        <!--遮罩层-->
        <div class="shut" @click="closeShut" v-show="shutShow"></div>
    </section>
  </div>
</template>
<script>
  import axios from 'axios';
  import Header from './common/head';
  import {mapState, mapMutations} from 'vuex'
  // import {timeFilter} from '@/common/js/mixin'
  import { DatetimePicker } from 'mint-ui';
  import {URL} from '@/common/js/url.js'
  export default {
    components: {
        DatetimePicker,
        Header
    },
    data () {
      return {
        // 查看当前收件人
        currentTab: [],
        header:'发消息',
        objShow:false,//省略号弹窗
        addressShow:true,//交集或出去
        occurShow:false,
        // 模式 普通0-高级1
        sendModel: 0,
        // putong:true,
        // gaoji:false,
        themeShow:true,//
        selectShow:false,//下拉框
        // consigneeShow:false,//交集或并集
        shutShow:false,//遮罩层
        triangle:true,//
        triangle1:false,
        // 是否开启定时发送
        timing:false,//定时
        Msg:true,//短信
        Email:true,//邮件
        QQ:true,//QQ
        Wxbusiness:true,//企业号
        Wxpublic:true,//公众号
        App:true,//app
        showOrhide:true,
        onlyText:false,
        sendText:'',//文字内容
        services:[],//保存服务的数组
        num:-1,
        // 当前选中的服务窗口
        selectedModel:{},
        occurText:"交集",//选中交集还是除去
        materialId:"",
        materialTitle:"",
        materialAuthor:"",
        materialContent:"",
        materialIntroduction:"",
        materialPhoto:"",
        materialTime:"",
        theme:'',//图文主题
        theme1:'',//文字主题
        array:[],
        // timeMask:false,
        addIconShow:true,
        // datapicker 值
        pickerValue:new Date(new Date().getTime() + 24*60*60*1000), //定义
        startDate: new Date(),//系统时间
        // chooseTime:"",
        channelShow:false,
        selectServiceId:'',
        channelId:'',//回执id
        terrace:[],//渠道数组
        pushPlatform:{
          app:0,
          email:0,
          qq:0,
          sms:0,
          wx:0
        },
        bigArray:{
          academyIds:[],
          content:"",
          flag:1,
          labelIds:[],
          rangeName:[],
          receiptTemplateStau:false,
          sendMode:0,
          serviceId:0,
          serviceName:"",
          serviceIds:'',
          title:'',
//          sourceId:,
          timing:'',
          timeHm:'',
          userAccounts:[]

        },
      }
    },
    filters: {
      timer(e) {
        const t = new Date(e)
        const y = t.toLocaleDateString().replace(/\//g, '-')
        return `${y} ${t.getHours()}:${t.getMinutes()}`
      },
      imageTimer(e) {
        const y = new Date(e)
        return y.toLocaleDateString().replace(/\//g, '-')
      }
    },
    computed: {
      ...mapState(['receiptId', 'timer', 'imageText', 'label'])
      // ifChoosePlat() {
      //   return Object.values(this.pushPlatform).some(item => {
      //     return item === 1
      //   })
      // }
    },
    created() {
      this.getServices()
    },
    methods:{
      ...mapMutations(['updateReceiptId', 'updateImageText', 'updateLabel']),
      checkPlat(e) {
        // 权限
        const auth = `${e}Auth`
        if (this.terrace[auth]) {
          this.pushPlatform[e] === 0 ? (this.pushPlatform[e] = 1) : (this.pushPlatform[e] = 0)
        }
      },
      goBack(){
        this.$router.push({path: '/'});
      },
      //获取服务
      getServices(){
        let sendData={
          "account": sessionStorage.account,
          "code": sessionStorage.code,
          "manageServiceId":sessionStorage.manageServiceId,
        };
        axios.get(`${URL}/h5/manager/getServices`,{params: sendData}).then(res => {
            if(res.data.code === 200){
              this.services = res.data.data
              this.selectedModel = this.services[0]
            }
        });
      },
      //服务下拉框
      chooseModel(){
        this.selectShow = !this.selectShow
      },
      //点击某一个下拉列表的项就选择哪个
      intersection(e){
          this.selectShow=false;
          this.selectedModel=e;
          // this.selectServiceId = e.serviceId
      },
      //跳转标签和机构
      choosePerson(e){
        this.$router.push({path: '/mailList_forChoose', query: {type: e}});
      },
      //交集除去下拉框
      chooseOccur(){
        this.occurShow = !this.occurShow
      },
      //交集
      occur(){
        this.occurShow=false;
        this.occurText='交集';
        this.addressShow=true;
        // this.bigArray.combinations.arithType=1
      },
      //除去
      cancel(){
        this.occurShow=false;
        this.occurText='除去';
        this.addressShow=false;
        // this.bigArray.combinations.arithType=2
      },
      //添加素材加号图标
      addMaterial(){
        this.$router.push({path: '/Material'});
      },
      //点击省略号
      moreAddress(e){
        const tag = this.label[`tag${e}`]
        if (tag.length === 0) return false
        this.currentTab = tag

        this.objShow=true;
        this.shutShow=true;
      },
      //点击遮罩层
      closeShut(){
        this.objShow=false;
        this.shutShow=false;
        this.channelShow=false;
      },
      // 选择定时发送时间
      openPicker(e) {
        switch (e) {
          case 'unchecked':
            this.$refs.picker.open();
            break;
          case 'checked':
            this.timing && (this.timing = false);
            break;
          case 'text':
            this.$refs.picker.open();
            break;
        }
      },
      //点击添加回执
      receiptTab(e){
        switch (e) {
          case 'unchecked':
            this.$router.push({path: '/Template'})
            break;
          case 'checked':
            this.updateReceiptId({status: false})
            break;
          case 'text':
            this.$router.push({path: '/Template'});
            break;
          default:
            break;
        }
      },
      // dataPicker 确定
      handleConfirm(e){
        this.timing = true
      },
      //获取发送平台
      getTerrace(){
        if (this.theme.length > 15) {
          this.$toast('主题长度不能超过15字')
          return false
        } else if (this.theme.length === 0 && this.imageText.flag === 2) {
          this.$toast('请输入主题')
          return false
        }
        if (!this.selectedModel.serviceId) {
          this.$toast('请选择服务')
          return false
        }
        if (this.sendModel === 1) {
          // 高级发送模式
          if (this.label.tag1.length === 0) {
            this.$toast('请选择A收件人')
            return false
          } else if (this.label.tag2.length === 0) {
            this.$toast('请选择A收件人')
            return false
          }
        } else {
          if (this.label.tag1.length === 0) {
            this.$toast('请选择收件人')
            return false
          }
        }
        if (this.sendText.length > 600) {
          this.$toast('发送内容长度不能超过600字')
          return false
        } else if (this.sendText.length === 0 && this.imageText.flag === 2) {
          this.$toast('请输入发送内容')
          return false
        }
        if (!this.imageText.content.id && this.imageText.flag === 1) {
          this.$toast('请选择发送图文')
          return false
        }
        let academyIds = []
          let userAccounts=[]
          let labelIds = []
          // 机构标签组合
          let combinations = {
            arithType: this.addressShow ? 1 : 2,
            ranges1: [],
            ranges2: []
          }
          this.label.tag1.forEach(e => {
            switch (e.type) {
              case 1:
                academyIds.push(e.id)
                break;
              case 2:
                labelIds.push(e.id)
                break;
              case 3:
                userAccounts.push(e.id)
                break;
              default:
                break;
            }
            combinations.ranges1.push(e)
          });
          if (this.sendModel === 1) { //高级模式
            this.label.tag2.forEach(e => {
              combinations.ranges2.push(e)
            })
          }
          let sendData={
            "academyIds":academyIds,//机构ID数组,普通模式
            "account": sessionStorage.account,
            "code": sessionStorage.code,
            "combinations":combinations,//普通模式不传,高級模式机构标签组合,
            "content":this.sendText,//文字消息内容
            "flag": this.imageText.flag,//发送消息的类型，1图文 2文字
            "labelIds":labelIds,//标签ID数组,普通模式
            "pushPlatform":this.pushPlatform,//短信，qq,app，邮件,微信公众号,可以传空，因为获取的就是它
            "manageServiceId":sessionStorage.manageServiceId,
            "rangeName": '',//发送时选择的机构、标签、人名的中文信息
            "receiptTemplateId": this.receiptId.id || 0,//回执id 没有传0
            "sendMode": this.sendModel,//发送模式0为简单模式，1为高级模式
            "serviceId": this.selectedModel.serviceId,//服务id
            "sourceId": this.imageText.flag === 1 ? this.imageText.content.id : 0,//flag为1即图文时传具体素材ID，为2即文字时传0
            "timing": this.timing ? new Date(this.pickerValue).getTime() : -1,//定时毫秒数
            "title": this.theme,//主题
            "userAccounts": userAccounts //学号,普通模式选人时，不选人时传空
          };
          axios.post(URL + '/h5/manager/queryPushPlatformDetail',sendData).then(res => {
              if(res.data.code=200) {
                this.terrace = res.data.data;
                this.channelShow=true;
                this.shutShow=true;
              }
          });
      },
      //点击发送按钮
      sendNews(){
        const arr = JSON.stringify(this.pushPlatform)
        if (arr.indexOf('1') === -1) {
          this.$toast('请选择发送平台')
          return false
        }
        
        let academyIds = []
          let userAccounts=[]
          let labelIds = []
          // 机构标签组合
          let combinations = {
            arithType: this.addressShow ? 1 : 2,
            ranges1: [],
            ranges2: []
          }
          // rangname
          let name = {
            name1: [],
            name2: []
          }
          this.label.tag1.forEach(e => {
            switch (e.type) {
              case 1:
                academyIds.push(e.id)
                break;
              case 2:
                labelIds.push(e.id)
                break;
              case 3:
                userAccounts.push(e.id)
                break;
              default:
                break;
            }
            combinations.ranges1.push(e)
            name.name1.push(e.name)
          });
          if (this.sendModel === 1) { //高级模式
            this.label.tag2.forEach(e => {
              combinations.ranges2.push(e)
              name.name2.push(e.name)
            })
          }
          const rangeName = this.sendModel === 0 ? name.name1.join() : `${name.name1.join()}与${name.name2.join()}的${this.addressShow ? '交集' : '除去'}`
          console.log(rangeName)
          let sendData={
            "academyIds":academyIds,//机构ID数组,普通模式
            "account": sessionStorage.account,
            "code": sessionStorage.code,
            "combinations":combinations,//普通模式不传,高級模式机构标签组合,
            "content":this.sendText,//文字消息内容
            "flag": this.imageText.flag,//发送消息的类型，1图文 2文字
            "labelIds":labelIds,//标签ID数组,普通模式
            "pushPlatform":this.pushPlatform,//短信，qq,app，邮件,微信公众号,可以传空，因为获取的就是它
            "manageServiceId":sessionStorage.manageServiceId,
            "rangeName": rangeName,//发送时选择的机构、标签、人名的中文信息
            "receiptTemplateId": this.receiptId.id || 0,//回执id 没有传0
            "sendMode": this.sendModel,//发送模式0为简单模式，1为高级模式
            "serviceId": this.selectedModel.serviceId,//服务id
            "sourceId": this.imageText.flag === 1 ? this.imageText.content.id : 0,//flag为1即图文时传具体素材ID，为2即文字时传0
            "timing": this.timing ? new Date(this.pickerValue).getTime() : -1,//定时毫秒数
            "title": this.theme,//主题
            "userAccounts": userAccounts //学号,普通模式选人时，不选人时传空
          };
        axios.post(URL + '/h5/manager/pushMessage', sendData).then(res => {
          if (res.data.code !== 200) return false
          this.channelShow=false;
          this.shutShow=false;
          this.$router.push({path: '/WaitAudit'});
          this.updateReceiptId({status: false, id: ''})
          this.updateImageText({flag: 1, content: {}})
          this.updateLabel({tag1: [], tag2: []})
        })
        // 获取发送平台
          // this.getTerrace()
          // this.channelShow=true;
          // this.shutShow=true;
      },
      //确认发送
      confirmSend(){

        // this.channelShow=false;
        // this.shutShow=false;
        // this.$router.push({path: '/WaitAudit'});
      },
    }
  }
</script>
<style scoped lang="stylus">
  /*@import './common/stylus/index.styl'*/
  @import '../common/stylus/head.styl'
  .box{
    /*height:0.9rem;*/
    position:relative;
    display flex
    flex-direction column
    height 100%
  }
  .section
    flex 1
    overflow auto
    -webkit-overflow-scrolling : touch
  img{
    vertical-align:middle;
  }
  // header{
  //   text-align:center;
  //   background:#fff;
  //   font-size:.34rem;
  //   height:0.9rem;
  //   line-height:0.9rem;
  //   border-bottom:1px solid #ccc;
  //   box-shadow:0 0 1px 0 #ccc;
  //   position:relative;
  // }
  header span{
    position:absolute;
    left:.36rem;
    top:0;
  }
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .clear{
    clear:both
  }
  .pattern,.consignee,.theme{
    height:1rem;
    line-height:1rem;
    width:100%;
    background:#fff;
  }
  .intersection
    height:1.2rem;
    // line-height:1.2rem;
    width:100%;
    background:#fff;
    border-top 1px solid #ccc
  .mark-institution
    // margin-top:0.56rem;
    height 1rem
    width 60%
    display flex
    flex-direction row
    align-items center
    overflow hidden
    // white-space: nowrap;  
    // text-overflow:ellipsis;
  .mar-institution__a
    background-color #ffffff
    font-size .3rem
    color #cccccc
  .mark-institution__bottom
    box-sizing border-box
    // padding-bottom .1rem
    align-items flex-end
    height 100%
    width 100%
  .pattern{
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
  }
  .pattern li{
    font-size:0.27rem;
    float:left;
  }
  .pattern
    li.swindow
      width:18%;
      margin-left:4%
      text-align:left
    li.service
      width:30%;
    li.model1
      width:24%
      text-align:left;
    li.model2
      width:24%
      text-align:left;
  .model_wrap {
    display flex
    flex-direction row
    align-items center
  }
  .model_wrap>span {
    margin-left .1rem
  }
  .pattern li span
    font-size:0.27rem;
  .pattern li.model img
    margin-right:0.04rem;
    width:0.28rem;
    height:0.28rem;
  .consignee li{
    text-align:center;
  }
  li.adress
    width:18%;
    height 100%
    line-height 1.2rem
    margin-left:4%
    text-align:left
    font-size:0.27rem;
    img
      width:80%;

  li.markInstitution{
   width:60%;
   height 100%
  }
  li.addIcon
    width:18%;
    height 100%
    display: flex
    align-items: flex-end
    justify-content center
    .addIcon__icon
      color #56bcff
      // margin-bottom 10px
    img
      margin-bottom:0.2rem;

 .mark-institution li.mark{
   margin-right:0.12rem;
   background:#91a0b7;
   color:#fff;
   font-size:.22rem;
   height:.38rem;
   line-height:.38rem;
   padding: 0.02rem 0.1rem;
   border-radius:4px;
  }
 .mark-institution li{
    color:#91a0b7;
    font-size:.22rem;
    height:.38rem;
    line-height:.38rem;
 }
  .theme{
    width:100%;
    font-size:0.26rem;
    height:1ren;
    overflow:hidden;
  }
  .theme input{
    width:64%;
    border:none;
    outline:none;
    font-size:0.26rem;
    color:#ccc;
    line-height .6rem
  }
  .theme span.fiften{
    color:#e1e1e1;
    display:block;
    width:20%;
    height: 0.6rem;
    text-align:left;
  }
  .theme span.themText{
    width:12%;
    margin-left:4%
    text-align:left
    color:#444;
    font-size:0.27rem;
    display:block;
  }
  /*选图文还是文字*/
  // .gangBox{
  //   width:100%;
  //   position:relative;
  // }
  .gangContent{
    background:#fff;
    height:1rem;
    line-height:1rem;
    position relative
  }
  .gangContent li{
    width:50%;
    font-size:.32rem;
  }
  .choose{
    // min-height:4rem;
  }
  .addImg{
    // position: relative;
    // width:100%;
    // height:100%;
    background:#f6f7f7;
    overflow hidden
  }
  .textarea_wrap {
    height: 4rem
    width 100%
    position relative
  }
  .textarea__inner{
    background:#f6f7f7;
    height: 100%
    width 100%
    box-sizing: border-box
    padding 5%
    outline:none;
    border 0
    font-size .3rem
    // text-indent 20px
  }
  .textarea__inner_tips {
    position absolute
    right: 5%
    bottom: 2%
    font-size .25rem
    color: #ccc
  }

  .add-icon{
    position:absolute;
    top:50%;
    left:50%;
    transform translate(-50%, -50%)
  }
  .addImg__content_add {
    min-height 4rem
    // margin .2rem 0
    position relative
  }
  .addImg__content_img {
    min-height 4rem
    background-color #fff
    margin .2rem 0
    box-sizing border-box
    padding 0 4%
    // position relative
  }
  // .gangContent .cur{
  //   color:#0092c1;
  // }
  .triangle-up
    width: 0;
    height: 0;
    border-left: 0.2rem solid transparent;
    border-right: 0.2rem solid transparent;
    border-bottom: 0.2rem solid #f6f7f7;
    position:absolute;
    // top:17%;
    bottom 0
    left:22%;
  .triangle-up1
    width: 0;
    height: 0;
    border-left: 0.2rem solid transparent;
    border-right: 0.2rem solid transparent;
    border-bottom: 0.2rem solid #f6f7f7;
    position:absolute;
    // top:17%;
    bottom 0
    right:22%;
  .send{
    width:90%;
    margin:0 5%;
    background:#56bcff;
    color:#ffff;
    font-size:.34rem;
    height:.88rem;
    border:none;
    outline:none;
    border-radius:6px;
    margin-top:.4rem;
  }
  .receipt li {
    padding-bottom 16px
  }
  .receipt li{
    color:#56bcff;
    font-size:.28rem;
    margin-top:.4rem;
  }
  // .receipt li span{
  //   font-size:.24rem;
  // }
  li.timing{
    width:57%;
    margin-left:8%;
    text-align:left;
    display flex
    flex-direction row
    align-items center
  }
  li.addReceipt{
    width:35%;
    display flex
    flex-direction row
    align-items center
  }
  .addReceipt__span {
    font-size .27rem
    margin-left 10px
  }
  .timing img,.addReceipt img{
    margin-right:.1rem;
  }
  .intersection{
    position:relative;
  }
  .intersectionText
    position:absolute;
    top:6%;
    left:44%;
    width:1.4rem;
    height:1.2rem;
    color:#56bcff
    line-height:normal;
    font-size:.28rem;
    .occur
      height:1.2rem;
      /*border:1px solid #1d567b*/
      .occurSelect
        width:97%;
        border: 1px solid #56bcff;
        border-bottom: 0
        position: absolute;
        top: 40%;
        right: 0;
        z-index: 1100;
        li
          background:#fff;
          color:#56bcff;
          border-bottom 1px solid #56bcff
      .occurText
        border:1px solid #56bcff
        height:0.48rem;
        div
          width:63%;
          height:0.48rem;
          line-height:0.48rem;
          color:#56bcff;
        p
          background:#56bcff;
          height:100%;
          width: 37%;
          img
            margin: 0.13rem 0 0 0.03rem;
  .select_showbox{
    line-height:normal;
    border: 1px solid #56bcff;
    overflow:hidden;
    margin-top:0.25rem
    height:0.48rem;
    width:80%;
  }
  .select_showbox div{
    width:74%;
    height:0.48rem;
    font-size:.26rem;
    line-height: 0.48rem;
    border:none;
    outline:none;
    color:#56bcff;
  }
  .pattern .select_showbox img{
    margin:0.13rem 0 0 0.03rem;
    padding:0
  }
  .select_showbox p{
    width:26%;
    background:#56bcff;
    height:100%;
    margin:0
    padding:0
  }
  .select_option
    width: 78%;
    border:1px solid #56bcff;
    border-bottom: 0
    position:absolute;
    top:70%;
    right:20%;
    z-index: 1100;
    li.option
      float:none;
      width:100%
      line-height:normal
      background:#fff;
      color:#56bcff;
      border-bottom: 1px solid #56bcff
  .selectObj
    width:5rem;
    max-height:6rem;
    background:#fff;
    border-radius:6px;
    position: absolute
    top:50%;
    left:50%
    // margin-left:-140px;
    // margin-top:-50px;
    transform translate(-50%, -50%)
    z-index:300
    text-align:left;
    overflow-y auto
    p
      color:#000;
      font-size:0.32rem;
      padding:0.4rem 0.3rem .2rem .3rem;
    ul
      padding:0 0.3rem 0.4rem 0.3rem;
      .selectObj__li
        padding:0.1rem 0 0 0
        font-size: .26rem;
        display: flex
        flex-direction row
        align-items center
        .selected__icon
          // margin-right .2rem
          margin-right 5px
          color #56bcff
          font-size 20px
  .shut
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    background:rgba(33,33,33,0.7);
    // opacity:0.5;
    z-index:100
  ol
    height:100%
    text-align:left;
    .title
      padding:0.3rem 0 0.2rem 0
      color:#444
      font-size:.27rem;
      width:90%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height .4rem
    .time
      padding:0 0.2rem  0.2rem  0
      color:#91a0b7
      font-size:.24rem;
      line-height .4rem
      span
        margin-left:0.22rem;
    .pic
      padding:0 0.2rem  0.2rem  0
      height:1.72rem;
      .pictrue
        border-radius:6px;
      .kong
        width:0.6rem;
        height:0.6rem;
        margin-left:1rem;
    .intrduction
      padding:0 0  0.2rem  0
      color:#444
      font-size:.26rem
      width:90%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height .4rem
  .timeMask
    background:#fff;
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:60%;
    border-top:1px solid #ccc;
    font-size:0.27rem;
    z-index:3000
    p
      padding:0.2rem 0;
    div.dataHour
      width:100%;
      overflow:hidden;
      span
        width:50%;
        display:block;
    /*div.datePicker*/
      /*div.mint-popup*/
        /*display:block !important;*/
  //选择渠道
  .channel
    width:5.04rem;
    height:6rem;
    background:#fff;
    border-radius:6px;
    position: absolute
    top:50%;
    left:50%
    transform translate(-50%, -50%)
    z-index:300
    text-align:left;
    p
      color:#000;
      line-height .5rem
      font-size:0.28rem;
      padding:0.2rem 0.3rem;
      text-align:center;
      border-bottom:1px solid #ccc;
    ul
      padding:0 0.3rem 0.3rem 0.3rem;
      margin:0
      li
        padding:0.1rem 0 0 0
        font-size:0.27rem;
        line-height:0.6rem;
        display flex
        flex-direction row
        align-items center
        .channel__icon
          color #56bcff
          margin-right 6px
          font-size 20px
        .auth__color
          color #cccccc
        // .icon__font
        //   margin-right:0.2rem;
        //   vertical-align:middle;
    button
      background:#56bcff;
      border:none;
      outline:none;
      width:2.502rem;
      margin:0 auto;
      display:block;
      line-height:0.8rem;
      color:#fff;
      font-size:0.34rem;
      border-radius:4px;
  .bag
    background:#fff !important;
</style>
