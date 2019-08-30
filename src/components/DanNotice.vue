<template>
  <div class="dan-notice" ref="current">
    <div class="content">
      {{showMessage}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "DanNotice",
    data: function () {
      return {
        showMessage: '',
        time: 0
      }
    },
    created() {
      let time = 300;
      if (this.time > 0) {
        time = this.time;
      }
      let _this = this;
      let interval = setInterval(() => {
        _this.$refs.current.remove();
        clearInterval(interval)
      }, time);
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .dan-notice {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    height: 100vh;
    background-color: transparent;
    .common-center;

    .content {
      background-color: rgba(0, 0, 0, 0.4);
      padding: 8px @space-width;
      border-radius: 3px;
      color: white;
    }
  }
</style>
