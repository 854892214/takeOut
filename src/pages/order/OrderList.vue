<template>
  <div id="order-list" v-if="list.length>0">
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom"
                 :bottom-all-loaded="isAllLoaded"
                 :auto-fill="false" :bottomDistance="50"
                 ref="loadMore">
      <div class="order-all">
        <div class="order-item"
             v-for="(item,index) in list"
             @click="toOrderDetail(item)">
          <div class="top">
            <span v-text="payStatus(item.paystatus)" :style="payStatusStyle(item.paystatus)"></span>
            <span v-text="zoneTime(item.createtime)"></span>
          </div>
          <div class="common-line"></div>
          <div class="content">
            <div class="goods-list">
              <div class="goods-item" v-for="(goodsItem,goodsIndex) in item.goodsOrderInfoList.slice(0,3)">
                <span>{{goodsItem.name}}</span>
                <span>x {{goodsItem.quantity}}</span>
              </div>
            </div>
            <div class="order-statistics">
              <div class="left">
                <div v-if="item.goodsOrderInfoList.length > 3">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-gengduo"></use>
                  </svg>
                </div>
              </div>
              <div class="right">
                <span>共{{goodsSizeCount(item.goodsOrderInfoList)}}件,</span>
                <!--<span>共999件,</span>-->
                <div>
                  <span>订单金额 </span>
                  <span style="font-size: 1.2rem;color: #ED5B5B;">${{appUtil.amountFormat(item.amount)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
  export default {
    name: "OrderList",
    props: {
      list: Array,
      tag: Number,
    },
    data() {
      return {
        isAllLoaded: false,
      }
    },
    computed: {},
    methods: {
      goodsSizeCount(goodsInfoSet) {
        let count = 0;
        goodsInfoSet.forEach(item => {
          count += item.quantity;
        });
        return count;
      },
      payStatus: function (paystatus) {
        switch (paystatus) {
          case 0:
            return '待支付';
          case 1:
            return '已完成';
          case 2:
            return '已完成';
          case 4:
            return '已完成';
        }
      },
      payStatusStyle: function (paystatus) {
        switch (paystatus) {
          case 0:
            return 'color:white; padding: 4px 8px; background-color:#a9a9a9; border-radius: 3px;';
          case 1:
            return 'color:white; padding: 4px 8px; background-color:green; border-radius: 3px;';
          case 2:
            return 'color:white; padding: 4px 8px; background-color:#ED5B5B; border-radius: 3px;';
          case 4:
            return 'color:white; padding: 4px 8px; background-color:red; border-radius: 3px;';
        }
      },
      zoneTime: function (dbTime) {
        if (dbTime !== undefined) {
          return this.appUtil.toTimeZone(dbTime, 'UTC', this.$store.getters.timeZone);
        } else {
          return '';
        }
      },
      toOrderDetail(order) {
        this.$router.replace({
          path: "/orderDetail",
          name: "OrderDetail",
          query: {
            orderNum: order.num,
            orderId: order.id,
            tag: this.tag,
            from:"fromOrderList"
          }
        });
      },
      //刷新
      loadTop() {
        this.$emit('refreshList');
      },
      //加载
      loadBottom: function () {
        this.$emit('loadMoreList')
      },
      refreshOver() {
        this.$refs.loadMore.onTopLoaded();
      },
      loadOver() {
        this.$refs.loadMore.onBottomLoaded();
      },
      allLoaded(bool) {
        this.isAllLoaded = bool;
      },
    },
    mounted(){

    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/common";

  #order-list {

    .order-all {
      min-height: calc(100vh - 88px);
    }

    .order-item {
      margin: @space-width;
      padding: @space-width;
      background-color: white;
      box-shadow: 0 0 2px #dddddd;
      border-radius: 4px;
      font-size: 1rem;

      .top {
        padding: 8px 0;

        > :nth-child(1) {

        }

        > :nth-child(2) {
          font-size: 0.8rem;
          margin-left: @space-width;
        }
      }

      .content {
        .goods-list {
          padding: 8px 0;

          .goods-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 24px;
            font-size: 0.8rem;
          }
        }

        .order-statistics {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-size: 0.8rem;

          .left {
            svg {
              width: 18px;
              height: 18px;
            }
          }

          .right {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
          }
        }
      }

      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: @space-width;

        .operation {
          padding: 4px 8px;
          font-size: 1rem;
          border: 1px solid #dddddd;
          border-radius: 3px;
        }
      }
    }
  }
</style>
