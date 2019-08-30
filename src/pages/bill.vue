<template>
  <div>
    <div v-if="isShow">
      <header class="mui-bar mui-bar-nav">
        <svg class="icon bill-back" aria-hidden="true" @click="jump">
          <use xlink:href="#icon-return"></use>
        </svg>
        <h1 class="mui-title">结账</h1>
        <span class="float-right nav-bar-btn">自取</span>
      </header>
      <div class="mui-content">
        <div class="info">
          <!--${{totalAmount.toFixed(2)}}-->
          <div class="total-amount" v-if="!isDeduction">
            ${{(totalAmount-transfromPrice(integral)).toFixed(2)}}
          </div>
          <div class="total-amount" v-if="isDeduction">${{0.01}}</div>
          <!--<div class="total" v-if="!isDeduction">：<span class="price">${{(totalAmount-transfromPrice(integral))}}</span>-->
          <!--</div>-->
          <!--<div class="total" v-if="isDeduction">合计：<span class="price">${{((totalAmount-(totalAmount-0.01)))}}</span>-->
          <!--</div>-->
          <div class="desk-no">
            <span>到店自取</span>
            <!--<span style="font-size: 14px;">({{moment(this.$store.getters.getToTime).format('MM-DD HH:mm')}})</span>-->
            <span style="font-size: 14px;letter-spacing: 1px;">{{toTimeShowText}}</span>
          </div>
          <div class="goods-header">
            <div class="name">菜名</div>
            <div class="count">数量</div>
            <div class="price">价格</div>
          </div>
          <div class="goods-item" v-for="goods of goodsList">
            <div class="group-name">
              <p class="name">{{goods.name}}</p>
              <p class="spec-list">
                <span v-for="(itemSpec,i) of goods.specItemList" :key="i"> {{(i==0?'':'/')+itemSpec.name}}</span>
                <span v-for="(name,k) in goods.remarkList"
                      :key="k + (goods.specItemList ? goods.specItemList.length : 0) ">{{(k + (goods.specItemList ? goods.specItemList.length : 0)===(goods.specItemList ? goods.specItemList.length : 0)? ( goods.specItemList && goods.specItemList.length > 0 ? '/' : '') :'/')+name}}</span>
              </p>
            </div>
            <div class="group-count">x{{goods.count}}</div>
            <div class="group-amount">
              ${{ItemCalc(goods)}}
            </div>
          </div>
          <div class="cost-info">
            <div class="item">
              <p>小计</p>
              <p class="subtotal">${{total.toFixed(2)}}</p>
            </div>
            <div class="item" v-if="discountAmount > 0">
              <p>折扣金额({{this.$store.getters.discount * 10}}折)</p>
              <p>-${{discountAmount.toFixed(2)}}</p>
            </div>
            <!-- v-if="integral>0"-->

            <div class="item" v-if="this.$store.getters.isTax === 'TRUE'">
              <p>税费</p>
              <p class="">${{tax.toFixed(2)}}</p>
            </div>
            <div class="item" v-if="this.$store.getters.isTip === 'TRUE'">
              <p>小费</p>
              <p class="">${{tipAmount.toFixed(2)}}</p>
            </div>
            <div class="item" v-if="integral>0">
              <p>积分抵扣金额：</p>
              <p class="">-${{transfromPrice(integral)+".00"}}</p>
            </div>
          </div>
          <!--((totalAmount-transfromPrice(integral))-discountAmount)-->
          <div class="total" v-if="!isDeduction">合计：<span class="price">${{(totalAmount-transfromPrice(integral)).toFixed(2)}}</span>
          </div>
          <div class="total" v-if="isDeduction">合计：<span class="price">${{((totalAmount-(totalAmount-0.01))).toFixed(2)}}</span>
          </div>
          ss
          <!-- v-if="this.$store.getters.isStoreUser=='FALSE'"-->
          <p class="register-prompt" @click="jumpRegister" v-if="this.$store.getters.isStoreUser=='FALSE'">
            (注册会员使用积分抵扣)</p>
        </div>
        <!--会员积分抵扣-->
        <!--<div class="info"-->
             <!--v-if="this.$store.getters.openMembershipSystem=='TRUE'&&this.$store.getters.isStoreUser=='TRUE'">-->
          <!--<p style="color: #ED5B5B;font-size: 14px;">会员积分抵扣</p>-->
          <!--<div class="cost-info" @click="prompt">-->
            <!--<div class="item">-->
              <!--<div class="item-box">-->
                <!--&lt;!&ndash;<span>积分抵扣?</span>&ndash;&gt;-->
                <!--<div class="integral-item" style="color: black;padding: 0 10px;">-->
                  <!--<div>-->
                    <!--<span>(当前积分</span>-->
                    <!--<span>2500</span>)-->
                  <!--</div>-->
                  <!--<div>-->
                    <!--<span style="float: left;">剩余积分:</span>-->
                    <!--<span>{{nowAsBeforeIntegra-integral}}</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<p>-->
                <!--&lt;!&ndash;<img src="../../../static/img/integral.png" alt="">&ndash;&gt;-->
                <!--<svg class="icon bill-back" aria-hidden="true" @click="jump">-->
                  <!--<use xlink:href="#icon-jifenmingxi"></use>-->
                <!--</svg>-->
                <!--&lt;!&ndash;icon-jifenmingxi&ndash;&gt;-->
                <!--<span class="integral-text">400($4.00)</span>-->
                <!--<i class="mui-icon mui-icon-forward" style="font-size:16px"></i>-->
              <!--</p>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--会员积分抵扣 改版-->
        <div class="info"
             v-if="this.$store.getters.openMembershipSystem=='TRUE'&&this.$store.getters.isStoreUser=='TRUE'">
          <div class="cost-info" @click="prompt">
            <div class="item" v-if="this.$store.getters.isTip === 'TRUE'">
              <div class="item-box">
                <span>会员积分抵扣</span>
                <!--<p style="color: #ED5B5B;font-size: 14px;">会员积分抵扣</p>-->
              </div>
              <p>
                <img src="../assets/img/integral.png" alt="">
                <span class="integral-text" v-text="integralHTML"></span>
                <i class="mui-icon mui-icon-forward" style="font-size:16px"></i>
              </p>
            </div>
          </div>
          <div class="cost-border">
            <div class="item">
              <div class="integral-item" style="color: black;padding: 0 10px;">
                <div>
                  <span>(当前积分</span>
                  <span
                    :style="integral>0?'text-decoration:line-through':''">{{this.$store.getters.nowIntegralNumber}}</span>)
                </div>
                <div v-if="integral>0">
                  <span style="float: left;">剩余积分:</span>
                  <span>{{this.$store.getters.nowIntegralNumber-integral}}</span>
                </div>
              </div>
              <div class="consumption-info">
                您当前消费<span>{{((totalAmount-transfromPrice(integral))).toFixed(2)}}</span>,可获得 <span>{{Math.round(transfromIntegral(((totalAmount-transfromPrice(integral)))))}}</span>积分
              </div>
            </div>
          </div>

        </div>
        <div class="pay-btn" @click="addOrder" :class="isPayBtnDisabled?'':'pay-btn-disable'">确认付款</div>
      </div>

      <div class="modal-tips-keyboard" :class="keyBordStatus ? 'active' : ''">
        <table>
          <tbody>
          <tr>
            <td @click="keyBordNum('1')">1</td>
            <td @click="keyBordNum('2')">2</td>
            <td @click="keyBordNum('3')">3</td>
            <td @click="keyBordNum('D')" data-code="D" rowspan="2">
                            <span class="icon icon-del">
                                <svg version="1.1" viewBox="0 0 48.4 36" class="svg-icon svg-fill">
                                    <path pid="0"
                                          d="M29.4 19.7l6.2 6.3 1.7-1.7-6.2-6.3 6.3-6.3-1.8-1.7-6.3 6.3-6.2-6.3-1.7 1.7 6.2 6.3-6.3 6.3 1.8 1.7 6.3-6.3zM39.9 3.2a5.3 5.3 0 0 1 5.4 5.3v19a5.3 5.3 0 0 1-5.4 5.3h-20a5.4 5.4 0 0 1-3.9-1.6L3.5 18.8a1 1 0 0 1 0-1.5L16 4.8a5.4 5.4 0 0 1 3.9-1.6h20zm0-3.2H20.7a8.6 8.6 0 0 0-6.2 2.6L1.3 15a4.2 4.2 0 0 0 0 6l13.3 12.4a8.6 8.6 0 0 0 6.1 2.6h19.2a8.5 8.5 0 0 0 8.5-8.5v-19A8.5 8.5 0 0 0 39.9 0z"></path>
                                </svg>
                            </span>
            </td>
          </tr>
          <tr>
            <td @click="keyBordNum('4')">4</td>
            <td @click="keyBordNum('5')">5</td>
            <td @click="keyBordNum('6')">6</td>
          </tr>
          <tr>
            <td @click="keyBordNum('7')">7</td>
            <td @click="keyBordNum('8')">8</td>
            <td @click="keyBordNum('9')">9</td>
            <!-- class="fobid"-->
            <td @click="keyBordNum('K')" data-code="K" rowspan="2" id="JS_form_tip_finish">Ok</td>
          </tr>
          <tr>
            <td @click="keyBordNum('.')">.</td>
            <td @click="keyBordNum('0')">0</td>
            <td data-code="F" @click="keyBordNum('F')">
                            <span class="icon icon-keyfold">
                                <svg data-v-7ef413f4 version="1.1" viewBox="0 0 48 48" class="svg-icon svg-fill">
                                    <path pid="0"
                                          d="M25.2 19.2H30v-4.8h-4.8v4.8zm1.2-12h-4.8V12h4.8V7.2zm-8.4 12h4.8v-4.8H18v4.8zm1.2-12h-4.8V12h4.8V7.2zM24 48l9.6-9.6H14.4L24 48zm9.6-40.8h-4.8V12h4.8V7.2zM13.2 26.4h21.6v-4.8H13.2v4.8zM12 7.2H7.2V12H12V7.2zm20.4 12h4.8v-4.8h-4.8v4.8zM36 12h4.8V7.2H36V12zm7.2-12H4.8A4.8 4.8 0 0 0 0 4.8v24a4.8 4.8 0 0 0 4.8 4.8h38.4a4.8 4.8 0 0 0 4.8-4.8v-24A4.8 4.8 0 0 0 43.2 0zm2.4 28.8a2.4 2.4 0 0 1-2.4 2.4H4.8a2.4 2.4 0 0 1-2.4-2.4v-24a2.4 2.4 0 0 1 2.4-2.4h38.4a2.4 2.4 0 0 1 2.4 2.4v24zm-30-14.4h-4.8v4.8h4.8v-4.8z"></path>
                                </svg>
                            </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <mt-popup v-model="tipPopupVisible" popup-transition="popup-fade"
                style="width:95%;top: 45% !important;background: rgba(255, 255, 255, 1);border-radius: 6px;"
                v-if="this.$store.getters.isTip == 'TRUE'" closeOnClickModal>
        <tip msg-father=""
             :taxAmount="tax"
             :discountAmount="discountAmount"
             :totalAmount="total"
             :tipInputVal="tipInputVal"
             @showTipKeyBord="showTipKeyBord"
             @clickSaveTip="clickSaveTip"></tip>
      </mt-popup>
    </div>
    <!--<home-header v-if="!isShow"></home-header>-->
    <mt-popup v-model="inputIntegralAlert" popup-transition="popup-fade" style="width: 100%;top:45%;"
              :closeOnClickModal="false">
      <div class="mint-msgbox">
        <div class="mint-msgbox-header">
          <div class="mint-msgbox-title">提示</div>
        </div>
        <div class="mint-msgbox-content">
          <div class="mint-msgbox-message">
            <span>请输入需抵扣的积分</span>
            <br>
            <!--<div style="font-size: 12px;line-height: 17px;">-->
            <!--<span>当前积分兑换比例{{integralPortion}}</span>-->
            <!--</div>-->
            <span>您的积分为 <span style="font-weight: 600;">{{this.$store.getters.nowIntegralNumber}}</span> </span>
            最多可抵
            <span style="font-weight: 600;">$
                  <span
                    style="padding: 0 0px;" v-if="this.$store.getters.openMembershipSystem=='TRUE'">{{transRemainder(this.$store.getters.nowIntegralNumber)}}</span>
                </span>
          </div>
          <p id="moneys" onclick="keyboard.keyBordStatus()" @click="toggleKeyborad()" style="font-size: 18px;">
            积分:&nbsp;
            <span id="price"></span>
            <span id="cursor" style="display: block;"></span>
          </p>
        </div>
        <div class="mint-msgbox-btns">
          <div class="mint-msgbox-btn mint-msgbox-cancel promiseBtn" style="color: black;"
               @click="alertClose">取消
          </div>
          <div class="mint-msgbox-btn mint-msgbox-confirm promiseBtn" @click="alertClose();alertConfirm()">
            确定
          </div>
        </div>
      </div>
    </mt-popup>
    <div id="contentKey" openToggle></div>
    <loading v-if="!isShow" type="page" height="calc(100vh - 50px)" top="0"></loading>
  </div>
