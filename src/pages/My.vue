<template>
  <div class="wrapper" ref="wrapper">
    <div class="my">
      <div class="logo-box">
        <div class="center" v-if="!isStoreUser" @click="binding()">
          <div class="logo">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wode"></use>
            </svg>
          </div>
          <span>点击绑定</span>
        </div>
        <div class="center" v-if="isStoreUser">
          <div class="logo">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-system-fi-user"></use>
            </svg>
          </div>
          <span v-text="userInfo.phone"></span>
        </div>
      </div>

      <div class="order-info">
        <div class="my-order" @click="toOrderHistory()">
          <div class="left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingdan"></use>
            </svg>
            <span>我的订单</span>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-jinrujiantou"></use>
            </svg>
          </div>
        </div>
        <div class="common-line"></div>
        <div class="order-status">
          <div class="order-status-item" @click="toOrderHistory(1)">
            <!--<number-count :count="numberCount.noPayOrderCount" class="count"></number-count>-->
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dingdandaifukuan"></use>
            </svg>
            <span>待支付</span>
          </div>
          <div class="order-status-item" @click="toOrderHistory(2)">
            <!--<number-count v-if="numberCount.handlingOrderCount>0" :count="numberCount.hasBeenCompleted" class="count"></number-count>-->
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhifu"></use>
            </svg>
            <span>已完成</span>
          </div>
        </div>
      </div>
      <div>
        <div style="min-height: calc(100vh - 30vh - 180px);">
          <div class="setting">
            <div class="setting-item" @click="toAddressList()">
              <div class="left">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dingweixiao"></use>
                </svg>
                <span>地址管理</span>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinrujiantou"></use>
                </svg>
              </div>
            </div>
            <div class="common-line"></div>
            <div class="setting-item" @click="contactMerchant()">
              <div class="left">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-kefu"></use>
                </svg>
                <span>联系商家</span>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinrujiantou"></use>
                </svg>
              </div>
            </div>
            <div class="common-line"></div>
            <div class="setting-item" @click="toIntegral()">
              <div class="left">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jifenmingxi"></use>
                </svg>
                <span>积分明细</span>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jinrujiantou"></use>
                </svg>
              </div>
            </div>

          </div>
        </div>
        <div class="provider">由Hante Pay提供技术支持</div>
      </div>
    </div>
  </div>

</template>

<script>
  import httpClient from '../http'
  import BScroll from 'better-scroll'
  import NumberCount from "../components/NumberCount";

  export default {
    name: "My",
    components: {NumberCount},
    data: function () {
      return {
        isStoreUser: false,
        userInfo: {},
      }
    },
    computed: {},
    methods: {
      toIntegral() {
        this.$router.replace("/IntegralDetail")
      },
      toOrderHistory(tag) {
        this.$router.replace({
          path: '/myOrder',
          name: 'MyOrder',
          params: {
            tag: tag,
            userInfo: this.$store.getters.userInfo
          }
        })
      },
      toAddressList() {
        this.$router.replace({
          path: '/addressList',
          name: 'AddressList',
          params: {
            userInfo: this.$store.getters.userInfo
          }
        })
      },
      contactMerchant() {
        this.$router.replace({
          path: '/merchantInfo',
          name: 'MerchantInfo'
        });
      },
      aboutUs() {
        this.$router.replace({
          path: '/aboutUs',
          name: 'AboutUs'
        });
      },
      binding() {
        this.$router.replace({
          path: '/register'
        })
      },
      register() {
        this.$router.replace({
          path: '/register'
        })
      },
    },
    created() {
      this.isStoreUser = this.$store.getters.isStoreUser === "TRUE" ? true : false;
      this.userInfo = this.$store.getters.storeScanGoodsUser
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        bounce: false,
        mouseWheel: true
      });
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .wrapper {
    height: calc(100vh - @common-navigation-bar-height);
    overflow: hidden;
  }

  .my {
    .logo-box {
      height: 30vh;
      background-color: @primary-color;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      @box-size: 100px;
      @logo-size: 80px;

      .center {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: @logo-size;
          height: @logo-size;
          border-radius: 50%;
          background-color: white;
        }

        .logo {
          border-radius: 50%;
          background-color: #f5f5f5;
          display: flex;

          svg {
            padding: 10px;
            width: @logo-size;
            height: @logo-size;
          }
        }

        span {
          color: white;
          margin-top: 8px;
        }
      }

      .register {
        position: absolute;
        top: @space-width;
        right: @space-width;
        padding: 4px 10px;
        font-size: 1rem;
        color: @primary-color;
        background-color: white;
        border-radius: 1rem;
      }
    }

    .order-info {
      display: flex;
      flex-direction: column;
      padding: 4px 12px;
      font-size: 1rem;
      background-color: white;
      margin-bottom: 8px;

      .my-order {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;

        svg {
          width: 1rem;
          height: 1rem;
        }

        .left {
          display: flex;
          flex-direction: row;
          align-items: center;

          span {
            margin: 0 0 0 10px;
          }
        }

        .right {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }

      .order-status {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        margin: 8px 0;

        .order-status-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;

          svg {
            width: 2.2rem;
            height: 3rem;
          }

          .count {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }

    .setting {
      display: flex;
      flex-direction: column;
      padding: 4px 12px;
      font-size: 1rem;
      background-color: white;
      margin-bottom: 8px;

      .setting-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;

        svg {
          width: 1rem;
          height: 1rem;
        }

        .left {
          display: flex;
          flex-direction: row;
          align-items: center;

          span {
            margin: 0 0 0 10px;
          }
        }

        .right {
          .common-column-center;
        }
      }
    }

    .provider {
      text-align: center;
      font-size: 0.8rem;
      color: #a9a9a9;
    }
  }
</style>
