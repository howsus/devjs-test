import Vue from 'vue'
import Vuex from 'vuex'

import Posts from './modules/posts'
import Loading from './modules/loading'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        posts: Posts,
        loading: Loading
    },
})