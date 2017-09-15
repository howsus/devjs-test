import Request from '../../api'
import { Fingerprint, shouldCatchThrownError } from '../../helpers'

export default {
    template: '#message-template',

    props: ['comment', 'fingerprint'],

    data () {
        return {
            mode: 'show',
            form: {
                text: this.comment.text,
                error: false,
            },
            deleting: false,
            updating: false,
            userId: null,
        }
    },

    computed: {
        /**
         * Determine if the comment belongs to the user.
         * 
         * @return {Boolean} 
         */
        belongsToMe () {
            return this.userId == this.comment.userId;
        },

        /**
         * Determine if the comment in the seeable mode.
         * 
         * @return {Boolean} 
         */
        seeable () {
            return this.mode == 'show';
        },

        /**
         * Determine if the comment in the editable mode.
         * 
         * @return {[type]} [description]
         */
        editable () {
            return this.mode == 'edit';
        }
    },

    created () {
        if(!this.fingerprint) {
            return this.getFingerPrint();
        }

        this.userId = this.fingerprint;
    },

    methods: {
        /**
         * Handler of the comment's updating requests.
         * 
         * @return {avoid} 
         */
        edit () {
            this.form.error = false;

            if(this.form.text.trim() == '') {
                return this.form.error = true;
            }

            this.updating = true;

            this.update();
        },

        /**
         * Make a request to update the comment.
         * 
         * @return {avoid} 
         */
        update () {
            Request.create()
                .resource('comments')
                .id(this.comment.id)
                .data({
                    ...this.comment,
                    text: this.form.text
                })
                .edit()
                .then(this.updated)
                .catch(shouldCatchThrownError())
        },

        /**
         * Called when a request is successfully done.
         * 
         * @param  {Object} options.data 
         * @return {avoid}              
         */
        updated ({data}) {
            this.$emit('commentChanged', data);

            this.mode = 'show';

            this.updating = false;
        },

        /**
         * Handler of removing requests.
         * 
         * @return {avoid} 
         */
        remove () {
            if(confirm('Are you sure?') === false) {
                return false;
            }

            this.deleting = true;

            Request.create()
                .resource('comments')
                .id(this.comment.id)
                .delete()
                .then(this.removed)
                .catch(shouldCatchThrownError())
        },

        /**
         * Called when the commen has been deleted.
         * 
         * @return {avoid} 
         */
        removed () {
            this.deleting = false;

            this.$emit('commentDeleted', this.comment);
        },

        /**
         * Keys handler.
         * 
         * @param  {Object} e
         * @return {avoid}
         */
        submit (e) {
            if(e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();

                this.edit();
            }
        },

        /**
         * Switch to show mode and set the message to the previous value.
         * 
         * @param  {Object} e 
         * @return {avoid}   
         */
        clear (e) {
            e.preventDefault();

            this.form.text = this.comment.text;

            this.mode = 'show';
        },

        /**
         * Get a fingerprint of the user's browser.
         * 
         * @return {avoid} 
         */
        getFingerPrint () {
            Fingerprint.get(fingerprint => {
                this.userId = fingerprint;
            })
        }
    }
}