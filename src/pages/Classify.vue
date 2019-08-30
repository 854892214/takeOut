<template>
  <div id="classify">
    <common-header title="分类"></common-header>
    <div class="content">
      <div class="wrapper" ref="wrapper1">
        <div id="menuControlContent">
          <div class="left menu-item" :class="i === 0 ? 'active' : '' "
               @click="scrollTag('item_'+i,i)"
               :data-index="i" v-for="(item,i) in list"
               :key="i">
            <div v-text="item.name"></div>
          </div>
        </div>
      </div>
      <div class="wrapper" ref="wrapper2">
        <div id="goodsControlContents">
        <div class="goods-control-content" :id="'item_'+i" v-for="(item,i) in list" :key="i">
          <div class="goods-title">///&nbsp;{{item.name}}&nbsp;///</div>
          <div class="goods-item"
               v-for="(goods ,j) in item.goodsList"
               @click="showDetails($event,item,goods,item.id,j,i)"
               :key="j">
            <div class="goods-ysx" v-if="goods.inventory_status === 1 && goods.quantity === 0">
              <img src="../assets/img/ysx.png"/>
            </div>
            <div class="content">
              <div class="goods-logo">
                <div class="goods-img" v-lazy:background-image="goods.photo + '?x-oss-process=image/resize,w_180'"
                     v-if="goods.photo !== undefined">
                </div>
                <div class="goods-img" v-if="goods.photo === undefined">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                </div>
              </div>
              <div class="goods-item-content">
                <div class="top">
                  <div class="name" :data-meun_index="i" :data-goods_index="j">{{goods.name}}</div>
                  <div class="goods-desc" v-if="goods.inventory_status === 1">剩余{{goods.quantity}}份</div>
                  <div class="price" v-if="goods.discount < 1">
                    <span>${{appUtil.amountFormat(afterDiscountAmount(goods))}}</span>
                    <span>${{appUtil.amountFormat(goods.amount)}}</span>
                  </div>
                </div>
                <div class="bottom">

                  <div class="discount" v-if="goods.discount < 1">
                    <div class="discount-icon"></div>
                    <div>{{appUtil.amountFormat(goods.discount*10)}}折</div>
                  </div>
                  <div class="price" v-if="goods.discount === 1">${{appUtil.amountFormat(goods.amount)}}</div>
                  <div class="spec-btn"
                       v-if="goods.hasOwnProperty('specificationInfoList')"
                       :data-meun_index="i"
                       :data-goods_index="j"
                       @click="selectSpecClick(goods)">
                    选规格
                  </div>
                  <div class="cart-btn" v-if="goods.hasOwnProperty('specificationInfoList') === false">
                    <div class="icon-btn"
                         :data-goods_id="goods.id"
                         v-show="goods.num>0"
                         @click.stop="removeCount(goods)">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jian"></use>
                      </svg>
                    </div>
                    <span class="cart-count" v-show="goods.num>0">{{goods.num}}</span>
                    <div class="icon-btn"
                         :data-goods_id="goods.id"
                         @click.stop="(goods.inventory_status === 1 && goods.num >= goods.quantity) ? '' : (flyBall($event)||addCount(goods))">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jia"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <!-- 选规格弹窗 -->
    <mt-popup v-model="specPopupVisible" :closeOnClickModal="specModal" popup-transition="popup-fade" class="spec-pop">
      <div class="spec-header">
        <div class="goods-name">{{goodsItem.name}}</div>
        <div class="spec-close mui-icon mui-icon-closeempty" @click="closeSpecModal">
          <svg data-v-6f91e968="" aria-hidden="true" class="icon"><use data-v-6f91e968="" xlink:href="#icon-close"></use></svg>
        </div>
      </div>
      <div class="spec-list">
        <div class="spec-list-item" v-for="(specificationInfo,i) of goodsItem.specificationInfoList" :key="i">
          <div class="spec-list-item-title">{{specificationInfo.name}}</div>
          <div class="spec-cell">
            <div class="spec-item" v-for="(list,j) of specificationInfo.lists" :key="j"
                 :class="j===0 ? 'spec-item-active' : ''" @click="selectSpec(i,list,$event)">
              {{list.name}}&nbsp;{{list.amount === '' || list.amount ===null || list.amount == 0? '' :
              '$'+parseFloat(list.amount).toFixed(2)}}
            </div>
          </div>
        </div>
      </div>
      <div class="spec-footer">
        <div class="left">
          <span class="spec-price"><span class="seat">$</span>{{appUtil.amountFormat(specTotalAmount)}}</span>
          <span style="text-decoration: line-through;" v-if="goodsItem.discount < 1">
            $ {{appUtil.amountFormat(specHistoricalAmount)}}
          </span>
          <span class="spec-text">({{specStr}})</span>
        </div>
        <div class="right">
                    <span class="spec-add-cart-btn"
                          @click="(goodsItem.inventory_status == 1 && goodsItem.num >= goodsItem.quantity) ? '' : (specAddCart($event,0) || flyBall($event))"
                          v-if="isSpecCartAdd === false"><span class="seat">+</span>加入购物车</span>
          <div class="cart-btn" v-if="isSpecCartAdd">
            <div class="icon-btn" @click="specRemoveCart">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jian"></use>
              </svg>
            </div>
            <span class="cart-count">{{specCount}}</span>
            <div class="icon-btn" @click="(goodsItem.inventory_status == 1 && goodsItem.num >= goodsItem.quantity) ? '' : (specAddCart($event,1) || flyBall($event))">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jia"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
    <!-- 商品详情弹窗 -->
    <mt-popup v-model="isShowDetails" popup-transition="popup-fade" class="product-details">
      <div class="product-header" :style="'opacity:'+detailsMessgeHeaderOpacity">
        <div></div>
        <p class="title">商品信息</p>
        <!--<p class="product-close" @click="HideDetails"><i class="mui-icon mui-icon-closeempty"></i></p>-->
        <svg class="" aria-hidden="true" @click="HideDetails">
        <use xlink:href="#icon-close"></use>
        </svg>
      </div>
      <div ref="wrapper" class="wrapper">
        <div>
          <div class="product-media" :style="detailsMessgeStyle">
            <div class="slide-bottom" @click="HideDetails">
              <i class="mui-icon mui-icon-closeempty" :style="'color:#'+detailsMessgeClose+';'"></i>
            </div>

            <div class="icon-watermark">
              图片仅供参考&nbsp;一切已实物为准
            </div>
          </div>
          <div class="product-content">
            <div class="product-name">{{detailsMessge.goods.name}}</div>
            <div class="product-spec" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')">
              <div class="product-spec-list" v-for="(specificationInfo,i) of detailsMessge.goods.specificationInfoList"
                   :key="i">
                <div class="product-spec-title">{{specificationInfo.name}}</div>
                <div class="product-spec-item">
                  <div class="product-spec-item-text" @click="productSelectSpec(i,list,$event)"
                       v-for="(list,j) of specificationInfo.lists" :key="j" :class="j===0 ? 'active' : ''">{{list.name}}&nbsp;{{list.amount
                    === '' || list.amount ===null || list.amount == 0? '' : '$'+parseFloat(list.amount).toFixed(2)}}
                  </div>
                </div>
              </div>
            </div>
            <div class="product-price">
              <!--test-->
              <div class="price" v-if="detailsMessge.goods.discount==1">${{productTotalAmount.toFixed(2)}}</div>
              <div v-if="detailsMessge.goods.discount!==1" style="font-size: 18px;color: red;">$
                <!--<span>{{(detailsMessge.goods.amount*detailsMessge.goods.discount).toFixed(2)}}</span>-->
                <span>{{appUtil.amountFormat(productTotalAmount)}}</span>
                <span style="text-decoration:line-through;color: #cccccc;font-size:14px; ">${{detailsMessge.goods.amount}}</span>
              </div>

              <div class="product-add-cart" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')==false">
                <div
                  @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"
                  :data-goods_id="detailsMessge.goods.id"><span style="font-size:1.1rem">+</span> 加入购物车
                </div>
              </div>
              <div class="product-add-cart" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')">
                <div
                  @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"
                  :data-goods_id="detailsMessge.goods.id"><span style="font-size:1.1rem">+</span> 加入购物车
                </div>
              </div>
              <!--<div class="cart-btn" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList') && productSpecCount>0">-->
              <!--<span class="icon-remove_circle_outline" :data-goods_id="detailsMessge.goods.id" @click="removeProductCount"></span>-->
              <!--<span class="cart-count">{{productSpecCount}}</span>-->
              <!--<span class="icon-add_circle" :data-goods_id="detailsMessge.goods.id" @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"></span>-->
              <!--</div>-->
              <!--<div class="cart-btn" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')==false && detailsMessge.goods.num>0">-->
              <!--<span class="icon-remove_circle_outline" :data-goods_id="detailsMessge.goods.id" v-show="detailsMessge.goods.num>0" @click="removeProductCount"></span>-->
              <!--<span class="cart-count" v-show="detailsMessge.goods.num>0">{{detailsMessge.goods.num}}</span>-->
              <!--<span class="icon-add_circle" :data-goods_id="detailsMessge.goods.id" @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"></span>-->
              <!--</div>-->
            </div>

          </div>
          <div class="product-desc">
            <div class="product-desc-title">商品详情</div>
            <div class="product-desc-text"
                 v-text="detailsMessge.goods.hasOwnProperty('description')?detailsMessge.goods.description:'此人很懒,什么也没留下'">
            </div>
          </div>
        </div>

      </div>
    </mt-popup>
    <loading v-if="isLoading" :type="loadingType" height="calc(100vh - 50px)" top="0"></loading>
  </div>
