<template>
    <div class="carcontrol">
       <div class="car-decrease" @click.stop.prevent="decreaseCar" v-show="food.count>0" transition="move">
         <span class="inner icon-remove_circle_outline"></span>
       </div>
       <div class="car-count" v-show="food.count>0">{{food.count}}</div>
       <div class="car-add icon-add_circle" @click.stop.prevent="addCar"></div>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .carcontrol
    font-size: 0
    .car-decrease
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.move-transition
        opacity:1
        transform: translate3d(0,0,0)
        .inner
          display: inline-block
          font-size: 24px
          line-height: 24px
          color: rgb(0,160,220)
          transition: all 0.4s linear
          transform: rotate(0)
      &.move-enter, &.move-leave
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
    .car-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)

    .car-add
      display: inline-block
      font-size: 24px
      line-height: 24px
      padding: 6px
      color: rgb(0,160,220)

</style>
<script type="text/ecmascript-6">
import Vue from 'vue';
    export default{

      props:{
          food: {
              type: Object
          }
      },
      created() {

      },
      methods: {
        addCar(event) {
            // 判断pc断点击事件同时触发两次的问题
            if(!event._constructed) {
                return;
            }
            if(!this.food.count){
              Vue.set(this.food,'count', 1);
            }else{
              this.food.count++;
            }
            this.$dispatch('car.add',event.target);
        },
        decreaseCar() {
          if(!event._constructed) {
            return;
          }
          if(this.food.count){
            this.food.count--;
          }
        }
      },
    };
</script>
