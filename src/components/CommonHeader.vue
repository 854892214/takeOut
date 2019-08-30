<template>
  <div class="header">
    <div class="back">
      <div v-if="backHandler !== undefined"
           @click="back">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-return"></use>
        </svg>
      </div>
    </div>
    <span>{{title}}</span>
    <div class="option"
         :style="option !== undefined && option.length>0 ? '' : 'width:0'">
      <div class="option-item"
           v-for="(item, index) in option"
           @click="optionHandler(item)">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonHeader",
    props: {
      backHandler: Function,
      title: String,
      option: Array
    },
    data: function () {
      return {}
    },
    methods: {
      back() {
        if (this.$props.backHandler !== undefined) {
          this.$props.backHandler();
        }
      },
      optionHandler(option) {
        if (option.handler !== undefined) {
          this.$emit(option.handler);
        }
      }
    },
    created() {

    }
  }
</script>

<style scoped lang="less">
  .common-center {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @primary-color: #ED5B5B;

  @common-header-height: 44px;

  .header {
    position: relative;
    z-index: 999;
    height: 44px;
    background-color: white;
    color: @primary-color;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 5px #888888;

    .back {
      min-width: @common-header-height;
      width: @common-header-height;
      height: @common-header-height;
      .common-center;

      div {
        .common-center;
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }

    span {
    }

    .option {
      min-width: @common-header-height;

      .option-item {
        width: 24px;
        height: 24px;

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .header(@show-shadow) when (@show-shadow = true) {
    .header;
    box-shadow: 0 0 15px #888888;
  }
</style>
