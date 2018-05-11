<template>
<div style='background-color:#f6f7f7;height:100%'>
    <div id="header">
        <div class="showMassGoBack" @click='goBackUrl'><img src="../common/image/shouye/houtui@2x.png" alt=""></div>
        <div class="title">回执情况</div>
        <div class="Alldata" @click='allDataPage'>统计数据</div>
    </div>
    <scroller :on-refresh="refresh"  :on-infinite="infinite" ref='scroller' v-if="showBox"  style="top:0.88rem" >
    <div v-for='(item,index) in list' :key='index'>
        <div id="chatWrap" >
            <div class="useImg"><img src="https://afp.alicdn.com/afp-creative/creative/u124884735/9fa0c2075172839724a919bf198dc4e8.jpg" alt=""></div>
            <div class="chartRight">
                <div>
                    <div class="useName">
                        <p>{{item.name}}</p>
                        <p>{{getDateDiff(item.time)}}</p>
                    </div>
                    <div class="useContent">
                        <div class="MainContent MainContent2" ref='cont'>{{item.content}}</div>
                        <span class="reply" @click='reply(index)'>回复</span>
                    </div>
                </div>
                <div class="replyContent" v-show=item.showReply>
                    <textarea name="" id='textarea' v-model="textCont" ref="textarea" placeholder="请输入回复的内容"></textarea>
                    <div class="replyButt" @click='replyDetailCont(index)'>回复</div>
                </div>
            </div>
        </div>
        <div class="replyMassageWrap" v-if='item.showMassages'>
            <div calss='replyMassage' @click='rotate(index)'>
                <p>{{item['replys'][0].content}}</p>
                <div  :class="item.rotates && 'rotateSan'"><img src="../common/image/shouye/xiasanjiao@2x.png" alt=""></div>
            </div>
            <ul class="moreMassage" v-if='item.moreReply' >
                <li v-for='detailMsg in item.replys'>
                    <p class="liCont">{{detailMsg.content}}</p>
                    <div class="liDate">{{getDateDiff(detailMsg.time)}}</div>
                </li>
            </ul>
        </div>
    </div>
     </scroller>
     <!-- 弹框 -->
    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div id="popupWrap">
            <p class="warm">回复失败</p>
            <p class="comfirmDel">该用户没有关注微信企业号</p>
            <div class="Delbuttom">
                <div @click='comformDel'>我知道了</div>
            </div>
        </div>
    </mt-popup>
    
</div>
</template>

