import axios from 'axios'
import config from './config'
import 'url-search-params-polyfill'

/**
 * Base URL to make request to.
 * 
 * @type {String}
 */
export const base_url = config.database.server

/**
 * Create a new axios instance.
 * 
 * @type {axios}
 */
export const api = axios.create({
    baseURL: base_url,
    timeout: 1000
})

export default class Request {
    /**
     * Create a new instance.
     * 
     * @param  {String} resource 
     * @constructor
     */
    constructor (resource) {
        this._params = new URLSearchParams();

        this._resource = resource;

        this._id = false;

        this._data = {};
    }

    /**
     * Set a resource id.
     * 
     * @param {Boolean|Integer} id
     */
    id (id = false) {
        this._id = id;

        return this;
    }

    /**
     * Add a constraint to query.
     * 
     * @param  {String} attribute 
     * @param  {String} condition 
     * @param  {mixed} value     
     * @return {Request}     
     */
    where (attribute, condition = false, value = false) {
        if(condition !== false && value === false) {
            value = condition;
            condition = false;
        }

        if(condition == '>=') {
            this.param(attribute + '_gte', value);
        }
        else if (condition == '<=') {
            this.param(attribute + '_lte', value);
        }
        else if (condition == '!=') {
            this.param(attribute + '_ne', value);
        }
        else if (condition == 'like') {
            this.param(attribute + '_like', value);
        }
        else {
            this.param(attribute, value);
        }
        
        return this;
    }



    /**
     * Add a param.
     * 
     * @param  {String} attribute 
     * @param  {mixed} value     
     * @return {Request}           
     */
    param (attribute, value) {
        this._params.append(attribute, value);

        return this;
    }

    /**
     * Add params.
     * 
     * @param  {Array} params
     * @return {Request}
     */
    params (...params) {
        for (var i = 0, l = params.length - 1; i < l; i += 2) {
            this._params.append(params[i], params[i + 1])
        }

        return this;
    }

    /**
     * Set resource.
     * 
     * @param {String} value
     * @return {Request} 
     */
    resource (value) {
        this._resource = value;

        return this;
    }

    /**
     * Set data.
     * 
     * @param {Object} value
     * @return {Request}
     */
    data (value = {}) {
        this._data = value;

        return this;
    }

    /**
     * Set a relation
     * 
     * @param  {Boolean|String} value
     * @return {Request}
     */
    with (value = false) {
        this._params.set('_embed', value);

        return this;
    }

    /**
     * Sort by the field
     * 
     * @param  {String} field
     * @param  {String} type
     * @return {Request}
     */
    order (field, type = 'asc') {
        this._params.set('_sort', field);

        this._params.set('_order', type);

        return this;
    }

    /**
     * Set the limit.
     * 
     * @param  {Number} limits
     * @return {Request}
     */
    limit (limits = 5) {
        this._params.set('_limit', limits);

        return this;
    }

    /**
     * Set the start the records should be fetched from.
     * 
     * @param  {Number} from
     * @return {Request}      
     */
    from (from = 0) {
        this._params.set('_start', from);

        return this;
    }

    /**
     * Set the finish the records should be fetched to.
     * 
     * @param  {Number} to 
     * @return {Request}    
     */
    to (to = 15) {
        this._params.set('_end', to);

        return this;
    }

    /**
     * Make a get request.
     * 
     * @return {Promise} 
     */
    get () {
        return this.query('get');
    }

    /**
     * Make a post request.
     * 
     * @return {Promise} 
     */
    create () {
        return this.query('post');
    }

    /**
     * Make a delete request.
     * 
     * @return {Promise} 
     */
    delete () {
        return this.query('delete');
    }

    /**
     * Make a put request.
     * 
     * @return {Promise} 
     */
    edit () {
        return this.query('put');
    }

    /**
     * Make a request.
     *
     * @param {String} type 
     * @return {Promise} 
     */
    query (type) {
        return api[type](this.getURL(), this._data);
    }

    /**
     * Get a request url.
     * 
     * @return {String} 
     */
    getURL () {
        var url = this._resource;

        if(this._id) {
            url += '/' + this._id;
        }

        return url + '?' + this._params.toString();
    }

    /**
     * Create an instance.
     * 
     * @return {Request} 
     */
    static create () {
        return new this;
    }
}