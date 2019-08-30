<template>
  <div id="loading" :class="type === 'inPage' ? 'in-page': ''" :style="`height:${height};top:${top}`">
    <div class="loading-animation" v-if="type === 'page'">
      <div class="circle-1"></div>
      <div class="circle-2"></div>
    </div>
    <div class="in-page-loading" v-if="type === 'inPage'">
      <div class="loader">Loading...</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Loading",
    props: {
      height: String,
      top: String,
      type: {
        type: String,
        default: 'page'
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .in-page {
    background-color: transparent !important;
  }

  #loading {
    width: 100%;
    background-color: white;
    position: absolute;
    z-index: 9999;
    .common-center;

    .loading-animation {
      position: relative;
      .common-center;

      .circle-1 {
        position: absolute;
        z-index: 10;
        width: 6rem;
        height: 6rem;
        background-color: #ED8E91;
        border-radius: 50%;
        animation: circle 1s infinite;
        animation-direction: alternate;
      }

      .circle-2 {
        position: absolute;
        z-index: 10;
        width: 0;
        height: 0;
        background-color: #ED575B;
        border-radius: 50%;
        animation: circle 1s infinite;
        animation-direction: alternate;
        animation-delay: 1s;
      }

      @keyframes circle {
        from {
          width: 0;
          height: 0;
        }
        to {
          width: 6rem;
          height: 6rem;
        }
      }
    }

    .in-page-loading {
      width: 140px;
      height: 140px;
      background-color: #000000b5;
      border-radius: 9px;
      .common-center;

      .loader,
      .loader:after {
        border-radius: 50%;
        width: 56px;
        height: 56px;
      }

      .loader {
        margin: 0 auto;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border-top: 1.1em solid rgba(255, 255, 255, 0.2);
        border-right: 1.1em solid rgba(255, 255, 255, 0.2);
        border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
        border-left: 1.1em solid #ffffff;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
      }

      @-webkit-keyframes load8 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes load8 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }

    }
  }
</style>
