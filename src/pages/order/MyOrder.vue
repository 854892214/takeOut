<template>
  <div id="my-order">
    <common-header :back-handler="back" title="我的订单"></common-header>
    <div class="order-status-nav">
      <div :class="currentNavIndex === index ? 'order-status-nav-item-active' : 'order-status-nav-item'"
           @click="changeNav(index)"
           v-for="(item,index) in navList">
        <span>{{item.title}}</span>
        <!--<span class="count" v-if="index === 1 && orderInfo.noPayOrderCount > 0">-->
          <!--<number-count :count="orderInfo.noPayOrderCount"></number-count>-->
        <!--</span>-->
        <!--<span class="count" v-if="index === 2 && orderInfo.handlingOrderCount > 0">-->
          <!--<number-count :count="orderInfo.handlingOrderCount"></number-count>-->
        <!--</span>-->
      </div>
    </div>
    <div class="content">
      <div class="null-list" v-if="orderList.length<=0">
        <div class="box">
          <div class="null-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingdan"></use>
            </svg>
          </div>
          <div class="null-description">
            订单是空的
          </div>
        </div>
      </div>
      <OrderList ref="orderList" v-show="orderList.length>0"
                 @refreshList="refreshList" @loadMoreList="loadMoreList"
                 :list="orderList" :tag="currentNavIndex"></OrderList>
    </div>
    <loading v-if="isLoading" :type="loadingType" height="calc(100vh - 92px)" top="92px"></loading>
  </div>
</template>

