import FingerprintLibrary from 'fingerprintjs2'

/**
 * Create a new FingerprintLibrary instance.
 * 
 * @type {FingerprintLibrary}
 */
export const Fingerprint = new FingerprintLibrary({
    excludeScreenResolution: true,
    excludeAvailableScreenResolution: true
})

/**
 * Catch a thrown error and print it to the console, alert message.
 *  
 * @return {avoid} 
 */
export const shouldCatchThrownError = () => err => {
    alert('Ooops! Something went wrong.');

    console.log(err);

    if(err.response) {
        console.log(err.response);
    }
}

/**
 * Check whether object is empty.
 * 
 * @param  {Object}  object
 * @return {Boolean}
 */
export function isObjectEmpty (object) {
    for(var item in object) {
        return false;
    }

    return true;
}

/**
 * Functions to work with cookies.
 * 
 * @type {Object}
 */
export const cookies = {
    /**
     * Get a cookie.
     * 
     * @param  {String} name 
     * @return {String}      
     */
    get (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    },

    /**
     * Set a cookie.
     * 
     * @param {String} name    
     * @param {mixed} value   
     * @param {Object} options 
     */
    set (name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }
}

/**
 * Check whether a given function is promise.
 * 
 * @param  {Function|Promise}  object 
 * @return {Boolean}
 */
export function isPromise (object) {
    return typeof object.then === 'function';
}

/**
 * Custom queue class.
 * 
 * @class
 */
export const Queue = class Queue {
    /**
     * Create a new instance.
     * 
     * @constructor
     */
    constructor () {
        this.busy = false;

        this.queue = [];
    }

    /**
     * Create a new task in a queue.
     * 
     * @param {Function|Promise} task
     */
    add (task = false) {
        if(task === false) {
            throw new Error('The task should be a function.')
        }

        this.queue.push(task);

        this.added();

        return this;
    }

    /**
     * Triggered when a new task added.
     * 
     * @return {avoid} 
     */
    added () {
        if(!this.busy) {
            this.start();
        }
    }

    /**
     * Start queue.
     * 
     * @return {avoid}
     */
    start () {
        if(typeof this.queue[0] !== 'undefined') {
            this.busy = true;
            
            this.queue[0](this.shouldBeDone());
        }
    }

    /**
     * Called when the proceed function is done.
     *
     * @return {Callback}
     */
    shouldBeDone () {
        return () => {
            this.queue.splice(0, 1);

            this.busy = false;

            this.start();
        }
    }
}