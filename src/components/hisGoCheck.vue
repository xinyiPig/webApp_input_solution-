<template>
<div style="height:100%">
   
    <!-- <scroller :on-refresh="refresh"  :on-infinite='infinite' ref='scroller'> -->
    <div id="selBox">
        <div class="selLeft">
            <div class="selZu"  @click.stop="showListul">{{selZu}}</div>
            <div class="selImgWrap"  @click.stop="showListul"><img src="../common/image/shouye/下拉@2x.png" alt=""></div>
            <ul v-show="isShowul" class="ulList">
                <li  v-for='lis,index in ulList' @click.stop='lisClick(index)'>{{lis.manageServiceName}}</li>
            </ul>
        </div>
        <div class="selRight">
            <!-- <input type="text" class="selInput" placeholder="搜索姓名" v-model="val" v-on:blur="changeCount(val)" v-on:focus='getfocus'> -->
            <input type="text" class="selInput" placeholder="搜索姓名" ref='input' v-on:input ="inputFunc">
            <div @click='searchName'><img src="../common/image/shouye/chaxun@2x.png" alt="" class="Searchimg"></div>
        </div>
    </div>
    <!-- 弹框 -->
    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div id="popupWrap">
            <p class="warm">提示</p>
            <p class="comfirmDel">{{warmText}}</p>
            <div class="Delbuttom">
                <div @click='comformDel'>确定</div>
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
                <div @click='comformDel'>确定</div>
                <div class="quxiao" @click='quxiao'>取消</div>
            </div>
        </div>
    </mt-popup>
    <scroller :on-refresh="refresh"  :noDataText='pageIndex==totalpage?"没有更多数据":""' :on-infinite="infinite" v-if="list.length"  ref='scroller' style='top:0.9rem;position:absolute'>
     <div id="WaitWrap" class="WaitWrap"  v-for='(item,index) in list' @click.stop='showMassage(index)' :key='index'>
        <div class="waitTimeWrap">
            <div class="waitTimeLeft">
                <div class="aa"></div>
                <p v-show='item.shhe'>{{item.operationName}} </p>
                <p v-show='!item.shhe && item.shhe2'>{{item.operationName}} （通过）</p>
                <p v-show='!item.shhe && !item.shhe2'>{{item.operationName}} （不通过）</p>
            </div>
            <div class="waitTimeRight">{{getDateDiff(item.date)}}</div>
        </div>
        <div class="theme">
            <span>主题：</span>
            <span>{{item.title}}</span>
        </div>
        <div class="centImgWrap">
            <div class="centImg" v-show='item.showImg'><img :src="urlImg+item.picture" alt=""></div>
            <div class="centTextWrap" :style="'width:'+item.width+'%'">
                <p  v-show='item.showImg'>{{item.introduction}}}</p>
                <p  v-show='!item.showImg' :style="'width:'+item.width+'%'">{{item.content}}</p>
                <div class="centText1"  v-show='item.showImg' v-if='item.showFooter'>
                    <div class="noPass" @click.stop='goNopass(index)'>不通过</div>
                    <div class="pass"  @click.stop='gopass(index)'>通过</div>
                </div>
                <div  class="centText2"  v-show='!item.showImg' v-if='item.showFooter'>
                    <div class="noPass"  @click.stop='goNopass(index)'>不通过</div>
                    <div class="pass"  @click.stop='gopass(index)'>通过</div> 
                </div>
            </div> 
        </div>
    </div>
    <!-- <NoData :showNodata='!list.length' ></NoData>  -->
    </scroller>
    <scroller :on-refresh="refresh" v-if="!list.length" noDataText=''  :on-infinite="infinite" ref='scroller' style='top:0.9rem;position:absolute'>
    <NoData :showNodata='!list.length' ></NoData>   
    </scroller> 

</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery';
import NoData from './common/noData.vue';
import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
import {mapStart,mapMutations} from 'vuex'

