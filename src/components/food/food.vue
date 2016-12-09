<template>
    <div v-show="showFlag" class="food" transition="move" v-el:food>
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="backforward">
            <i class="icon-arrow_lift"></i>
          </div>

        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class=old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="carcontrol-wrapper">
            <carcontrol :food="food"></carcontrol>
          </div>
          <!--给加入购物车按钮添加动画，能够拿到他的位置，使小球能从该按钮飞出-->
          <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count === 0" transition="fade">加入购物车
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="rating in food.ratings">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #ffffff
  &.move-transition
    transform: translate3d(0,0,0)
    transition: all 0.2s linear
  &.move-enter, &.move-leave
    transform: translate3d(100%,0,0)
  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #ffffff


  .content
    padding: 18px
    position: relative
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7,17,27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      font-size: 0
      height: 10px
      .sell-count, .rating
        font-size: 10px
        color: rgb(147,153,159)
      .sell-count
        margin-right: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240,20,20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147,153,159)
    .carcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size:10px
      color: #ffffff
      background: rgb(0, 160, 220)
      &.fade-transition
        opacity: 1
        transition: all 0.2s
      &.fade-enter, &.fade-leave
        opacity: 0

  .info
    padding: 18x
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7,17,27)
    .text
      line-height: 24px
      font-size: 12px
      padding: 0 8px
      color: rgb(77,85,93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7,17,27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147,153,159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          font-size: 10px
          line-height: 12px
          color: rgb(147,153,159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7,17,27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0,160,220)
          .icon-thumb_down
            color: rgb(147,153,159)


      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147,153,159)

</style>
<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import Vue from "vue";
  import carcontrol from "components/carcontrol/carcontrol";
  import ratingselect from "components/ratingselect/ratingselect";
  import split from "components/split/split";
  // 加{}代表组件中是export function,如果有多个function就在{}里加，间隔；不加{}的代表以export default{}输出
  import {formatDate} from '../../common/js/date';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default{
      props: {
          food:{
              type: Object
          }
      },
      data(){
          return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
          };
      },
      methods: {
          show() {
              this.showFlag = true;
              // 初始化 评价分类 与 只看有内容的评价的选项
              this.selectType = ALL;
              this.onlyContent = true;
              // better-scroll组件调用需要以下方法渲染
              this.$nextTick(() => {
                  if (!this.scroll) {
                      this.scroll = new BScroll(this.$els.food, {
                          click: true
                      });
                  }else {
                      this.scroll.refresh();
                  }
              });
          },
          // 商品详情页点击返回按钮，后退页面
          backforward(){
              this.showFlag = false;
          },
          addFirst(event) {
              // 防止页面连续点击
              if(!event._constructed) {
                  return;
              }
              this.$dispatch('car.add',event.target);
              Vue.set(this.food, 'count' ,1);
          },
          needShow(type,text) {
              if(this.onlyContent && !text){
                  return false;
              }
              if(this.selectType === ALL){
                  return true;
              }else{
                  return type === this.selectType;
              }
          }
      },
      // 实现按钮点击对应评论列表内容的修改
      events: {
          'ratingtype.select'(type){
              this.selectType = type;
              // 异步更新评论数据
              this.$nextTick(() => {
                  this.scroll.refresh();
              });
          },
          'content.toggle'(onlyContent){
              this.onlyContent = onlyContent;
              // 异步更新评论数据
              this.$nextTick(() => {
                this.scroll.refresh();
              });
          }
      },
      filters: {
        // 评价列表时间戳转化为时间对象  模块化编程思想
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm');
        }
      },
      components: {
         carcontrol,
         split,
         ratingselect
       },
  };
</script>
