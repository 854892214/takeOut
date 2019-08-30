<template>
  <div id="add-order">
    <common-header :back-handler="back" title="确认订单"></common-header>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="pick-user-info" @click="changePickUserInfo()">
          <div class="left" v-if="JSON.stringify(pickUser) !== '{}'">
            <div>
              <span>收货人：</span>
              <span>{{pickUser.name}}</span>
            </div>
            <div>
              <span>联系电话：</span>
              <span>{{pickUser.mobile}}</span>
            </div>
            <div>
              <span>收货地址：</span>
              <span>{{pickUser.address}}</span>
            </div>
          </div>
          <div class="left" v-if="JSON.stringify(pickUser) === '{}'">
            <div>
              <span>请选择收货地址</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next"></use>
            </svg>
          </div>
        </div>
        <div class="order-info">
          <div class="goods-list">
            <div class="goods-item" v-for="(item,index) in shopCarList" @click="showDetails(item)">
              <div class="left">
                <div class="goods-logo">
                  <div v-if="item.photo !== undefined">
                    <div class="goods-img"
                         v-lazy:background-image="item.photo + '?x-oss-process=image/resize,w_180'"></div>
                  </div>

                  <div class="goods-img" v-if="item.photo === undefined">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-tupian"></use>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="top">
                  <div class="goods-name">{{item.name}}</div>
                </div>
                <div class="bottom">
                  <div class="goods-quantity">
                    数量：
                    <span class="cart-count">{{item.count}}</span>
                  </div>
                  <div class="goods-total-amount">$ {{appUtil.amountFormat(totalAmount(item))}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-statistics">
            <div>
              <span>商品金额：</span>
              <span>$ {{appUtil.amountFormat(goodsAll.amount)}}</span>
            </div>
            <div>
              <span>支付金额：</span>
              <span>$ {{appUtil.amountFormat(goodsAll.amount)}}</span>
            </div>
            <!--<div>-->
            <!--<span>姓名：</span>-->
            <!--<input type="text" v-model="uName" placeholder="请输入您的姓名"
@blur="appUtil.commonBlur()">-->
            <!--</div>-->
            <!--<div>-->
            <!--<span>电话：</span>-->
            <!--<input type="text" v-model="mobile" placeholder="请填写您的手机号"
@blur="appUtil.commonBlur()">-->
            <!--</div>-->
            <div>
              <span>备注：</span>
              <input type="text" v-model="remark" placeholder="选填，请告诉我们你的需求"
                     @blur="appUtil.commonBlur()">
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="to-pay">
      <div class="left">
        合计：$ {{appUtil.amountFormat(goodsAll.amount)}}
      </div>
      <div class="right"
           :class="isPaying ? 'disabled' : ''"
           @click="pay()">
        去支付
      </div>
    </div>
    <loading v-if="isLoading" type="inPage" height="calc(100vh - 44px)" top="44px"></loading>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
  import httpClient from '../http';
  import util from '../util';
  import Loading from "../components/Loading";
  import BScroll from 'better-scroll'

  export default {
    name: "AddOrder",
    components: {Loading, CommonHeader},
    data: function () {
      return {
        pickUser: this.$store.getters.selectedAddress === null ? {} : this.$store.getters.selectedAddress,
        discount: 0,
        remark: '',
        isLoading: false,
        buyNow: this.$store.getters.buyNow,
        buyOneGoods: this.$store.getters.buyOneGoods,
        isPaying: false,
        mobile:'',
        uName:''
      }
    },
    computed: {
      shopCarList: function () {
        if (this.buyNow) {
          return [
            this.buyOneGoods
          ]
        } else {
          return this.$store.getters.shopCartList;
        }
      },
      goodsAll: function () {
        let count = 0;
        let amount = 0;

        if (this.buyNow) {
          count = this.buyOneGoods.count;
          amount = util.amountMul(this.buyOneGoods.amount, this.buyOneGoods.count)
        } else {
          if (this.$store.getters.shopCartList !== null) {
            this.$store.getters.shopCartList.forEach(goods => {
              count += goods.count;
              amount = util.amountAdd(amount, util.amountMul(goods.amount, goods.count));
            });
          }
        }

        return {
          count: count,
          amount: util.amountHandle(amount),
        }
      },
    },
    methods: {
      totalAmount(goods) {
        return util.amountMul(goods.amount, goods.count);
      },
      back() {
        if (this.buyNow) {
          this.$router.replace({
            path: '/home/',
          })
        } else {
          this.$router.replace({
            path: '/home/shoppingCart',
            name: 'ShoppingCart'
          });
        }
      },
      showDetails(goods) {
        this.$router.replace({
          path: '/goodsDetail',
          name: 'GoodsDetail',
          params: {
            goodsInfo: goods
          },
          query: {
            name: goods.name,
            id: goods.id
          }
        })
      },
      changePickUserInfo() {
        this.$router.replace({
          path: '/addressList',
          name: 'AddressList',
          params: {
            from: "/addOrder",
          }
        })
      },
      pay() {
        if (this.isPaying) {
          return;
        }
        this.isPaying = true;
        this.isLoading = true;
        this.addOrder();
      },
      addOrder() {
        if (this.pickUser.mobile === undefined || this.pickUser.mobile === '') {
          this.isLoading = false;
          this.isPaying = false;
          this.$danMessageBox("请选择收货人信息");
          return
        }

        let goodList = [];
        this.shopCarList.forEach(item => {
          goodList.push({
            goods: {
              id: item.id
            },
            quantity: item.count,
            specificationInfoList: item.specItemList
          })
        });

        httpClient.addOrder(this.qs.stringify({
          store_id: this.$store.getters.storeId
        }), {
          goodsMicroMallOrderInfoSet: goodList,
          goodsMicroMallCustomer: {
            id: this.$store.getters.userInfo.id
          },
          goods_micro_mall_customer_name: this.pickUser.name,
          goods_micro_mall_customer_mobile: this.pickUser.mobile,
          goods_micro_mall_customer_address: this.pickUser.address,
          remark: this.remark,
        }).then(result => {
          if (result.data.result_code === "ok" && result.data.result_msg === "SUCCESS") {
            this.addPayOrder(result.data.goodsMicroMallOrder);
          } else {
            this.isPaying = false;
            this.isLoading = false;
            let message = "下单失败";
            if (result.data.result_msg === 'INSUFFICIENT_INVENTORY') {
              message += ",商品数量不对";
            }
            if (result.data.result_msg === 'SYSTEM_ERROR') {
              message += ",系统错误";
            }
            this.$danMessageBox(message + ".请联系我们");
          }
        });
      },
      addPayOrder(order) {
        // let storeShopCarList = this.$store.getters.shopCartList;
        // let orderShopCarList = this.shopCarList;
        // let residueShopCarList = [];
        //
        // storeShopCarList.forEach(storeItem => {
        //   let one = orderShopCarList.find(orderItem => orderItem.id === storeItem.id);
        //   if (one === undefined) {
        //     residueShopCarList.push(storeItem)
        //   }
        // });
        //
        // this.$store.commit("shopCartList", residueShopCarList);


        httpClient.addPayOrder(order.num).then(result => {
          if (result.data.result_code === "ok") {
            let paytype = '';

            if (process.env.NODE_ENV === "development") {
              // paytype = 'wechatpay';
              paytype = 'alipay';
            } else {
              if (this.appUtil.isWx()) {
                paytype = 'wechatpay';
              }
              if (this.appUtil.isAli()) {
                paytype = 'alipay';
              }
            }
            let params = this.qs.stringify({
              transaction_id: result.data.merchantOrder.transaction_id,
              pay_type: paytype,
              wx_openid: this.$store.getters.userId,
              alipay_user_id: this.$store.getters.userId,
            });
            httpClient.uniformPay(params).then(payResult => {
              if (payResult.data.result_code === "ok") {
                this.isLoading = false;
                if (this.appUtil.isWx()) {
                  this.wxPay(
                    payResult.data.appId,
                    payResult.data.timeStamp,
                    payResult.data.nonceStr,
                    payResult.data.wechatPackage,
                    payResult.data.signType,
                    payResult.data.paySign,
                    order);
                }
                if (this.appUtil.isAli()) {
                  this.aliPay(
                    payResult.data.trade_no,
                    result.data.merchantOrder.transaction_id,
                    order);
                }
              } else {
                this.isLoading = false;
                this.$danMessageBox("支付失败", () => {
                  this.$router.replace({
                    path: "/orderDetail",
                    name: "OrderDetail",
                    query: {
                      orderNum: order.num,
                      orderId: order.id,
                      tag: 1
                    }
                  });
                }, true);
              }

              if (this.$store.getters.buyNow) {

              } else {
                this.$store.commit("shopCartList", []);
              }
            });
          } else {
            this.isLoading = false;
            if (result.data.result_msg === "ORDER_PID") {
              this.$danMessageBox("订单已完成或已被取消");
            }
            if (result.data.result_msg === "SYSTEM_ERROR") {
              this.$danMessageBox("系统错误");
            }
          }
        });
      },
      wxPay(appId, timeStamp, nonceStr, wechatPackage, signType, paySign, order) {
        let that = this;

        function onBridgeReady() {
          WeixinJSBridge.invoke(
            "getBrandWCPayRequest", {
              appId: appId, //公众号名称，由商户传入
              timeStamp: timeStamp, //时间戳，自1970年以来的秒数
              nonceStr: nonceStr, //随机串
              package: wechatPackage,
              signType: signType, //微信签名方式：
              paySign: paySign //微信签名
            },
            function (res) {
              if (res.err_msg === "get_brand_wcpay_request:ok") {
                that.$router.replace({
                  path: "/orderDetail",
                  name: "OrderDetail",
                  query: {
                    orderNum: order.num,
                    orderId: order.id,
                    tag: 2
                  }
                });
              } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                that.$router.replace({
                  path: "/orderDetail",
                  name: "OrderDetail",
                  query: {
                    orderNum: order.num,
                    orderId: order.id,
                    tag: 1
                  }
                });
              } else {
                this.$danMessageBox("支付失败", () => {
                  that.$router.replace({
                    path: "/orderDetail",
                    name: "OrderDetail",
                    query: {
                      orderNum: order.num,
                      orderId: order.id,
                      tag: 1
                    }
                  });
                }, true)
              }
            }
          );
        }

        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
            document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      },
      aliPay(tradeNo, transactionId, order) {
        let that = this;

        function ready(callback) {
          if (window.AlipayJSBridge) {
            callback && callback();
          } else {
            document.addEventListener("AlipayJSBridgeReady", callback, false);
          }
        }

        ready(function () {
          AlipayJSBridge.call(
            "tradePay", {
              tradeNO: tradeNo
            },
            function (alipayResult) {
              that.isLoading = true;
              //查询订单
              httpClient.queryOrder(transactionId).then(queryResult => {
                if (queryResult.data.result_code === "ok" && queryResult.data.result_msg === "SUCCESS") {
                  //支付成功
                  if (queryResult.data.tradeState === "TRADE_SUCCESS") { //跳转到支付成功页面
                    that.$router.replace({
                      path: "/orderDetail",
                      name: "OrderDetail",
                      query: {
                        orderNum: order.num,
                        orderId: order.id,
                        tag: 2
                      }
                    });

                  } else if (queryResult.data.tradeState === "WAIT_BUYER_PAY") { //未支付
                    that.$router.replace({
                      path: "/orderDetail",
                      name: "OrderDetail",
                      query: {
                        orderNum: order.num,
                        orderId: order.id,
                        tag: 1
                      }
                    });
                  } else if (queryResult.data.tradeState === "CLOSED") { //交易关闭
                    this.$danMessageBox("当前订单已被关闭，请重新下单.", undefined, true)
                  } else if (queryResult.data.tradeState === "UNKNOWN") {
                    this.$danMessageBox("支付结果未知，请查看支付宝账单.", undefined, true)
                  }
                } else {
                  this.$danMessageBox("支付结果未知，请查看支付宝账单.", undefined, true)
                }
                that.isLoading = false;
              });
            }
          );
        });
      },
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        mouseWheel: true
      });
    },
    beforeRouteEnter: function (to, from, next) {
      if (to.params.userInfo === null || (to.params.userInfo !== undefined && to.params.userInfo.isLogin
        === false)) {
        next(vm => {
          httpClient.getUserDetail(vm.qs.stringify({
            storeId: vm.$store.getters.storeId,
            wxOpenId: vm.$store.getters.userId,
          })).then(result => {
            if (result.data.result_code === "ok") {
            } else {
              if (result.data.result_msg === "NOT_FOUND") {
                vm.$router.replace({
                  path: '/register',
                  query: {
                    registerTip: true
                  }
                });
              }
            }
          })
        });
      } else {
        next();
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #add-order {

    .wrapper {
      height: @primary-content-height;
      overflow: hidden;
    }

    .content {
      .pick-user-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: @space-width;
        background-color: @primary-color;
        color: white;

        font-size: 0.9rem;

        .left {
          width: calc(100% - 24px);

          div {
            margin: 5px 0;
          }
        }

        .right {
          width: 24px;

          svg {
            width: 24px;
            height: 24px;
            fill: white;
          }
        }
      }

      .order-info {
        padding: @space-width;

        .goods-list {
          border-radius: 4px;
          background-color: white;

          @img-size: 40px;

          .goods-item {
            height: calc(@img-size + @space-width * 2);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: @space-width;

            .left {
              width: @img-size;
              height: @img-size;
              background-color: gainsboro;

              .goods-logo {
                width: @img-size;

                .goods-img {
                  width: @img-size;
                  height: @img-size;
                  background: no-repeat center center;
                  background-size: cover;
                  border-radius: 3px;

                  svg {
                    width: @img-size;
                    height: @img-size;
                    fill: gray;
                  }
                }
              }
            }

            .right {
              width: calc(100% - @img-size);
              height: @img-size;
              margin-left: @space-width;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-size: 0.8rem;

              div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 20px;
              }
            }
          }
        }

        .order-statistics {
          margin-top: @space-width;
          background-color: white;
          font-size: 1rem;
          border-radius: 4px;

          div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 6px @space-width;

            input {
              width: 192px;
              margin: 0;
              border: 0;
              height: 32px;
              padding: 0;
              font-size: 1rem;
              text-align-last: right;
              text-align: right;
            }
          }
        }
      }
    }

    .to-pay {
      height: @common-navigation-bar-height;
      display: flex;
      flex-direction: row;
      align-items: center;

      @button-width: 98px;

      .left {
        width: calc(100vw - @button-width);
        height: 50px;
        background-color: white;
        .common-column-center;
        padding-left: @space-width;
      }

      .right {
        width: @button-width;
        height: 50px;
        background-color: @primary-color;
        color: white;

        .common-center;
      }

      .disabled {
        background-color: @primary-disable-color;
        color: @primary-disable-light-color;
      }
    }
  }

</style>
