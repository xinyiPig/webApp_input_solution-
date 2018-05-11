export const url = '/Wisdom'
export const urlImg = 'http://mesg.scau.edu.cn/'
// export const url = 'http://mesg.scau.edu.cn//Wisdom'
// export const urlImg = 'http://mesg.scau.edu.cn//Wisdom'
 
export const timeFilter = {
  data () { 
    return {
 
    }
  },
  methods: {
    getDateDiff (dateTimeStamp) {
      //console.log(typeof dateTimeStamp)
      var minute = 1000 * 60;
      var hour = minute * 60;
      var day = hour * 24;
      var halfamonth = day * 15;
      var month = day * 30;
      var year1 = month * 12;
      var now = new Date().getTime();
      var diffValue = now - dateTimeStamp;
      var diffValue2
      if (diffValue < 0) { 
        // 未来
        diffValue = -diffValue 
        diffValue2 = 'diffValue2'
        console.log(diffValue + '未来')
      }
      var yearC = diffValue / year1;
      var monthC = diffValue / month;
      var weekC = diffValue / (7 * day);
      var dayC = diffValue / day;
      var hourC = diffValue / hour;
      var minC = diffValue / minute;
      var time = new Date(dateTimeStamp);
      var yearSure = time.getFullYear();  //年
      var monthSure = time.getMonth() + 1;  //月
      var daySure = time.getDate();         //日
      var getdaySure = time.getDay();   //周几
      var hhSure = time.getHours();       //时
      var mmSure = time.getMinutes();    //分
      var ssSure = time.getSeconds();   //毫秒
      if (month < 10)
        monthSure = "0" + monthSure;
      if (day < 10)
        daySure = "0" + daySure;
      if (hhSure < 10)
        hhSure = "0" + hhSure;
      if (mmSure < 10)
        mmSure = "0" + mmSure;
      if (ssSure < 10)
        ssSure = "0" + ssSure;
      var result = "";
      if (yearC >= 1) {
        result = "" + yearSure + "年" + monthSure + "月" + daySure + "日" + hhSure + ":" + mmSure;
      } else if (monthC >= 1) {
        result = "" + monthSure + "月" + daySure + "日" + hhSure + ":" + mmSure;
      } else if (weekC >= 1) {
        result = "" + monthSure + "月" + daySure + "日" + hhSure + ":" + mmSure;
      } else if (dayC >= 2 && dayC < 7) {
        var week;
        if (getdaySure == 0) week = "星期日";
        if (getdaySure == 1) week = "星期一";
        if (getdaySure == 2) week = "星期二";
        if (getdaySure == 3) week = "星期三";
        if (getdaySure == 4) week = "星期四";
        if (getdaySure == 5) week = "星期五";
        if (getdaySure == 6) week = "星期六";
        result = "" + week + " " + hhSure + ":" + mmSure;
      } else if (hourC >= 1 && dayC < 2) {
        // result = "" + "昨天" + " " + hhSure + ":" + mmSure;
        if(diffValue2 == 'diffValue2'){
          //表示时将来
          result = "" + "明天" + " " + hhSure + ":" + mmSure;
        }else{
          result = "" + "昨天" + " " + hhSure + ":" + mmSure;
        }
 
      } else {
        result = hhSure + ":" + mmSure;
      }
      return result;
    }
  }
}
 
export const loadingMore = {
  data () {
    return {
      type:''
    }
  },
 
  methods:{
    refresh (done) {
      this.isShowul = false;
      if(sessionStorage.modul == 2){
        this.name = this.$refs.input.value;
      }
      this.type = 'refresh'
      //console.log('刷新')
      this.pageIndex = 1
      this.list=[]
      this.loadMassage()
      done()
    },
    infinite(done) {
        console.log('上la')
        this.type = 'infinite'
        this.isShowul = false;
        console.log(this.pageIndex)
        console.log(this.totalpage)
        if(this.pageIndex >= this.totalpage){
          console.log('大于')
          setTimeout(()=>{
            done(true) 
          },1000)
          return;
        }
        //setTimeout(() => {
            this.$store.commit('loadPageIndex',this.pageIndex+1)
            console.log(this.$store.state.loadPageIndex)
            this.pageIndex += 1; //6-7，加1已经到最后一页了
            this.loadMassage() 
            console.log('请求成功1')
            setTimeout(() => {
              console.log('请求成功2')
              done(true)
              console.log('请求成功3')
            },100) 

     
        //}, 500) 

        //正常 2 请求成功1   请求成功2 请求成功3  数据

    },
  }
}