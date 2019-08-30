<template>
  <div >
    <common-header :back-handler="back" title="编辑收货地址"></common-header>
    <div id="map_canvas"></div>
    <div class="near-address">
      <div>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingweixiao"></use>
        </svg>
        <span>附近地址</span>
      </div>
      <div class="address-item" v-for="item in 3">
        <div>锦绣龙城</div>
        <div>湖北省武汉市洪山区民族大道与水蓝湖交叉处往南约150米</div>
      </div>
    </div>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
    export default {
        name: "Map",
        data(){
          return{
            addressInfo:{}
          }
        },
      components:{
        CommonHeader
      },
      methods:{
        back(){
          this.$router.replace({
            path:"addressDetail",
            query:{
              addressInfo:this.addressInfo,
              isAdd:false
            }
          })
        }
      },
      created(){
        this.addressInfo = this.$route.query.addressInfo
      }
    }
</script>

<style lang="less" scoped>
  #map_canvas{
    height: 300px;
    width: 99%;
    border: 1px solid #cccccc;
  }
  .near-address{
    margin: 1rem;
    div:nth-child(1) span{
      font-size: 15px;
      color: #7b7777;
    }
    .address-item{
      margin: 1rem;
      padding: 1rem 0;
      padding-top: 0;
      border-bottom: 1px solid #e2e1e1;
      div:nth-child(2){
        font-size: 14px;
        color: #bbb8b8;
        margin-top: 10px;
      }
    }
  }
  .icon{
    width: 15px;
    height: 15px;
  }
</style>
