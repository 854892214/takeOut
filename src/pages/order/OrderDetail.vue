<template>
  <div id="order-detail">
    <common-header :back-handler="back" title="订单详情"></common-header>

    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="top">
          <div class="title">
            <div>${{appUtil.amountFormat(orderInfoProcess.payAmount)}}</div>
            <div v-if="orderInfo.paystatus === 2">({{payStatus(orderInfo.paystatus)}} - ${{appUtil.amountFormat(refund_amount)}})</div>
          </div>
          <div class="common-line"></div>
          <div class="goods-list">
            <table>
              <tr>
                <td>菜名</td>
                <td>份数</td>
                <td>价格</td>
              </tr>
              <tr v-for="(goodsItem,goodsIndex) in orderInfo.goodsOrderInfoList">
                <td>
                  {{goodsItem.name}}
                  <div style="font-size: 0.6rem;">
                    <span v-for="(spec,index) in goodsItem.specificationInfoList">
                      <span style="background-color: #ED5B5B; color: white;border-radius: 3px;padding: 0 2px;margin-right: 2px">{{spec.name}}</span>
                    </span>
                  </div>
                </td>
                <td>x{{goodsItem.quantity}}</td>
                <td class="amount">${{appUtil.amountFormat(goodsItem.amount)}}</td>
              </tr>
            </table>
          </div>
          <div class="common-line"></div>
          <div class="order-statistics">
            <div class="statistic-item">
              <span>小计</span>
              <span>${{appUtil.amountFormat(orderInfo.goods_total_amount)}}</span>
            </div>
            <div class="statistic-item" v-if="orderInfo.discount_amount !== undefined && orderInfo.discount_amount > 0">
              <span>折扣金额({{orderInfo.discount*10}}折)</span>
              <span>-${{appUtil.amountFormat(orderInfo.discount_amount)}}</span>
            </div>
            <div class="statistic-item" v-if="orderInfo.is_tax === 'TRUE'">
              <span>税费</span>
              <span>${{appUtil.amountFormat(orderInfo.tax)}}</span>
            </div>
            <div class="statistic-item" v-if="orderInfo.is_tip === 'TRUE'">
              <span>小费</span>
              <span>${{appUtil.amountFormat(orderInfo.tip)}}</span>
            </div>
            <div class="statistic-item" v-if="orderInfo.shipping_fee !== undefined && orderInfo.shipping_fee > 0">
              <span>配送费</span>
              <span>${{appUtil.amountFormat(orderInfo.shipping_fee)}}</span>
            </div>
            <div class="statistic-item"
                 v-if="orderInfo.integral_deduction_amount !== undefined && orderInfo.integral_deduction_amount > 0">
              <span>积分抵扣金额</span>
              <span>-${{appUtil.amountFormat(orderInfo.integral_deduction_amount)}}</span>
            </div>
            <div class="common-line"></div>
            <div class="statistic-item right">
              <span>合计：</span>
              <span class="amount">${{appUtil.amountFormat(orderInfoProcess.payAmount)}}</span>
            </div>
          </div>
        </div>
        <div class="order-info">
          <div class="info-item">
            <span>订单号</span>
            <span>
              {{orderInfo.num}}
              <copy-button :copy-content="orderInfo.num"></copy-button>
            </span>
          </div>
          <div class="info-item">
            <span>下单时间</span>
            <span v-text="zoneTime(orderInfo.createtime)"></span>
          </div>
          <div v-if="[1,2,4].find(item => item === orderInfo.paystatus) !== undefined">
            <div class="info-item">
              <span>支付时间</span>
              <span v-text="zoneTime(orderInfo.paytime)"></span>
            </div>
            <div class="info-item">
              <span>支付方式</span>
              <span>{{appUtil.paymentMethodHandler(orderInfo.payment_method)}}</span>
            </div>
          </div>
          <div class="info-item">
            <span>客户姓名</span>
            <span v-text="orderInfo.customer_name"></span>
          </div>
          <div class="info-item">
            <span>客户电话</span>
            <span v-text="orderInfo.customer_mobile"></span>
          </div>
          <div class="info-item">
            <span>自提时间</span>
            <span v-text="orderInfoProcess.tackOutTime"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="operation" v-if="orderInfo.paystatus === 0"
           @click="toPay()"
           style="color: white;background-color: #ED5B5B;">
        去付款
      </div>
      <div class="operation" v-if="orderInfo.paystatus === 0"
           @click="cancelOrder(orderInfo.id)"
           style="color: white;background-color: #a9a9a9;">
        取消订单
      </div>
      <div class="operation" v-if="orderInfo.paystatus !== 0"
           @click="showReceiptBox = true"
           style="color: white;background-color: #5da5ed;">
        查看收据
      </div>
      <div class="operation" @click="contactMerchant()" style="color: white;background-color: rgb(109, 161, 177);">
        联系商家
      </div>
    </div>

    <loading v-if="isLoading" :type="loadingType" height="calc(100vh - 44px)" top="44px"></loading>

    <div class="message-box">
      <receipt-box v-if="showReceiptBox" @close="showReceiptBox = false">
        <div class="receipt-content">
          <p class="receipt-title">选择收据</p>
          <div class="receipt-box">
            <div class="receipt-item" @click="chooseReceipt('NO')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wu"></use>
              </svg>
              <div class="receipt-desc">无收据</div>
            </div>
            <div class="receipt-item" @click="chooseReceipt('PAPER')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shouju"></use>
              </svg>
              <div class="receipt-desc">纸质收据</div>
            </div>
            <div class="receipt-item" @click="chooseReceipt('EMAIL')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-youjian"></use>
              </svg>
              <div class="receipt-desc">邮件</div>
            </div>
            <div class="receipt-item" @click="chooseReceipt('TEXT')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shouji"></use>
              </svg>
              <div class="receipt-desc">发送文本</div>
            </div>
          </div>
        </div>
      </receipt-box>
      <dan-message-box v-if="showEmailReceiptBox"
                       :okProp="sendEmailReceipt"
                       display-type="hidden" @close="showEmailReceiptBox = false">
        <div class="receipt-detail-content">
          <div class="receipt-message">请输入您的邮箱</div>
          <div class="receipt-input">
            <input type="email" v-model="receipt.email"
                   placeholder="请填写您的邮箱">
            <div class="error-message" v-if="!appUtil.isEmpty(receiptErrorMessage)">{{receiptErrorMessage}}</div>
          </div>
        </div>
      </dan-message-box>
      <dan-message-box v-if="showPhoneReceiptBox"
                       :okProp="sendPhoneReceipt"
                       display-type="hidden" @close="showPhoneReceiptBox = false">
        <div class="receipt-detail-content">
          <div class="receipt-message">请输入您的电话({{taskEndTime}})</div>
          <div class="receipt-input">
            <select class="select-wrapper" v-model="receipt.countryCode">
              <option value="1" selected>+1</option>
              <option value="86">+86</option>
            </select>
            <input type="number" v-model="receipt.phone"
                   placeholder="请填写您的手机号">
            <div class="error-message" v-if="!appUtil.isEmpty(receiptErrorMessage)">{{receiptErrorMessage}}</div>
          </div>
        </div>
      </dan-message-box>
    </div>

  </div>
