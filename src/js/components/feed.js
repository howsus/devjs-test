import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    template: '#feed-template',

    data () {
        return {
            new_posts: false,
            loaded: false,
            busy: false,
        }
    },

    mounted () {
        if(this.state.posts.length) {
            return this.onLoaded();
        }

        this.busy = true;

        this.getNextPage()
            .then(this.onLoaded)
    },

    methods: {
        onLoaded () {
            this.$store.commit('loading/disable')

            this.loaded = true;

            this.busy = false;
        },

        nextPage () {
            this.busy = true;

            this.getNextPage()
                .then(() => this.busy = false)
        },

        ...mapActions({
            'getNextPage': 'posts/getNextPage'
        })
    },

    computed: {
        ...mapState({
            state: state => state.posts
        })
    },
}