<template>
  <div id="address-list">
    <!--<common-header :back-handler="back" title="我的地址"></common-header>-->
    <common-header :back-handler="back" title="我的地址"></common-header>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="null-list" v-if="userAddressList === undefined || userAddressList.length<=0">
          <div class="box">
            <div class="null-icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingweixiao"></use>
              </svg>
            </div>
            <div class="null-description">
              请添加收货地址
            </div>
          </div>
        </div>
        <div class="address-box" :class="selectedAddress != null && selectedAddress.id === item.id ? 'selected' : '' " @click="selectOneAddress(item)" v-for="(item,index) in userAddressList">
          <div class="title">
            <span style="font-weight: bold; margin-top: 0;">收货地址：{{index+1}}</span>
          </div>
          <div class="common-line"></div>
          <div class="address-content">
            <div>
              <span style="font-weight: bold">{{item.name}} - {{item.mobile}}</span>
              <span>{{item.address}}</span>
            </div>
            <div @click.stop="editAddress(item)">
              <div class="edit-btn">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiugai"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-address" @click="addAddress()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-increase"></use>
      </svg>
    </div>
  </div>
</template>

<script>
  import CommonHeader from "../../components/CommonHeader";
  import httpClient from '../../http'
  import BScroll from 'better-scroll'

  export default {
    name: "AddressList",
    components: {CommonHeader},
    data: function () {
      return {
        userAddressList: {}
      }
    },
    computed: {
      selectedAddress : function (){
        return this.$store.getters.selectedAddress;
      },
    },
    methods: {
      back() {
        if(this.$route.query.path === "addOrder"){
          this.$router.replace({
            path: '/addOrder',
            name: 'AddOrder',
            params : {
              tipPopupVisible : false,
              tip : this.$route.query.tip
            }
          });
        }else {
          this.$router.replace({
            path: '/my',
            name: 'My'
          });
        }
      },
      addAddress() {
        let location = {
          path: '/addressDetail',
          name: 'AddressDetail',
          query : {
            path : this.$route.query.path,
            tip : this.$route.query.tip,
            editType : 'add'
          }
        };
        this.$router.replace(location)
      },
      editAddress(item) {
        let addressMsg = {
          address:item.address,
          name:item.name,
          mobile:item.mobile,
          latitude:item.latitude,
          longitude:item.longitude
        }
        let location = {
          path: '/addressDetail',
          name: 'AddressDetail',
          query : {
            path : this.$route.query.path,
            tip : this.$route.query.tip,
            id : item.id,
            editType : 'edit',
            // addressMsg:addressMsg,
            addressMsg:JSON.stringify(addressMsg),
          }
        };
        this.$router.replace(location)
      },
      selectOneAddress(address) {
        if(this.$route.query.path === "addOrder"){
          this.$store.commit("selectedAddress", address);
          this.$router.replace({
            path: '/addOrder',
            name: 'AddOrder',
            params : {
              tipPopupVisible : false,
              tip : this.$route.query.tip
            }
          });
        }else{
          return false;
        }
      },
      getAddressList() {
        //{headers: {'Content-type': 'application/json;charset=utf-8'}}
        httpClient.getAddressList(this.qs.stringify({
          storeScanGoodsUser_id: this.$store.getters.storeScanGoodsUser.id
        })).then(result => {
          this.userAddressList = result.data.addressList
        })
      }
    },
    created() {
      this.getAddressList();
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        mouseWheel: true
      });
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/common";

  #address-list {

    .wrapper {
      height: calc(100vh - @common-header-height);
      overflow: hidden;
    }

    .content {
      padding: @space-width;

      .null-list {
        .common-center;
        height: 38vh;
        width: 100%;

        .box {
          display: flex;
          flex-direction: column;
          align-items: center;

          .null-icon {
            width: 6rem;
            height: 6rem;
            background-color: @primary-light-color;
            border-radius: 50%;
            .common-center;

            svg {
              width: 4rem;
              height: 4rem;
              fill: @primary-color;
            }
          }

          .null-description {
            margin-top: @space-width;
            font-size: 1rem;
            color: gray;
          }
        }
      }

      .address-box {
        background-color: white;
        border-radius: 3px;
        box-shadow: 0 0 2px #dddddd;

        .title {
          padding: @space-width;
          border-radius: 3px 3px 0 0;
        }

        .address-content {
          margin-bottom: @space-width;
          padding: @space-width;
          font-size: 1rem;
          display: flex;
          flex-direction: row;

          @right-width: 30px;

          > :nth-child(1) {
            display: flex;
            flex-direction: column;
            width: calc(100% - @right-width);

            span {
              margin: 0.4rem 0;
            }
          }

          > :nth-child(2) {
            width: @right-width;

            .edit-btn {
              width: @right-width;
              height: @right-width;
              border: 1px solid @primary-disable-color;
              border-radius: 3px;
              .common-center;
            }
          }

          svg {
            width: 24px;
            height: 24px;
          }
        }


      }

      .selected {
        .title {
          background-color: @primary-color;
          color: white;
        }
      }
    }

    @button-size: 20vw;

    .add-address {
      width: @button-size;
      height: @button-size;
      position: absolute;
      right: 20px;
      bottom: 40px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0 0 10px #888;
      .common-center;

      svg {
        width: 14vw;
        height: 14vw;
        fill: @primary-color;
      }
    }
  }
</style>
