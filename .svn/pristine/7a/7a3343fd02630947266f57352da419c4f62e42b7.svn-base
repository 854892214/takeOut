import vue from "vue"
import Router from "vue-router"
import NotFound from "../components/404/NotFound.vue"
//
import Home from "../pages/Home.vue"
import My from "../pages/My";
import ShoppingCart from "../pages/ShoppingCart";
import Register from "../pages/Register";
import MyOrder from "../pages/order/MyOrder";
import AddressList from "../pages/address/AddressList";
import AddressDetail from "../pages/address/AddressDetail";
import Classify from "../pages/Classify";
import AddOrder from "../pages/AddOrder";
import OrderDetail from "../pages/order/OrderDetail";
import GoodsDetail from "../pages/GoodsDetail";
import AboutUs from "../pages/AboutUs";
import MerchantInfo from "../pages/MerchantInfo";
import Bill from "../pages/bill";
import Address from "../pages/address";
import Map from "../pages/Map";
import IntegralDetail from "../pages/IntegralDetail";

vue.use(Router);

export default new Router({
  // base: "/h5/micromall/",
  base: "/h5/food/takeout/",         //nginx测试
  routes: [
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          name: 'Classify',
          component: Classify
        },
        {
          path: 'shoppingCart',
          name: 'ShoppingCart',
          component: ShoppingCart,
        },
        {
          path: 'my',
          name: 'My',
          component: My,
        }
      ],
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/IntegralDetail',
      name: 'IntegralDetail',
      component: IntegralDetail
    },
    {
      path: '/Map',
      name: 'Map',
      component: Map
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/bill',
      name: 'Bill',
      component: Bill
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      component: MyOrder
    },
    {
      path: '/addressList',
      name: 'AddressList',
      component: AddressList
    },
    {
      path: '/addressDetail',
      name: 'AddressDetail',
      component: AddressDetail
    },
    {
      path: '/addOrder',
      name: 'AddOrder',
      component: AddOrder
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/goodsDetail',
      name: 'GoodsDetail',
      component: GoodsDetail
    },
    {
      path: '/aboutUs',
      name: 'AboutUs',
      component: AboutUs
    },
    {
      path: '/merchantInfo',
      name: 'MerchantInfo',
      component: MerchantInfo
    },
    {
      path: '*',
      component: NotFound
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
