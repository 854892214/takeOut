import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

function getDataFromSessionStorage(key, type = '') {
  let sessionStr = sessionStorage.getItem(key);
  switch (type) {
    case "int":
      return parseInt(sessionStr);
    case "double":
      return sessionStr * 1;
    case "bool":
      return sessionStr === 'true';
    case "array":
    case "object":
      return JSON.parse(sessionStr);
    default:
      return sessionStr;
  }
}

const store = new Vuex.Store({
  state: {
    clientType: getDataFromSessionStorage('clientType'),//打开类型
    userId: getDataFromSessionStorage('userId'),//用户id
    storeId: getDataFromSessionStorage('storeId', 'int'),//门店id
    qrCode: getDataFromSessionStorage('qrCode'),//门店码
    timeZone: getDataFromSessionStorage('timeZone'),//门店时区
    shopCartList: getDataFromSessionStorage('shopCartList', 'array'),//购物车列表
    userInfo: getDataFromSessionStorage('userInfo', 'object'),//用户信息
    orderInfo: getDataFromSessionStorage('orderInfo', 'object'),//订单信息
    storeInfo: getDataFromSessionStorage('storeInfo', 'object'),//门店信息
    buyNow: getDataFromSessionStorage('buyNow', 'bool'),//立即支付
    buyOneGoods: getDataFromSessionStorage('buyOneGoods', 'object'),//立即支付商品内容
    selectedAddress: getDataFromSessionStorage('selectedAddress', 'object'),
    classifyList: getDataFromSessionStorage('classifyList', 'array'),//

    storeName: getDataFromSessionStorage('storeName', ''),//店铺名称
    storeAddress: getDataFromSessionStorage('storeAddress', ''),//店铺地址
    storeMobile: getDataFromSessionStorage('storeMobile', ''),//店铺电话
    isTax: getDataFromSessionStorage('isTax', ''),//是否有税
    isTip: getDataFromSessionStorage('isTip', ''),//是否有小费
    taxRate: getDataFromSessionStorage('taxRate', ''),//税率
    tipType: getDataFromSessionStorage('tipType', ''),//小费类型
    tipVal: getDataFromSessionStorage('tipVal', ''),//小费取值范围
    discount: getDataFromSessionStorage('discount', ''),//门店折扣
    isStoreUser: getDataFromSessionStorage('isStoreUser', ''),//店铺用户是否存在
    menuId: getDataFromSessionStorage('menuId', ''),//菜单id
    isNoTip: getDataFromSessionStorage('isNoTip', ''),//是否无小费
    isCustomTip: getDataFromSessionStorage('isCustomTip', ''),//是否自定义小费
    isAfterDiscountTip: getDataFromSessionStorage('isAfterDiscountTip', ''),//是否折前小费
    isAfterDiscountTax: getDataFromSessionStorage('isAfterDiscountTax', ''),//是否折前税费
    afterOrdersToTime: getDataFromSessionStorage('afterOrdersToTime', ''),//自提时间
    businessTimeSlot: getDataFromSessionStorage('businessTimeSlot', ''),//打烊时间
    toTime: getDataFromSessionStorage('toTime', ''),//选择的自提时间

    storeNum: getDataFromSessionStorage('storeNum',''),//店铺编号

    storeScanGoodsUser: getDataFromSessionStorage('storeScanGoodsUser', 'object'),//门店用户信息
    nowIntegralNumber: getDataFromSessionStorage('nowIntegralNumber', 'int'),//用户当前积分
    openMembershipSystem: getDataFromSessionStorage('openMembershipSystem', ''),//是否开启积分系统
    fromIntegralConvertRatio: getDataFromSessionStorage('fromIntegralConvertRatio', ''),//积分换钱的比例
    toIntegralConvertRatio: getDataFromSessionStorage('toIntegralConvertRatio', ''),//钱换积分的比例
    deductionIntegral: getDataFromSessionStorage('deductionIntegral', ''),//已抵扣但未支付成功的积分

    goodsOrderId: getDataFromSessionStorage('goodsOrderId', ''),
    goodsOrderNum: getDataFromSessionStorage('goodsOrderNum', ''),
    pickUpUserName: getDataFromSessionStorage('pickUpUserName', ''),
    pickUpUserPhone: getDataFromSessionStorage('pickUpUserPhone', ''),
    pickUpUserRemark: getDataFromSessionStorage('pickUpUserRemark', ''),
    selectedSpec: getDataFromSessionStorage('selectedSpec', 'object')
  },
  mutations: {
    selectedSpec(state, selectedSpec) {
      state.selectedSpec = selectedSpec;
      sessionStorage.setItem('selectedSpec', selectedSpec)
    },
    pickUpUserName(state, pickUpUserName) {
      state.pickUpUserName = pickUpUserName;
      sessionStorage.setItem('pickUpUserName', pickUpUserName)
    },
    pickUpUserPhone(state, pickUpUserPhone) {
      state.pickUpUserPhone = pickUpUserPhone;
      sessionStorage.setItem('pickUpUserPhone', pickUpUserPhone)
    },
    pickUpUserRemark(state, pickUpUserRemark) {
      state.pickUpUserRemark = pickUpUserRemark;
      sessionStorage.setItem('pickUpUserRemark', pickUpUserRemark)
    },
    goodsOrderId(state, goodsOrderId) {
      state.goodsOrderId = goodsOrderId;
      sessionStorage.setItem('goodsOrderId', goodsOrderId)
    },
    goodsOrderNum(state, goodsOrderNum) {
      state.goodsOrderNum = goodsOrderNum;
      sessionStorage.setItem('goodsOrderNum', goodsOrderNum)
    },
    nowIntegralNumber(state, nowIntegralNumber) {
      state.nowIntegralNumber = nowIntegralNumber;
      sessionStorage.setItem('nowIntegralNumber', nowIntegralNumber)
    },
    openMembershipSystem(state, openMembershipSystem) {
      state.openMembershipSystem = openMembershipSystem;
      sessionStorage.setItem('openMembershipSystem', openMembershipSystem)
    },
    fromIntegralConvertRatio(state, fromIntegralConvertRatio) {
      state.fromIntegralConvertRatio = fromIntegralConvertRatio;
      sessionStorage.setItem('fromIntegralConvertRatio', fromIntegralConvertRatio)
    },
    toIntegralConvertRatio(state, toIntegralConvertRatio) {
      state.toIntegralConvertRatio = toIntegralConvertRatio;
      sessionStorage.setItem('toIntegralConvertRatio', toIntegralConvertRatio)
    },
    deductionIntegral(state, deductionIntegral) {
      state.deductionIntegral = deductionIntegral;
      sessionStorage.setItem('deductionIntegral', deductionIntegral)
    },
    toTime(state, toTime) {
      state.toTime = toTime;
      sessionStorage.setItem('toTime', toTime)
    },
    storeName(state, storeName) {
      state.storeName = storeName;
      sessionStorage.setItem('storeName', storeName)
    },
    storeAddress(state, storeAddress) {
      state.storeAddress = storeAddress;
      sessionStorage.setItem('storeAddress', storeAddress)
    },
    storeMobile(state, storeMobile) {
      state.storeMobile = storeMobile;
      sessionStorage.setItem('storeMobile', storeMobile)
    },
    isTax(state, isTax) {
      state.isTax = isTax;
      sessionStorage.setItem('isTax', isTax)
    },
    isTip(state, isTip) {
      state.isTip = isTip;
      sessionStorage.setItem('isTip', isTip)
    },
    taxRate(state, taxRate) {
      state.taxRate = taxRate;
      sessionStorage.setItem('taxRate', taxRate)
    },
    tipType(state, tipType) {
      state.tipType = tipType;
      sessionStorage.setItem('tipType', tipType)
    },
    tipVal(state, tipVal) {
      state.tipVal = tipVal;
      sessionStorage.setItem('tipVal', tipVal)
    },
    discount(state, discount) {
      state.discount = discount;
      sessionStorage.setItem('discount', discount)
    },
    isStoreUser(state, isStoreUser) {
      state.isStoreUser = isStoreUser;
      sessionStorage.setItem('isStoreUser', isStoreUser)
    },
    menuId(state, menuId) {
      state.menuId = menuId;
      sessionStorage.setItem('menuId', menuId)
    },
    isNoTip(state, isNoTip) {
      state.isNoTip = isNoTip;
      sessionStorage.setItem('isNoTip', isNoTip)
    },
    isCustomTip(state, isCustomTip) {
      state.isCustomTip = isCustomTip;
      sessionStorage.setItem('isCustomTip', isCustomTip)
    },
    isAfterDiscountTip(state, isAfterDiscountTip) {
      state.isAfterDiscountTip = isAfterDiscountTip;
      sessionStorage.setItem('isAfterDiscountTip', isAfterDiscountTip)
    },
    isAfterDiscountTax(state, isAfterDiscountTax) {
      state.isAfterDiscountTax = isAfterDiscountTax;
      sessionStorage.setItem('isAfterDiscountTax', isAfterDiscountTax)
    },
    businessTimeSlot(state, businessTimeSlot) {
      state.businessTimeSlot = businessTimeSlot;
      sessionStorage.setItem('businessTimeSlot', businessTimeSlot)
    },
    afterOrdersToTime(state, afterOrdersToTime) {
      state.afterOrdersToTime = afterOrdersToTime;
      sessionStorage.setItem('afterOrdersToTime', afterOrdersToTime)
    },
    userId(state, userId) {
      state.userId = userId;
      sessionStorage.setItem('userId', userId)
    },
    storeId(state, storeId) {
      state.storeId = storeId;
      sessionStorage.setItem('storeId', storeId)
    },
    qrCode(state, qrCode) {
      state.qrCode = qrCode;
      sessionStorage.setItem('qrCode', qrCode)
    },
    timeZone(state, timeZone) {
      state.timeZone = timeZone;
      sessionStorage.setItem('timeZone', timeZone)
    },
    clientType(state, clientType) {
      state.clientType = clientType;
      sessionStorage.setItem('clientType', "");
    },
    shopCartList(state, shopCartList) {
      if (shopCartList !== undefined) {
        state.shopCartList = shopCartList;
        sessionStorage.setItem('shopCartList', JSON.stringify(shopCartList));
      }
    },
    storeScanGoodsUser(state, storeScanGoodsUser) {
      if (storeScanGoodsUser !== undefined) {
        state.storeScanGoodsUser = storeScanGoodsUser;
        sessionStorage.setItem('storeScanGoodsUser', JSON.stringify(storeScanGoodsUser))
      }
    },
    userInfo(state, userInfo) {
      if (userInfo !== undefined) {
        state.userInfo = userInfo;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
    },
    orderInfo(state, orderInfo) {
      if (orderInfo !== undefined) {
        state.orderInfo = orderInfo;
        sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));
      }
    },
    storeInfo(state, storeInfo) {
      if (storeInfo !== undefined) {
        state.storeInfo = storeInfo;
        sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo));
      }
    },
    buyNow(state, buyNow) {
      state.buyNow = buyNow;
      sessionStorage.setItem('buyNow', JSON.stringify(buyNow));
    },
    buyOneGoods(state, buyOneGoods) {
      if (buyOneGoods !== undefined) {
        state.buyOneGoods = buyOneGoods;
        sessionStorage.setItem('buyOneGoods', JSON.stringify(buyOneGoods));
      }
    },
    selectedAddress(state, selectedAddress) {
      if (selectedAddress !== undefined) {
        state.selectedAddress = selectedAddress;
        sessionStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
      }
    },
    classifyList(state, classifyList) {
      if (classifyList !== undefined) {
        state.classifyList = classifyList;
        sessionStorage.setItem('classifyList', JSON.stringify(classifyList));
      }
    },
    storeNum(state, storeNum) {
      state.storeNum = storeNum;
      sessionStorage.setItem('storeNum', storeNum)
    },

  },
  getters: {
    selectedSpec: function (state) {
      return state.selectedSpec;
    },
    pickUpUserName: function (state) {
      return state.pickUpUserName;
    },
    pickUpUserPhone: function (state) {
      return state.pickUpUserPhone;
    },
    pickUpUserRemark: function (state) {
      return state.pickUpUserRemark;
    },
    goodsOrderId: function (state) {
      return state.goodsOrderId;
    },
    goodsOrderNum: function (state) {
      return state.goodsOrderNum;
    },
    storeScanGoodsUser: function (state) {
      return state.storeScanGoodsUser;
    },
    nowIntegralNumber: function (state) {
      return state.nowIntegralNumber;
    },
    openMembershipSystem: function (state) {
      return state.openMembershipSystem;
    },
    fromIntegralConvertRatio: function (state) {
      return state.fromIntegralConvertRatio;
    },
    toIntegralConvertRatio: function (state) {
      return state.toIntegralConvertRatio;
    },
    deductionIntegral: function (state) {
      return state.deductionIntegral;
    },
    toTime: function (state) {
      return state.toTime;
    },
    isAfterDiscountTip: function (state) {
      return state.isAfterDiscountTip;
    },
    isAfterDiscountTax: function (state) {
      return state.isAfterDiscountTax;
    },
    afterOrdersToTime: function (state) {
      return state.afterOrdersToTime;
    },
    businessTimeSlot: function (state) {
      return state.businessTimeSlot;
    },
    storeName: function (state) {
      return state.storeName;
    },
    storeAddress: function (state) {
      return state.storeAddress;
    },
    storeMobile: function (state) {
      return state.storeMobile;
    },
    isTax: function (state) {
      return state.isTax;
    },
    isTip: function (state) {
      return state.isTip;
    },
    taxRate: function (state) {
      return state.taxRate;
    },
    tipType: function (state) {
      return state.tipType;
    },
    tipVal: function (state) {
      return state.tipVal;
    },
    discount: function (state) {
      return state.discount;
    },
    isStoreUser: function (state) {
      return state.isStoreUser;
    },
    menuId: function (state) {
      return state.menuId;
    },
    isNoTip: function (state) {
      return state.isNoTip;
    },
    isCustomTip: function (state) {
      return state.isCustomTip;
    },
    clientType: function (state) {
      return state.clientType;
    },
    userId: function (state) {
      return state.userId;
    },
    storeId: function (state) {
      return state.storeId;
    },
    qrCode: function (state) {
      return state.qrCode;
    },
    timeZone: function (state) {
      return state.timeZone;
    },
    shopCartList: function (state) {
      return state.shopCartList;
    },
    userInfo: function (state) {
      return state.userInfo;
    },
    orderInfo: function (state) {
      return state.orderInfo;
    },
    storeInfo: function (state) {
      return state.storeInfo;
    },
    buyNow: function (state) {
      return state.buyNow;
    },
    buyOneGoods: function (state) {
      return state.buyOneGoods;
    },
    selectedAddress: function (state) {
      return state.selectedAddress;
    },
    classifyList: function (state) {
      return state.classifyList;
    },
    storeNum: function (state) {
      return state.storeNum;
    },
  }
});
export default store;