</template>

<script>
  import CommonHeader from "../components/CommonHeader";
  import httpClient from '../http';
  import $ from 'jquery'
  import taffy from "../assets/js/taffy.js";
  import Loading from "../components/Loading";
  import BScroll from 'better-scroll'
  import { MessageBox } from 'mint-ui';

  let fly = require('../assets/js/fly');

  export default {
    name: "Classify",
    components: {Loading, CommonHeader},
    data: function () {
      return {
        //数据库
        db: null,
        //商品数据
        list: [],
        //购物车商品列表
        shopCartGoodsList: [],
        //加载动画
        isLoading: true,
        specificationInfoList : [],
        //是否显示规格
        specPopupVisible: false,
        //是否允许关闭规格
        specModal: false,
        //当前选中商品信息
        goodsItem: {},
        //是否显示规格里面加减按钮
        isSpecCartAdd: false,
        //规格商品总价
        specTotalAmount: 0,
        specHistoricalAmount: 0,
        //选中规格字符串
        specStr: '',
        //当前选中规格数量
        specCount: 0,
        isLoading: true,
        loadingType: 'page',
        scroll1 : '',
        scroll2 : '',
        //控制点击图片显示的弹窗显示
        isShowDetails: false,
        //详情页头部显示
        detailsMessgeHeaderOpacity: 0,
        //商品详情也图片样式控制
        detailsMessgeStyle: "",
        //商品详情关闭
        detailsMessgeClose: '',
        //控制点击图片显示的弹窗内容
        detailsMessge: {item: "", goods: ""},
        //详情弹窗的折后金额
        productTotalAmount:0,
        //详情弹窗的折前金额
        detailHistoricalAmount:0
      }
    },
    methods: {
      scrollTag(idName, index) {
        this.scroll2.scrollToElement(document.getElementById(idName), 500, 0, 0);

        let eleList = document.getElementById('menuControlContent').querySelectorAll('.left');
        for (let i = 0; i < eleList.length; i++) {
          eleList[i].classList.remove('active')
        }
        eleList[index].classList.add("active")
      },
      afterDiscountAmount(goods){
        return this.appUtil.round(this.appUtil.amountMul(goods.amount, goods.discount), 2);
      },
      //选择规格
      selectSpecClick(currentGoods){
        this.specPopupVisible = true;
        let specWhere = new Array();
        for (let specItem of currentGoods.specificationInfoList) {
          let i = 0;
          for (let specificationInfo of specItem.lists) {
            if (i == 0) {
              if (specificationInfo.amount != "") {
                this.specTotalAmount = this.specTotalAmount + parseFloat(specificationInfo.amount);
              }
              this.specStr += specificationInfo.name + ",";
              specificationInfo.active = true;
              specWhere.push(specificationInfo);
            } else {
              specificationInfo.active = false;
            }
            i++
          }
        }
        let specTotalAmount = this.specTotalAmount;
        this.specTotalAmount = specTotalAmount + this.afterDiscountAmount(currentGoods);
        this.specHistoricalAmount = specTotalAmount + currentGoods.amount;
        this.specStr = this.specStr.substring(0, this.specStr.length - 1);
        //查询当前选中规格是否已添加
        let where = {"id" : currentGoods.id,"specItem":JSON.stringify(specWhere)};
        if(this.db(where).first()){
          this.specCount = this.db(where).first().count;
          this.isSpecCartAdd = true;
        }else{
          this.isSpecCartAdd = false;
        }
        this.goodsItem = currentGoods;
      },
      //关闭规格
      closeSpecModal(){
        this.specPopupVisible = false;
        this.specCount = 0;
        this.specStr = '';
        this.goodsItem = '';
        this.isSpecCartAdd = false;
        this.specTotalAmount = 0;
        this.specHistoricalAmount = 0;
      },
      //选中规格
      selectSpec(specIndex, item, e){
        this.specTotalAmount = 0;
        this.specHistoricalAmount = 0;
        this.specStr = '';
        this.specCount = 0;
        $(e.currentTarget).parent().find(".spec-item").removeClass("spec-item-active");
        $(e.currentTarget).addClass("spec-item-active");
        let lists = this.goodsItem.specificationInfoList[specIndex].lists;
        for (let i = 0; i < lists.length; i++) {
          this.goodsItem.specificationInfoList[specIndex].lists[i].active = false;
        }
        item.active = true;
        let specItemList = this.selectedSpecItem();
        for (let specItem of specItemList) {
          if (specItem.amount != "") {
            this.specTotalAmount = this.specTotalAmount + parseFloat(specItem.amount);
          }
          this.specStr += specItem.name + ",";
        }
        let specTotalAmount = this.specTotalAmount;
        this.specTotalAmount = specTotalAmount + this.afterDiscountAmount(this.goodsItem);
        this.specHistoricalAmount = specTotalAmount + this.goodsItem.amount;
        this.specStr = this.specStr.substring(0, this.specStr.length - 1);
        let where = {"id" : this.goodsItem.id,"specItem":JSON.stringify(specItemList)};
        if(this.db(where).first()){
          this.specCount = this.db(where).first().count;
          this.isSpecCartAdd = true;
        }else{
          this.isSpecCartAdd = false;
        }
      },
      //获取当前选中规格
      selectedSpecItem() {
        let specItem = new Array();
        let specificationInfoList = this.goodsItem.specificationInfoList;
        for (let specificationInfo of specificationInfoList) {
          for (let list of specificationInfo.lists) {
            if (list.active) {
              specItem.push(list);
            }
          }
        }
        return specItem;
      },
      specRemoveCart(){
        let selectSpecItemList = this.selectedSpecItem();
        if (selectSpecItemList.length === 0) {
          return false;
        }
        let where = {"id": this.goodsItem.id, "specItem": JSON.stringify(selectSpecItemList)};
        let count = this.db(where).first().count - 1;
        if (count <= 0) {
          this.db(where).remove();
          this.specCount = 0;
          this.isSpecCartAdd = false;
        } else {
          this.specCount = count;
          this.db(where).update({"count": count});
        }
        this.refreshGoods(this.goodsItem.id);
        this.updateShopCart();
      },
      specAddCart(){
        let selectSpecItemList = this.selectedSpecItem();
        if (selectSpecItemList.length === 0) {
          return false;
        }
        let where = {"id": this.goodsItem.id, "specItem": JSON.stringify(selectSpecItemList)};
        console.log(this.goodsItem)
        if (this.db(where).first()) {
          this.db(where).update({"count": this.db(where).first().count + 1});
          this.specCount = this.db(where).first().count;
        } else {
          this.db.insert({
            "id": this.goodsItem.id,
            "photo":this.goodsItem.photo,
            "name": this.goodsItem.name,
            "count": 1,
            "amount": this.goodsItem.amount,
            "specItem": JSON.stringify(selectSpecItemList),
            "remarkList": [],
            "inventory_status": this.goodsItem.inventory_status,
            "goods_quantity": this.goodsItem.quantity,
            "discount":this.goodsItem.discount
          });
          this.specCount = 1;
        }
        this.isSpecCartAdd = true;
        this.updateShopCart();
        this.refreshGoods(this.goodsItem.id);
        // this.closeSpecModal();
      },
      loadMore(storeNum) {
        httpClient.getGoodsList(storeNum).then(result => {
          let list = result.data.categoryList;
          this.db = taffy();
          if (list === undefined) {
            return;
          }
          if (this.$store.getters.shopCartList != null && this.$store.getters.shopCartList.length > 0) {
            for (let shopCart of  this.$store.getters.shopCartList) {
              this.db.insert(shopCart);
            }
            //更新购物车
            this.updateShopCart();
          }

          list.forEach(category => {
            category.goodsList.forEach(goods => {
              let where = {"id": goods.id};
              if (this.db(where).first()) {
                goods.num = this.db(where).first().count;
              } else {
                goods.num = 0;
              }
            })
          });
          this.list = list;
          this.isLoading = false;

        });
      },
      //更新购物车
      updateShopCart() {
        this.shopCartGoodsList = [];
        this.db().each((result) => {
          console.log(result);
          let specAmount = 0.00;
          if (result.specItem != "") {
            let specItems = JSON.parse(result.specItem);
            for (let item of specItems) {
              if (item.amount != "") {
                specAmount = specAmount + parseFloat(item.amount);
              }
            }
            result.specItemList = specItems;
          }
          result.specAmount = specAmount;
          this.shopCartGoodsList.push(result);
        });
        this.$store.commit("shopCartList", this.shopCartGoodsList);
      },
      //添加商品
      addCount(currentGoods) {
        let flag = false;
        for (let item of this.list) {
          for (let goods of item.goodsList) {
            if (currentGoods.id == goods.id) {
              //查询条件
              let where = {"id": currentGoods.id};
              if (this.db(where).first()) {
                this.db(where).update({"count": this.db(where).first().count + 1});
              } else {
                this.db.insert({
                  "id": goods.id,
                  "name": goods.name,
                  "count": 1,
                  "amount": goods.amount,
                  "specItem": "",
                  "remarkList": [],
                  "inventory_status": goods.inventory_status,
                  "goods_quantity": goods.quantity,
                  "discount": goods.discount,
                  "photo":goods.photo,
                });
              }
              flag = true;
              break;
            }
          }
          if (flag) {
            break;
          }
        }
        this.refreshGoods(currentGoods.id);
        this.updateShopCart();
      },
      //移除商品
      removeCount(currentGoods) {
        let flag = false;
        for (let item of this.list) {
          for (let goods of item.goodsList) {
            if (currentGoods.id == goods.id) {
              //查询条件
              let where = {"id": currentGoods.id};
              let count = this.db(where).first().count - 1;
              if (count <= 0) {
                this.db(where).remove();
              } else {
                this.db(where).update({"count": count});
              }
              flag = true;
              break;
            }
          }
          if (flag) {
            break;
          }
        }
        this.refreshGoods(currentGoods.id);
        this.updateShopCart();
      },
      //刷新商品
      refreshGoods(goodsId) {
        for (let item of this.list) {
          for (let goods of item.goodsList) {
            if (goodsId == goods.id) {
              if (goods.specificationInfoList && goods.specificationInfoList.length > 0) {
                goods.num = 0;
                this.db().each((result) => {
                  if (result.id == goodsId) {
                    goods.num += result.count;
                  }
                });
              } else {
                let where = {"id": goodsId};
                if (this.db(where).first()) {
                  goods.num = this.db(where).first().count;
                } else {
                  goods.num = 0;
                }
              }
            }
          }
        }
      },
      flyBall(event) {
        let flyObj = $('<div style="z-index: 10000;border-radius: 50%;background:red;width:15px;height:15px;"></div>');
        flyObj.fly({
          start: {
            left: event.pageX - 20,
            top: event.pageY - 20
          },
          end: {
            left: document.getElementsByClassName('navigationBar')[0].children[1].offsetLeft + 20,
            top: document.getElementsByClassName('navigationBar')[0].children[1].offsetTop + 20,
            width: 20,
            height: 20
          },
          onEnd: function () {
            $(flyObj).remove()
          }
        });
      },
      checkBusinessTime(data){
        let businessTimeSlot = data.business_time_slot;
        //获取指定时区的当前时间
        let nowTzTime = this.moment.tz(this.moment(), data.timezone).format("HH:mm");
        if (businessTimeSlot) {
          let time = businessTimeSlot.split(",");
          let businessTimeSlotStartTime = time[0];
          let businessTimeSlotEndTime = time[1];
          //当天
          if(businessTimeSlotStartTime < businessTimeSlotEndTime){
            if(nowTzTime < businessTimeSlotStartTime || nowTzTime > businessTimeSlotEndTime){
              this.$danMessageBox('抱歉,本店打烊了!',function () {
                this.appUtil.closeClient();
              },true);
            }
          }else {
            if(nowTzTime < businessTimeSlotStartTime && nowTzTime > businessTimeSlotEndTime){
              this.$danMessageBox('抱歉,本店打烊了!',function () {
                this.appUtil.closeClient();
              },true);
            }
          }
        }
      },
      storeData(data){
        //数据存储到会话
        this.$store.commit("storeName", data.stroeName); //店铺名称
        this.$store.commit("storeAddress", data.stroeAddress); //店铺地址
        this.$store.commit("storeMobile", data.stroeMobile ? data.stroeMobile : '暂无电话'); //店铺电话
        this.$store.commit("isTax", data.isTax); //是否有税费
        this.$store.commit("isTip", data.isTip); //是否有小费
        this.$store.commit("storeId", data.store_id); //店铺ID
        this.$store.commit("taxRate", data.taxRate); //税率
        this.$store.commit("tipType", data.tipType); //小费类型
        this.$store.commit("tipVal", data.tipVal); //小费取值范围
        this.$store.commit("userId", data.userid); //用户ID
        this.$store.commit("timeZone", data.timezone); //时区
        this.$store.commit("discount", data.discount); //折扣
        this.$store.commit("isStoreUser", data.isStoreUser); //店铺用户是否存在
        this.$store.commit("storeScanGoodsUser", data.storeScanGoodsUser); //店铺用户信息
        this.$store.commit("menuId", data.menuId); //菜单ID
        this.$store.commit("isNoTip", data.is_no_tip); //是否无小费
        this.$store.commit("isCustomTip", data.is_custom_tip); //是否自定义小费
        this.$store.commit("isAfterDiscountTip", data.is_after_discount_tip); //是折前前小费
        this.$store.commit("isAfterDiscountTax", data.is_after_discount_tax); //是否折前税费
        this.$store.commit("afterOrdersToTime", data.takeOutTimeConf); //自提时间
        this.$store.commit("businessTimeSlot", data.business_time_slot);//打烊时间
        this.$store.commit("openMembershipSystem", data.open_membership_system);//是否开启会员系统
        this.$store.commit("fromIntegralConvertRatio", data.from_integral_convert_ratio);//积分兑换折扣金额的比例
        this.$store.commit("toIntegralConvertRatio", data.to_integral_convert_ratio);//积分兑换折扣金额的比例
      },
      getGlobalInfo(code,storeNum) {
        httpClient.getUserInfo(this.qs.stringify({
          storeNum: storeNum,
          code: code === undefined ? "" : code,
          paytype: this.$store.getters.clientType,
          state: this.$store.getters.userId
        })).then(result => {
          let data = result.data;
          if (data.result_code === "ok" && data.result_msg === "SUCCESS") {
            document.title = data.stroeName;

            this.checkBusinessTime(data.business_time_slot);

            this.storeData(data);
          } else {
            this.isLoading = false;
            let errorMessage = '系统错误';
            if (data.result_msg === 'QR_CODE_NOT_EXIST'){
              errorMessage = '该二维码已失效';
            }
            if (data.result_msg === 'STORE_MENU_NOT_EXIST'){
              errorMessage = '店铺还没有添加任何菜单';
            }
            this.$danMessageBox(errorMessage, function () {
              this.appUtil.closeClient();
            },true);
          }
        })
      },
      getUrlParamInfo() {
        let code = '';
        let clientType = '';
        //是微信打开
        if (this.appUtil.isWx()) {
          code = this.appUtil.spliceRouter('code');
          clientType = "wechat";
        }
        //支付宝打开
        if (this.appUtil.isAli()) {
          code = this.$route.query.auth_code;
          clientType = "alipay";
        }
        if (process.env.NODE_ENV === 'development') {
          clientType = "alipay";
        }
        let state = this.appUtil.spliceRouter('state');
        let storeNum = state.split(',')[0];
        if(storeNum === '' || storeNum == null){
          storeNum = this.$store.getters.storeNum;
        }else{
          this.$store.commit("storeNum", storeNum); //折扣
        }

        this.$store.commit("clientType", clientType);

        this.getGlobalInfo(code, storeNum);
        this.loadMore(storeNum);
      },
      //隐藏商品详情
      HideDetails() {
        this.isShowDetails = false;
      },
      //显示商品详情
      showDetails(e, item, goods, id, j, i) {
        this.productTotalAmount = 0;
        if (goods.inventory_status == 1 && goods.quantity == 0) {
          return false;
        }
        let that = this;
        $(".mint-popup").each(function () {
          if ($(this).css("z-index") != "auto") {
            let zIndex = parseInt($(this).css("z-index"));
            if (zIndex > that.shopCartZIndex) {
              that.shopCartZIndex = zIndex - 1;
            }
          }
        });
        if (e.target.offsetParent == null) {
          return
        }
        if (e.target.className == "spec-btn") {
          return
        }
        if (e.target.offsetParent.className === "cart-btn") {
          return;
        }
        let height = window.screen.height * 0.4;
        this.detailsMessgeHeaderOpacity = 0;
        if (this.detailsMessgeScroll) {
          if (!(this.detailsMessge.goods.id == goods.id)) {
            this.detailsMessgeScroll.refresh();
          } else {
            this.detailsMessgeScroll.scrollTo(0, 0, 0);
          }
        } else {
          this.detailsMessgeScroll = new BScroll(this.$refs.wrapper, {
            scrollY: true,
            click: true,
            bounce: false,
            probeType: 2
          });
        }

        this.detailsMessgeScroll.on("scroll", (result) => {
          let y = Math.abs(result.y);
          if (y < 40) {
            this.detailsMessgeHeaderOpacity = 0;
          }
          if (y > 40) {
            this.detailsMessgeHeaderOpacity = ((y - 40) / 50).toFixed(2);
          }
          if (y > height - 40) {
            $(".product-header").addClass("active");
          } else {
            $(".product-header").removeClass("active");
          }
        });
        this.detailsMessge = {};
        this.detailsMessge = {item, goods, id, j, i};
        if (this.detailsMessge.goods.specificationInfoList && this.detailsMessge.goods.specificationInfoList.length > 0) {
          this.productSpecCount = 0;
          let specWhere = new Array();
          for (let specItem of this.detailsMessge.goods.specificationInfoList) {
            let i = 0;
            for (let specificationInfo of specItem.lists) {
              if (i == 0) {
                if(specificationInfo.active==false){

                } else {
                  if (specificationInfo.amount != "") {
                    this.productTotalAmount = this.productTotalAmount + parseFloat(specificationInfo.amount);
                  }
                  specificationInfo.active = true;
                  specWhere.push(specificationInfo);
                }
              } else {
                if(specificationInfo.active){
                  this.productTotalAmount = this.productTotalAmount + parseFloat(specificationInfo.amount);
                }
                specificationInfo.active = false;
              }
              i++
            }
          }
          let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specWhere)};
          if (this.db(where).first()) {
            this.productSpecCount = this.db(where).first().count;
          }
        }
        this.productTotalAmount = this.productTotalAmount + this.appUtil.amountMul(this.detailsMessge.goods.amount,this.detailsMessge.goods.discount);
        $(".product-media").css({"background-repeat": "", "background-size": ""});
        this.detailsMessgeStyle += 'height:' + height + 'px;';
        if (this.detailsMessge.goods.photo === '' || this.detailsMessge.goods.photo == null) {
          this.detailsMessgeStyle += 'background-image:url(\'' + this.appUtil.goodsImg + '\');';
          this.detailsMessgeClose = '000';
        } else {
          let width = $(window).width() * 0.9;
          // $.get(this.detailsMessge.goods.photo+"?x-oss-process=image/info",(result) => {
          //     console.log(result.ImageWidth.value);
          //     console.log((result.ImageHeight.value/parseInt(height)));
          //     console.log(parseInt(result.ImageWidth.value/(result.ImageHeight.value/parseInt(height))));
          //     let img_x  = parseInt(parseInt(result.ImageWidth.value/(result.ImageHeight.value/parseInt(height))) - width - 50);
          //     if(img_x < 0){
          //       img_x = 10;
          //     }
          this.detailsMessgeStyle += 'background-image:url(\'' + this.detailsMessge.goods.photo + '?x-oss-process=image/resize,h_' + parseInt(height) + '\');';
          this.detailsMessgeStyle += 'background-repeat: no-repeat;background-size: cover;'
          //     $.get(this.detailsMessge.goods.photo+"?x-oss-process=image/average-hue",(resultAverage) => {
          //       this.detailsMessgeClose = this.ColorReverse(resultAverage.RGB);
          //     });
          // });
        }
        this.isShowDetails = true;
      },
      addProductCount(e) {
        if (this.detailsMessge.goods.specificationInfoList && this.detailsMessge.goods.specificationInfoList.length > 0) {
          let specItem = new Array();
          for (let specificationInfo of this.detailsMessge.goods.specificationInfoList) {
            for (let list of specificationInfo.lists) {
              if (list.active) {
                specItem.push(list);
              }
            }
          }
          let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specItem)};
          if (this.db(where).first()) {
            this.db(where).update({"count": this.db(where).first().count + 1});
            this.productSpecCount = this.db(where).first().count;
            // this.specCount = this.db(where).first().count;
          } else {
            this.db.insert({
              "id": this.detailsMessge.goods.id,
              "name": this.detailsMessge.goods.name,
              "count": 1,
              "amount": this.detailsMessge.goods.amount,
              "specItem": JSON.stringify(specItem),
              "remarkList": [],
              "inventory_status": this.detailsMessge.goods.inventory_status,
              "goods_quantity": this.detailsMessge.goods.quantity,
              "discount":this.detailsMessge.goods.discount
            });
            this.productSpecCount = 1;
          }
        } else {
          let where = {"id": this.detailsMessge.goods.id};
          if (this.db(where).first()) {
            this.db(where).update({"count": this.db(where).first().count + 1});
          } else {
            this.db.insert({
              "id": this.detailsMessge.goods.id,
              "name": this.detailsMessge.goods.name,
              "count": 1,
              "amount": this.detailsMessge.goods.amount,
              "specItem": "",
              "remarkList": [],
              "inventory_status": this.detailsMessge.goods.inventory_status,
              "goods_quantity": this.detailsMessge.goods.quantity,
              "discount":this.detailsMessge.goods.discount
            });
          }
        }
        this.refreshGoods(this.detailsMessge.goods.id);
        this.updateShopCart();
        this.isShowDetails = false;
      },
      //商品详情规格选择事件
      productSelectSpec(specIndex, item, e) {
        this.productTotalAmount = 0;
        this.productSpecCount = 0;
        let lists = this.detailsMessge.goods.specificationInfoList[specIndex].lists;
        for (let i = 0; i < lists.length; i++) {
          this.detailsMessge.goods.specificationInfoList[specIndex].lists[i].active = false;
        }
        console.log(this.detailsMessge)
        item.active = true;
        $(e.currentTarget).parent().find(".product-spec-item-text").removeClass("active");
        $(e.currentTarget).addClass("active");
        let specItem = new Array();
        let specificationInfoList = this.detailsMessge.goods.specificationInfoList;
        let specItemList = new Array();
        for (let specificationInfo of specificationInfoList) {
          for (let list of specificationInfo.lists) {
            if (list.active) {
              if (list.amount != "") {
                this.productTotalAmount = this.productTotalAmount + parseFloat(list.amount);
              }
              specItemList.push(list);
            }
          }
        }
        this.productTotalAmount = this.productTotalAmount + this.appUtil.amountMul(this.detailsMessge.goods.amount,this.detailsMessge.goods.discount);

        let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specItemList)};
        if (this.db(where).first()) {
          this.productSpecCount = this.db(where).first().count;
        }
      },
    },
    created() {

      this.isLoading = true;
      let _this = this;
      if (process.env.NODE_ENV === 'development') {

        // this.$store.commit("clientType", "wechat");
        this.$store.commit("clientType", "alipay");
        // this.$store.commit("userId", "43321221222321322");
        this.$store.commit("userId", "808080");
        this.$store.commit("qrCode", "sedtR4tj");
        this.$store.commit("storeNum", "S10043");
        this.getGlobalInfo('',this.$store.getters.storeNum);
        this.loadMore(this.$store.getters.storeNum);
        // if(this.$store.getters.storeNum === "" || this.$store.getters.storeNum == null){
        //   this.getUrlParamInfo();
        // }else{
        //   this.loadMore(this.$store.getters.storeNum);
        // }

      } else {
        if(this.$store.getters.storeNum === "" || this.$store.getters.storeNum == null){
          this.getUrlParamInfo();
        }else{
          this.loadMore(this.$store.getters.storeNum);
        }

      }
    },
    mounted() {
      this.$nextTick(() => {
        this.scroll1 = new BScroll(this.$refs.wrapper1, {
          click: true,
          tap: true,
          bounce: false,
          mouseWheel: true
        });
        this.scroll2 = new BScroll(this.$refs.wrapper2, {
          click: true,
          tap: true,
          bounce: false,
          mouseWheel: true
        });
      })
    }
  }
