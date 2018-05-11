<template>
<div style='background-color:#f6f7f7;height:100%'>
    <div id="showMassHead">
        <div class="showMassGoBack" @click='goBackUrl'><img src="../../common/image/shouye/houtui@2x.png" alt=""></div>
        <!-- <div class="titleWrap" v-show='ediot'>
            <input type="text" v-model='title' autofocus='autofocus'>
        </div> -->
        <div class="titleWrap">{{title}}</div>
        <div class="showMassImg" v-show ='showHuiZhi' @click='receiptChat'>
            <img src="../../common/image/shouye/tuisong@2x.png" alt="">
            <div class="reply" v-show='showReply'>{{receiptNum}}</div>
        </div>
    </div>
    <div id="mainContent" v-html="sourceContent">

    </div>
    <!-- showHuiZhi默认时false，true时是从其他页面传过来的 -->
    <div id="huizhi" v-show ='showHuiZhi' >回执</div>
    <div id="huizhiMass" v-show ='showHuiZhi'>{{receiptContent}}</div>
    <div class="comfirm" v-show ='showFooter' >
        <div  @click='Footerconfirm'>通过</div>
        <div @click='FootNoConfirm' class="FootNOpass">不通过</div>
    </div>
     <!-- 弹框 -->
    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div id="popupWrap">
            <p class="warm">提示</p>
            <p class="comfirmDel">确定通过该推送吗？</p>
            <div class="Delbuttom">
                <div @click='comformDel(0)'>确定</div>
                <div class="quxiao" @click='quxiao'>取消</div>
            </div>
        </div>
    </mt-popup>
    <!-- 不通过弹框 -->
    <mt-popup
        v-model="popupVisible2"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div id="popupWrap2">
            <p class="warm">不通过理由</p>
            <div id="reasonWrap">
                <textarea name="" id="" placeholder="请输入你的理由" maxlength="120" v-model="textarea"></textarea>
                <div><span>{{textarea.length}}</span><span>/120</span></div>
            </div>
            
            <div class="Delbuttom2">
                <div @click='comformDel(1)'>确定</div>
                <div class="quxiao" @click='quxiao'>取消</div>
            </div>
        </div>
    </mt-popup>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import { timeFilter,url,urlImg } from '@/common/js/mixin'