<script>
import axios from 'axios'
import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
export default {
    mixins: [timeFilter,loadingMore],
    data(){
        return{
            list:[],
            // showReply:false,
            textCont:'',
            showMassages:false,
            moreReply:false,
            account:'',
            code:'',
            manageServiceId:0,
            hasSendId:0,
            pageIndex:1,
            pageSize:5,
            urlImg:urlImg,
            desAccount:0,
            pushReceiptContentId :0,
            serviceId:0,
            popupVisible:false,
            code:200,
            showBox:true,
            totalpage:0,
        }
    },
    methods:{
        goBackUrl(){
             this.$router.push({path:'/showMassage'})
            //  this.$router.go(-1)
        },
        allDataPage(){
             this.$router.push({path:'/allData'})
        },
        reply(index){
            console.log(this.list[index].showReply)
            if(this.list[index].showReply){
                console.log('打印true')
                this.list[index].showReply=false
            }else{
                for(var i=0;i<this.list.length;i++){
                    this.list[i].showReply = false
                    
                    this.list[index].showReply = true
                }
            }
            
            
            //this.list[index].showReply=!this.list[index].showReply
            // this.list[index].showReply = true
            this.textCont = this.$refs.textarea.value;
            this.desAccount = this.list[index].account
            this.pushReceiptContentId = this.list[index].id
            this.serviceId  = this.list[index].serviceId   
        },
        comformDel(){
            this.popupVisible = false
        },
        replyDetailCont(index){  //点击回复时
            var date = new Date()
            var dates = date.getTime()
            // console.log(this.textCont)
            if(!this.textCont){
                alert('回复的内容不能为空')
            }else{
                var data={
                    account:this.account,
                    code:this.code,
                    content:this.textCont,
                    desAccount: this.desAccount,
                    pushReceiptContentId: this.pushReceiptContentId,
                    serviceId: this.serviceId
                }
                var _this = this
                //回复的内容传给后台
                axios({
                    url:`${url}/h5/manager/replyReceipt`,
                    method:'POST',
                    data:data,
                }).then((msg)=>{
                    // this.code =  msg.data.code //用来判断是否有权限回复
                    if(msg.data.code!= 200){
                        this.popupVisible = true
                    }else{
                         this.list[index].replys.unshift({content:this.textCont,time:dates})
                        //  this.list[index].showReply=!this.list[index].showReply
                         this.list[index].showReply = false
                        this.list[index].showMassages = true
                    }
                   
                    console.log(msg)
                })
            }
            
        },
        rotate(index){
            //console.log(this.list[index].rotates)
            if(this.list[index].rotates){
                //console.log('打印true')
                this.list[index].rotates=false
                this.list[index].moreReply=false
            }else{
                for(var i=0;i<this.list.length;i++){
                    this.list[i].rotates = false
                    this.list[i].moreReply = false
                    
                    this.list[index].rotates = true
                    this.list[index].moreReply = true
                }
            }
            //this.list[index].rotates = !this.list[index].rotates
            //console.log(this.list[index].rotates)
            
            //this.list[index].moreReply = !this.list[index].moreReply
            // this.moreReply = !this.moreReply
        },
        loadMassage(){
            var data={
                account:this.account,
                code:this.code,
                manageServiceId:this.manageServiceId,
                hasSendId:this.hasSendId
                // pageIndex:1,
                // pageSize:5,
            }
            var _this = this
            axios({
                url:`${url}/h5/manager/findReceiptContent?account=${data.account}&code=${data.code}&manageServiceId=${data.manageServiceId}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&hasSendId=${data.hasSendId}`,
                methods:'get',
                // headers:{'Token':'token'}
            }).then((msg)=>{
                // this.list = msg.data.data.list
                 _this.totalpage = parseInt(msg.data.data.totalPage)

                if(msg.data.data.list.length==0){  //没有数据时的显示
                    this.$refs.scroller.finishInfinite(true)
                    this.showBox = !this.showBox
                    return
                }else{
                    for(var i = 0;i< msg.data.data.list.length;i++){
                        msg.data.data.list[i].showReply = false
                        msg.data.data.list[i].showMassages = false
                        msg.data.data.list[i].moreReply = false
                        
                    }
                    
                    _this.list = this.list.concat(msg.data.data.list)
                    console.log(this.list)
                }


                for(var i=0;i<this.list.length;i++){
                    this.list[i].rotates = false
                    if(this.list[i].replys!=''){
                        console.log('有回复内容')
                        this.list[i].showMassages = true
                    }else{
                        // document.getElementsByClassName('showMassages')[i].style.display='none'
                    }
                }
                console.log(msg)
            })
        }
    },
    mounted(){
        this.hasSendId = sessionStorage.hasSendId
        this.manageServiceId = sessionStorage.manageServiceId
        this.account = sessionStorage.account
        this.code =  sessionStorage.code
        console.log(sessionStorage.sourceContent)
        // var height= this.$refs.cont.offsetHeight
        // console.log(height+'71')
        this.loadMassage();
    }
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
div{box-sizing:border-box}
#textarea::-moz-placeholder { 
    color: #ccc;	
}
#textarea:-ms-input-placeholder{
    color: #ccc;
}  
#textarea::-webkit-input-placeholder{
    color:#ccc;
}
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
    .Alldata
        width:1.3rem
        height:0.28rem
        line-height:0.28rem
        position:absolute
        right:0.36rem
        top:0.3rem
        font-size:0.28rem;
        color:rgb(86,188,255)

