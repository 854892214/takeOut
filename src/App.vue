<template>
  <div>
    <transition>
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        val: "首页",
        transitionName: ""
      };
    },
    computed: {
      key() {
        return this.$route.name !== undefined
          ? this.$route.name + new Date()
          : this.$route + new Date();
      }
    }
  };
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 17px;
    line-height: 21px;
    color: #000;
    background-color: #f5f5f5;
  }

  input {
    outline: none;
  }

  select {
    appearance: none;
    outline: none;
  }
</style>

