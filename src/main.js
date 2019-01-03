// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'common/style/index.styl'
import 'common/style/animate.min.css'
import 'common/js/lottery.js'
import FastClick from 'fastclick'
import Mint from 'mint-ui'
import VueTouch from "vue-touch";
import vueTouch from 'common/js/vueTouch'
import VueClipboards from 'vue-clipboard2'
import infiniteScroll from 'vue-infinite-scroll'
import Toasted from 'vue-toasted';
import 'mint-ui/lib/style.css'

// import animate from 'animate.css'

//引入vconsole
import VConsole from 'vconsole'
if (window.location.href.indexOf('localhost') == -1) {
  var vConsole = new VConsole()
}

FastClick.attach(document.body)
Vue.use(Mint)
Vue.use(VueClipboards)
Vue.use(Toasted);
Vue.use(VueTouch, {name:'v-touch'})
Vue.use(infiniteScroll);
Vue.config.productionTip = false

if (/Android/gi.test(navigator.userAgent)) {
  window.addEventListener('resize', function () {
    if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
      window.setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
  })
}
Vue.filter('time', function (value) {
  let date;
  const ua = navigator.userAgent.toLowerCase(); 
  if (/iphone|ipad|ipod/.test(ua)) {
    date = new Date(value.replace(/-/g, "/"));   
  }  else {
     date = new Date(value);
  }
  const Y = date.getFullYear() + '-',
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
  D = date.getDate() + ' ',
  h = (date.getHours()+1 < 10 ? '0'+(date.getHours()) : date.getHours()) + ':',
  m = (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':',
  s = (date.getSeconds()+1 < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
  return h+m+s;
// console.log(Y+M+D);
})
Vue.filter('station', function (value) {
  if (value) {
    return value;
  } else {
    return '暂无数据';
  }
// console.log(Y+M+D);
})
Vue.filter('changeTime', function (value) {
  if (value) {
    return value.substring(10)
  }
// console.log(Y+M+D);
})
 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}) 
