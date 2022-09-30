import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import JoinView from '../views/JoinView.vue'
import OrderView from '../views/OrderView.vue'
import OrderListView from '../views/OrderListView.vue'
import AdminOrderListView from '../views/AdminOrderList.vue'
import BookRegister from '../views/BookRegister.vue'
import AdminBookRental from '../views/AdminBookRental.vue'
import AdminBookReserve from '../views/AdminBookReserve.vue'
import AdminBook from '../views/AdminBook.vue'
import AdminBookCart from '../views/AdminBookCart.vue'
import AdminBookDetail from '../views/AdminBookDetail.vue'
import MyBookRental from '../views/BookRental.vue'
import MyBookReserve from '../views/BookReserve.vue'

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
  {
    path: '/admin/rental',
    name: 'AdminBookRental',
    component: AdminBookRental
  },
  {
    path: '/admin/reserve',
    name: 'AdminBookReserve',
    component: AdminBookReserve
  },
  {
    path: '/admin/book',
    name: 'AdminBook',
    component: AdminBook
  },
  {
    path: '/admin/bookcart',
    name: 'AdminBookCart',
    component: AdminBookCart
  },
  {
    path: '/admin/book/detail/:id',
    name: 'AdminBookDetail',
    component: AdminBookDetail
  },
  {
    path: '/my/rental',
    name: 'MyBookRental',
    component: MyBookRental
  },
  {
    path: '/my/reserve',
    name: 'MyBookReserve',
    component: MyBookReserve
  },
  ]
})