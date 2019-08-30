<template>
  <div class="not-found">
    <div class="box">
      <div>
        <img src="../../assets/img/404_img1.png" alt>
      </div>
      <div>
        <img src="../../assets/img/404_img2.png" alt>
      </div>
      <h3>页面不存在......</h3>
      <h3 v-if="count>=1">{{count}}秒后自动关闭</h3>
    </div>
  </div>
</template>

<script>
  import util from '../../util'

  export default {
    data() {
      return {
        count: 5,
        myTimer: null
      };
    },
    methods: {},
    created() {
      this.myTimer = setInterval(() => {
        if (this.count <= 1) {
          util.closeClient();
        }
        this.count--;
      }, 1000);
    },
    //页面离开后执行一些清理操作
    destroyed: function () {
      clearInterval(this.myTimer);
    }
  };
</script>

<style scoped lang="less">
  @import "../../assets/css/common";

  .not-found {
    width: 100%;
    height: 100vh;
    .common-center;

    .box {
      text-align: center;
    }
  }
</style>

