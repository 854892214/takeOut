<template>
  <div id="receipt-box" @click="cancelHandle()" ref="current">
    <div class="box" @click.stop="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ReceiptBox",
    methods: {
      cancelHandle() {
        this.$emit('close');
      },
    },
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #receipt-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    .common-center;

    .title {
      padding: @space-width;
    }

    .content {
      width: 100%;
      padding: @space-width;
      .common-center;
    }

    .box {
      width: 86vw;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid @primary-disable-light-color;
      border-radius: 3px;

      .btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
        border-top: 1px solid @primary-disable-light-color;

        div {
          width: 100%;
          height: inherit;
          .common-center;
        }

        > :nth-child(2) {
          border-left: 1px solid @primary-disable-light-color;
        }
      }
    }
  }
</style>