;     
export default {
    mixins: [timeFilter,loadingMore],
    data(){
        return{
            list:[],
            isShowul:false,
            account:'',
            code:'',
            manageServiceId:0,
            selZu:'选择群组',
            ulList:[],
            queryManageServiceId:0,
            name:'',
            popupVisible:false,
            popupVisible2:false,
            showHuiZhi:false,
            warmText:'',
            pageIndex:1,
            pageSize:5,
            hasSendId:0,
            pass:0,
            reason:'',
            mTop:0, //点击内容的高度
            sTop:0,//滚动条的高度
            noCancat:false, //不跟请求到的数据合并
            index:0,
            totalpage:1,
            kong:false,
            textarea:'',
            urlImg:urlImg
        }
    },
    components: {
        NoData
    },
    methods:{
        showListul(){
           //获取下级
            axios({
                url:`${url}/h5/manager/findLowerManageServices`,
                params:{
                    'account':this.account,
                    'code':this.code,
                    'manageServiceId':this.manageServiceId,
                },
                methods:'get',
            }).then((msg)=>{
                this.ulList = msg.data.data
                console.log(msg.data.data)
                if(!this.ulList){
                    this.ulList.unshift({manageServiceName:'选择群组'})
                }else{
                     this.ulList.unshift({manageServiceName:'选择群组'})
                }
                
            })
            this.isShowul =  !this.isShowul
        },
        lisClick(index){
            this.selZu = this.ulList[index].manageServiceName
            if(index==0){ //点击选择群组时获取最初的全部
                this.list=[]
                this.pageIndex = 1
                this.queryManageServiceId = 0
                this.loadMassage()
            }else{
                this.list=[]
                this.pageIndex = 1
                this.queryManageServiceId = this.ulList[index].manageServiceId
                 
                this.loadMassage()
                
            }
            this.isShowul =  !this.isShowul      
        },
        searchName(){ //input搜索
            console.log('搜索')
            this.name = this.$refs.input.value;
            this.$store.commit('search',this.name)
            console.log(this.$store.state.search)
            this.list = []
            this.pageIndex = 1
            this.loadMassage(1)
            console.log(this.list)
            
        },
        inputFunc(){  //监听input值为空时显示全部内容
            if(!this.$refs.input.value){
                this.name = this.$refs.input.value
                this.pageIndex = 1
                this.loadMassage()

            }
        },
        showMassage(index){  //点击进入详情
            // sessionStorage.modul = 2
            if(this.list[index].flag==2){ //文字
                var content = this.list[index].content
                this.sourceContent = `<div style='font-size:0.28rem;text-align:left;text-indent:2em'>${content}</div>`
            }else{
                this.sourceContent = this.list[index].sourceContent
            }
            if( this.list[index].receiptId!==0){
                this.showHuiZhi = true
            }
            this.title = this.list[index].title
            this.$router.push({path:'/showMassage',query:{sourceContent:this.sourceContent,title:this.title,hasSendId:this.list[index].hasSendId,showHuiZhi:this.showHuiZhi,receiptContent:this.list[index].receiptContent,showFooter:this.list[index].showFooter,receiptNum:this.list[index].receiptNum}})
        },
        gopass(index){
            console.log('点击通过')
            this.pass = 1  //pass为1时通过
            this.popupVisible = true
            this.warmText = '确定通过该推送吗？'
            this.hasSendId = this.list[index].hasSendId
            this.index = index
            //获取点击的这个div距离顶部的位置
            // this.mTop = document.getElementsByClassName('WaitWrap')[index].offsetTop; 
            // //滚动条的高度
            // this.sTop = document.body.scrollTop
        },
        goNopass(index){
            this.pass = 2 //pass为2时不通过
            this.index = index
            this.hasSendId = this.list[index].hasSendId
            this.popupVisible2 = true
            // this.warmText = '不想推送该推送吗？'
            // this.mTop = document.getElementsByClassName('WaitWrap')[index].offsetTop;
            // this.sTop = document.body.scrollTop
        },
        comformDel(){
            console.log('确认按钮')
            if(this.pass==1){ //如果点击的是通过的话
                console.log('通过')
                console.log(this.list)
                console.log(this.index)
                console.log(this.list[this.index].shhe) //false
                console.log(this.list[this.index].shhe2) //true
                this.list[this.index].shhe = false
                this.list[this.index].shhe2 = true
                this.popupVisible = false
            }else{
                console.log('不通过')
                this.list[this.index].shhe = false
                this.list[this.index].shhe2 = false
                this.reason = this.textarea
                this.popupVisible2 = false
            }
            this.isPass()
            this.list[this.index].showFooter = false
        },
        quxiao(){
            // console.log('取消按钮')
            this.popupVisible = false
            this.popupVisible2 = false
        },
        isPass(){  //点通过时
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
            }).then((mag)=>{
                //console.log(msg)
                this.reason = ''
            })
        },
        
        loadMassage(value){  //页面初始化加载
            var data={
                account:this.account,
                code:this.code,
                manageServiceId:this.manageServiceId,
                queryManageServiceId:this.queryManageServiceId, //查询的下级管理群组
                name:this.name,
                // pageIndex:this.pageIndex,
                // pageSize:this.pageSize,
            }
            var _this = this
            axios({
                url:`${url}/h5/manager/findLowerMessage?account=${data.account}&code=${data.code}&manageServiceId=${data.manageServiceId}&queryManageServiceId=${data.queryManageServiceId}&name=${data.name}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`,
                methods:'get',
            }).then((msg)=>{
                this.pageSize = 5  //若返回时，请求完第一次后，恢复默认值
                this.pageIndex = this.$store.state.loadPageIndex  //表示当前请求的数据页
                if(msg.data.data.list.length==0 && value==1){ //搜索如果返回的数据为空时显示toast提示
                    this.$toast({
                        message: '搜索内容为空',
                        duration: 2000
                    });
                }
                console.log(msg.data.data.list)
                 _this.totalpage = parseInt(msg.data.data.totalPage)
                if (msg.data.code === 200) {
                    console.log(msg.data.data.list[1].picture)
                    _this.list = this.list.concat(msg.data.data.list) 
                }
                for(var i=0;i< _this.list.length;i++){
                    //文字内容布局
                    if(_this.list[i].flag==2){ //文字
                        _this.list[i].showImg = false
                        _this.list[i].width='100'    
                    }else{
                        _this.list[i].showImg = true
                    } 
                    //通过，不通过一行的样式布局
                    if(_this.list[i].verify ==1){
                        _this.list[i].shhe = false
                        _this.list[i].shhe2 = true
                        // _this.list[i].verify = '（通过）'
                        _this.list[i].showFooter = false
                    }else if(_this.list[i].verify ==2){
                         _this.list[i].shhe = false
                         _this.list[i].shhe2 = false
                        // _this.list[i].verify = '（不通过）'
                        _this.list[i].showFooter = false
                    }else{
                        _this.list[i].shhe = true
                        // _this.list[i].verify = ''
                        _this.list[i].showFooter = true
                    }
                }
            
            })
        }
    },
    mounted(){
        this.manageServiceId = sessionStorage.manageServiceId
        this.account = sessionStorage.account
        this.code =  sessionStorage.code
        this.pageSize = this.$store.state.loadPageIndex*this.pageSize
        //返回时加载代入之前ul选择的数据
        if(this.$store.state.selUl.lisName){
            this.selZu = this.$store.state.selUl.lisName
            this.queryManageServiceId =  this.$store.state.selUl.queryManageServiceId
        }
        //返回时加载代入之前input的数据
        if(this.$store.state.search){
            this.name = this.$store.state.search
            this.$refs.input.value = this.name
        }
        this.loadMassage()
        var _this=this

        $(document).click(function(){
            _this.isShowul = false;
        })
    },
    beforeRouteEnter(to,from,next){
        if(!sessionStorage.askPositon3){//当前页面刷新不需要切换位置
            sessionStorage.askPositon3 = '';
            next();
        }else{
            next(vm => {
                if(vm && vm.$refs.scroller){//通过vm实例访问this
                    setTimeout(function () {
                        vm.$refs.scroller.scrollTo(0, sessionStorage.askPositon3, false);
                        sessionStorage.askPositon3 = null
                        sessionStorage.removeItem('askPositon3')
                    },1000)//同步转异步操作
                }
            })
        }
    },
    beforeRouteLeave(to,from,next){
        if(to.path=='/showMassage'){ //记录离开时的位置
            sessionStorage.askPositon3 = this.$refs.scroller && this.$refs.scroller.getPosition() && this.$refs.scroller.getPosition().top;
            //保留选择的数据
            this.$store.commit('selUl',{'lisName':this.selZu,'queryManageServiceId':this.queryManageServiceId})
            next()
        }else{
            this.$store.state.search = ''
            next()
        }
       
    },
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
div{box-sizing:border-box}
#selBox{
    width:100%;
    height:0.9rem;
    padding:0 0.37rem
    display:flex;
    justify-content:space-between
    align-items:center
    background-color #fff
    border-bottom:0.01rem #e0e0e0 solid;
}
.selLeft{
    width:.2.04rem
    height:0.45rem
    clear:both  
    position relative
}
.selZu{
    float:left
    min-width:1.54rem
    width:auto;
    padding: 0 0.1rem
    line-height :0.45rem
    font-size:0.24rem
    color:#1d567b
    border:0.01rem  #91a0b7 solid;
}     
.selImgWrap{
    float:left
    width:0.5rem
    height:100%
    background-color :#1d567b
    position:relative
}
.selImgWrap img{
    width:0.22rem
    height:0.16rem
    position:absolute;
    top: 0.15rem;
    right: 0.13rem;
}
.ulList
    font-size:0.24rem;
    // width:1.74rem;
    // height:0.45rem
    z-index:1000
    background-color:#ffffff
    position :absolute
    top:0.45rem
    left:0
    border-left:0.01rem #91a0b7 solid;
    border-right:0.01rem #91a0b7 solid;
    li
        min-width:2.02rem
        height:0.45rem
        line-height:0.45rem
        border-bottom :0.01rem #91a0b7 solid;

