import Request from '../../api'
import { Fingerprint, shouldCatchThrownError } from '../../helpers'

export default {
    template: '#message-create-template',

    props: ['fingerprint', 'postId'],

    data () {
        return {
            form: {
                name: '',
                text: '',
                userId: null,
                postId: this.postId
            },
            errors: [],
            rendered: false,
            busy: false
        }
    },

    created () {
        if(!this.fingerprint) {
            return this.getFingerPrint();
        }

        this.form.userId = this.fingerprint;
    },

    watch: {
        ['form.userId'] (val) {
            this.rendered = true;
        }
    },

    methods: {
        /**
         * A submitting handler. Validate data and if there's no errors, make the request.
         * 
         * @return {avoid} 
         */
        submit () {
            this.errors = [];

            if(this.form.name.trim() == '') {
                this.errors.push('The input name is required.');
            }
            if(this.form.text.trim() == '') {
                this.errors.push('The input name is required.');
            }
            if(typeof this.form.postId === 'undefined') {
                this.errors.push('The post id is required.');
            }

            if(!this.errors.length) {
                this.post();
            }
        },

        /**
         * Make a request to create a new comment.
         * 
         * @return {avoid} 
         */
        post () {
            this.bust = true;

            Request.create()
                .resource('comments')
                .data(this.form)
                .create()
                .then(({data}) => {
                    this.$emit('commentCreated', data);

                    this.busy = false;

                    this.form.name = '';
                    this.form.text = '';
                })
                .catch(shouldCatchThrownError())
        },

        /**
         * Get fingerprint of the user's browser.
         * 
         * @return {avoid} 
         */
        getFingerPrint () {
            Fingerprint.get(fingerprint => {
                this.form.userId = fingerprint;
            })
        }
    }
}