<script>
  import OrderList from "./OrderList";
  import CommonHeader from "../../components/CommonHeader";
  import httpClient from '../../http';
  import Loading from "../../components/Loading";
  import NumberCount from "../../components/NumberCount";

  export default {
    name: "MyOrder",
    components: {NumberCount, Loading, CommonHeader, OrderList},
    data: function () {
      return {
        navList: [
          {
            title: '全部订单',
            pageIndex: 0,
            tmpList: [],
            allLoaded: false
          },
          {
            title: '待支付',
            pageIndex: 0,
            tmpList: [],
            allLoaded: false
          },
          // {
          //   title: '处理中',
          //   pageIndex: 0,
          //   tmpList: [],
          //   allLoaded: false
          // },
          {
            title: '已完成',
            pageIndex: 0,
            tmpList: [],
            allLoaded: false
          },
        ],
        currentNavIndex: 0,
        orderList: [],
        isLoading: false,
        loadingType: 'page'
      }
    },
    created() {
      if (this.$route.params.tag === undefined) {

      } else {
        this.currentNavIndex = this.$route.params.tag;
      }
      this.getOrderList("refresh");
    },
    computed: {
      orderInfo: function () {
        let orderInfo = this.$store.getters.orderInfo;
        if (orderInfo === null) {
          return {
            noPayOrderCount: 0,
            handlingOrderCount: 0,
          }
        } else {
          return orderInfo
        }
      }
    },
    methods: {
      back() {
        this.$router.replace({
          path: '/home/my'
        })
      },
      changeNav(navListIndex) {
        let oldIndex = this.currentNavIndex;
        this.navList[oldIndex].tmpList = this.orderList;
        this.currentNavIndex = navListIndex;
        let newList = this.navList[navListIndex].tmpList;
        if (newList.length <= 0) {
          this.getOrderList("refresh");
        } else {
          this.orderList = newList;
          this.allLoaded(this.navList[navListIndex].allLoaded)
        }
      },
      // 刷新
      refreshList() {
        this.loadingType = "inPage";
        this.getOrderList("refresh");
        this.$refs.orderList.refreshOver();
      },
      // 加载更多
      loadMoreList() {
        this.loadingType = "inPage";
        this.getOrderList("loadMore");
        this.$refs.orderList.loadOver();
      },
      allLoaded(bool) {
        this.$refs.orderList.allLoaded(bool);
      },
      //获取订单列表
      getOrderList(loadType) {
        this.isLoading = true;
        let statusList;
        switch (this.currentNavIndex) {
          case 0:
            statusList = [0, 1, 2, 4];
            break;
          case 1:
            statusList = [0];
            break;
          case 2:
            statusList = [1, 2, 4];
            break;
        }

        if (loadType === "refresh") {
          // this.orderList = [];
          this.navList[this.currentNavIndex].pageIndex = 0;
        } else if (loadType === "loadMore") {
          this.navList[this.currentNavIndex].pageIndex += 1;
        }

        let _this = this;

        httpClient.getOrderList(this.qs.stringify({
          pageid: this.navList[this.currentNavIndex].pageIndex,
          store_id: this.$store.getters.storeId
        }), {
          "type": 4,
          "statusList": statusList,
          "store_scan_goods_user_id": this.$store.getters.storeScanGoodsUser.id
        }).then(result => {
          let list = result.data.goodsOrderPage.content;
          let goodsCount = 0;
          for (let row of list) {
            for (let item of row.goodsOrderInfoList) {
              if (item.type === 0) {
                goodsCount = item.quantity - item.reduced_quantity;
              }
            }
            row.goodsCount = goodsCount;
            if (row.paystatus == 0) {
              if (row.is_tip == "TRUE") {
                row.amount += row.tip
              }
              if (row.integral_deduction_amount >= 0) {
                row.amount -= row.integral_deduction_amount
              }
            }
          }

          if (loadType === "loadMore") {
            _this.orderList = _this.orderList.concat(list);
          } else {
            _this.orderList = list;
          }
          this.navList[this.currentNavIndex].tmpList = _this.orderList;
          this.navList[this.currentNavIndex].allLoaded = result.data.goodsOrderPage.lastPage;
          if (result.data.goodsOrderPage.lastPage === true) {
            _this.allLoaded(true);
          } else {
            _this.allLoaded(false);
          }

          this.isLoading = false;
        })
      },
    },
    beforeRouteEnter: function (to, from, next) {
      // if (to.params.userInfo === null || (to.params.userInfo !== undefined && to.params.userInfo.isLogin === false)) {
      //   next(vm => {
      //     httpClient.getUserDetail(vm.qs.stringify({
      //       storeId: vm.$store.getters.storeId,
      //       wxOpenId: vm.$store.getters.userId,
      //     })).then(result => {
      //       if (result.data.result_code === "ok") {
      //       } else {
      //         if (result.data.result_msg === "NOT_FOUND") {
      //           vm.$router.replace({
      //             path: '/register',
      //             query: {
      //               registerTip: true
      //             }
      //           });
      //         }
      //       }
      //     })
      //   });
      // } else {
      //   next();
      // }
      next(vm=>{
        if (vm.$store.getters.isStoreUser == "FALSE") {
          vm.$router.replace("register");
        }
      })

    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/common";

  #my-order {

    .order-status-nav {
      height: @common-header-height;
      z-index: 999;
      position: absolute;
      display: flex;
      flex-direction: row;
      background-color: white;
      border-top: 1px solid @primary-disable-light-color;
      box-shadow: 0 2px 2px @primary-disable-light-color;

      .order-status-nav-item {
        width: 33.33vw;
        height: @common-header-height;
        border-bottom: 2px solid white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 1rem;

        .count {
          position: relative;
          top: -8px;
          right: 0;
        }
      }

      .order-status-nav-item-active {
        .order-status-nav-item;
        border-bottom: 2px solid @primary-color;
      }
    }

    .content {
      height: calc(100vh - @common-header-height * 2);
      margin-top: 44px;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      .null-list {
        .common-center;
        height: 38vh;
        width: 100%;

        .box {
          display: flex;
          flex-direction: column;
          align-items: center;

          .null-icon {
            width: 6rem;
            height: 6rem;
            background-color: @primary-light-color;
            border-radius: 50%;
            .common-center;

            svg {
              width: 4rem;
              height: 4rem;
              fill: @primary-color;
            }
          }

          .null-description {
            margin-top: @space-width;
            font-size: 1rem;
            color: gray;
          }
        }


      }
    }
  }
</style>
