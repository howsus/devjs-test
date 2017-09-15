import Request from '../../api'
import Comment from '../comment'
import CommentCreateForm from '../comment/create'
import { Fingerprint, shouldCatchThrownError } from '../../helpers'

export default {
    template: '#post-template',

    data () {
        return {
            post: {},

            mode: 'show',

            deleting: false,

            form: {
                title: '',
                text: '',
                errors: [],
                busy: false,
            },

            userId: null,

            loadStatus: {
                fingerprint: false,
                rendered: false,
                data: false
            }
        }
    },

    computed: {
        /**
         * Determine whether the component is ready.
         * 
         * @return {Boolean}
         */
        loaded () {
            return this.loadStatus.fingerprint && this.loadStatus.rendered && this.loadStatus.data;
        },

        /**
         * Determine if the post belongs to the user.
         * 
         * @return {Boolean} 
         */
        belongsToMe () {
            return this.post.userId == this.userId;
        },

        /**
         * Get the sorted comments.
         * 
         * @return {Array}
         */
        comments () {
            return this.post.comments.sort((a, b) => b.id - a.id);
        },

        /**
         * Determine if the post in the seeable mode.
         * 
         * @return {Boolean} 
         */
        seeable () {
            return this.mode == 'show';
        },

        /**
         * Determine if the post in the editable mode.
         * 
         * @return {Boolean} 
         */
        editable () {
            return this.mode == 'edit';
        }
    },

    watch: {
        loaded (loaded) {
            if(loaded) {
                this.$store.commit('loading/disable')
            }
        },

        post (value) {
            this.form.title = value.title;
            this.form.text = value.text;
        }
    },

    created () {
        this.getFingerPrint();

        this.getPost(this.$store.getters['posts/getPostById'](this.$route.params.id));
    },

    mounted () {
        this.loadStatus.rendered = true;
    },

    methods: {
        /**
         * Handler of the user's requests to edit the post.
         * 
         * @return {avoid} 
         */
        edit () {
            this.form.errors = [];

            if(this.form.title.trim() == '') {
                this.form.errors.push('The title input is required.')
            }

            if(this.form.text.trim() == '') {
                this.form.errors.push('The text input is required.')
            }

            if(!this.form.errors.length) {
                this.update();
            }
        },

        /**
         * Make a request to update the post.
         * 
         * @return {avoid}
         */
        update () {
            this.form.busy = true;

            Request.create()
                .resource('posts')
                .id(this.post.id)
                .data({
                    ...this.post,
                    title: this.form.title,
                    text: this.form.text,
                })
                .edit()
                .then(this.updated)
                .catch(shouldCatchThrownError())
        },

        /**
         * Called when the post has been updated.
         * 
         * @param  {Object} options.data 
         * @return {avoid}              
         */
        updated ({data}) {
            this.post.title = data.title;
            this.post.text = data.text;

            this.busy = false;

            this.mode = 'show';
        },

        /**
         * Handler of the user's request to update the post.
         * 
         * @return {avoid} 
         */
        remove () {
            if(confirm('Are you sure?') === false) {
                return false;
            }

            Request.create()
                .resource('posts')
                .id(this.post.id)
                .delete()
                .then(({data}) => {
                    this.$store.commit('posts/delete', this.post.id);

                    this.$router.push({
                        path: `/`
                    })
                })
        },

        /**
         * Get the post if it's not loaded yet, and get the comments.
         * 
         * @param  {Object|Boolean} post
         * @return {Promise}
         */
        getPost (post = false) {
            if(typeof post !== 'undefined' && post !== false) {
                this.post = post;

                return this.getOnlyComments();
            }

            return this.getFullPost();
        },

        /**
         * Get the post and the comments.
         * 
         * @return {Promise} 
         */
        getFullPost () {
            return Request.create()
                .resource('posts')
                .with('comments')
                .id(this.$route.params.id)
                .get()
                .then(({data}) => this.post = data)
                .then(() => this.loadStatus.data = true)
                .catch(shouldCatchThrownError())
        },

        /**
         * Get the comments of the post.
         * 
         * @return {Promise} 
         */
        getOnlyComments () {
            return Request.create()
                .resource('comments')
                .where('postId', this.post.id)
                .get()
                .then(({data}) => this.post.comments = data)
                .then(() => this.loadStatus.data = true)
                .catch(shouldCatchThrownError())
        },

        /**
         * Called when a comment has been changed.
         * 
         * @param  {Object} changedComment 
         * @return {avoid}                
         */
        commentChanged (changedComment) {
            var comment = this.post.comments.find(e => e.id == changedComment.id);

            comment.text = changedComment.text;
        },

        /**
         * Called when a comment has been deleted.
         * 
         * @param  {Object} deletedComment 
         * @return {avoid}                
         */
        commentDeleted (deletedComment) {
            this.post.comments.splice(this.post.comments.findIndex(e => e.id == deletedComment.id), 1);
        },

        /**
         * Called when a comment has been created.
         * 
         * @param  {Object} createdComment 
         * @return {avoid}                
         */
        commentCreated (createdComment) {
            this.post.comments.push(createdComment);
        },

        /**
         * Get and register a fingerprint of the user's browser.
         * 
         * @return {avoid} 
         */
        getFingerPrint () {
            Fingerprint.get(fingerprint => {
                this.userId = fingerprint

                this.loadStatus.fingerprint = true;
            })
        },
    },

    components: {
        'comment': Comment,
        'comment-create-form': CommentCreateForm,
    }
}