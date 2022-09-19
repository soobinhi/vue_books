/* eslint-disable */
import router from '@/router'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const userStore = new Vuex.Store({
    state: {
        token: ''
    },
    mutations: {
        login: function (state, payload) {
            state.token = payload.token
            state.user_id = payload.user_id
            state.is_admin = payload.is_admin
            console.log("토큰은 :"+state.token+", id는 : "+state.user_id+", 관리자인가요?"+state.is_admin)
        },
        loginCheck: function (state) {
            if (!state.token) {
                router.push({
                    name: 'login'
                }).catch(error => {
                    console.log(error)
                })
            }
        },
        logout: function(state){
            state.token=''
            state.user_id=''
            state.is_admin=''
            
        }
    },
    plugins: [createPersistedState({

    })]
})

export default userStore