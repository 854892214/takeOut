<template>
  <div class="number-count">
    <div class="count">
      {{count}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "NumberCount",
    props: {
      count: Number
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .number-count {
    width: 20px;
    height: 20px;
    background-color: @primary-color;
    color: white;
    line-height: 20px;
    border-radius: 50%;
    .common-center;

    .count {
      font-size: 12px;
      line-height: 14px;
      width: 14px;
      text-align: center;
    }
  }
</style>
