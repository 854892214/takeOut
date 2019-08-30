<template>
  <div id="login">
    <common-header :back-handler="back" title="绑定电话"></common-header>
    <div class="content">
      <div class="content-box">
        <div class="phone-input">
          <div class="country-code">
            <select :disabled="this.isValidating" v-model="countryCode">
              <option value="1">+1</option>
              <option value="86">+86</option>
            </select>
          </div>
          <div class="phone">
            <input type="number"
                   :disabled="this.isValidating"
                   v-model="phone" placeholder="请填写您的手机号" @blur="appUtil.commonBlur()" ref="phone">
          </div>
        </div>
        <div class="validate-code-input">
          <div class="validate-code">
            <input type="text" placeholder="请填写您的验证码" v-model="code" @blur="appUtil.commonBlur()" ref="code">
          </div>
          <div class="validate-code-btn"
               :class="this.isValidating ? 'disable' : ''"
               @click="getCode()">
            <div>
              {{this.isValidating ? '剩余'+taskEndTime+'秒' : '获取验证码'}}
            </div>
          </div>
        </div>
        <div class="binding"
             :class="this.isLogging ? 'disable' : ''"
             @click="login()">
          <div class="binding-btn">绑定电话</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
  import httpClient from '../http';

  export default {
    name: "Register",
    components: {CommonHeader},
    data() {
      return {
        phone: "",
        countryCode: "1",
        respCode: "",//验证码
        code: "",//输入的验证码
        taskEndTime: 60,
        isLogging: false,
        isValidating: false,
      }
    },
    methods: {
      back() {
        this.$router.replace({
          path: '/home/my'
        })
      },
      allInputBlur() {
        this.$refs.phone.blur();
        this.$refs.code.blur();
      },
      scrollToTop: function () {
        window.scrollTo(0, 0);
      },
      login() {
        this.allInputBlur();
        if (this.isLogging) {
          return false;
        }
        if (this.phone === "" || this.phone == null) {
          this.$danMessageBox("请输入手机号码");
          return false;
        }
        if (!(/^1[34578]\d{9}$/.test(this.phone)) && this.countryCode === "86") {
          this.$danMessageBox("手机号码格式不正确", function () {

          }, true);
          return false;
        }
        if (this.countryCode === "1" && this.phone.length <= 5) {
          this.$danMessageBox("手机号码长度不正确", function () {

          }, true);
          return false;
        }
        if (this.code === "" || this.code == null) {
          this.$danMessageBox("请输入验证码");
          return false;
        }
        if (this.respCode !== this.code) {
          this.$danMessageBox("验证码有误");
          return false;
        }

        let wxOpenId = "";
        let alipayUserId = "";

        if (process.env.NODE_ENV === "development") {
          alipayUserId = this.$store.getters.userId;
        } else {
          if (this.appUtil.isWx()) {
            wxOpenId = this.$store.getters.userId;
          } else if (this.appUtil.isAli()) {
            alipayUserId = this.$store.getters.userId;
          }
        }

        this.isLogging = true;

        let storeId = this.$store.getters.storeId;

        httpClient.registerUser(storeId, {
          "phone": this.phone,
          "country_code": this.countryCode,
          "wx_open_id": wxOpenId,
          "alipay_user_id": alipayUserId
        }, {
          "Content-type": "application/json",
        }).then(result => {
          console.log(result)
          if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
            this.$danMessageBox("注册成功!", () => {
              this.$store.commit("isStoreUser", "TRUE"); //店铺用户是否存在
              this.$store.commit("storeScanGoodsUser", result.data.storeScanGoodsUser ? result.data.storeScanGoodsUser : {}); //店铺用户信息
              this.$router.replace({
                path: "/my",
                name: "My"
              })
            }, true)
          } else if (result.data.result_msg == "PHONE_ALREADY_BOUND_ACCOUNT") {
            this.$danMessageBox("电话已被使用!", () => {}, true)
          } else if (result.data.result_msg == "ACCOUNT_ALREADY_BOUND_PHONE") {
            this.$danMessageBox("账户已绑定电话!", () => {}, true)
          } else {
            this.$danMessageBox("注册失败!", () => {

            }, true)
          }
        })
      },
      //获取验证码按钮
      getCode() {
        if (this.isValidating) {
          return false;
        }
        if (this.phone === "" || this.phone == null) {
          this.$danMessageBox("请输入手机号码");
          return false;
        }
        if (!(/^1[34578]\d{9}$/.test(this.phone)) && this.countryCode === "86") {
          this.$danMessageBox("手机号码格式不正确");
          return false;
        }
        if (this.countryCode === "1" && this.phone.length <= 5) {
          this.$danMessageBox("手机号码长度不正确");
          return false;
        }

        this.isValidating = true;

        httpClient.getValidateCode(this.qs.stringify({
          phone: this.phone,
          countrycode: this.countryCode
        })).then(result => {
          if (result.data.result_code === "ok") {
            this.respCode = result.data.randomCode;
            let TaskTime = setInterval(() => {
              this.taskEndTime--;
              if (this.taskEndTime <= 0) {
                this.isValidating = false;
                this.isLogging = false;
                this.respCode = "";
                clearInterval(TaskTime);
                this.taskEndTime = 60;
              }
            }, 1000);
          } else {
            this.isValidating = false;
            this.$danMessageBox("请输入正确的手机号码", function () {

            }, true);
          }
        });
      },
    },
    created() {
      if (this.$route.query.registerTip !== undefined) {
        this.$danMessageBox("当前用户未绑定，请先绑定");
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #login {

    .content {
      height: calc(100vh - @common-header-height - @common-navigation-bar-height);
      .common-center;

      .content-box {
        width: 90vw;

        > div {
          display: flex;
          flex-direction: row;
          height: 42px;
          background-color: white;
          margin: @space-width;
          border-radius: 3px;
          border: 1px solid #a9a9a9;
        }

        input {
          border: 0;
          background-color: transparent;
          margin: 0;
          height: 42px;
          padding-left: 10px;
          width: calc(100% - 10px);

        }

        .phone-input {
          .country-code {
            width: 25vw;
            .common-center;

            select {
              margin: 0;
              height: 42px;
              border: 0;
              border-radius: 0;
              background-color: transparent;
              width: 100%;
              text-align-last: right;
              appearance: none;
              padding-right: @space-width;
              padding-left: @space-width;
            }
          }

          .phone {
            width: calc(100% - 25vw);
            border-left: 1px solid #a9a9a9;
          }
        }

        .validate-code-input {
          display: flex;
          flex-direction: row;
          align-items: center;

          .validate-code {
            width: calc(100% - 25vw);
          }

          .validate-code-btn {
            width: 25vw;
            height: 42px;
            background-color: @primary-color;
            color: white;
            .common-center;
            border-left: 1px solid #a9a9a9;
          }
        }

        .binding {
          margin-top: @space-width * 2;
          background-color: @primary-color;
          color: white;
          .common-center;
          border: 0;
        }
      }

      .disable {
        background-color: @primary-disable-color !important;
        color: white !important;
      }
    }
  }
</style>
