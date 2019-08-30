<template>
  <div id="about-us">
    <common-header :back-handler="back" title="关于我们"></common-header>
    <div class="content">
      <p class="line">汉特支付是美国领先的微信支付及跨境支付方案服务商，提供人民币到美元的多样支付方案。</p>
      <p class="line item">1、中国用户通过支付宝、微信支付和银联用人民币进行付款。</p>
      <p class="line item">2、美国商家可以用本系统进行美元收款。</p>
      <p class="line item">3、功能包括订单生产、支付状态查询、成功通知、退款操作。</p>
      <p class="line item">4、本系统提供商户的开户申请和资料预审操作。</p>
      <p class="line">Hante Corp.，2016年成立于美国洛杉矶,为全美领先的提供中美跨境移动支付解决方案与增值服务的专业公司。</p>
      <p class="line">提供跨境收款移动端，多平台、多币种等支付方案的全方位服务以及商户管理系统、代理商管理系统等增值服务。</p>
      <p class="line">在超市、餐饮、旅游、留学等数十类行业中具有广阔的应用前景和拓展空间。</p>
      <p class="line">有华人的地方，就有微信支付；有微信支付的地方，就有汉特的服务。</p>
      <p class="line">客服电话：1-833-833-8033</p>
      <a href="customerservice_en@hante.com">customerservice_en@hante.com</a>
    </div>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";

  export default {
    name: "AboutUs",
    components: {CommonHeader},
    data: function () {
      return {}
    }, methods: {
      back() {
        this.$router.replace({
          path: '/home/my',
          name: 'My'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #about-us {

    .content {
      height: calc(100vh - @common-header-height - 20px);
      margin: @space-width;
      padding: @space-width;
      background-color: white;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      .line {

      }

      .item {
        margin-left: @space-width;
      }
    }
  }
</style>
