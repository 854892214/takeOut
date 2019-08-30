<template>
  <div class="dan-message-box" @click="cancelHandle()" ref="current">
    <div class="box" @click.stop="">
      <div class="title">提示</div>
      <div class="content">
        <div>{{showMessage}}</div>
        <slot></slot>
      </div>
      <div class="btn">
        <div @click.stop="cancelHandle()" v-if="!this.cancelForbid">
          <div>取消</div>
        </div>
        <div @click.stop="okHandle()">
          <div>确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DanMessageBox",
    props: {
      displayType: String,
      okProp: Function
    },
    data: function () {
      return {
        showMessage: '',
        cancelForbid: false
      }
    },
    methods: {
      cancelHandle() {
        if (this.cancelForbid) {
          return;
        }
        this.close();
      },
      okHandle() {
        if (this.ok === undefined) {
        } else {
          this.ok();
        }
        if (this.okProp === undefined) {
        } else {
          if (!this.okProp()){
            return;
          }
        }
        this.close();
      },
      close(){
        if (this.displayType !== undefined && this.displayType === 'hidden'){
          this.$emit("close");
        } else {
          this.$refs.current.remove();
        }
      }
    },
    mounted() {

    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .dan-message-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2000;
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