.selRight{
    width:2.58rem
    height:0.45rem
    // border:1px red solid;
    box-sizing: border-box;
    display: flex;
    position relative
}    
.selInput{
    padding:0 0.32rem 0 0.16rem
    width:2.58rem
    font-size:0.24rem
    box-sizing: border-box;
    border-radius:0.06rem
    border:0.01rem #91a0b7 solid;
    outline-style :none
    // box-shadow:0 0 1px 1px #e0e0e0;
    position relative
}  
.Searchimg{
    width:0.26rem;
    height:0.26rem;
    position:absolute;
    right:0.15rem;
    top:0.1rem
}


#WaitWrap{
    width: 100%;
    background-color: #fff;
    padding: 0.3rem 0.36rem 0.3rem;
    margin-bottom:0.2rem
}
.waitTimeWrap{
    height 0.3rem
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.waitTimeLeft
    display: flex
    align-items:center
    div
        width:0.16rem
        height:0.16rem
        border-radius:50%
        background-color:#3ad277
        margin-right:0.08rem
    p
        font-size:0.24rem
        color :#444444
.waitTimeRight
    color:#91a0b7
    font-size:0.22rem       
.theme
    font-size:0.28rem
    color:#444444
    font-weight:bold 
    text-align:left
    margin:0.35rem 0 0.26rem
.centImgWrap{
    width:100%
    display:flex
    justify-content:space-between
    position:relative
}
.centImg{
    width:3.4rem
    height:2.19rem
}     
.centImg img{
    width:100%
    height:100%
} 
            
.centTextWrap{
    width:3.2rem
    text-align :left     
    margin-top:0.2rem

}  
.centTextWrap>p{
    width:3.2rem
    line-height :0.37rem
    font-size:0.26rem
    color:#444444
    text-indent:2em
    display: -webkit-box;
    -webkit-box-orient: vertical
    -webkit-line-clamp:3
    overflow: hidden
    word-wrap: break-word
}
           
.centText2{
    height:0.41rem 
    text-align:right
    margin-top:0.3rem
    color:white

    display:flex
    justify-content:flex-end
}        
.centText1{
    height:0.41rem 
    position:absolute
    right:0
    bottom:0
    text-align:right
    color:white
    
    display:flex
}              
.pass{
    text-align:center
    background-color:#3ad277;
    font-size:0.24rem;
    width:0.99rem;
    line-height:0.41rem
    margin-left 0.2rem;
    border-radius: 4px;
}              
.noPass{
    text-align:center
    background-color:#ff4242;
    font-size:0.24rem;
    width:0.99rem;
    line-height:0.41rem
    border-radius: 3px;
}        
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

#noData
    width:100%
    // height:10.4rem
    position relative
    >div
        width:3rem
        height:2.5rem
        margin:auto
        position:absolute;
        top:0;
        bottom:0
        right:0;
        left:0
        text-align:center
        div
            width:1.96rem;
            height:1.28rem
            margin:0 auto
            img 
                width:100%;
                height:100%
        p
            font-size:0.38rem
            margin-top:0.2rem
            color:#ccc
        
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
