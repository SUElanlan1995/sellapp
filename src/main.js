import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import "./common/stylus/index.styl";

Vue.use(VueRouter);
Vue.use(VueResource);

let app = Vue.extend(App);

let router = new VueRouter({
  linkActiveClass:'active'
});

router.map({
  '/goods':{
    component: goods
  },
  '/ratings':{
    component: ratings
  },
  '/seller':{
    component: seller
  }
});

// 挂载点
router.start(app,'#app');

// 首次打开页面会展示商品页面
// router.go('/goods');

