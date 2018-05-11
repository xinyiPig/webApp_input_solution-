<template>
<div id="top">
    <div id="header">
        <div class="showMassGoBack" @click='goBackUrl'><img src="../common/image/shouye/houtui@2x.png" alt=""></div>
        <div class="title">回执详情</div>
    </div>
    <div class="replyMassageWrap" >
        <div calss='replyMassage' @click='rotate'>
            <p>已送达（{{hasSendNum}}）</p>
            <div  :class="this.rotates && 'rotateSan'"><img src="../common/image/shouye/xiasanjiao@2x.png" alt=""></div>
        </div>
        <ul class="moreMassage" v-show='Sendrecipt'>
            <li>已回执（{{receiptNum}}）</li>
            <li class="noSend" @click='nosendRotates'>
                <span>未回执（{{notReceiptNum}}）</span> 
                <span class="reply" @click.stop='remind'  v-if='rotates2 && noSendShow'>一键提醒</span>
                <div  :class="this.rotates2 && 'rotateSan'" v-if='noSendShow'><img src="../common/image/shouye/xiasanjiao@2x.png" alt=""></div>
            </li>
            
            <ul class="moreMassage loadWrap" v-if='this.rotates2 && noSendShow'>
                <scroller v-if='showScroller' :on-refresh="refresh"  :on-infinite="infinite"  ref='scroller'>
                <li style="padding: 0.15rem 1.1rem;"  v-for='item in list2'>
                    <p>{{item.name}}</p>
                     <p>{{item.account}}</p>
                </li>
                </scroller>
                <li v-if='!showScroller' style="padding: 0.15rem 1.1rem;"  v-for='item in list2'>
                    <p>{{item.name}}</p>
                     <p>{{item.account}}</p>
                </li>
            </ul>
            
            
        </ul>
    </div>
     <div class="replyMassageWrap" id="idreplyMassageWrap">
        <div calss='replyMassage' @click='NOrotate'>
            <p>未送达（{{notSendNum}}）</p>
            <div  v-show='shownotSend' :class="this.NOrotates && 'rotateSan'"><img src="../common/image/shouye/xiasanjiao@2x.png" alt=""></div>
        </div>
        <ul class="moreMassage" v-show='NOSendrecipt'>
            <li v-for='item in userList'>
                <p>{{item.name}}</p>
                <p>{{item.account}}</p>
            </li>
        </ul>
        <span class="reply" @click.stop='resend' v-if='NOSendrecipt && shownotSend' >重新发送</span>
    </div>

    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div class="channel">
            <p>选泽渠道</p>
            <ul>
                <li @click='lis(0)' >
                    <div @click='lis0=!lis0' v-show='lis0&&appAuth'><img src="../common/image/waitChoose.png" ></div>
                    <div @click='lis0=!lis0' v-show='!lis0&&appAuth'><img src="../common/image/xuanzhong.png"></div>
                    <div v-show='!appAuth'><img src="../common/image/shouye/jinxuan@2x.png"></div>
                    <span :class="{disShow:!appAuth}">短信（{{requireSmsNum}}/{{smsNum}}）</span>
                </li>
                <li @click='lis(1)' >
                    <div  @click='lis1=!lis1' v-show='lis1&&emailAuth'><img src="../common/image/waitChoose.png" ></div>
                    <div  @click='lis1=!lis1' v-show='!lis1&&emailAuth'><img src="../common/image/xuanzhong.png" ></div>
                    <div v-show='!emailAuth'><img src="../common/image/shouye/jinxuan@2x.png"></div>
                    <span :class="{disShow:!emailAuth}">邮件</span>
                </li>
                <li @click='lis(2)'>
                    <div  @click='lis2=!lis2' v-show='lis2&&qqAuth'><img src="../common/image/waitChoose.png" ></div>
                    <div  @click='lis2=!lis2' v-show='!lis2&&qqAuth'><img src="../common/image/xuanzhong.png"></div>
                    <div v-show='!qqAuth'><img src="../common/image/shouye/jinxuan@2x.png"></div>
                    <span :class="{disShow:!qqAuth}">QQ公众号（{{qqSubNum}}人关注）</span>
                </li>
                <li @click='lis(3)' >
                    <div  @click='lis3=!lis3' v-show='lis3&&smsAuth'><img src="../common/image/waitChoose.png"></div>
                    <div  @click='lis3=!lis3' v-show='!lis3&&smsAuth'><img src="../common/image/xuanzhong.png" ></div>
                    <div v-show='!smsAuth'><img src="../common/image/shouye/jinxuan@2x.png"></div>
                    <span :class="{disShow:!smsAuth}">微信企业号（{{datawxSubNum}}人关注）</span>
                </li>
                <li @click='lis(4)' >
                    <div  @click='lis4=!lis4' v-show='lis4&&wxAuth' ><img src="../common/image/waitChoose.png"></div>
                    <div  @click='lis4=!lis4' v-show='!lis4&&wxAuth'><img src="../common/image/xuanzhong.png"></div>
                    <div v-show='!wxAuth'><img src="../common/image/shouye/jinxuan@2x.png"></div>
                    <span :class="{disShow:!wxAuth}">信使App（{{appInstallNum}}人安装）</span>
                </li>
            </ul>
            <div @click='comfirmSend' class="button">确定发送</div>
        </div>
    </mt-popup>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import { timeFilter,url,urlImg } from '@/common/js/mixin'
