import Request from '../../api'
import { Fingerprint, shouldCatchThrownError } from '../../helpers'

export default {
    template: '#post-create-template',

    data () {
        return {
            form: {
                title: '',
                text: '',
                userId: ''
            },
            loading: false,
            errors: [],
        };
    },

    watch: {
        ['form.userId'] () {
            this.$store.commit('loading/disable');
        }
    },

    methods: {
        /**
         * Handler of the user's request to create a post.
         * 
         * @return {avoid} 
         */
        post () {
            this.$set(this, 'errors', []);

            if(this.form.title.trim() == '') {
                this.errors.push('The title input is required.');
            }

            if(this.form.text.trim() == '') {
                this.errors.push('The text input is required.');
            }

            if(!this.errors.length) {
                this.request();
            }
        },

        /**
         * Make a request to create a new post.
         * 
         * @return {avoid} 
         */
        request () {
            this.loading = true;

            Request.create()
                .resource('posts')
                .data(this.form)
                .create()
                .then(({data}) => {
                    this.loading = false;

                    this.$store.commit('posts/push', data)

                    this.$router.push({ path: `/post/${data.id}` })
                })
                .catch(shouldCatchThrownError())
        },

        /**
         * Register a fingerprint of the user's browser.
         * 
         * @return {avoid} 
         */
        signUp () {
            Fingerprint.get(fingerprint => {
                this.form.userId = fingerprint;
            });
        },
    },

    created () {
        this.signUp();
    },
}