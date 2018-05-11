<template>
<div style="height:100%">
    <scroller :on-refresh="refresh"  :on-infinite="infinite" :noDataText='pageIndex==totalpage?"没有更多数据":""' ref='scroller' v-if="list.length" >
        <div id="WaitWrap" @click='showMassage(index)'  v-for="(item,index) in list" :key='index'>
            <div class="waitTimeWrap">
                <div class="waitTimeLeft">
                    <div :style="'background:'+item.bgc"></div>
                    <p>{{item.statu}}</p>
                    <!-- <p>未发送</p> -->
                </div>
                <!-- <div class="waitTimeRight">星期六 16.59</div> -->
                <div class="waitTimeRight"><span>{{getDateDiff(item.date)}}</span></div>
            </div>
            <div class="theme">
                <span>主题：</span>
                <span class="Themetitle">{{item.title}}</span>
            </div>
            <div class="centImgWrap">
                <div class="centImg" v-show='item.showImg'><img :src='urlImg+item.picture' alt=""></div>
                <div class="centCont" :style="'width:'+item.width+'%'" v-show='!item.showImg'>{{item.content}}</div>
                <div class="centCont"  v-show='item.showImg'>{{item.introduction}}</div>
            </div>
            <div class="Contentfoot"  v-show='!item.showFoot'>
                <span>送达&nbsp;</span><span>{{item.hasSendNum }}</span>&nbsp;&nbsp;&nbsp;
                <span>回执&nbsp;</span><span>{{item.receiptNum}}</span>
            </div>
            <div class="Contentfoot" v-show='item.showFoot'>
                <!-- <span>将于&nbsp;</span><span>2018.03.21  16:40</span>&nbsp;<span>发送</span> -->
                <span>将于&nbsp;</span><span>{{getDateDiff(item.timing)}}</span>&nbsp;<span>发送</span>
            </div>
        </div>
        <NoData :showNodata='!list.length' ></NoData> 
    </scroller>
    <scroller :on-refresh="refresh" :on-infinite="infinite" v-if="!list.length"  ref='scroller' noDataText=''>
    <NoData :showNodata='!list.length' ></NoData>  
    </scroller>
</div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
import NoData from './common/noData.vue';
export default {
    mixins: [timeFilter,loadingMore],
    data(){
        return{
            list:[],
            urlImg:urlImg,
            totalpage:0,
            sourceContent:'',
            showHuiZhi:false,
            title:'',
            pageIndex:1,
            pageSize:5,
            loading:false,
            bottomText: '',
            account:'',
            code:'',
            manageServiceId:0,
        }
       
    },
    methods:{
        showMassage(index){
            // sessionStorage.modul = 0
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
           
            this.$router.push({path:'/showMassage',query:{sourceContent:this.sourceContent,title:this.title,showHuiZhi:this.showHuiZhi,hasSendId:this.list[index].hasSendId,receiptContent:this.list[index].receiptContent,receiptNum:this.list[index].receiptNum}})
        },
       

        loadMassage(){
            // document.body.scrollTop = 2+'rem'
            this.manageServiceId = sessionStorage.manageServiceId
            this.account = sessionStorage.account
            this.code =  sessionStorage.code
            // console.log('加载数据')
            var _this = this
            axios({
                url:`${url}/h5/manager/findMessage`,
                params:{
                    'account':this.account,
                    'code':this.code,
                    'manageServiceId':this.manageServiceId,
                    'verify':1,
                    'ifSend':-1,
                    'pageIndex':this.pageIndex,
                    'pageSize':this.pageSize
                },
                methods:'get',
            }).then((msg)=>{
                this.pageSize = 5  //若返回时，请求完第一次后，恢复默认值
                this.pageIndex = this.$store.state.loadPageIndex  //表示当前请求的数据页

                // _this.list = msg.data.data.list
                _this.totalpage = parseInt(msg.data.data.totalPage)
                if (msg.data.code === 200) {
                    //判断时间是否超过现在的时间
                    var now = new Date().getTime()
                    for(var i=0;i< msg.data.data.list.length;i++){
                        if(msg.data.data.list[i].statu==0 &&msg.data.data.list[i].timing>now){
                            msg.data.data.list[i].statu='未发送'
                            msg.data.data.list[i].bgc='#91a0b7'
                            msg.data.data.list[i].showFoot = true
                        }else{
                            msg.data.data.list[i].statu='已发送'
                            msg.data.data.list[i].bgc='#56bcff'
                            msg.data.data.list[i].showFoot = false
                        }
                    }
                    _this.list = this.list.concat(msg.data.data.list)
                }
                console.log(_this.list)

                for(var i=0;i< _this.list.length;i++){
                    if(_this.list[i].picture==null){
                        _this.list[i].showImg = false
                        _this.list[i].width='100'    
                    }else{
                        _this.list[i].showImg = true
                    } 
                }

            
            })

        }
    },
    mounted(){
        this.pageSize = this.$store.state.loadPageIndex*this.pageSize
        this.loadMassage()
    },
    components: {
        NoData
    },
    beforeRouteEnter(to,from,next){
        if(!sessionStorage.askPositon1){//当前页面刷新不需要切换位置
            sessionStorage.askPositon1 = '';
            next();
        }else{
            next(vm => {
                //console.log(vm)
                console.log('vmvmvmvm')
                if(vm && vm.$refs.scroller){//通过vm实例访问this
                    console.log(vm.$refs)
                    setTimeout(function () {
                        vm.$refs.scroller.scrollTo(0, sessionStorage.askPositon1, false);
                        sessionStorage.askPositon1 = null
                        sessionStorage.removeItem('askPositon1')
                    },1000)//同步转异步操作
                }
            })
        }
    },
    beforeRouteLeave(to,from,next){
        console.log(to)
        if(to.path=='/showMassage'){ //记录离开时的位置
            sessionStorage.askPositon1 = this.$refs.scroller && this.$refs.scroller.getPosition() && this.$refs.scroller.getPosition().top;
            console.log(sessionStorage.askPositon1)
            next()
        }else{
            next()
        }
       
    },
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
.box{
    width:100%;
    height:100%;
    overflow:auto;
    position:relative;
    background:f6f7f7
  }
div{box-sizing:border-box}

#WaitWrap{
    width: 100%;
    background-color: #fff;
    padding: 0.3rem 0.36rem 0.3rem;
    border-bottom:0.01rem #e0e0e0 solid
    box-shadow:0 0 1px 2px #f5f5f5
    margin-bottom :0.2rem
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
        background-color:#56bcff
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
    // height:2.19rem
    display:flex
    justify-content:space-between
    // align-items :center
    .centImg
        width:3.4rem;
        height:2.19rem
        img 
            width:100%
            height:100%
    .centCont
        width:3.2rem
        line-height :0.39rem
        max-height:1.1rem
        font-size:0.26rem
        color:#444444
        text-align :left
        text-indent:2em
        margin-top:0.2rem

        display: -webkit-box;
        -webkit-box-orient: vertical
        -webkit-line-clamp:3
        overflow: hidden
        word-wrap: break-word

.Contentfoot
    font-size:0.24rem
    color:#91a0b7    
    margin-top:0.3rem
    text-align:left
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
