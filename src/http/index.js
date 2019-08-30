import httpClient from 'axios';

if (process.env.NODE_ENV === 'development') {
  // httpClient.defaults.baseURL = 'http://192.168.1.19:8080/route/mobi';
  httpClient.defaults.baseURL = 'http://192.168.1.14:8080/mobi';
  //httpClient.defaults.baseURL = 'https://test.hantepay.cn/mobi';
} else {
  httpClient.defaults.baseURL = 'https://test.hantepay.cn/mobi';
}
httpClient.defaults.headers.post['Content-Type'] = 'application/json';
httpClient.defaults.withCredentials = true;

export default {
  getUserInfo: async function (params) {
    return httpClient.get(`/store/takeOuth5Info?${params}`)
  },
  getGlobalInfo: async function (params) {
    console.log(params)
    return httpClient.get(`/store/takeOuth5Info?${params}`)
  },
  getGoodsList: async function (storeNum) {
    return httpClient.post(`/store/takeout/goods/list?storeNum=${storeNum}`, {});
  },
  getGoodsDetail: async function (goodsId) {
    return httpClient.get(`/goods/one?id=${goodsId}`);
  },
  registerUser: async function (storeId, body) {
    return httpClient.post(`/scangoodsuser/register?store_id=${storeId}`, body);
  },
  // getUserDetail: async function (params) {
  //   return httpClient.get(`/goodsMicroMallCustomer/userDetail?${params}`)
  // },
  // addAddress: function (userInfoId, addressInfo) {
  //   return httpClient.post(`/goodsMicroMallCustomer/address/save?goods_micro_mall_customer_id=${userInfoId}`, addressInfo);
  // },
  addAddress: function (userInfoId, addressInfo) {
    return httpClient.post(`/scangoodsuser/address/save?storeScanGoodsUser_id=${userInfoId}`, addressInfo);
  },
  updateAddress: function (addressId, addressInfo) {
    //return httpClient.post(`/goodsMicroMallCustomer/address/update?goods_micro_mall_customer_address_id=${addressId}`, addressInfo);
    //接口发生变更
    return httpClient.post(`/scangoodsuser/address/update?storeScanGoodsUserAddress_id=${addressId}`, addressInfo);
  },
  // deleteAddress: function (addressId) {
  //   return httpClient.post(`/goodsMicroMallCustomer/address/update?goods_micro_mall_customer_address_id=${addressId}`, {
  //     status: 99
  //   });
  // },
  deleteAddress: function (addressId,body) {
    return httpClient.post(`/scangoodsuser/address/update?storeScanGoodsUserAddress_id=${addressId}`, body);
  },
  getOrderList: async function (params, body) {
    return httpClient.post(`/goodsorder/list?${params}`, body);
  },
  getOrderListCount: async function (body) {
    return httpClient.post(`/goodsmicromallorder/listCount`, body);
  },
  getOrderDetail(orderNum) {
    return httpClient.get(`/goodsorder/one?num=${orderNum}`);
  },
  addOrder(params, body) {
    return httpClient.post(`/goodsorder/add?${params}`, body);
  },
  cancelOrder(orderId) {
    return httpClient.post(`/goodsmicromallorder/update?order_id=${orderId}`, {
      paystatus: 3
    });
  },
  addPayOrder(params,body) {
    return httpClient.post(`/goodsorder/pay/order/add?${params}`, body);
  },
  uniformPay(params) {
    return httpClient.get(`/pay/pay?${params}`);
  },
  getAllCountry() {
    return httpClient.get(`/address/allCountry`);
  },
  getAllProvinceByCountryCode(countryCode) {
    return httpClient.get(`/address/allProvinceByCountryCode?countryCode=${countryCode}`);
  },
  getAllCityByProvinceCode(provinceCode) {
    return httpClient.get(`/address/allCityByProvinceCode?provinceCode=${provinceCode}`);
  },
  getValidateCode(params) {
    return httpClient.get(`/sms/webphone?${params}`);
  },
  getStoreInfo(storeId) {
    // return httpClient.get(`/store/one?store_id=${storeId}`);
    return httpClient.get(`/goodsmicromallorder/storeInfo?storeId=${storeId}`);
  },
  queryOrder(params) {
    return httpClient.get(`/pay/resp/alipay/query?${params}`)
  },
  getPayOrderById(id) {
    return httpClient.get(`/order/one?merchant_order_id=${id}`)
  },
  getPayOrderUpdate(params,body) {
    return httpClient.post(`/goodsorder/update/status?${params}`,body)
  },
  getPayOrderEmail(params,body) {
    return httpClient.post(`/goodsorder/send/receipt?${params}`,body)
  },
  getAddressList(params) {
    return httpClient.get(`scangoodsuser/address/list?${params}`)
  },
  getIntegralDetailList(params) {
    return httpClient.get(`scangoodsuser/integralConsumeList?${params}`)
  },
  getDistance(params){
    return httpClient.get(`/goodsorder/distance?${params}`)
  }
}
