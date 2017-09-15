import dynamics from 'dynamics.js'
import { Queue } from '../helpers'

export default {
    data () {
        return {
            opened: this.$store.state.loading.busy,
            queue: new Queue(),
        }
    },

    computed: {
        loading () {
            return this.$store.state.loading.busy;
        }
    },

    mounted () {
        this.$nextTick(() => this.boot());
    },

    watch: {
        loading () {
            this.$nextTick(() => this.boot());
        },
    },

    methods: {
        /**
         * Called when the 'loading' variable changed.
         * 
         * @return {avoid} 
         */
        boot () {
            scrollTo(0, 0);

            if(this.loading) {
                return this.open();
            }

            this.close();
        },

        /**
         * Called when the 'loading' set to true.
         * 
         * @return {avoid} 
         */
        open () {
            this.opened = true;

            this.queue.add(done => this.logoPopUp(done));
        },

        /**
         * Called when the 'loading' variable set to false.
         * 
         * @return {avoid} 
         */
        close () {
            this.queue.add(done => this.logoPopOut(done));
        },

        /**
         * Pop up the logo.
         * 
         * @param  {Function} done
         * @return {avoid}        
         */
        logoPopUp (done) {
            dynamics.animate(this.$el.getElementsByTagName('figure')[0], {
                scale: 1.6,
            }, {
                type: dynamics.spring,
                duration: 500,
                complete: done
            }) 
        },

        /**
         * Pop out the logo.
         * 
         * @param  {Function} done
         * @return {avoid}
         */
        logoPopOut (done) {
            dynamics.animate(this.$el.getElementsByTagName('figure')[0], {
                scale: 1,
            }, {
                type: dynamics.easeIn,
                duration: 400,
                complete: () => done(this.opened = false)
            })
        }
    }
}