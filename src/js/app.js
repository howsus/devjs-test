import Vue from 'vue'
import router from './router'
import store from './store'

import Logo from './components/logo'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    watch: {
        '$route': function (to, from) {
            this.$store.commit('loading/enable')
        }
    },
    components: {
        logo: Logo,
    }
})