export default {
     data(){
        return{
            sourceContent:'',
            title:'',
            showHuiZhi:false,
            manageServiceId:1,
            pageIndex:1,
            pageSize:5,
            receiptContent:'',
            showFooter:false,
            showFooter1:"",
            receiptNum:0,
            popupVisible:false,
            popupVisible2:false,
            reason:'',
            ediot:true,
            showReply:false,
            textarea:'',
            pass:1,
        }
       
    },
    methods:{
        goBackUrl(){
            // this.$router.go(-1)
            console.log("返回")
            sessionStorage.removeItem('hisData')
            this.$router.push({path:'/history'})
           
        },
        Footerconfirm(){ //点通过时
            this.popupVisible = true
            this.pass = 1
        },
        FootNoConfirm(){
            this.popupVisible2 = true
            this.pass = 2
        },
        comformDel(){
            this.reason = this.textarea
            console.log(this.reason)
            axios({
                url:`${url}/h5/manager/verifyMessage`,
                method:'POST',
                data:{
                    account:this.account,
                    code:this.code,
                    hasSendId:this.hasSendId,
                    pass:this.pass,
                    reason:this.reason,
                }
            }).then(()=>{
                sessionStorage.removeItem('hisData')
                //this.$router.go(-1)
                this.$router.push({path:'/history'})
            })
        },
        
        quxiao(){
           this.popupVisible = false
           this.popupVisible2 = false
        },
        receiptChat(){
            // sessionStorage.sourceContent = this.sourceContent 
            // sessionStorage.title = this.title 
            // sessionStorage.showHuiZhi = this.showHuiZhi 
            // sessionStorage.hasSendId = this.hasSendId 
            // sessionStorage.receiptContent = this.receiptContent 
            // sessionStorage.showFooter = this.showFooter 
            // sessionStorage.receiptNum = this.receiptNum 
            this.$router.push({path:'/receiptReply'})
        },
    },
    
    updated () {
        this.$nextTick(function(){
            let position = this.$store.state.position //返回页面取出来
            window.scroll(0, position)
        }) 
    },
    mounted(){
        var _this=this;
        this.account = sessionStorage.account
        this.code = sessionStorage.code
        if(!sessionStorage.hisData){  //sessionStorage不存在时
            sessionStorage.hisData = 'aa'
            //初始进入页面时获取上个页面传过来的数据
            _this.sourceContent = _this.$route.query.sourceContent
            _this.title = _this.$route.query.title
            _this.showHuiZhi = _this.$route.query.showHuiZhi
            _this.hasSendId =  _this.$route.query.hasSendId
            _this.receiptContent =  _this.$route.query.receiptContent
            _this.showFooter = _this.$route.query.showFooter
            //  document.getElementById("mainContent").innerHTML = _this.sourceContent
           
            _this.receiptNum = _this.$route.query.receiptNum
            if(_this.receiptNum>0){ //回执数大于0时
                this.showReply = true
            }
            if(_this.receiptContent==null || !_this.receiptContent){
                _this.receiptContent = '回执无内容'
            }
            console.log(_this.showHuiZhi)
            console.log(_this.showFooter)

            //调整内容框的高
            if(!_this.showFooter&&_this.showHuiZhi==false){ //如果不显示尾部'确定'，'回执'的时候
                console.log('a')
                _this.showFooter = false
                document.getElementById("mainContent").style.height = 'calc(100% - 1.35rem)'
                sessionStorage.height = document.getElementById("mainContent").style.height
            }else if(_this.showHuiZhi==false &&  _this.showFooter == true){  //如果不显示回执
                 console.log('b')
                _this.showFooter = true
                document.getElementById("mainContent").style.height = 'calc(100% - 2.55rem)'
                sessionStorage.height = document.getElementById("mainContent").style.height
            }else if(_this.showHuiZhi==true &&  !_this.showFooter){ //如果不显示确定
                console.log('c')
                 _this.showHuiZhi = true
                  _this.showFooter = false
                document.getElementById("mainContent").style.height = 'calc(100% - 3.15rem)'
                sessionStorage.height = document.getElementById("mainContent").style.height
            }else{ //如果都显示
                console.log('d')
                 _this.showFooter = true
                document.getElementById("mainContent").style.height = 'calc(100% - 4.31rem)'
                sessionStorage.height = document.getElementById("mainContent").style.height
            }
           
            

            //储存起来，保证刷新时数据不变
            sessionStorage.sourceContent = this.sourceContent 
            sessionStorage.title = this.title 
            sessionStorage.showHuiZhi = this.showHuiZhi 
            sessionStorage.hasSendId = this.hasSendId 
            sessionStorage.receiptContent = this.receiptContent 
            sessionStorage.showFooter = this.showFooter 
            sessionStorage.receiptNum = this.receiptNum 
           


        }else{  //sessionStorage存在时==刷新时/返回时
            _this.sourceContent= sessionStorage.sourceContent
            _this.title= sessionStorage.title
            _this.showHuiZhi= sessionStorage.showHuiZhi
            _this.hasSendId= sessionStorage.hasSendId
            _this.receiptContent= sessionStorage.receiptContent
             _this.showHuiZhi = sessionStorage.showHuiZhi=='false'?false:true
             _this.showFooter = sessionStorage.showFooter=='false'?false:true
            document.getElementById("mainContent").style.height =  sessionStorage.height
             _this.receiptNum= sessionStorage.receiptNum
             if(_this.receiptNum>0){ //回执数大于0时
                this.showReply = true
            }
            document.getElementById("mainContent").innerHTML = _this.sourceContent
           
        }
        // if(this.receiptNum>99){this.receiptNum = 99+}
         setTimeout(()=>{
                console.log(document.querySelectorAll('#mainContent>p>img'))
                document.querySelectorAll('#mainContent>p>img').forEach((item)=>{
                item.style = `max-width:7rem;max-height:5rem`
            })
            },500)
    },
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
div{box-sizing:border-box}
#showMassHead
    width:100%;
    height: 0.88rem; 
    margin-bottom :0.2rem
    padding-top:0.27rem
    position relative
    background-color #fff
    .titleWrap
        width:5.69rem
        line-height :0.34rem
        font-size: 0.34rem
        margin:0 0  0 0.72rem;
        text-align :left
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        input{
            width:100%;
            heigth:100%;
            font-size: 0.34rem
            border:none;

        }
    .showMassGoBack
        position:absolute;
        left:0.36rem
        top:0
        bottom:0
        margin:auto ;
        width:0.21rem;
        height: 0.28rem;
        img 
            width:100%
            height :100%
            position:absolute;
            top:0
            right :0
    .showMassImg
         width:0.41rem;
         height: 0.39rem;
         position:absolute;
         right:0.5rem
         top:0
         bottom:0
         margin:auto ;
         img 
            width:100%
            height :100%
            position:absolute;
            top:0
            right :0
        .reply
            position:absolute
            text-align: center;
            border-radius: 0.2rem;
            right: -0.2rem;
            top: -0.1rem;
            width: 0.38rem;
            height: 0.3rem;
            background-color: #f22f22;
            color: #fff;
            font-size: 0.18rem;
            // padding: 0 0.05rem;
            line-height:0.3rem
            // width: 0.5rem;
            //right:0.3rem
#mainContent
    width:100%
    //height: calc(100% - 4.31rem);
    background-color #fff
    margin-bottom:0.2rem
    overflow:auto
    padding:0.2rem 0.3rem
    font-size:0.3rem
    p
      font-size:0.3rem
      text-align: center
      background: #f00
    img 
      max-width:7rem
      max-height:5rem
#huizhi
     font-size:0.32rem
     font-weight:bold;
     border-bottom:0.01rem #e0e0e0 solid 
#huizhi,#huizhiMass
    width:100%;
    height:0.88rem
    text-align:center;
    line-height:0.88rem  
    background-color #fff
#huizhiMass
    font-size:0.28rem

.comfirm
    margin-top:0.2rem ;
    padding:0.1rem
    background-color #fefefe
    display:flex;
    align-item:center;
    justify-content:space-around;
    div
        width:40%
        background-color :#02cc67;
        text-align:center;
        font-size:0.34rem
        line-height :0.8rem
        color:white
        border-radius: 0.06rem;
    .FootNOpass
        background-color:#ff0202
    
// 弹框 
#popupWrap{
    width:4.9rem
    height:3.43rem
    background-color:#fff
    text-align:center
    padding:0.5rem 0.7rem 0.69rem
    border-radius:0.06rem 
    
} 
.mint-popup{
    top: calc(50% - 0.1rem);
    border-radius:0.06rem     
}
.warm{
    font-size:0.32rem
    line-height:0.32rem
}
.comfirmDel{
     font-size:0.34rem
     line-height:0.34rem
     font-weight:bold; 
     margin:0.5rem 0
}
.Delbuttom{
    display:flex;
    justify-content:space-between;
    align-items:center
}
.Delbuttom div,.Delbuttom2 div{
    width:1.44rem;
    height:0.56rem
    text-align:center;
    line-height:0.56rem
    font-size:0.32rem;
    color:white
    background-color:rgb(86,188,255)
    border-radius:0.06rem
}
.Delbuttom .quxiao,.Delbuttom2 .quxiao{
    background-color:white
    color:rgb(215,215,215);
    border:0.01rem rgb(215,215,215) solid;
}
// 弹框2
#popupWrap2{
    width:4.9rem
    height:4.5rem
    background-color:#fff
    text-align:center
    padding:0.5rem 0.4rem 0.69rem
    border-radius:0.06rem 
}
#popupWrap2 #reasonWrap{
    width:100%;
    margin-top:0.3rem
    height:2rem
    outline:0.01rem #ccc solid
    position:relative
    margin-bottom:0.3rem
}
#reasonWrap textarea{
    width:100%;
    height:1.6rem
    border:none
    outline-style :none
    resize:none
    padding:0.1rem
    box-sizing:border-box
}
#reasonWrap div{
    position:absolute;
    font-size:0.28rem;
    color:#c0c0c0;
    right:0.1rem;
    bottom:0.1rem;
}
.Delbuttom2{
    display:flex;
    justify-content:space-around;
    align-items:center
}
</style>
