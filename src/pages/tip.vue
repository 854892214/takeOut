<template>
  <div id="tip-content">
    <div class="title">添加小费</div>
    <div class="tip-cell">
      <div class="tip-item"v-if="this.$store.getters.isTip === 'TRUE'" @click="saveTip(0)">
        无小费
      </div>
      <div class="tip-item" v-for="tip of tipList" @click="saveTip(tip.tipAmount.toFixed(2))">
        小费：{{tip.tipVal * 100}}%(${{tip.tipAmount.toFixed(2)}})
      </div>
      <div class="input" v-if="this.$store.getters.isCustomTip === 'TRUE'">
        <div class="input-warp" @click="showKeyBord">
          <span>$</span>
          <span id="Js_tip_input" class="tip-input-val">{{tipInputVal}}</span>
        </div>
        <div class="addInputTip" @click="saveTip(tipInputVal)">添加</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    MessageBox
  } from "mint-ui";

  export default {
    name: "hello",
    data() {
      return {
        tipList: [],
        //保存选中小费
        tipAmount: 0,
      };
    },
    methods: {
      //显示小费键盘
      showKeyBord(e) {
        this.$emit("showTipKeyBord", true);
      },
      //确认小费
      saveTip(tipAmount) {
        if(tipAmount === "" || tipAmount === null){
          MessageBox.alert("请输入小费");
          return false;
        }
        this.$emit("saveTip", parseFloat(tipAmount));
      },
      computeTipList() {
        //小费计算总价金额
        let totalAmount = 0.00;
        if(this.$store.getters.tipType === 'AFTER_TAX' && this.$store.getters.isTax === 'TRUE' ){
          if(this.$store.getters.isAfterDiscountTax === "TRUE"){
            totalAmount = this.total + this.tax;
          }else{
            totalAmount = this.afterDiscountAmount + this.tax;
          }
        }else{
          if(this.$store.getters.isAfterDiscountTip === "TRUE"){
            totalAmount = this.total;
          }else{
            totalAmount = this.afterDiscountAmount;
          }
        }
        let tipRateList = this.$store.getters.tipVal.split(",");
        for (let tipRate of tipRateList) {
            this.tipList.push({"tipVal": tipRate, "tipAmount": this.appUtil.amountMul(tipRate,totalAmount)});
        }
      }
    },
    props: [
      "afterDiscountAmount",
      "total",
      "tax",
      "tipInputVal"
    ],
    created() {
      this.computeTipList();
    },

    computed: {},
    watch: {},
    mounted: function () {

    }
  };
</script>

<style>
  #tip-content {
    margin-bottom: 20px;
    overflow-y: hidden
  }

  #tip-content .title {
    text-align: center;
    padding: 20px 20px 10px 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

  #tip-content .tip-cell {
    position: relative;
    padding: 10px;
  }

  #tip-content .tip-cell .tip-item {
    padding: 15px;
    margin-bottom: 10px;
    /*border-radius: 24px;*/
    border: 1px solid rgba(204, 204, 204, 1);
    padding-left: 1.3rem;
    font-size: 14px;
    color: rgb(62, 61, 61);
    text-align: center;
  }

  #tip-content .tip-cell .tip-item.active {
    background: rgba(237, 91, 91, 0.2) !important;
    border: 1px solid rgba(237, 91, 91, 1) !important;
  }

  #tip-content .saveTipBtn {
    padding: 15px;
    border-radius: 24px;
    background: rgba(237, 91, 91, 1);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
    box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
    text-align: center;
    margin: 0px 10px 10px 10px;
    color: #fff;
  }

  #tip-content .addInputTip {
    width: 35%;
    float: left;
    margin-left: 5%;
    padding: 13px;
    background: rgba(237, 91, 91, 1);
    text-align: center;
    color: #fff;
  }

  #tip-content .tip-input-val{
    padding-left: 10px;
  }
  #tip-content .input-warp {
    width: 60%;
    overflow: hidden;
    padding: 12px;
    float: left;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0px;
  }
  #tip-content .input{
    display: flex;
    width: 100%;
  }
</style>
