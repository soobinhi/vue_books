import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import axios from 'axios'
// axios를 import

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$axios = axios
Vue.prototype.$store = store

export default new Vuetify({
  icons: {
    iconfont: 'md' // 'md' || 'mdi' || 'fa' || 'fa4'
  }
})

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  vuetify: new Vuetify(),
})