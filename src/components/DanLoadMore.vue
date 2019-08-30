<template>
  <div class="dan-load-more wrapper" ref="wrapper">
    <div>
      <div class="topPull">
        <div>刷新</div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="bottomPull"></div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "DanLoadMore",
    props: {
      allLoaded: Boolean
    },
    data: function () {
      return {}
    },
    methods: {
      onTopLoaded() {
        this.scroll.finishPullDown();
      },
      onBottomLoaded() {
        this.scroll.finishPullUp();
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        mouseWheel: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad: {
          threshold: -50
        }
      });

      this.scroll.on('pullingDown', () => {
        this.$emit("refresh");
      });
      this.scroll.on('pullingUp', () => {
        if (!this.allLoaded) {
          this.$emit("loadMore");
        }
      });
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .wrapper {
    position: relative;

    .topPull {
      width: 100%;
      height: 50px;
      position: absolute;
      top: -50px;
      .common-center;
    }

    .content {

    }

  }
</style>
