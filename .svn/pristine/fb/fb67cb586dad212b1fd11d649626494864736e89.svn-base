<template>
  <div class="goods-specifications" ref="current" @click="cancelHandle()">
    <div class="box" @click.stop="">
      <div class="top">
        <div class="goods-img" v-lazy:background-image="goodsDetail.photo + '?x-oss-process=image/resize,w_180'"
             v-if="goodsDetail.photo !== undefined">
        </div>
        <div class="goods-img" v-if="goodsDetail.photo === undefined">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tupian"></use>
          </svg>
        </div>
        <div class="top-description">
          <div class="close" @click="cancelHandle()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shibai"></use>
            </svg>
          </div>
          <div class="goods-info">
            <span>${{appUtil.amountFormat(goodsDetail.amount)}}</span>
          </div>
          <div class="specification-info">
            <!--            <div v-if="!selectedSpecificationInfo">-->
            <!--              选择规格信息-->
            <!--            </div>-->
            <!--            <div v-if="selectedSpecificationInfo">-->
            <!--              选择规格信息-->
            <!--            </div>-->
            <div class="operation">
              <div>
                购买数量
              </div>
              <div class="addSub">
                <div class="icon-btn"
                     v-if="selectedCount>0"
                     @click.stop="subtractGoodsCount()">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jian"></use>
                  </svg>
                </div>
                <span v-if="selectedCount>0"
                      class="cart-count">{{selectedCount}}</span>
                <div class="icon-btn"
                     v-if="goodsDetail.quantity - currentGoods.count - selectedCount > 0 || goodsDetail.inventory_status === 1"
                     @click.stop="addGoodsCount()">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jia"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="wrapper" ref="wrapper">-->
      <!--        <div class="content">-->
      <!--          <div class="specification-category-list" v-if="goodsDetail.specificationInfoList !== undefined && goodsDetail.specificationInfoList.length > 0">-->
      <!--            <div class="specification-category-item" v-for="(category, index) in goodsDetail.specificationInfoList">-->
      <!--              <div class="specification-title">{{category.name}}</div>-->
      <!--              <div class="specification-list">-->
      <!--                <div class="specification-item" v-for="specification in category.lists">-->
      <!--                  {{specification.name}}(${{appUtil.amountFormat(specification.amount)}})-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="operation">-->
      <!--            <div>-->
      <!--              购买数量-->
      <!--            </div>-->
      <!--            <div class="addSub">-->
      <!--              <div class="icon-btn"-->
      <!--                   v-if="selectedCount>0"-->
      <!--                   @click.stop="subtractGoodsCount()">-->
      <!--                <svg class="icon" aria-hidden="true">-->
      <!--                  <use xlink:href="#icon-jian"></use>-->
      <!--                </svg>-->
      <!--              </div>-->
      <!--              <span v-if="selectedCount>0"-->
      <!--                    class="cart-count">{{selectedCount}}</span>-->
      <!--              <div class="icon-btn"-->
      <!--                   v-if="goodsDetail.quantity - currentGoods.count - selectedCount > 0 || goodsDetail.inventory_status === 0"-->
      <!--                   @click.stop="addGoodsCount()">-->
      <!--                <svg class="icon" aria-hidden="true">-->
      <!--                  <use xlink:href="#icon-jia"></use>-->
      <!--                </svg>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="bottom">
        <div class="select" v-if="false">
          <div @click="addToShoppingCart">加入购物车</div>
          <div @click="buyNow">立即购买</div>
        </div>
        <div class="ok" @click="ok" v-if="true">
          <div>确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "GoodsSpecifications",
    props: {
      operationType: String,
      selectedCount: Number,
      goodsDetail: Object,
      currentGoods: Object
    },
    data: function () {
      return {
        goods: {
          photo: undefined
        },
        selectedSpecificationInfo: false
      }
    },
    methods: {
      cancelHandle() {
        this.$emit("close")
      },
      subtractGoodsCount() {
        this.$emit("subtractGoodsCount")
      },
      addGoodsCount() {
        this.$emit("addGoodsCount")
      },
      addToShoppingCart() {
        this.$emit("addToShoppingCart");
        this.$emit("close");
        this.$danNotice("已添加到购物车", 500);
      },
      buyNow() {
        this.$emit("buyNow")
      },
      ok() {
        if (this.operationType === "cart") {
          this.addToShoppingCart();
        }
        if (this.operationType === "buy") {
          this.buyNow();
        }
        if (this.operationType === "addToShopCart") {
          let shopCartList = this.$store.getters.shopCartList
          for (let i = 0; i < shopCartList.length; i++) {
            if (shopCartList[i].id == this.goodsDetail.id) {
              shopCartList[i].count = this.selectedCount
            }
          }
          this.$store.commit("shopCartList",shopCartList)
          this.$emit("close");
          this.$danNotice("已添加到购物车", 500);
        }
      }
    },
    created() {

    },
    mounted() {
      // this.scroll = new BScroll(this.$refs.wrapper, {
      //   click: true,
      //   tap: true,
      //   mouseWheel: true
      // });
    },
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  .goods-specifications {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .box {
      width: 100vw;
      /*height: 70vh;*/
      height: 170px;
      background-color: white;
      border-radius: 12px 12px 0 0;

      .top {
        height: 120px;
        @item-logo-size: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .goods-img {
          width: @item-logo-size;
          height: @item-logo-size;
          margin-left: @space-width;
          background: no-repeat center center;
          background-size: cover;
          border-radius: 3px;
          background-color: @primary-disable-light-color;

          svg {
            width: @item-logo-size;
            height: @item-logo-size;
            fill: gray;
          }
        }

        .top-description {
          width: 100%;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0 @space-width;

          .close {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            svg {
              width: 6vw;
              height: 6vw;
            }
          }

          .goods-info {
            color: @primary-color;
            font-size: 24px;
          }

          .specification-info {
            font-size: 14px;

            .operation {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;


              height: calc(10vw + 10px);
              background-color: white;
              padding: 5px 0;

              .addSub {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                @icon-size: 6vw;

                .icon-btn {
                  width: @icon-size;
                  height: @icon-size;
                  background-color: @primary-color;
                  border-radius: 50%;

                  svg {
                    width: @icon-size;
                    height: @icon-size;
                    .common-center;
                    fill: white;
                  }
                }

                span {
                  margin: 0 2vw;
                }
              }
            }
          }
        }
      }

      .wrapper {
        height: calc(70vh - 120px - 50px);
        overflow: hidden;

        .content {
          padding: @space-width;

          .specification-category-list {

            .specification-category-item {

              .specification-title {
                font-size: 16px;
                margin-bottom: @space-width;
              }

              .specification-list {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;

                .specification-item {
                  padding: 2px 4px;
                  font-size: 14px;
                  background-color: @primary-disable-light-color;
                  border-radius: 3px;
                  margin-right: @space-width;
                  margin-bottom: @space-width;
                }
              }
            }
          }

          .operation {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;


            height: calc(10vw + 10px);
            background-color: white;
            padding: 5px 0;

            .addSub {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;

              @icon-size: 6vw;

              .icon-btn {
                width: @icon-size;
                height: @icon-size;
                background-color: @primary-color;
                border-radius: 50%;

                svg {
                  width: @icon-size;
                  height: @icon-size;
                  .common-center;
                  fill: white;
                }
              }

              span {
                margin: 0 2vw;
              }
            }
          }
        }
      }

      .bottom {
        height: 50px;
        border-top: 1px solid @primary-disable-light-color;
        .common-center;

        > div {
          width: 100%;
          background-color: @primary-color;
          border-radius: calc((50px - 12px) / 2);
          margin: 6px @space-width;
          height: calc(50px - 12px);
          .common-center;
        }

        .ok {
          color: white;
        }

        .select {
          > div {
            width: 100%;
            height: inherit;
            color: white;
            .common-center;
          }

          > :nth-child(1) {
            background-color: darkorange;
            border-radius: calc((50px - 12px) / 2) 0 0 calc((50px - 12px) / 2);
          }
        }
      }
    }
  }
</style>