</template>

<script>
  // require("../assets/js/keyboard")
  import tip from "./tip.vue";
  import httpClient from '../http';
  import Loading from "../components/Loading";
  // import HomeHeader from "@/components/transition/trans";
  import {
    Indicator,
    Toast,
    MessageBox
  } from "mint-ui";

  export default {
    components: {
      tip,
      Loading
    },
    data() {
      return {
        //商品数据列表
        goodsList: [],
        //小计
        total: 0,
        //优惠金额
        discountAmount: 0,
        //折后金额
        afterDiscountTotal: 0,
        //税费
        tax: 0,
        //总金额
        totalAmount: 0,
        //小费弹框
        tipPopupVisible: true,
        //小费
        tipAmount: 0,
        //小费键盘是否显示
        keyBordStatus: false,
        //小费输入框初始值
        tipInputVal: '',
        //支付按钮是否禁用
        isPayBtnDisabled: true,
        isShow: false,
        //显示的积分HTML模板
        integralHTML: "",
        //输入积分所抵扣的钱
        integralPrice: 0,
        //输入的积分
        integral: 0,
        //输入积分popup显示
        inputIntegralAlert: false,
        //订单未支付且扣了积分的当前积分数
        nowAsBeforeIntegra: +(this.$store.getters.deductionIntegral) + (+(this.$store.getters.nowIntegralNumber)),//+(this.$store.getters.deductionIntegral) + (+(this.$store.getters.nowIntegralNumber))
        //是否注册了会员
        isShowRegister: false,
        //积分兑换比例
        integralPortion: "",
        //抵扣金额是否等于合计金额
        isDeduction: false,
        //clickTipItem
        tipItem: -1,
        //toTimeShowText
        toTimeShowText: "",
      };
    },
    methods: {
      ItemCalc(goods) {
        return this.appUtil.amountMul(this.appUtil.round(this.appUtil.amountMul(goods.amount, goods.discount), 2), goods.count).toFixed(2);
      },
      jump() {
        if (!this.isPayBtnDisabled) {
          return false;
        }
        this.$router.replace("/AddOrder");
        // this.$store.commit("goodsOrderNum", ""); //订单号
      },
      //小费确认点击事件
      clickSaveTip(tip, isTipInput, i) {
        if (isTipInput) {
          if (this.tipInputVal === "" || this.tipInputVal === null) {
            MessageBox.alert("请输入小费").then(action => {
            });
            return false;
          }
          this.tipItem = "tipInput"
          this.tipAmount = parseFloat(this.tipInputVal);
          this.totalAmount = this.totalAmount + parseFloat(this.tipInputVal);
        } else {
          this.tipItem = +(i)
          this.tipAmount = tip;
          this.totalAmount = this.totalAmount + tip;
        }
        this.keyBordStatus = false;
        this.tipPopupVisible = false;
      },
      //显示小费键盘
      showTipKeyBord(status) {
        this.keyBordStatus = status;
        let screenHeight = $(window).height();
        let table = screenHeight * 0.4;
        let inputHeight = $(".tip-input-val").offset().top;
        if (inputHeight + 50 > screenHeight - table) {
          $(".mint-popup").css("margin-top", -(inputHeight - (screenHeight - table) + 80) + "px");
        }
      },
      //键盘事件
      keyBordNum(val) {
        let amountVal = this.tipInputVal.toString().trim();
        let _result = 0;
        let _code = val;
        if (_code === "K" || _code === "F") {
          //ok按钮  //隐藏键盘按钮
          _result = parseFloat(this.common.clearNoNum(amountVal)).toFixed(2);
          _result == 0 ? (_result = "") : "";
          // 限额检测
          if (_result > 999.99) {
            return false;
          } else {
            $(".mint-popup").css("margin-top", 0 + "px");
            this.keyBordStatus = false;
          }
          this.tipInputVal = _result;
        } else {
          //删除按钮
          if (_code === "D") {
            if (amountVal.length == 1 || amountVal == "") {
              _result = "";
            } else {
              _result = amountVal.substring(0, amountVal.length - 1);
            }
          } else {
            //数字按钮
            if (_code === "." && amountVal.indexOf(".") >= 0) {
              return false;
            }
            if (amountVal.split(".").length < 2 && (this.common.clearNoNum(amountVal) === "0.00" || parseFloat(this.common.clearNoNum(amountVal)) == "0")) {
              if (_code === ".") {
                _result = "0" + _code;
              } else {
                _result = _code;
              }
            } else {
              let _amountValArray = amountVal.split(".");
              if (_amountValArray[0].length < 3) {
                _result = this.common.clearNoNum(amountVal) + _code;
                _result = this.common.clearNoNum(_result);
                if (_result.indexOf(".") < 0) {
                  _result = parseFloat(_result);
                }
              } else if (_amountValArray[0].length == 3) {
                let temp = this.common.clearNoNum(amountVal) + _code;
                if (parseInt(temp) > parseInt(amountVal) || (_amountValArray.length == 2 && _amountValArray[1].length > 1)) {
                  _result = amountVal;
                } else {
                  _result = temp;
                }
              } else {
                _result = amountVal;
              }
            }
          }
          this.tipInputVal = _result;
        }
      },
      //下单
      addOrder() {
        if (!this.isPayBtnDisabled) {
          return false;
        }
        let paytype = ""
        if (process.env.NODE_ENV === "development") {
          paytype = "wechatpay"
        } else {
          paytype = this.appUtil.isWx() ? 'wechatpay' : this.appUtil.isAli() ? 'alipay' : '';
          if (paytype === '') {
            MessageBox.alert("请使用微信或支付宝客户端打开").then(action => {
            });
            return false;
          }
        }
        //加载动画
        Indicator.open({text: "正在加载中...", spinnerType: "fading-circle"});
        this.isPayBtnDisabled = false;
        let alipay_login_userid = "";
        let wx_openid = "";
        if (this.appUtil.isWx()) {
          wx_openid = this.$store.getters.userId;
        } else if (this.appUtil.isAli()) {
          alipay_login_userid = this.$store.getters.userId;
        }
        // let userName = this.$route.params.uName;
        // let userTel = this.$route.params.uTel;
        // let userRemark = this.$route.params.uRemark;
        let userName = this.$store.getters.getPickUpUserName;
        let userTel = this.$store.getters.getPickUpUserPhone;
        let userRemark = this.$store.getters.getPickUpUserRemark;
        if (userName === '' || userName == null) {
          userName = this.$store.getters.getUserName;
        } else {
          this.$store.commit("userName", userName);
        }
        if (userTel === '' || userTel == null) {
          userTel = this.$store.getters.getUserTel;
        } else {
          this.$store.commit("userTel", userTel);
        }
        if (userRemark === '' || userRemark == null) {
          userRemark = this.$store.getters.getUserRemark;
        } else {
          this.$store.commit("userRemark", userRemark);
        }

        let goodsArray = new Array();
        for (let item of this.goodsList) {
          goodsArray.push({goods_id: item.id, quantity: item.count, specificationInfoList: item.specItemList});
        }
        console.log(this.$store.getters.selectedAddress.address)
        let body = {
          type: 1,
          qr_code_num: this.$store.getters.getQrCode,
          alipay_login_userid: alipay_login_userid,
          wx_openid: wx_openid,
          goodsOrderInfoList: goodsArray,
          customer_name: userName,
          customer_mobile: userTel,
          remark: userRemark,
          tack_out_time: this.appUtil.toTimeZone(this.$store.getters.toTime, this.$store.getters.timeZone, 'UTC'),
          customer_address: this.$store.getters.selectedAddress.address,
          latitude: "30.52",
          longitude: "114.31"
        }
        let url = {
          store_id: this.$store.getters.storeId,
          store_menu_id: this.$store.getters.menuId,
        }
        if (this.$store.getters.isStoreUser === 'TRUE') {
          url.store_user_id = this.$store.getters.storeScanGoodsUser.id
        }
        console.log(this.$store.getters.goodsOrderNum)
        if (this.$store.getters.goodsOrderNum === '' || this.$store.getters.goodsOrderNum == null) {
          console.log(httpClient)
          httpClient.addOrder(this.qs.stringify(
            url
          ), body).then(result => {
            if (result.data.result_code === "ok" && result.data.result_msg === "SUCCESS") {
              this.$store.commit("goodsOrderId", result.data.goodsOrder.id)
              this.$store.commit("goodsOrderNum", result.data.goodsOrder.num); //订单号
              this.payment(result.data.goodsOrder.num, this.tipAmount, paytype);
            } else {
              this.$danMessageBox("下单失败", undefined, true)
              Indicator.close();
              this.isPayBtnDisabled = true;
            }
          })
          // this.axios.post(url, {
          //   type: 1,
          //   qr_code_num: this.$store.getters.getQrCode,
          //   alipay_login_userid: alipay_login_userid,
          //   wx_openid: wx_openid,
          //   goodsOrderInfoList: goodsArray,
          //   customer_name: userName,
          //   customer_mobile: userTel,
          //   remark: userRemark,
          //   tack_out_time: this.common.toTimeZone(this.$store.getters.getToTime, this.$store.getters.timeZone, 'UTC')
          // }).then(result => {
          //   if (result.data.result_code === "ok" && result.data.result_msg === "SUCCESS") {
          //     this.$store.commit("goodsOrderId", result.data.goodsOrder.id)
          //     this.$store.commit("goodsOrderNum", result.data.goodsOrder.num); //订单号
          //     this.payment(result.data.goodsOrder.num, this.tipAmount, paytype);
          //   } else {
          //     MessageBox.alert("下单失败.").then(action => {
          //
          //     });
          //     Indicator.close();
          //     this.isPayBtnDisabled = true;
          //   }
          // });
        } else {
          this.payment(this.$store.getters.goodsOrderNum, this.tipAmount, paytype);
        }
      },
      //支付
      payment(orderNum, tip, paytype) {
        let body, params;
        if (this.$store.getters.isStoreUser == "TRUE") {
          console.log('body:' + this.integral, this.integralPrice)
          // params = this.common.baseURL + "mobi/goodsorder/pay/order/add?store_user_id=" + this.$store.getters.storeScanGoodsUser.id + "&store_id=" + this.$store.getters.storeId;
          params = {
            store_user_id: this.$store.getters.storeScanGoodsUser.id,
            store_id: this.$store.getters.storeId
          }
          body = {
            deduction_integral: this.integral,
            integral_deduction_amount: this.integralPrice,
            num: orderNum,
            tip: tip
          }
        } else {
          // params = this.common.baseURL + "mobi/goodsorder/pay/order/add";
          params = {}
          body = {
            num: orderNum,
            tip: tip
          }
        }
        httpClient.addPayOrder(this.qs.stringify(params), body).then(result => {
          if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
            // let payUrl = this.common.baseURL + "mobi/pay/pay?transaction_id=" + result.data.merchantOrder.id + "&pay_type=" + paytype + "&wx_openid=" + this.$store.getters.userId + "&alipay_user_id=" + this.$store.getters.userId
            httpClient.uniformPay(this.qs.stringify({
              transaction_id: result.data.merchantOrder.id,
              pay_type: paytype,
              wx_openid: this.$store.getters.userId,
              alipay_user_id: this.$store.getters.userId
            })).then(payResult => {
              if (payResult.data.result_code == "ok" && payResult.data.result_msg == "SUCCESS") {
                Indicator.close();
                this.isPayBtnDisabled = true;
                if (this.appUtil.isWx()) {
                  this.wxpay(payResult.data.appId, payResult.data.timeStamp, payResult.data.nonceStr, payResult.data.wechatPackage, payResult.data.signType, payResult.data.paySign, orderNum);
                } else if (this.appUtil.isAli()) {
                  this.alipay(payResult.data.trade_no, result.data.merchantOrder.id, orderNum);
                }
              } else {
                Indicator.close();
                this.isPayBtnDisabled = true;
                MessageBox.alert("支付失败").then(action => {
                });
              }
            })
            // this.axios.get(payUrl, {}).then(payResult => {
            //   if (payResult.data.result_code == "ok" && payResult.data.result_msg == "SUCCESS") {
            //     Indicator.close();
            //     this.isPayBtnDisabled = true;
            //     if (this.appUtil.isWx()) {
            //       this.wxpay(payResult.data.appId, payResult.data.timeStamp, payResult.data.nonceStr, payResult.data.wechatPackage, payResult.data.signType, payResult.data.paySign, orderNum);
            //     } else if (this.appUtil.isAli()) {
            //       this.alipay(payResult.data.trade_no, result.data.merchantOrder.id, orderNum);
            //     }
            //   } else {
            //     Indicator.close();
            //     this.isPayBtnDisabled = true;
            //     MessageBox.alert("支付失败").then(action => {
            //     });
            //   }
            // });
          } else if (result.data.result_code == "error" && result.data.result_msg == "ORDER_PID") {
            Indicator.close();
            this.isPayBtnDisabled = true;
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
            this.isPayBtnDisabled = true;
            MessageBox.alert("系统错误").then(action => {

            });
          }
        })
        // this.axios.post(params, body).then(result => {//*
        //   if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
        //     // let nowIntegral=this.$store.getters.nowIntegralNumber;
        //     // this.$store.commit("nowIntegralNumber",nowIntegral-this.integral)
        //     let payUrl = this.common.baseURL + "mobi/pay/pay?transaction_id=" + result.data.merchantOrder.id + "&pay_type=" + paytype + "&wx_openid=" + this.$store.getters.userId + "&alipay_user_id=" + this.$store.getters.userId
        //     this.axios.get(payUrl, {}).then(payResult => {
        //       if (payResult.data.result_code == "ok" && payResult.data.result_msg == "SUCCESS") {
        //         Indicator.close();
        //         this.isPayBtnDisabled = true;
        //         if (this.appUtil.isWx()) {
        //           this.wxpay(payResult.data.appId, payResult.data.timeStamp, payResult.data.nonceStr, payResult.data.wechatPackage, payResult.data.signType, payResult.data.paySign, orderNum);
        //         } else if (this.appUtil.isAli()) {
        //           this.alipay(payResult.data.trade_no, result.data.merchantOrder.id, orderNum);
        //         }
        //       } else {
        //         Indicator.close();
        //         this.isPayBtnDisabled = true;
        //         MessageBox.alert("支付失败").then(action => {
        //         });
        //       }
        //     });
        //   } else if (result.data.result_code == "error" && result.data.result_msg == "ORDER_PID") {
        //     Indicator.close();
        //     this.isPayBtnDisabled = true;
        //     MessageBox.alert("订单已完成或已被取消.").then(action => {
        //       if (this.appUtil.isWx()) {
        //         this.appUtil.closeWx();
        //       } else if (this.appUtil.isAli()) {
        //         this.appUtil.closeAli();
        //       } else {
        //         history.back();
        //       }
        //     });
        //   } else {
        //     Indicator.close();
        //     this.isPayBtnDisabled = true;
        //     MessageBox.alert("系统错误").then(action => {
        //
        //     });
        //   }
        // });
      },
      //微信支付
      wxpay(appId, timeStamp, nonceStr, wechatPackage, signType, paySign, orderNum) {
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
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                Indicator.close();
                that.$store.commit("goodsOrderNum", ""); //订单号
                that.$router.replace({
                  path: "/paySuccess",
                  query: {
                    orderNum: orderNum,
                    paystatus: "TRADE_SUCCESS"
                  }
                });
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //取消支付
                Indicator.close();
                that.isPayBtnDisabled = true;

                that.$router.replace({
                  path: "/paySuccess",
                  query: {
                    orderNum: orderNum,
                    paystatus: "WAIT_BUYER_PAY"
                  }
                });
              } else {
                //错误提示
                MessageBox.alert("支付失败").then(action => {
                });
                Indicator.close();
                that.isPayBtnDisabled = true;

                // that.$router.replace({
                //   path: "/paySuccess",
                //   query: {
                //     orderNum: orderNum
                //   }
                // });
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
      //支付宝支付
      alipay(tradeNo, transactionId, orderNum) {
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
              Indicator.close();
              Indicator.open({text: "正在跳转...", spinnerType: "fading-circle"});
              httpClient.queryOrder(that.qs.stringify({
                transaction_id: transactionId
              })).then(queryResult => {
                if (queryResult.data.result_code == "ok" && queryResult.data.result_msg == "SUCCESS") {
                  Indicator.close();
                  //支付成功  //SUCCESS
                  if (queryResult.data.tradeState == "TRADE_SUCCESS") { //跳转到支付成功页面
                    Indicator.close();
                    that.isPayBtnDisabled = true;
                    that.$router.replace({
                      path: "/orderDetail",
                      name: "OrderDetail",
                      query: {
                        orderNum: orderNum,
                        paystatus: "TRADE_SUCCESS"
                      }
                    });
                  } else if (queryResult.data.tradeState == "WAIT_BUYER_PAY") { //未支付   //USERPAYING
                    // that.$store.commit("goodsOrderNum","")
                    // that.$store.commit("goodsOrderId","")
                    Indicator.close();
                    that.isPayBtnDisabled = true;
                    that.$router.replace({
                      path: "/orderDetail",
                      name: "OrderDetail",
                      query: {
                        orderNum: orderNum,
                        paystatus: "WAIT_BUYER_PAY"
                      }
                    });
                  } else if (queryResult.data.tradeState == "CLOSED") { //交易关闭
                    MessageBox.alert("当前订单已被关闭，请重新下单.").then(action => {
                      that.appUtil.closeAli();
                    });
                    Indicator.close();
                    that.isPayBtnDisabled = true;
                  } else if (queryResult.data.tradeState == "UNKNOWN") {
                    //结果未知
                    MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
                      that.appUtil.closeAli();
                    });
                    Indicator.close();
                    that.isPayBtnDisabled = true;
                  }
                  that.isPayBtnDisabled = true;
                } else {
                  //支付结果未知
                  MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
                    that.appUtil.closeAli();
                  });
                  Indicator.close();
                  that.isPayBtnDisabled = true;
                }
              })
              //查询订单
              // that.axios.get(that.common.baseURL + "mobi/pay/resp/alipay/query?transaction_id=" + transactionId, {}).then(queryResult => {
              //   if (queryResult.data.result_code == "ok" && queryResult.data.result_msg == "SUCCESS") {
              //     Indicator.close();
              //     //支付成功  //SUCCESS
              //     if (queryResult.data.tradeState == "TRADE_SUCCESS") { //跳转到支付成功页面
              //       Indicator.close();
              //       that.isPayBtnDisabled = true;
              //       that.$router.replace({
              //         path: "/paySuccess",
              //         query: {
              //           orderNum: orderNum,
              //           paystatus: "TRADE_SUCCESS"
              //         }
              //       });
              //     } else if (queryResult.data.tradeState == "WAIT_BUYER_PAY") { //未支付   //USERPAYING
              //       // that.$store.commit("goodsOrderNum","")
              //       // that.$store.commit("goodsOrderId","")
              //       Indicator.close();
              //       that.isPayBtnDisabled = true;
              //       that.$router.replace({
              //         path: "/paySuccess",
              //         query: {
              //           orderNum: orderNum,
              //           paystatus: "WAIT_BUYER_PAY"
              //         }
              //       });
              //     } else if (queryResult.data.tradeState == "CLOSED") { //交易关闭
              //       MessageBox.alert("当前订单已被关闭，请重新下单.").then(action => {
              //         that.appUtil.closeAli();
              //       });
              //       Indicator.close();
              //       that.isPayBtnDisabled = true;
              //     } else if (queryResult.data.tradeState == "UNKNOWN") {
              //       //结果未知
              //       MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
              //         that.appUtil.closeAli();
              //       });
              //       Indicator.close();
              //       that.isPayBtnDisabled = true;
              //     }
              //     that.isPayBtnDisabled = true;
              //   } else {
              //     //支付结果未知
              //     MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
              //       that.appUtil.closeAli();
              //     });
              //     Indicator.close();
              //     that.isPayBtnDisabled = true;
              //   }
              // });
            }
          );
        });
      },
      //输入会员alert显示
      prompt() {
        this.inputIntegralAlert = true;
      },
      //传入积分转换成金额
      transfromPrice(value) {
        if (this.$store.getters.openMembershipSystem == "TRUE") {
          let integralArray = this.$store.getters.fromIntegralConvertRatio.split('/')
          let integral = (value / integralArray[0]).toFixed(0)
          return +(integral)
        } else {
          return 0
        }
      },
      //传入消费金额转换积分
      transfromIntegral(value) {
        if (this.$store.getters.openMembershipSystem == "TRUE") {
          let priceArray = this.$store.getters.toIntegralConvertRatio.split('/')
          let price = (priceArray[1] * value).toFixed(2)
          return price
        }
      },
      //传入取余积分转换成金额
      transRemainder(values) {
        if (this.$store.getters.openMembershipSystem == "TRUE") {
          let str1 = +(this.$store.getters.fromIntegralConvertRatio.split('/')[0]) / +(this.$store.getters.fromIntegralConvertRatio.split('/')[1])//一块钱对应的积分数(根据门店配置)
          let unitRrice
          if (str1.toString().indexOf('.') >= 0) {
            unitRrice = +(str1.toString().split('.')[0])
          } else {
            unitRrice = +(str1);
          }
          let deductibleAmount = values / unitRrice
          if (deductibleAmount.toString().indexOf('.') >= 0) {//积分抵扣的金额=积分除以单价 需取余
            deductibleAmount = +(deductibleAmount.toString().split('.')[0])
          }
          return deductibleAmount
        }
      },
      //传入金额转换成积分数
      transIntegral(value) {
        if (this.$store.getters.openMembershipSystem == "TRUE") {
          let integralArray = this.$store.getters.fromIntegralConvertRatio.split('/')
          let integral = (integralArray[0] * value).toFixed(0)
          return integral
        }
      },
      //显示键盘修正alery的位置
      toggleKeyborad(value) {
        if (value == undefined) {
          if ($("#contentKey").hasClass('active')) {
            $('.mint-msgbox').css({
              'top': "-15vw"
            })
          } else {
            $('.mint-msgbox').css({
              'top': ""
            })
          }
        } else {
          $('.mint-msgbox').css({
            'top': ""
          })
        }
      },
      //MessageBox点击确认和取消时关闭alert
      alertClose() {
        this.inputIntegralAlert = false;
        this.toggleKeyborad("slide-bottom")
        $("#contentKey").removeClass("active")
      },
      //MessageBox点击确定时
      alertConfirm() {
        let value = document.getElementById('price').innerHTML
        let values = +(value)
        if (/^\d{1,}$/.test(values)) {
          let inputIntegral = values//输入的积分
          let nowIntegral = this.nowAsBeforeIntegra//当前积分
          let totalAmount = this.totalAmount - this.tipAmount
          let getIntegral = +(this.transfromIntegral(this.totalAmount.toFixed(2)))//消费获得的积分
          if (values < 0) {
            MessageBox.alert('请输入正确的额度(正整数)')
            return
          }
          if (inputIntegral > nowIntegral) {//输入抵扣金额多于当前积分
            MessageBox.alert('超出了您的积分折算额度')
            return
          } else if (inputIntegral == getIntegral) {//输入积分等于合计对等的积分则总价为0.01
            this.integralHTML = inputIntegral + "($" + this.totalAmount.toFixed(2) + ")"
            this.integralPrice = +(this.transfromPrice(inputIntegral))//消耗积分所抵扣的钱
            this.integral = inputIntegral
          } else if (inputIntegral > +(this.transIntegral(this.totalAmount))) {//输入抵扣金额多于消费金额
            let mostIntegral = 0//最多抵扣金额
            if (this.totalAmount.toString().indexOf('.') >= 0) {
              mostIntegral = +(this.totalAmount.toString().split('.')[0])
            } else if (this.totalAmount.toString().indexOf('.') == -1) {
              mostIntegral = this.totalAmount
            }
            let totalAmountIntegral = +(this.transIntegral(mostIntegral))
            this.integralHTML = totalAmountIntegral + "($" + mostIntegral.toFixed(2) + ")"
            this.integralPrice = +(this.transfromPrice(totalAmountIntegral))//消耗积分所抵扣的钱
            this.integral = totalAmountIntegral
          } else if (inputIntegral <= +(this.transIntegral(this.totalAmount))) {//输入的抵扣金额小于可以抵扣的金额
            let amount = this.transRemainder(+(inputIntegral));//输入积分抵扣的金额
            this.integralHTML = +(this.transIntegral(amount)) + "($" + (amount).toFixed(2) + ")"
            this.integralPrice = amount//消耗积分所抵扣的钱
            if (amount == 0) {
              this.integral = 0
            } else {
              this.integral = this.transIntegral(amount)
            }
          }
          document.getElementById('price').innerHTML = this.integral
          return
        } else {
          MessageBox.alert('只能输入整数').then(result => {
            document.getElementById('price').innerHTML = 0
          })
          return
        }
      },
      //跳转到注册页
      jumpRegister() {
        this.$router.replace("/register")
      },
      //计算折扣,税费
      beforeComputed(goodsTotalAmount, discount, isTax, taxRate, isPreDiscountTax) {
        function add(a, b) {
          return (a * 100 + b * 100) / 100;
        }

        function sub(a, b) {
          return (a * 100 - b * 100) / 100;
        }

        function mul(a, b) {
          return ((a * 100) * (b * 100)) / (100 * 100);
        }

        // 折hou金额
        let baseAmount = mul(goodsTotalAmount, discount); // 100 * (1-0.9) = 10 || 14.97 * 0.5 = 7.485(7.49)
        baseAmount = this.appUtil.round(baseAmount, 2)
        // this.total = this.appUtil.round(this.total + item.total_amount, 2);
        //round
        // 折kou金额
        let discountAmount = sub(goodsTotalAmount, baseAmount); // 100 - 10 = 90 || 14.97-7.49 = 7.48
        //税费金额
        let taxAmount = 0;
        if (isTax) {
          // 有税
          if (isPreDiscountTax) {
            // 折前税
            taxAmount = mul(goodsTotalAmount, taxRate); // 100 * 0.15 = 15
          } else {
            // 折后税
            taxAmount = mul(baseAmount, taxRate); // 90 * 0.15 = 13.5
          }
        }
        discountAmount = parseFloat(discountAmount.toFixed(2))
        baseAmount = parseFloat(baseAmount.toFixed(2))
        taxAmount = parseFloat(taxAmount.toFixed(2))
        return {
          goodsTotalAmount: goodsTotalAmount,// 商品总价|小计
          discountAmount: discountAmount,// 折扣金额
          taxAmount: taxAmount,// 税费金额
        }
      },
      //计算小费
      afterComputed(isTip, tipRate, isPreDiscountTip, isPreTaxTip, taxAmount) {
        function add(a, b) {
          return (a * 100 + b * 100) / 100;
        }

        function sub(a, b) {
          return (a * 100 - b * 100) / 100;
        }

        function mul(a, b) {
          return ((a * 100) * (b * 100)) / (100 * 100);
        }

        let baseAmount = parseFloat(sub(this.total, this.discountAmount).toFixed(2))
        //小费金额
        let tipAmount = 0;
        if (isTip) {
          if (tipRate == "tipInput") {
            tipAmount = +(this.tipInputVal)
          } else {
            if (isPreDiscountTip) {
              // 折前小费
              let tipBase = this.total;
              if (isPreTaxTip) {
                // 税前小费
                tipAmount = mul(tipBase, tipRate); // 100 * 0.01 = 1
              } else {
                // 税后小费
                tipAmount = mul(add(tipBase, taxAmount), tipRate);
                // (100 + 税费)* 0.01 【(100 + 15)* 0.01 =1.15，(100 + 13.5)* 0.01 =1.135】
              }
            } else {
              // 折后小费
              let tipBase = baseAmount;
              if (isPreTaxTip) {
                // 税前小费
                tipAmount = mul(tipBase, tipRate); // 90 * 0.01 = 0.9
              } else {
                // 税后小费
                tipAmount = mul(add(tipBase, taxAmount), tipRate);
                // (90 + 税费)* 0.01 【(90 + 15)* 0.01 =1.05，(9 + 13.5)* 0.01 =1.035】
              }
            }
          }
        }

        tipAmount = parseFloat(tipAmount.toFixed(2));
        let payAmount = parseFloat((baseAmount + this.tax + tipAmount).toFixed(2));
        return {
          tipAmount: tipAmount,// 小费金额
          payAmount: payAmount,// 支付金额
        }
      },
      getComputed() {
        let total = this.total;
        let discount = +(this.$store.getters.discount)
        let isTax = this.$store.getters.isTax == "TRUE"
        let taxRate = +(this.$store.getters.taxRate)
        let isDiscountPreRax = this.$store.getters.isAfterDiscountTax == "TRUE" ? true : false
        let totalAmount = this.beforeComputed(total, discount, isTax, taxRate, isDiscountPreRax)
        this.discountAmount = totalAmount.discountAmount;
        this.tax = totalAmount.taxAmount;
      },
    },
    created() {
      this.toTimeShowText = this.appUtil.dateComputed(this.$store.getters.getToTime, this.$store.getters.timeZone);
      if (this.$store.getters.openMembershipSystem == "TRUE") {
        this.integralPortion = this.$store.getters.fromIntegralConvertRatio.split('/')[0] + ":" + this.$store.getters.fromIntegralConvertRatio.split('/')[1]
      } else {
        this.integralPortion = ""
      }
      if (this.$store.getters.deductionIntegral == "0" || this.$store.getters.deductionIntegral == 0) {
        this.$store.commit('deductionIntegral', 0)
      }
      //进入details页面,购物车没有菜品
      if (this.$store.getters.shopCartList == null || this.$store.getters.shopCartList == undefined || this.$store.getters.shopCartList.length == 0) {
        MessageBox.alert("非法访问").then(action => {
          if (this.appUtil.isWx()) {
            this.appUtil.closeWx();
          } else if (this.appUtil.isAli()) {
            this.appUtil.closeAli();
          } else {
            history.back();
          }
        });
        return;
      }
      this.goodsList = this.$store.getters.shopCartList;
      for (let goods of this.goodsList) {
        this.total += +(this.ItemCalc(goods))
      }
      this.getComputed();
      this.totalAmount = this.total - this.discountAmount + this.tax
      window.setTimeout((result) => {
        this.isShow = true;
      }, 1000);
    },
    mounted() {
      if (this.$store.getters.openMembershipSystem == "TRUE" && this.$store.getters.isStoreUser == "TRUE") {
        // this.$store.getters.deductionIntegral > 0 ? this.integral = this.$store.getters.deductionIntegral : this.integral = 0
        // this.$store.getters.deductionIntegral > 0 ? this.integralHTML = this.$store.getters.deductionIntegral + "($" + this.transfromPrice(this.$store.getters.deductionIntegral) + ")" : ""
        this.integralKeyboard = window.keyboard.init(document.getElementById("contentKey"), document.getElementById('price'), {
          length: +(this.nowAsBeforeIntegra.toString().length),
          point: false,
          svgIcon: false,
          amountTesting: {
            isOpen: true,
            amount: +(this.$store.getters.nowIntegralNumber)
          }
        })
        $("#contentKey").removeClass("active")
      }
    },
    destroyed: function () {
      Indicator.close();
    },
    watch: {
      integral: {
        handler: function (newVal, oldVal) {
          this.isDeduction = false
          let totalIntegral = this.transIntegral(this.totalAmount)
          if (totalIntegral == newVal) {
            this.isDeduction = true
          }
        }
      },
      tipItem: {
        handler: function (newVal, oldVal) {
          let tipList = this.$store.getters.tipVal.split(",");
          let isTip = this.$store.getters.isTip == "TRUE"
          let tipRate
          if (isNaN(newVal)) {
            if (newVal == "tipInput") {
              tipRate = 'tipInput'
            } else {
              tipRate = 0
            }
          } else {
            tipRate = parseFloat(tipList[newVal])
          }
          let isDiscountPreTip = this.$store.getters.isAfterDiscountTip == "TRUE" ? true : false
          let isPreTax = this.$store.getters.tipType == "PRE_TAX"
          let totalAmount = this.afterComputed(isTip, tipRate, isDiscountPreTip, isPreTax, this.tax)
          this.tipAmount = totalAmount.tipAmount;
          this.totalAmount = totalAmount.payAmount;
          // this.totalAmount = this.totalAmount+this.tipAmount;
        }
      }
    }
  };
