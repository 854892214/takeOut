<template>
  <div id="merchant-info">
    <common-header :back-handler="back" title="联系商家"></common-header>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="merchant-logo">
          <div class="box">
            <div class="info">
              <div class="line">
                <span>店铺名称：{{merchantInfo.name}}</span>
              </div>
              <div class="line">
                <span>联系电话：{{merchantInfo.phone}}</span>
                <copy-button :copy-content="merchantInfo.phone" style="fill: white"></copy-button>
              </div>
              <div class="line">
                <span>店铺地址：{{merchantInfo.showAddress}}</span>
                <copy-button :copy-content="merchantInfo.address" style="fill: white"></copy-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
  import BScroll from 'better-scroll'
  import CopyButton from "../components/CopyButton";

  export default {
    name: "MerchantInfo",
    components: {CopyButton, CommonHeader},
    computed: {
      merchantInfo: function () {
        let address = this.$store.getters.storeAddress;
        let showAddress;
        if (address.length>18){
          showAddress = address.substring(0,18)+"...";
        } else {
          showAddress = address;
        }
        return {
          name: this.$store.getters.storeName,
          phone: this.$store.getters.storeMobile,
          address: address,
          showAddress: showAddress,
        };
      }
    },
    methods: {
      back() {
        this.$router.replace({
          path: '/home/my',
          name: 'My'
        })
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        mouseWheel: true
      });
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #merchant-info {

    .wrapper {
      height: calc(100vh - @common-header-height - 20px);

      .content {
        .merchant-logo {
          width: 100%;
          height: 240px;
          background-color: #6785cf;
          .common-center;

          .box {
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background-color: @primary-disable-light-color;
            }

            .info {
              padding: 0 @space-width;

              .line {
                color: white;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin-top: @space-width;
                text-align: center;

                span {
                  width: 100%;
                  text-align: left;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
