import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import JoinView from '../views/JoinView.vue'
import OrderView from '../views/OrderView.vue'
import OrderListView from '../views/OrderListView.vue'
import AdminOrderListView from '../views/AdminOrderList.vue'
import BookRegister from '../views/BookRegister.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/join',
    name: 'Join',
    component: JoinView
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderView
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: OrderListView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin/orderlist',
    name: 'AdminOrderList',
    component: AdminOrderListView
  },
  {
    path: '/admin/bookregister',
    name: 'BookRegister',
    component: BookRegister
  },
  ]
})