</script>

<style scoped>
  .integral-keyboard {
    width: 100%;
  }

  .bill-back {
    width: 20px;
    height: 20px;
    font-weight: 600;
    color: red;
    position: relative;
    top: 10px;
  }

  .mui-bar-nav {
    background: #ffffff;
  }

  .mui-bar-nav {
    top: 0;
    box-shadow: 0 1px 6px #ccc;
  }

  .mui-bar {
    position: fixed;
    z-index: 10;
    right: 0;
    left: 0;
    height: 44px;
    padding-right: 10px;
    padding-left: 10px;
    border-bottom: 0;
    background-color: #f7f7f7;
    box-shadow: 0 0 1px rgba(0, 0, 0, .85);
    backface-visibility: hidden;
  }

  .mui-bar-nav.mui-bar .mui-icon {
    margin-right: -10px;
    margin-left: -10px;
    padding-right: 10px;
    padding-left: 10px;
  }

  .mui-bar .mui-icon {
    font-size: 24px;
    position: relative;
    z-index: 20;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .mui-icon {
    font-family: Muiicons;
    font-size: 24px;
    line-height: 1;
    display: inline-block;
  }

  .mui-bar .mui-title {
    right: 40px;
    left: 40px;
    display: inline-block;
    overflow: hidden;
    width: auto;
    margin: 0;
    text-overflow: ellipsis;
  }

  .mui-title {
    font-size: 17px;
    font-weight: 500;
    line-height: 44px;
    position: absolute;
    display: block;
    width: 100%;
    margin: 0 -10px;
    padding: 0;
    text-align: center;
    white-space: nowrap;
    color: #000;
  }

  .mui-bar-nav .nav-bar-btn {
    border-radius: 12px;
    border: 1px solid rgba(237, 91, 91, 1);
    font-size: 12px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(237, 91, 91, 1);
    padding: 0px 7px;
  }

  .float-right {
    float: right;
    margin: 0.7rem;
  }

  .mui-content {
    position: relative;
    color: #333;
    background-image: linear-gradient(0deg, #efeff4, #efeff4 65%, hsla(0, 0%, 96%, .3) 75%, hsla(0, 0%, 96%, 0)), linear-gradient(270deg, #ed5b5b, #f16f6f);
    padding: 44px 5% 40px 5%;
    font-size: 14px;
  }

  .mui-content .info {
    background: #ffffff;
    border-radius: 5px;
    padding: 5%;
    margin-top: 1.5rem;
  }

  .mui-content .info .total-amount {
    font-size: 24px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(237, 91, 91, 1);
    text-align: center;
  }

  .mui-content .info .desk-no {
    text-align: center;
    padding: 1rem;
    font-size: 16px;
    display: flex;
    flex-flow: column;
  }

  .mui-content .info .goods-header {
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px dashed #ece4e4;
    padding: 10px 0px;
    margin-bottom: 10px;
  }

  .mui-content .info .goods-header .name {
    overflow: hidden;
    -webkit-box-flex: 6;
    flex: 6;
    color: rgba(51, 51, 51, 1);
  }

  .mui-content .info .goods-header .count {
    overflow: hidden;
    -webkit-box-flex: 1.5;
    flex: 1.5;
    text-align: center;
    color: rgba(51, 51, 51, 1);
  }

  .mui-content .info .goods-header .price {
    overflow: hidden;
    -webkit-box-flex: 2.5;
    flex: 3;
    text-align: right;
    color: #ED5B5B;
  }

  .mui-content .info .goods-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 1rem;
  }

  .mui-content .info .goods-item .group-name {
    overflow: hidden;
    -webkit-box-flex: 6;
    flex: 6;
  }

  .mui-content .info .goods-item .group-name .name {
    color: rgba(51, 51, 51, 1);;
    margin: 0;
  }

  .mui-content .info .goods-item .group-name .spec-list {
    margin: 0;
  }

  .mui-content .info .goods-item .group-name .spec-list span {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }

  .mui-content .info .goods-item .group-count {
    -webkit-box-flex: 1;
    flex: 1;
    text-align: right;
  }

  .mui-content .info .goods-item .group-amount {
    -webkit-box-flex: 3;
    flex: 3;
    text-align: right;
    color: #ED5B5B;
  }

  .mui-content .info .cost-info {
    border-top: 1px dashed #ece4e4;
    border-bottom: 1px dashed #ece4e4;
  }

  .mui-content .info .cost-info .item {
    display: flex;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    padding: 10px 0px;

  }

  .mui-content .info .cost-info .item p {
    color: #000;
    font-size: 14px;
    margin: 0;
  }

  .mui-content .info .cost-info .item p.subtotal {

  }

  .mui-content .info .total {
    text-align: right;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 0px;
  }

  .mui-content .info .total .price {
    color: rgba(237, 91, 91, 1);
    font-size: 18px;
  }

  .pay-btn {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    margin-top: 1.5rem;
    background: rgba(237, 91, 91, 1);
    box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
    border-radius: 24px;
    font-size: 16px;
  }

  /*键盘样式*/
  .modal-tips-keyboard {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    font-size: 24px;
    line-height: 24px;
    background: #f6f6f6;
    color: #4a4a4a;
    width: 100%;
    height: 40%;
    user-select: none;
    transition-property: transform visibility;
    transition-duration: 0.6s;
    font-weight: 300;
    border-top: 1px solid #e5e5e5;
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
    z-index: 999999999;
  }

  .modal-tips-keyboard table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .modal-tips-keyboard td:first-child {
    border-left: none;
  }

  .modal-tips-keyboard td:nth-of-type(-n + 3) {
    font-weight: 600;
  }

  .modal-tips-keyboard td {
    text-align: center;
    width: 33.33%;
    border: 1px solid #ddd;
  }

  .modal-tips-keyboard .icon {
    font-size: 12px;
  }

  .modal-tips-keyboard .icon svg {
    width: 18px;
    height: 18px;
  }

  .modal-tips-keyboard td[data-code="K"] {
    font-size: 20px;
    background: #ed5b5b;
    color: #ddd;
  }

  .modal-tips-keyboard.active {
    visibility: visible;
    transform: translateZ(0);
  }

  .register-prompt {
    color: #ED5B5B;
    font-size: 12px;
    text-align: right;
    text-decoration: underline;
    margin-bottom: 0;
  }

  .total-width {
    width: 80px;
    margin: 0;
  }

  .promiseBtn {
    color: #26a2ff;
    width: 50%;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
  }

  #moneys {
    margin: 0;
  }

  .integral-item div:nth-child(2) {
    position: relative;
    right: 2px;
  }

  .integral-item {
    display: flex;
    flex-flow: column;
  }

  .item-box {
    display: flex;
    color: #ED5B5B;
    font-size: 13px;
  }

  .integral-text {
    padding: 0 7px;
    letter-spacing: .5px;
  }

  .item {
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
    padding: 10px 0px;
  }

  .cost-border {
    border-bottom: 1px dashed #ece4e4;
  }

  .consumption-info {
    font-size: 12px;
    padding: 0 10px;
    padding-top: 5px;
  }

  .consumption-info span {
    font-size: 13px;
    font-weight: 600;
    color: red;
  }

  @media screen and (max-width: 320px) {
    .integral-item div:nth-child(1) {
      font-size: 12px !important;
    }
  }

  .integral-item-toTime {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .pay-btn-disable {
    background-color: #cccccc;
    box-shadow: 0 0 10px 0px #cccccc;
  }

</style>
