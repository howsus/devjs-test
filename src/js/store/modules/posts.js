import Request from '../../api'
import { shouldCatchThrownError } from '../../helpers'

function createNextPageRequest (from) {
    return Request.create()
                  .resource('posts')
                  .limit(10)
                  .order('id', 'desc');
}

export default {
    state: {
        posts: [],
        last_total_records: 0,
    },

    mutations: {
        push (state, post) {
            if(typeof post.title !== 'undefined' && typeof post.text !== 'undefined' && state.posts.findIndex(p => p.id == post.id) === -1) {
                state.posts.push(post);
            }
        },

        delete (state, deletedPostId) {
            var indexDeletedPost = state.posts.findIndex(post => post.id == deletedPostId);

            if(indexDeletedPost !== -1) {
                state.posts.splice(indexDeletedPost, 1);
            }
        },

        setLastTotalRecords (state, records) {
            state.last_total_records = records;
        }
    },

    actions: {
        getNextPage (context) {
            var request = createNextPageRequest();

            if(context.state.posts.length) {
                request.where('id', '<=', context.getters.last_post_id + 1)
            }

            return request.get()
                .then(response => {
                    context.commit('setLastTotalRecords', Number(response.headers['x-total-count']));

                    response.data.forEach(post => context.commit('push', post));
                })
                .catch(shouldCatchThrownError())
         }
    },

    getters: {
        getPostById: state => id => {
            return state.posts.find(post => post.id == id);
        },

        sorted (state) {
            return state.posts.sort((a, b) => b.id - a.id);
        },

        last_post_id (state) {
            return Math.min.apply(null, state.posts.map(post => post.id)) || 0;
        } 
    },

    namespaced: true,
}