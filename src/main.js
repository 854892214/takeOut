import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import qs from "qs"
import util from './util'
import DanComponents from './components'
import "./assets/font/iconfont.js"
import "mint-ui/lib/style.min.css"
import moment from "moment-timezone";
import {
  Lazyload,
  Loadmore,
  Popup,
  Radio,
} from 'mint-ui'

Vue.config.productionTip = false;
Vue.use(Lazyload);
Vue.use(DanComponents);

Vue.prototype.qs = qs;
Vue.prototype.appUtil = util;
Vue.prototype.moment = moment;
Vue.component(Loadmore.name, Loadmore);
Vue.component(Popup.name, Popup);
Vue.component(Radio.name, Radio);

function checkClient() {
  if (!util.isWx() && !util.isAli()) {
    Vue.prototype.$danMessageBox("请使用微信或支付宝客户端", () => {
      util.closeClient();
    }, true)
  }
}

const windowHeight = window.innerHeight
Vue.directive('fixedInput', function (el, binding) {
  el.addEventListener('blur', function () {
    let windowFocusHeight = window.innerHeight
    if (windowHeight == windowFocusHeight) {
      return
    }
    // console.log(windowHeight + '--' + windowFocusHeight);
    // console.log('修复');
    let currentPosition;
    let speed = 1; //页面滚动距离
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    currentPosition -= speed;
    window.scrollTo(0, currentPosition); //页面向上滚动
    currentPosition += speed; //speed变量
    window.scrollTo(0, currentPosition); //页面向下滚动
  })
})

router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === "development") {
    // 开发环境
    // checkClient();
  } else {
    // 发布环境
    checkClient();
  }

  next();
});

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app');
