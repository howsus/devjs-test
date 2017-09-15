export default {
    namespaced: true,
    
    state: {
        busy: true
    },

    mutations: {
        enable (state) {
            state.busy = true;
        },

        disable (state) {
            state.busy = false;
        }
    }
}