import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Feed from '../components/feed'
import Post from '../components/post'
import CreatePost from '../components/post/create'

export default new Router({
    routes: [
        {
            path: '/',
            component: Feed
        },
        {
            path: '/post/create',
            component: CreatePost
        },
        {
            path: '/post/:id',
            component: Post
        },
        
    ]
})