export default {
    mixins: [timeFilter],
    data(){
        return{
            account:'',
            code:'',
            manageServiceId:0,
            pageIndex:1,
            pageSize:5,
            rotates:false,
            rotates2:false,
            Sendrecipt:false,
            NOSendrecipt:false,
            NOrotates:false,
            hasSendNum:0,
            notReceiptNum:0,
            notSendNum:0,
            receiptNum:0,
            userList:[],
            list2:[],
            popupVisible:false,
            appInstallNum:0,//app安装人数
            smsNum:0,  //短信总数
            datawxSubNum:0, //微信关注人数
            qqSubNum:0, //qq关注人数 
            // pushUserNum //推送总人数 
            requireSmsNum:0,  //需要短信数
            lis0:true,
            lis1:true,
            lis2:true,
            lis3:true,
            lis4:true,
            appAuth:true,  //为false时显示不能点击状态
            emailAuth:true,
            qqAuth:true,
            smsAuth:true,
            wxAuth:true,
            shownotSend:true,  
            noSendShow:true,
            showScroller:false
        }
    },
    methods:{
        goBackUrl(){
            this.$router.push({path:'/receiptReply'})
        },
        rotate(){
            console.log(this.rotates)
            this.rotates = !this.rotates
            this.Sendrecipt = !this.Sendrecipt
        },
        nosendRotates(){
            console.log('展开')
            this.rotates2 = !this.rotates2
            this.list2=[]
            console.log(this.rotates2)
            if(this.rotates2){
                console.log('点击展开')
                this.nosendRotatesFn()
                
            }
            
        },
        async nosendRotatesFn(){
            axios({
                url:`${url}/h5/manager/findNotReceiptUsers`,
                params:{
                    'account':this.account,
                    'code':this.code,
                    'manageServiceId':this.manageServiceId,
                    'hasSendId':this.hasSendId,
                    'pageIndex':this.pageIndex,
                    'pageSize':this.pageSize
                },
                method:'get',
            }).then((msg)=>{
                console.log(msg.data.data)
                this.totalpage = parseInt(msg.data.data.totalPage)
                if(this.totalpage==1){ //页数只有一页时，不要scroller
                   console.log('aaaaaabbbbb')
                   this.showScroller = false
                   $(".loadWrap").css('height','auto')
                   this.list2 = msg.data.data.list
                }else{
                    this.showScroller = true
                    $(".loadWrap").css('height','4.1rem')
                    this.list2 = this.list2.concat(msg.data.data.list)

                }
                // if (msg.data.code === 200) {   
                //     this.list2 = this.list2.concat(msg.data.data.list)
                // }     
            })
        },
        NOrotate(){
            this.NOrotates = !this.NOrotates
            this.NOSendrecipt = !this.NOSendrecipt
        },
        lis(idx){
            
        },
        remind(){
            axios({
                url:`${url}/h5/manager/receiptResend`,
                data:{
                    'account':this.account,
                    'code':this.code,
                    'hasSendId':this.hasSendId,
                },
                method:'post',
            }).then((msg)=>{
                this.$toast({
                    message: '已提醒',
                    duration: 2000
                });
                // setTimeout(()=>{
                //     this.noSendShow = false
                //      this.rotates2 = false
                // },50)
               
                console.log(msg)
   
            })
        },
        refresh (done) {

            this.pageIndex = 1
            this.list2=[]
            this.nosendRotatesFn()
            done()
        },
        infinite(done) {
            console.log('上拉')
            var start = this.bottom + 1
            this.bottom = this.bottom + 10
            // alert(this.pageIndex+''+this.totalpage)

            if(this.pageIndex >= this.totalpage){
                console.log('没有数据了')
                done(true)
                return;
            }
            setTimeout(() => {
                //console.log('上拉加载更多')
                this.pageIndex += 1;
                this.nosendRotatesFn() 
                //console.log('请求成功1')
                setTimeout(() => {
                //console.log('请求成功2')
                    done(true)
                },100) 
            }, 500) 
        },
        resend(){ //点击确认发送   
            this.popupVisible = true;
            var _this = this

            axios({
                url:`${url}/h5/manager/queryFailMessagePushPlatformDetail?account=${this.account}&code=${this.code}&manageServiceId=${this.manageServiceId}&hasSendId=${this.hasSendId}`,
                method:'get',
            }).then((msg)=>{
                this.appInstallNum = msg.data.data.appInstallNum//app安装人数
                this.pushUserNum  = msg.data.data.pushUserNum //推送总人数 
                this.qqSubNum  = msg.data.data.qqSubNum //qq关注人数 
                this.requireSmsNum  = msg.data.data.requireSmsNum  //需要短信数
                this.smsNum  = msg.data.data.smsNum  //短信总数
                this.wxSubNum  = msg.data.data.wxSubNum //微信关注人数
                if(msg.data.data.emailAuth==0){this.emailAuth = false}
                if(msg.data.data.qqAuth==0){this.qqAuth = false}
                if(msg.data.data.smsAuth==0){this.smsAuth = false}
                if(msg.data.data.wxAuth==0){this.wxAuth = false}
                if(msg.data.data.appAuth==0){this.appAuth = false}
                SW

                console.log(msg)
            })
        },
        comfirmSend(){
            this.popupVisible = false
            if(this.lis0==false){var app = 1}  //表选中
            if(this.lis1==false){var email = 1}
            if(this.lis2==false){var qq = 1}
            if(this.lis3==false){var sms = 1}
            if(this.lis4==false){var wx = 1}
            //确认提交
             var data={
                account:this.account,
                code:this.code,
                hasSendId:this.hasSendId,
                pushPlatform:{
                    'app':app,
                    'email':email,
                    'qq':qq,
                    'sms':sms,
                    'wx':wx
                }
            }
            var _this = this
            axios({
                url:`${url}/h5/manager/resend`,
                method:'POST',
                data:data,
            }).then((msg)=>{

                console.log(msg)
            })
        },
        getALLdata(){
            var data={
                account:this.account,
                code:this.code,
                manageServiceId:this.manageServiceId,
                hasSendId:this.hasSendId
            }
            var _this = this
            axios({
                url:`${url}/h5/manager/findHasSendStatuInfo?account=${data.account}&code=${data.code}&manageServiceId=${data.manageServiceId}&hasSendId=${data.hasSendId}`,
                methods:'get',
            }).then((msg)=>{
                console.log(msg)
               
                // if(notSendNum)
                _this.hasSendNum  = msg.data.data.hasSendNum 
                _this.notReceiptNum  = msg.data.data.notReceiptNum 
                _this.notSendNum  = msg.data.data.notSendNum 
                if( _this.notReceiptNum == 0){  //未回执人
                    this.noSendShow = false
                }
                if(_this.notSendNum==0){  //未送达人
                    this.shownotSend = false
                }
                _this.receiptNum  = msg.data.data.receiptNum
                _this.userList  = msg.data.data.users
            })
        }
    },
    mounted(){
        this.hasSendId = sessionStorage.hasSendId
        this.manageServiceId = sessionStorage.manageServiceId
        this.account = sessionStorage.account
        this.code =  sessionStorage.code
        this.getALLdata()   
    }
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
div{box-sizing:border-box}
#header
    width:100%;
    height: 0.88rem;
    line-height:0.88rem
    margin-bottom :0.2rem
    // padding-top:0.28rem
    background-color #fff
    position:relative
    text-align:center
    .showMassGoBack
        width:0.21rem;
        height:0.27rem
        position:absolute
        left:0.36rem
        top:0.3rem
        img 
            width:100%;
            height:100%
            position:absolute
            // top:0
    .title
        font-size:0.34rem;

.replyMassageWrap
    width:100%;
    padding: 0 0 0.3rem  
    box-sizing:border-box
    >div
        width:100%
        background-color:white
        text-align:left
        display:flex
        justify-content:space-between
        align-items:center
        padding:0.1rem 0.4rem 0.1rem
        border-radius:0.06rem
        
        p
            width:100%
            line-height:0.56rem
            font-size:0.28rem
            color:#444444
        div
            width:0.13rem
            height:0.2rem
            img 
                width:0.13rem
                height:0.2rem
                display:flex
    .moreMassage
        width:100%;
        list-style:none
        position:relative
        li
            font-size:0.28rem
            height:0.5rem;
            background-color:white
            text-align:left
            border-bottom:0.01rem #f0f0f0 solid 
            padding:0.15rem 0.4rem 0.15rem 0.8rem
            display:flex;
            align-items:center;
            p
                margin-right:0.2rem
        
    .reply
        font-size:0.22rem
        padding:0.12rem
        background-color:#56bcff
        color:white
        border-radius:0.06rem
        position:absolute;
        top:0.15rem;
        right:1rem
#idreplyMassageWrap{
    position:relative
}
.rotateSan{
    transform:rotate(90deg);
}
.noSend{
    justify-content:space-between;
    position:relative
}
.noSend div,.noSend img{
    width:0.13rem
    height:0.2rem
}  
.loadWrap{
    
    // height:4.1rem
}     
   
               

// 弹框
.mint-popup
     border-radius:0.12rem
     margin-top:-0.1rem
.channel
    width:5.04rem;
    height:6.4rem;
    background:#fff;
    border-radius:0.12rem
    text-align:left;
    p
      color:#000;
      font-size:0.28rem;
      padding:0.2rem 0.3rem;
      text-align:center;
      border-bottom:1px solid #ccc;
    ul
      padding:0 0.3rem 0.3rem 0.3rem;
      margin-top:0.2rem
      li
        // padding:0.1rem 0 0 0
        font-size:0.27rem;
        height:0.7rem;
        display:flex;
        align-items:center;
        >div
            width:0.26rem
            height:0.26rem
            margin-right:0.2rem
            img
                width:0.26rem
                height:0.26rem


    .button
        text-align:center
        background:#56bcff;
        width:2.502rem;
        margin:0 auto;
        line-height:0.8rem;
        color:#fff;
        font-size:0.34rem;
        border-radius:0.06rem;
.disShow{
    color:#ccc
}
#top{
    background-color:#f6f7f7;
    height:100%
    
}
// .v-modal{
//     opacity: 0.5 !important;
// }
</style>
