<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex === $index}" @click="clickItem($index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="carcontrol-wrapper">
                  <carcontrol :food="food"></carcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcar v-ref:shopcar :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcar>
  </div>
  <food :food="selectedFood" v-ref:food></food>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    overflow: hidden
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #ffffff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')

        .text
          display: table-cell
          vertical-align: middle
          width: 56px
          font-size: 12px
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgb(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7,17,27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            line-height: 10px
            .count
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
            right: 0
            bottom: 12px
</style>

<script type="text/ecmascript-6">
  import BScroll from "better-scroll";
  import shopcar from "components/shopcar/shopcar";
  import carcontrol from "components/carcontrol/carcontrol";
  import food from 'components/food/food';

  const ERR_OK = 0;

    export default {
      props: {
            seller: {
                type: Object
            }
        },
      data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        };
      },
      computed: {
          currentIndex() {
              // 定义一个区间y值得高点和低点
              for(let i =0;i< this.listHeight.length;i++){
                  let height1 = this.listHeight[i];
                  let height2 = this.listHeight[i + 1];
                  if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
                      return i;
                  }
              }
              return 0;
          },
          // 将修改加入购物车商品的数量与购物车的总价格之间绑定联系
          selectFoods(){
             let foods = [] ;
             this.goods.forEach((good) => {
                 good.foods.forEach((food) => {
                     if(food.count){
                         foods.push(food);
                     }
                 });
             });
             return foods;
          },
      },
      created() {
          this.classMap = ['decrease','discount','guarantee','invoice','special'];
          this.$http.get('/api/goods').then((response) => {
            response = response.body;
            if(response.errno === ERR_OK){
                this.goods = response.data;
                this.$nextTick(() => {
                  this.initScroll();
                  this.calculateHeight();
                });
            }

          });
      },
      methods: {
        // 点击滚动到对应区块
        clickItem(index,event) {
            if(!event._constructed){
                return;
            }

            let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el,300);
        },
        // 小球下落的方法
        _drop(target) {
            // 解决小球动画延时问题 体验优化，异步执行下落动画
            this.$nextTick(() => {
              // 访问子组件对象的方法
              this.$refs.shopcar.drop(target);
            });
        },
        initScroll() {
          this.menuScroll = new BScroll(this.$els.menuWrapper, {
              click : true
          });
          this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
            click : true,
            probeType: 3    /* better-scroll插件的一个接口，能够实现监听滚动*/
          });
          // 滚动过程中实时获取scrollY
          this.foodsScroll.on('scroll', (pos) => {
              // pos.y是一个负值，且是一个小数
              this.scrollY = Math.abs(Math.round(pos.y));
          });

        },
        calculateHeight() {
            let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for(let i=0;i<foodList.length;i++){
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectFood(food,event) {
            if (!event._constructed) {
                return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
        },
      },
      components: {
            shopcar,
            carcontrol,
            food
      },
      events: {
        'car.add'(target){
            this._drop(target);
        }
      }

    };

</script>
