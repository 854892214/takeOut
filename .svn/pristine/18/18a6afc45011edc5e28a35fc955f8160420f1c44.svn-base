<template>
  <div class="copy-button" @click="copy()">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-fuzhi"></use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "CopyButton",
    props: {
      copyContent: String
    },
    methods: {
      copy() {
        this.appUtil.copyToClipboard(this.copyContent)
        this.$danNotice("复制完成")
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .copy-button {
    width: 18px;
    height: 18px;
    font-size: 10px;
    background-color: transparent;
    border-radius: 3px;
    margin: 0 4px;
    cursor: pointer;
    color: white;
    .common-center;

    svg {
      width: 18px;
      height: 18px;
    }
  }
</style>
