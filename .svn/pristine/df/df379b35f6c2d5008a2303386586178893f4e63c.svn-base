<template>
  <div id="home">
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="navigationBar">
      <div :class="currentNavIndex === index ? 'barItem-active' : 'barItem'"
           @click="toComponent(item,index)"
           v-for="(item,index) in navList">
        <div class="bar-icon">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
          <div class="tip-count"
               v-if="item.tipCount !== undefined && shopCarGoodsCount.count>0">
            <number-count :count="shopCarGoodsCount.count"></number-count>
          </div>
        </div>
        <span class="barTitle">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import NumberCount from "../components/NumberCount";

  export default {
    name: "Home",
    components: {NumberCount},
    data() {
      return {
        navList: [
          {
            icon: '#icon-liebiao',
            title: '分类',
            componentPath: '',
            componentName: 'Classify'
          },
          {
            icon: '#icon-gouwuche',
            title: '购物车',
            componentPath: 'shoppingCart',
            componentName: 'ShoppingCart',
            tipCount: 1
          },
          {
            icon: '#icon-wode',
            title: '我的',
            componentPath: 'my',
            componentName: 'My'
          }
        ],
        currentNavIndex: 0
      };
    },
    computed: {
      shopCarGoodsCount: function () {
        let count = 0;
        if (this.$store.getters.shopCartList !== null) {
          this.$store.getters.shopCartList.forEach(goods => {
            count += goods.count;
          });
        }
        return {
          count: count,
        }
      }
    },
    methods: {
      toComponent(item, index) {
        this.currentNavIndex = index;
        this.$router.replace({
          path: item.componentPath,
          name: item.componentName
        })
      },
      checkNavIndex() {
        if (this.$route.name === 'My') {
          this.currentNavIndex = 2;
        }
        if (this.$route.name === 'ShoppingCart') {
          this.currentNavIndex = 1;
        }
        if (this.$route.name === 'order') {
          this.currentNavIndex = 0;
        }
      },
    },
    created() {
      if (this.$route.path === '/home') {
        // first
      }

      if (this.$route.path === '/home/') {
        // again
      }

      this.checkNavIndex();
    }
  };
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      height: calc(100vh - 50px);
    }

    .navigationBar {
      height: 50px;
      background-color: white;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #bbbbbb;
      z-index: 999;

      @unselected-color: #666666;

      .barItem {
        display: flex;
        flex-direction: column;
        align-items: center;

        .bar-icon {
          position: relative;

          svg {
            width: 24px;
            height: 24px;
            fill: @unselected-color;
          }

        }

        @icon-count-size: 6px;

        .tip-count {
          position: absolute;
          top: 0;
          left: 24px;
        }

        .barTitle {
          font-size: 12px;
          color: @unselected-color;
          line-height: 12px;
        }
      }

      .barItem-active {
        .barItem;

        .bar-icon {
          svg {
            fill: @primary-color;
          }
        }

        .barTitle {
          color: @primary-color;
        }
      }
    }
  }

</style>