</script>

<style scoped lang="less">
  @import "../assets/css/common";

  #classify {
    p {
      font-size: 14px;
      margin-top: 0;
      margin-bottom: 10px;
      color: #8f8f94;
    }
    .content {
      height: @primary-content-height;
      display: flex;
      flex-direction: row;

      .wrapper {
        background: rgb(245, 245, 245);
        height: @primary-content-height;
        overflow: hidden;
      }

      #menuControlContent {
        width: 25vw;
        background: rgb(245, 245, 245);

        .menu-item {
          background: rgb(245, 245, 245);
          border-radius: 0;
          border: 0;
          height: 4rem;
          color: #000;
          transition-duration: .0s !important;
          font-size: 14px;
          word-break: break-all;
          padding: 0 @space-width;
          .common-center;
        }

        .menu-item.active {
          background: #ffffff;
          border-left: 2px solid red;
          color: #007aff;
        }
      }

      #goodsControlContents {
        width: 75vw;

        .goods-control-content {
          position: relative;
          background: #fff;
          width: 100%;
          margin-bottom: @space-width;

          .goods-title {
            font-size: 16px;
            text-align: center;
            color: #fd2c2c;
            padding: 1rem;
          }

          @item-logo-size: 20vw;

          .goods-item {
            position: relative;
            padding: 0 @space-width @space-width @space-width;

            .content {
              position: relative;
              height: calc(@item-logo-size + @space-width * 2);
              padding: @space-width;
              border-radius: 3px;
              box-shadow: 0 0 6px #ccc;
              display: flex;
              flex-direction: row;
              justify-content: space-between;

              .goods-logo {
                width: @item-logo-size;

                .goods-img {
                  width: @item-logo-size;
                  height: @item-logo-size;
                  background: no-repeat center center;
                  background-size: cover;
                  border-radius: 3px;

                  svg {
                    width: @item-logo-size;
                    height: @item-logo-size;
                    fill: gray;
                  }
                }
              }

              .goods-item-content {
                width: calc(100% - @item-logo-size - @space-width);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .top {
                  .name {
                    font-size: .8rem;
                    color: #07111b;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    font-weight: 600;
                  }

                  .goods-desc {
                    padding-top: 5px;
                    font-size: 12px;
                    color: #CCCCCC;
                  }
                  .price{
                    color: red;
                    font-size: 14px;
                    :last-child{
                      color: #CCCCCC;
                      text-decoration: line-through;
                    }
                  }

                }

                .bottom {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  .price{
                    color: red;
                    font-size: 14px;
                  }
                  .discount{
                    display: flex;
                    align-items: center;
                    font-size: .8rem;
                    color: #5f5f5f;
                    .discount-icon {
                      background-image: url(../assets/img/discount-icon.png);
                      width: 12px;
                      height: 12px;
                      background-size: 100%;
                      background-position: center;
                      background-repeat: no-repeat;
                      margin-right: .2rem;
                    }
                  }

                  .spec-btn {
                    text-align: center;
                    background: #fd2c2c;
                    border-radius: 14px;
                    height: 24px;
                    font-size: 12px;
                    line-height: 24px;
                    padding-right: 10px;
                    padding-left: 10px;
                    color: #fff;
                  }

                  .cart-btn {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .cart-count {
                      font-size: 12px;
                      margin: 0 8px;
                    }

                    @icon-size: 6vw;

                    .icon-btn {
                      width: @icon-size;
                      height: @icon-size;
                      background-color: @primary-color;
                      border-radius: 50%;

                      svg {
                        width: @icon-size;
                        height: @icon-size;
                        fill: white;
                      }
                    }
                  }
                }
              }

            }

            .goods-ysx {
              position: absolute;
              width: calc(100% - @space-width * 2);
              height: calc(@item-logo-size + @space-width * 4);
              background: rgba(210, 209, 209, 0.29);
              border-radius: 3px;

              img {
                height: 60px;
                position: absolute;
                right: 0.3rem;
              }
            }
          }
        }
      }
    }
    .spec-pop{
      width: 90%;
      border-radius: 10px;
      max-height: 90%;
      overflow-y: auto;
      overflow-x: hidden;
      .spec-header {
        text-align: center;
        position: relative;
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 .8rem;
        .goods-name {
          font-size: 1.2rem;
          padding-right: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          text-align: center;
        }
        .spec-close {
          position: absolute;
          top: 0;
          right: 0;
          height: 30px;
          overflow: hidden;
          svg{
            width: 30px;
            height: 30px;
          }
        }
      }
      .spec-list {
        width: 100%;
        position: relative;
        padding: .8rem;
        .spec-list-item{
          .spec-list-item-title {
            font-size: 1rem;
          }
          .spec-cell {
            overflow: hidden;
            padding: .5rem 0rem;
            .spec-item {
              float: left;
              border: 1px solid #fd2c2c;
              font-size: 16px;
              text-align: center;
              color: #fd2c2c;
              margin: 5px 10px 5px 0px;
              padding: 5px 10px;
              float: left;
              border-radius: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }.spec-item-active {
               color: white !important;
               background: rgba(237, 91, 91, 1);
               -webkit-box-shadow: 0px 0px 4px 0px rgba(237, 91, 91, 1);
               box-shadow: 0px 0px 4px 0px rgba(237, 91, 91, 1);
             }
          }
        }
      }
      .spec-footer {
        clear: both;
        display: flex;
        padding: 10px .8rem;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        .left {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          -webkit-flex: 1;
          height: 2.1rem;
          line-height: 2.1rem;
          padding-right: 20px;
          .spec-price {
            color: red;
            font-size: 1.6rem;
            .seat {
              font-size: 1rem;
            }
          }
          .spec-text {
            font-size: .8rem;
            padding: 10px;
          }
        }
        .right{
          .spec-add-cart-btn {
            border-radius: 15px;
            text-align: center;
            font-size: .8rem;
            background: rgba(237, 91, 91, 1);
            -webkit-box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
            box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
            color: #fff;
            padding: .5rem .5rem;
            .seat {
              font-size: 1rem;
              padding-right: .3rem;
            }
          }
          .cart-btn {
            display: flex;
            flex-direction: row;
            align-items: center;

            .cart-count {
              font-size: 12px;
              margin: 0 8px;
            }

            @icon-size: 6vw;

            .icon-btn {
              width: @icon-size;
              height: @icon-size;
              background-color: @primary-color;
              border-radius: 50%;

              svg {
                width: @icon-size;
                height: @icon-size;
                fill: white;
              }
            }
          }
        }
      }
    }
    .product-details{
      width: 90%;
      height: 80%;
      background-color: #efeff4!important;
      border-radius: 5px;
      overflow-y: auto;
      .product-header{
        height: 40px;
        line-height: 40px;
        background: #fff;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div:nth-child(1){
          width: 30px;
          height: 1px;
        }
        svg{
          width: 30px;
          height: 30px;
        }
        .title{
          text-align: center;
          color: #000000;
          font-size: 16px;
        }
        .product-close{
          position: absolute;
          top: 0;
          right: 0;
          .mui-icon{
            font-size: 40px;
            color: #000;
            line-height: 40px;
          }
        }
      }
      .wrapper{
        overflow: hidden;
        height: 100%;
        div{
          .product-media {
            display: block;
            color: #fff;
            background-position: center;
            background-size: cover;
            font-size: 17px;
            /* border-radius: 2px 2px 0 0; */
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            position: relative;
            .slide-bottom{
              position: absolute;
              top: 0;
              right: 0;
              .mui-icon{
                font-size: 40px;
              }
            }
            .icon-watermark{
              position: absolute;
              bottom: 15px;
              right: .5rem;
              font-size: 12px;
              color: #fff;
            }
          }
          .product-content{
            font-size: 14px;
            position: relative;
            overflow: hidden;
            padding: 5%;
            background: #ffffff;
            .product-name{
              font-size: 16px;
              font-weight: bold;
              padding-bottom: .8rem;
            }
            .product-spec {
              width: 100%;
              overflow: hidden;
              padding-bottom: 20px;
              .product-spec-list{
                .product-spec-title{
                  padding: 10px 0px;
                }
                .product-spec-item{
                  width: 100%;
                  overflow: hidden;
                  .product-spec-item-text{
                    float: left;
                    border: 1px solid #fd2c2c;
                    font-size: 16px;
                    text-align: center;
                    color: #fd2c2c;
                    margin-right: 5px;
                    padding: 5px 10px;
                    border-radius: 16px;
                    margin-bottom: 10px;
                  }
                  .product-spec-item-text.active {
                    color: white !important;
                    background: rgba(237, 91, 91, 1);
                    box-shadow: 0px 0px 4px 0px rgba(237, 91, 91, 1);
                  }
                }
              }
            }
            .product-price{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .price{
                font-size: 18px;
                color: red;
              }
              .product-add-cart{
                text-align: center;
                background: #fd2c2c;
                border-radius: 14px;
                height: 30px;
                font-size: 14px;
                line-height: 30px;
                padding-right: 10px;
                padding-left: 10px;
                color: #fff;
                position: relative;
              }
            }
          }
          .product-desc{
            margin-top: 1.5rem;
            background: #ffffff;
            padding: .8rem 5%;
            .product-desc-title{
              font-size: 14px;
              font-weight: bold;
              padding-bottom: .8rem;
              border-bottom: 1px dashed #cccccc;
              margin-bottom: .8rem;
            }
            .product-desc-text {
              font-size: 14px;
              color: #676262;
            }
          }
        }

      }
    }
  }


</style>
