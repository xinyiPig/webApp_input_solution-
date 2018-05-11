<template>
<div>
    <scroller :on-refresh="refresh"  :on-infinite="infinite" ref='scroller' v-if="list.length" >
     <div id="WaitWrap" v-for='(item,index) in list' @click='showMassage(index)' :key='index'>
        <div class="waitTimeWrap">
            <div class="waitTimeLeft">
                <div class="aa"></div>
                <p>未通过</p>
            </div>
            <div class="waitTimeRight">{{getDateDiff(item.verifyTime)}}</div>
        </div>
        <div class="theme">
            <span>主题：</span>
            <span class="Themetitle">{{item.title}}</span>
        </div>
        <div class="centImgWrap">
            <div class="centImg" v-show='!item.showImg'><img :src="urlImg+item.picture" alt=""></div>
            <div class="centTextWrap" :style="'width:'+item.width+'%'">
                <p :style="'width:'+item.width+'%'"  v-show='item.showImg'>{{item.content}}</p>
                <p v-show='!item.showImg'>{{item.introduction}}</p>
                <!-- <div class="centText1" v-show='item.showImg'><div class="del" @click='del(index)'>重新发送</div></div>
                <div class="centText2" v-show='!item.showImg'><div class="del" @click='del(index)'>重新发送</div></div> -->
            </div> 
        </div>
        <div class='nopassReason'>{{item.reason}}</div>
    </div>
    <!-- <NoData :showNodata='!list.length' ></NoData>  -->
    </scroller>
    <scroller :on-refresh="refresh" v-if="!list.length" :on-infinite="infinite" ref='scroller' noDataText=''>
    <NoData :showNodata='!list.length' ></NoData> 
    </scroller>
    <!-- 弹框 -->
    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        modal:true
        closeOnClickModal:true>
        <div id="popupWrap">
            <p class="warm">提示</p>
            <p class="comfirmDel">确定要删除吗</p>
            <div class="Delbuttom">
                <div @click='comformDel'>确定</div>
                <div class="quxiao" @click='quxiao'>取消</div>
            </div>
        </div>
    </mt-popup>
  
  
</div>
</template>

