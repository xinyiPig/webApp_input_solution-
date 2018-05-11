<template>
<div id="noData" v-if='showNodata'>
    <!-- <scroller :on-refresh="refresh"   ref='scroller' style='top:0.9rem'> -->
    <div>
        <div class='imgWrapper'><img src="../../common/image/shouye/无数据@2x.png" alt=""></div>
        <p>空空如也</p>
    </div>
    <!-- </scroller> -->
    
</div>
</template>

<script>
import { timeFilter,url,urlImg,loadingMore} from '@/common/js/mixin'
export default {
props:['showNodata','loadingMore']
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">
#noData
        /* margin: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-40%);
        z-index 10 */
        margin-top :50%;
        .imgWrapper
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
