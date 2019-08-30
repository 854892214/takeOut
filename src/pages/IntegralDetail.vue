<template>
  <div>
    <common-header :back-handler="back" title="积分明细"></common-header>
    <!--    <div class="wrapper" ref="wrapper">-->
    <!--      <div class="integral-consume-list">-->
    <!--        <div class="integral-item" v-for="item in integralDetails">-->
    <!--          <div class="integral-consume" v-if="item.type === 0">-->
    <!--            <span>积分消费</span>-->
    <!--            <span>-{{item.change_integral}}</span>-->
    <!--          </div>-->
    <!--          <div class="integral-get" v-if="item.type === 1">-->
    <!--            <span>积分入账</span>-->
    <!--            <span>+{{item.change_integral}}</span>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <span>{{item.createtime}}</span>-->
    <!--            <span>积分余额:{{item.after_integral}}</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="content">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom"
                   :bottom-all-loaded="isAllLoaded"
                   :auto-fill="false" :bottomDistance="50"
                   ref="loadMore">
        <div class="integral-consume-list">
          <div class="integral-item" v-for="item in integralDetails">
            <div class="integral-consume" v-if="item.type === 0">
              <span>积分消费</span>
              <span>-{{item.change_integral}}</span>
            </div>
            <div class="integral-get" v-if="item.type === 1">
              <span>积分入账</span>
              <span>+{{item.change_integral}}</span>
            </div>
            <div>
              <span>{{item.createtime}}</span>
              <span>积分余额:{{item.after_integral}}</span>
            </div>
          </div>
        </div>
      </mt-loadmore>
    </div>

    <loading v-if="isLoading" :type="loadingType" height="calc(100vh - 44px)" top="44px"></loading>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
  import BScroll from 'better-scroll'
  import httpClient from '../http'

  export default {
    name: "IntegralDetail",
    components: {
      CommonHeader
    },
    data() {
      return {
        isLoading: false,
        loadingType: 'page',
        integralDetails: [],
        page: {},
        pageIndex: 1,
        isAllLoaded: false
      }
    },
    methods: {
      back() {
        this.$router.replace('home/my')
      },
      getListData(type) {
        let mobile =
          httpClient.getIntegralDetailList(this.qs.stringify({
            phoneNumber: this.$store.getters.storeScanGoodsUser.phone,
            storeId: this.$store.getters.storeId,
            pageIndex: this.pageIndex
          })).then(result => {
            if (result.data.result_code === "ok") {
              let list = result.data.integralDetails.content;
              this.page = result.data.integralDetails;
              this.isAllLoaded = this.page.lastPage;

              if (type === 'loadMore') {
                this.$refs.loadMore.onBottomLoaded();
                this.integralDetails = this.integralDetails.concat(list);
              } else {
                if (type === 'refresh') {
                  this.$refs.loadMore.onTopLoaded();
                }
                this.integralDetails = list;
              }
            }
          });
      },
      //刷新
      loadTop() {
        this.loadingType = "inPage";
        this.pageIndex = 1;
        this.getListData("refresh");
      },
      //加载
      loadBottom: function () {
        this.loadingType = "inPage";
        this.pageIndex++;
        this.getListData("loadMore");
      },
    },
    created() {
      this.getListData();
    },
    mounted() {
      // this.scroll = new BScroll(this.$refs.wrapper, {
      //   click: true,
      //   tap: true,
      //   bounce: false,
      //   mouseWheel: true
      // });
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .wrapper {

  }

  .content {
    height: calc(100vh - @common-header-height);
    overflow: scroll;

    .integral-consume-list {
      background-color: white;
      padding: 0 @space-width;

      .integral-item {
        border-bottom: 1px solid #c0c0c0;

        div {
          display: flex;
          justify-content: space-between;
          padding: @space-width 0;

          > :nth-child(2) {
            color: #aaa9a9;
          }
        }

        .integral-consume {
          > :nth-child(2) {
            color: red;
          }
        }

        .integral-get {
          > :nth-child(2) {
            color: dodgerblue;
          }
        }
      }

      > :last-child {
        border-bottom: 0;
      }
    }
  }

</style>