<script>
import axios from 'axios'
import NoData from './common/noData.vue';
import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
export default {
    mixins: [timeFilter,loadingMore],
    data(){
        return{
            list:[],
            urlImg:urlImg,
            pageIndex:1,
            pageSize:5,
            popupVisible:false,
             account:'',
            code:'',
            manageServiceId:0,
            showBox:true,
             totalpage:1,
             showHuiZhi:false,
            receiptNum:0,
        }
    },
    methods:{
        showMassage(index){
            // sessionStorage.modul = 3
            if(this.list[index].flag==2){ //文字
                var content = this.list[index].content
                this.sourceContent = `<div style='font-size:0.28rem;text-align:left;text-indent:2em'>${content}</div>`
            }else{
                this.sourceContent = this.list[index].sourceContent
            }
            if( this.list[index].receiptId!==0){
                this.showHuiZhi = true
                this.receiptNum =  this.list[index].receiptNum
            }
            this.title = this.list[index].title
            this.$router.push({path:'/showMassage',query:{sourceContent:this.sourceContent,title:this.title,showHuiZhi:this.showHuiZhi,receiptNum:this.receiptNum,urlName:'/history',hasSendId:this.list[index].hasSendId}})
        },
        del(index){
            // this.popupVisible = true
        },
        comformDel(){
            console.log('确认删除按钮')
        },
        quxiao(){
            console.log('取消按钮')
        },
        loadMassage(){
            var data={
                account:this.account,
                code:this.code,
                manageServiceId:this.manageServiceId,
                verify:2,
                ifSend:'-1',
                // pageIndex:1,
                // pageSize:5,
            }
            var _this = this
            axios({
                url:`${url}/h5/manager/findMessage?account=${data.account}&code=${data.code}&manageServiceId=${data.manageServiceId}&verify=${data.verify}&ifSend=-1&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`,
                methods:'get',
                // headers:{'Token':'token'}
            }).then((msg)=>{
                this.pageSize = 5  //若返回时，请求完第一次后，恢复默认值
                this.pageIndex = this.$store.state.loadPageIndex  //表示当前请求的数据页

                // _this.list = msg.data.data.list
                _this.totalpage = parseInt(msg.data.data.totalPage)
                if(msg.data.data.list.length==0){  //没有数据时的显示
                   
                    this.showBox = !this.showBox
                    return
                }else{
                     _this.list = this.list.concat(msg.data.data.list)
                }

                for(var i=0;i< _this.list.length;i++){
                    if(_this.list[i].picture==null){
                        _this.list[i].showImg = true
                        _this.list[i].width='100'    
                    }else{
                        _this.list[i].showImg = false
                    } 
                }

            
            })
        }
    },
    components: {
        NoData
    },
    mounted(){
        this.manageServiceId = sessionStorage.manageServiceId
        this.account = sessionStorage.account
        this.code =  sessionStorage.code
        this.pageSize = this.$store.state.loadPageIndex*this.pageSize
        this.loadMassage()
    },
    beforeRouteEnter(to,from,next){
        if(!sessionStorage.askPositon4){//当前页面刷新不需要切换位置
            sessionStorage.askPositon4 = '';
            next();
        }else{
            next(vm => {
                //console.log(vm)
                console.log('vmvmvmvm')
                if(vm && vm.$refs.scroller){//通过vm实例访问this
                    console.log(vm.$refs)
                    setTimeout(function () {
                        vm.$refs.scroller.scrollTo(0, sessionStorage.askPositon4, false);
                        sessionStorage.askPositon4 = null
                        sessionStorage.removeItem('askPositon4')
                    },1000)//同步转异步操作
                }
            })
        }
    },
    beforeRouteLeave(to,from,next){
        console.log(to)
        if(to.path=='/showMassage'){ //记录离开时的位置
            sessionStorage.askPositon4 = this.$refs.scroller && this.$refs.scroller.getPosition() && this.$refs.scroller.getPosition().top;
            console.log(sessionStorage.askPositon4)
            next()
        }else{
            next()
        }
       
    },
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
div{box-sizing:border-box}
#WaitWrap{
    width: 100%;
    height:100%;
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
        background-color:#ff4242
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

.centImgWrap
    width:100%
    display:flex
    justify-content:space-between
    position relative
    .centImg
        width:3.4rem
        height:2.19rem
        img 
            width:100%
            height:100%
    .centTextWrap
        width:3.2rem
        line-height :0.37rem
        text-align :left     
        margin-top:0.2rem
        position relative
        p
            width:3.2rem
            font-size:0.26rem
            color:#444444
            text-indent:2em
            display: -webkit-box;
            -webkit-box-orient: vertical
            -webkit-line-clamp:3
            overflow: hidden
            word-wrap: break-word
        .centText2
            text-align:center
            margin-top:0.3rem
            clear both
            div
                float:right
        .centText1 
                position:absolute
                right:0
                bottom:0
                text-align:center
.nopassReason
    width:100%;
    color:#91a0b7;
    font-size:0.24rem;
    margin:0.34rem 0 0.3rem 0
    text-align:left
                

.del{
    width:1.2rem;
    height:0.41rem;
    line-height:0.41rem;
    color:#ff4242;
    font-size:0.24rem
    border:0.01rem #ff4242 solid;
    border-radius:0.06rem
}              
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
.Delbuttom div{
    width:1.44rem;
    height:0.56rem
    text-align:center;
    line-height:0.56rem
    font-size:0.32rem;
    color:white
    background-color:rgb(86,188,255)
    border-radius:0.06rem
}
.Delbuttom .quxiao{
    background-color:white
    color:rgb(215,215,215);
    border:0.01rem rgb(215,215,215) solid;
}

#noData
    width:100%
    height:10.4rem !important
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
</style>
