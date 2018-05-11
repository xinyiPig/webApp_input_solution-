<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
	name: 'App'
}
</script>
<style>
@import url('//at.alicdn.com/t/font_578274_xkuco22kyma8xgvi.css');

* {
	margin: 0;
	padding: 0;



}
li {
	list-style: none;
}
html {
	background: #fff;
	height: 100%;
}
body {
	margin: 0;
	padding: 0;
	background: #fff;
	height: 100%;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	background: #fff;
	height: 100%;
	position: relative;
}
* {
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
div.mint-loadmore-bottom span.mint-loadmore-text{
  font-size:0.3rem !important;
}
/* 影响到后面的样式了 add zhang */
/* .v-modal{
  opacity: 0;
} */
</style>