</template>

<script>
  import CommonHeader from "../../components/CommonHeader";
  import httpClient from '../../http'
  import Loading from "../../components/Loading";
  import BScroll from 'better-scroll'
  import CopyButton from "../../components/CopyButton";
  import ReceiptBox from "../../components/ReceiptBox";
  import DanMessageBox from "../../components/DanMessageBox";
  import {MessageBox, Indicator, Toast} from "mint-ui";
  export default {
    name: "OrderDetail",
    components: {DanMessageBox, ReceiptBox, CopyButton, Loading, CommonHeader},
    data: function () {
      return {
        orderInfo: {},
        isLoading: false,
        loadingType: 'page',
        showReceiptBox: false,
        showEmailReceiptBox: false,
        showPhoneReceiptBox: false,
        receipt: {
          countryCode: 1,
          phone: '',
          email: ''
        },
        receiptErrorMessage: '',
        taskEndTime: 180,
        integral: 0,
      }
    },
    watch: {
      showReceiptBox(newVal, oldVal){
        if (newVal){
          this.receiptErrorMessage = ''
        }
      },
      showEmailReceiptBox(newVal, oldVal){
        if (newVal){
          this.receiptErrorMessage = ''
        }
      },
      showPhoneReceiptBox(newVal, oldVal){
        if (newVal){
          this.receiptErrorMessage = ''
        }
      }
    },
    computed: {
      orderInfoProcess: function () {
        let goodsAmount = 0;
        let goodsOrderInfoList = this.orderInfo.goodsOrderInfoList;
        if (goodsOrderInfoList !== undefined && goodsOrderInfoList.length > 0) {
          goodsOrderInfoList.forEach(goods => {
            goodsAmount = this.appUtil.amountAdd(goodsAmount, goods.amount)
          })
        }

        let payAmount = 0;
        payAmount = this.appUtil.amountAdd(payAmount, this.orderInfo.goods_total_amount);
        if (this.orderInfo.discount_amount !== undefined) {
          payAmount = this.appUtil.amountSub(payAmount, this.orderInfo.discount_amount);
        }
        if (this.orderInfo.is_tax === "TRUE") {
          payAmount = this.appUtil.amountAdd(payAmount, this.orderInfo.tax);
        }
        if (this.orderInfo.is_tip === "TRUE") {
          payAmount = this.appUtil.amountAdd(payAmount, this.orderInfo.tip);
        }
        if (this.orderInfo.integral_deduction_amount !== undefined) {
          payAmount = this.appUtil.amountSub(payAmount, this.orderInfo.integral_deduction_amount);
        }
        if (this.orderInfo.shipping_fee !== undefined) {
          payAmount = this.appUtil.amountAdd(payAmount, this.orderInfo.shipping_fee);
        }

        return {
          goodsAmount: goodsAmount,
          payAmount: payAmount,
          tackOutTime: this.tackOutTimeProcess()
        }
      },
      orderTime:function () {
        return this.appUtil.toTimeZone(this.orderInfo.createtime,'UTC',this.$store.getters.timeZone)
      }
    },
    methods: {
      back() {
        this.$router.replace({
          path: '/myOrder',
          name: 'MyOrder',
          params: {
            tag: parseInt(this.$route.query.tag),
          }
        })
      },
      tackOutTimeProcess() {
        let utcTackOutDateTimeStr = this.orderInfo.tack_out_time;
        if (this.appUtil.isEmpty(utcTackOutDateTimeStr)) {
          return "";
        }
        let tackOutDateTime = this.moment(this.zoneTime(utcTackOutDateTimeStr));

        let tackOutDateStr = tackOutDateTime.format("YYYY-MM-DD");
        let tackOutTimeStr = tackOutDateTime.format("HH:mm:ss");

        console.log(this.orderInfo)
        if (tackOutDateStr === this.currentTimeZoneTime().format("YYYY-MM-DD")) {
          tackOutDateStr = '(今天)';
        }
        if (tackOutDateStr === this.currentTimeZoneTime().add(-1, 'days').format("YYYY-MM-DD")) {
          tackOutDateStr = '(昨天)';
        }
        if (tackOutDateStr === this.currentTimeZoneTime().add(1, 'days').format("YYYY-MM-DD")) {
          tackOutDateStr = '(明天)';
        }
        return `${tackOutDateStr} ${tackOutTimeStr}`;
      },
      currentTimeZoneTime() {
        return this.moment.tz(this.moment(), this.$store.getters.timeZone);
      },
      zoneTime: function (dbTime) {
        if (dbTime !== undefined) {
          return this.appUtil.toTimeZone(dbTime, 'UTC', this.$store.getters.timeZone);
        } else {
          return '';
        }
      },
      //选择票据
      chooseReceipt(value) {
        switch (value) {
          case 'NO':
            this.showReceiptBox = false;
            return;
          case 'PAPER':
            let _this = this;
            this.$danMessageBox("请找门店服务员索要收据", function () {
              _this.showReceiptBox = false;
            }, true);
            return;
          case 'EMAIL':
            this.showEmailReceiptBox = true;
            return;
          case 'TEXT':
            this.showPhoneReceiptBox = true;
            return;
        }
      },
      sendEmailReceipt() {
        let _this = this;
        let email = this.receipt.email;
        if (this.appUtil.isEmpty(email)) {
          this.receiptErrorMessage = "请输入邮箱";
          return false;
        }
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (reg.test(email)) {
          this.receiptErrorMessage = "";
          this.loadingType = 'inPage';
          this.isLoading = true;
          httpClient.getPayOrderEmail(this.qs.stringify({
            goods_order_id: this.orderInfo.id,
            send_type: 0
          }), {
            email: email
          }).then(result => {
            this.isLoading = false;
            if (result.data.result_code === "ok") {
              this.$danMessageBox("发送成功",function () {
                _this.showEmailReceiptBox = false;
              },true)
            } else {
              this.$danMessageBox("发送失败,请确认订单是否已支付!")
            }
          })
        } else {
          this.receiptErrorMessage = "请输入合法的邮箱";
          return false;
        }
      },
      sendPhoneReceipt() {
        let _this = this;
        if (this.taskEndTime !== 180) {
          this.receiptErrorMessage = '不可重复发送,请于' + this.taskEndTime + "后重试";
          return false;
        }
        let countryCode = this.receipt.countryCode.toString();
        let phone = this.receipt.phone;
        if (this.appUtil.isEmpty(phone)) {
          this.receiptErrorMessage = "请输入手机号码";
          return false;
        }
        if (countryCode === "86" && !(/^1[34578]\d{9}$/.test(phone))) {
          this.receiptErrorMessage = "请输入正确手机号码";
          return false;
        }
        if (countryCode === "1" && phone.length <= 5) {
          this.receiptErrorMessage = "请输入正确手机号码";
          return false;
        }
        this.receiptErrorMessage = "";
        this.loadingType = 'inPage';
        this.isLoading = true;
        httpClient.getPayOrderEmail(this.qs.stringify({
          goods_order_id: this.orderInfo.id,
          send_type: 1,
          countrycode: countryCode
        }), {
          mobile: phone
        }).then(result => {
          this.isLoading = false;
          if (result.data.result_code === "ok") {
            this.$danMessageBox("发送成功!",function () {
              _this.showPhoneReceiptBox = false;
              let TaskTime = setInterval(() => {
                this.taskEndTime--;
                if (this.taskEndTime <= 0) {
                  this.taskEndTime = 180;
                  clearInterval(TaskTime)
                }
              }, 1000)
            },true)
          } else if (result.data.result_code === "error" && result.data.result_msg === "ORDER_NOT_EXIST") {
            this.$danMessageBox("订单不存在,请确认订单已经支付完成!",function () {
              _this.showPhoneReceiptBox = false;
            },true)
          }
        })
      },
      showDetails(goods) {
        this.$router.replace({
          path: '/goodsDetail',
          name: 'GoodsDetail',
          params: {
            goodsInfo: goods,
            orderNum: this.$route.query.orderNum,
            orderId: this.$route.query.orderId,
            tag: this.$route.query.tag,
          },
          query: {
            name: goods.name,
            id: goods.id
          }
        })
      },
      payStatus: function (paystatus) {
        switch (paystatus) {
          case 0:
            return '已下单';
          case 1:
            return '处理中';
          case 2:
            return '已退款';
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
      contactMerchant() {
        this.$router.replace({
          path: '/merchantInfo'
        })
      },
      toPay() {
        let orderNum = this.orderInfo.num
        let tip = this.orderInfo.tip
        let paytype ;
        if (process.env.NODE_ENV === "development") {
          paytype = "wechatpay"
        } else {
          paytype = this.common.is_weixin() ? 'wechatpay' : this.common.is_alipay() ? 'alipay' : '';
          if (paytype === '') {
            MessageBox.alert("请使用微信或支付宝客户端打开").then(action => {
            });
            return false;
          }
        }
        this.loadingType = 'inPage';
        // this.isLoading = true;
        //加载动画
        Indicator.open({text: "正在加载中...", spinnerType: "fading-circle"});
        // let url, body;
        let body, params;
        console.log(this.orderInfo)
        if (this.$store.getters.isStoreUser == "TRUE") {
          params = {
            store_user_id: this.$store.getters.storeScanGoodsUser.id,
            store_id: this.$store.getters.storeId
          }
          body = {
            deduction_integral: this.orderInfo.deduction_integral,
            num: orderNum,
            tip: tip
          }
        } else {
          params = {}
          body = {
            num: orderNum,
            tip: tip
          }
        }
        httpClient.addPayOrder(this.qs.stringify(params), body).then(result => {
          if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
            httpClient.uniformPay(this.qs.stringify({
              transaction_id: result.data.merchantOrder.id,
              pay_type: paytype,
              wx_openid: this.$store.getters.userId,
              alipay_user_id: this.$store.getters.userId
            })).then(payResult => {
              if (payResult.data.result_code == "ok" && payResult.data.result_msg == "SUCCESS") {
                Indicator.close();
                this.isPaying = false;
                if (this.appUtil.isWx()) {
                  this.wxpay(payResult.data.appId, payResult.data.timeStamp, payResult.data.nonceStr, payResult.data.wechatPackage, payResult.data.signType, payResult.data.paySign, orderNum);
                } else if (this.appUtil.isAli()) {
                  this.alipay(payResult.data.trade_no, result.data.merchantOrder.id, orderNum);
                }
              } else {
                Indicator.close();
                this.isPaying = false;
                MessageBox.alert("支付失败").then(action => {
                });
              }
            })
          } else if (result.data.result_code == "error" && result.data.result_msg == "ORDER_PID") {
            Indicator.close();
            this.isPaying = false;
            MessageBox.alert("订单已完成或已被取消.").then(action => {
              if (this.appUtil.isWx()) {
                this.appUtil.closeWx();
              } else if (this.appUtil.isAli()) {
                this.appUtil.closeAli();
              } else {
                history.back();
              }
            });
          } else {
            Indicator.close();
            this.isPaying = false;
            MessageBox.alert("系统错误").then(action => {

            });
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
                that.$store.commit('shopCartList',{})
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
                this.$danMessageBox("微信支付取消", undefined, true);
              } else {
                this.$danMessageBox("微信支付失败", undefined, true);
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
                    this.$danMessageBox("支付宝支付取消", undefined, true);
                  } else if (queryResult.data.tradeState === "CLOSED") { //交易关闭
                    this.$danMessageBox("当前订单已被关闭，请重新下单.", undefined, true);
                  } else if (queryResult.data.tradeState === "UNKNOWN") {
                    this.$danMessageBox("支付结果未知，请查看支付宝账单.", undefined, true);
                  }
                } else {
                  this.$danMessageBox("支付结果未知，请查看支付宝账单.", undefined, true);
                }
              });
            }
          );
        });
      },
      cancelOrder() {
        this.$danMessageBox("确定取消订单吗?", () => {
          this.loadingType = 'inPage';
          this.isLoading = true;
          httpClient.getPayOrderUpdate(this.qs.stringify({
            num: this.orderInfo.num,
            type: "CANCEL"
          }), {}).then(result => {
            this.isLoading = false;
            if (result.data.result_code === "ok") {
              this.$danMessageBox("取消成功", () => {
                this.back();
              }, true);
            } else {
              this.$danMessageBox("取消失败");
            }
          })
        });
      },
      initData() {
        this.isLoading = true;
        let orderNum = this.$route.query.orderNum;
        if (orderNum !== undefined) {
          httpClient.getOrderDetail(orderNum).then(result => {
            this.orderInfo = result.data.goodsOrder;
            this.isLoading = false;
          });
        }
      },
      //积分抵扣
      deductionIntegral(value) {
        let proportion = this.$store.getters.fromIntegralConvertRatio.split('/')
        let str1 = +(proportion[0])
        return value / str1
      },
    },
    created() {
      this.initData();
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
  @import "../../assets/css/common";

  #order-detail {
    font-size: 0.9rem;

    .wrapper {
      height: @primary-content-height;
      overflow: hidden;
    }

    .content {
      display: flex;
      flex-direction: column;

      .top {
        margin: @space-width;
        padding: 0 @space-width;
        background-color: white;
        border-radius: 4px;

        .title {
          padding: 18px 0;

          text-align: center;

          > :nth-child(1) {
            font-size: 1.2rem;
            color: @primary-color;
            margin: 8px 0;
          }
        }

        .goods-list {
          padding: 8px 0;

          table {
            td {
              width: calc((100vw - @space-width * 4) / 3);
              text-align: center;
              padding: 8px 0;
            }

            > :nth-child(1) {
              color: #999999;
            }

            tr > :nth-child(1) {
              text-align: left;
            }

            tr > :nth-child(3) {
              text-align: right;
            }
          }

          .amount {
            color: @primary-color;
          }
        }

        .order-statistics {

          .statistic-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 16px 0;
          }

          .right {
            justify-content: flex-end;
            font-size: 1.2rem;

            .amount {
              color: @primary-color;
            }
          }
        }
      }

      .order-info {
        margin: 0 @space-width @space-width @space-width;
        padding: 0 @space-width;
        background-color: white;
        border-radius: 4px;

        .info-item {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin: @space-width 0;

          > :nth-child(2) {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }
      }
    }

    .bottom {
      height: @common-navigation-bar-height;
      background-color: white;
      border-top: 1px solid #dddddd;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      .operation {
        width: 20vw;
        font-size: 0.8rem;
        padding: 4px 8px;
        border-radius: 3px;
        margin-right: @space-width;
        .common-center;
      }
    }

    .message-box {
      font-size: 1rem;
      align-items: center;

      .receipt-content {
        width: 100%;
        font-size: 1rem;

        .receipt-title {
          margin: @space-width 0;
          text-align: center;
          font-size: 1.2rem;
        }

        .receipt-box {
          margin: @space-width / 2;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;

          .receipt-item {
            width: calc(50% - @space-width - 2px);
            height: 80px;
            border: 1px solid white;
            border-radius: 3px;
            .common-center;
            box-shadow: 0 0 5px 1px #ccc;
            margin: @space-width / 2;
            display: flex;
            flex-direction: column;
            align-items: center;

            svg {
              width: 40px;
              height: 40px;
              margin-bottom: 4px;
            }
          }
        }
      }

      .receipt-detail-content {
        display: flex;
        flex-direction: column;

        .receipt-message {
          text-align: center;
          margin-bottom: @space-width;
        }

        select {
          padding: 0 5px;
          text-align-last: right;
          height: 28px;
          border: 1px solid #dddddd;
          border-radius: 3px;
        }

        input {
          height: 28px;
          padding-left: 5px;
          border: 1px solid #dddddd;
          border-radius: 3px;
        }

        .error-message {
          margin-top: 4px;
          font-size: 0.8rem;
          color: red;
          text-align: center;
        }
      }
    }
  }
</style>