#chatWrap
    padding:0.4rem 0.36rem 0
    display:flex;
    justify-content:space-between;
    // align-items:center;
    .useImg
        padding:0.2rem 
        width:1rem
        height:1rem
        position relative
        img  
            width:0.8rem
            height:0.8rem
            position:absolute
            top:0.2rem
            left:0.1rem
            border-radius:50%
    .chartRight
        width:85%
        .useName
            font-size:0.24rem
            color:#91a0b7
            display:flex;
            justify-content:space-between;
            align-items:center
        .useContent
            display:flex;
            justify-content:space-between;
            align-items:center
            font-size:0.28rem
            margin-top:0.1rem
            .MainContent
                width:4.6rem
                height: auto
                background-color #fff
                color:#444444
                padding:0.1rem 0.1rem 0.1rem 0.2rem
                border: 1px solid #d7d7d7
               
                line-height: 0.4rem;
                border-radius:0.06rem
                margin-left: 0.2rem;
                text-align:left;
                position relative
            :before {
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
            :after {
                content: '';
                position: absolute;
                top: 0.1rem;
                left: -0.19rem;
                width: 0;
                height: 0;
                z-index: 2;
                border-top: 0.1rem solid transparent;
                border-right: 0.2rem solid #fff;
                border-bottom: 0.1rem solid transparent;
            }
            // .MainContent2
            //     display: -webkit-box;
            //     -webkit-box-orient: vertical;
            //     -webkit-line-clamp:3;
            //     overflow: hidden;
            //     word-wrap: break-word;
            .reply
                padding:0.12rem
                background-color:#56bcff
                color:white
                border-radius:0.06rem
                line-height: 0.3rem;
    .replyContent
        width:100%;
        background-color #fff
        display:flex
        margin-top:0.3rem
        transition:all 5s
        outline: 0.01rem solid #ccc;
        textarea
            height:1.81rem
            width:calc(100% - 1.53rem)
            font-size:0.24rem
            padding:0.2rem
            border:none
            border-right:0.01rem #ccc dashed
            outline-style :none
            resize:none  
            textarea::-webkit-input-placeholder {color:red}
        .replyButt
            width:1.53rem
            height: 2.21rem;
            line-height: 2.21rem;
            font-size:0.32rem
            color:#56bcff         
            display:inline-block
.replyMassageWrap
    width:100%;
    padding:0.3rem 0.36rem 0
    box-sizing:border-box
    >div
        width:100%
        background-color:white
        text-align:left
        display:flex
        justify-content:space-between
        align-items:center
        padding:0 0.2rem
        border-radius:0.06rem
        border:0.01rem #ccc solid;
        
        p
            width:100%
            line-height:0.56rem
            font-size:0.24rem
            color:#444444

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        div
            width:0.13rem
            height:0.2rem
            img 
                width:0.13rem
                height:0.2rem
                display:flex
.rotateSan{
    transform:rotate(90deg);
}

    .moreMassage
        width:100%;
        list-style:none
        // margin:0.1rem 0
        
        li
            
            background-color:white
            height:auto
            text-align:left
            border-bottom:0.01rem #f0f0f0 solid 
            padding:0.15rem 0.1rem
            display:flex;
            justify-content:space-between;
            align-items:center
            p
                font-size:0.24rem
                width:69%
                line-height:0.32rem
            .liDate
                text-align:center
                max-width:2.4rem
                min-width:1.5rem
                font-size:0.18rem
                color:#91a0b7
               
// 弹框 
#popupWrap{
    width:4.9rem
    height:3.43rem
    background-color:#fff
    text-align:center
    padding:0.5rem 0.7rem 0.69rem
} 
.mint-popup{
    top: calc(50% - 0.1rem);
}
.warm{
    font-size:0.32rem
    line-height:0.32rem
}
.comfirmDel{
     font-size:0.29rem
     line-height:0.34rem
     font-weight:bold; 
     margin:0.5rem 0
}
.Delbuttom div{
    width:1.44rem;
    height:0.56rem
    text-align:center;
    line-height:0.56rem
    font-size:0.32rem;
    color:white
    background-color:rgb(86,188,255)
    border-radius:0.06rem
    margin:0 auto
}

</style>
