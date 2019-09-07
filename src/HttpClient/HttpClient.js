import HttpRequest from "./HttpRequest";
import HttpError from "./HttpError";

export default class HttpClient {
    constructor(options) {
        const clientOptions = options || {};

        this._baseUrl = this._filterOptionBaseUrl(clientOptions.baseUrl || '');
        this._headers = clientOptions.headers || {};
        this._mode = clientOptions.mode || HttpRequest.MODE_SAME_ORIGIN;
        this._cache = clientOptions.cache || HttpRequest.CACHE_DEFAULT;
        this._redirect = clientOptions.redirect || HttpRequest.REDIRECT_FOLLOW;
        this._credentials = clientOptions.credentials || HttpRequest.CREDENTIALS_SAME_ORIGIN;
        this._throwError = clientOptions.throwError || true;
        this._responseFormat = this._filterOptionResponseFormat(clientOptions.responseFormat || undefined);
    }

    static get RESPONSE_JSON() {
        return 'json';
    }

    static get RESPONSE_TEXT() {
        return 'text';
    }

    static get RESPONSE_FORM_DATA() {
        return 'form-data';
    }

    static get RESPONSE_BLOB() {
        return 'blob';
    }

    static get RESPONSE_ARRAY_BUFFER() {
        return 'array-buffer';
    }

    static get RESPONSE_RAW() {
        return 'raw';
    }

    static create(options) {
        return new HttpClient(options || {});
    }

    static getRequest(url, options) {
        return HttpClient.create().fetch(url, options);
    }

    static postRequest(url, options) {
        return HttpClient.create().post(url, options);
    }

    static patchRequest(url, options) {
        return HttpClient.create().patch(url, options);
    }

    static deleteRequest(url, options) {
        return HttpClient.create().delete(url, options);
    }

    fetch(url, {headers, mode, cache, redirect, credentials, responseFormat} = {}) {
        return this.sendRequest(
            url,
            HttpRequest.METHOD_GET,
            headers || undefined,
            undefined,
            mode || undefined,
            cache || undefined,
            redirect || undefined,
            credentials || undefined,
            responseFormat || undefined
        );
    }

    post(url, {headers, body, mode, cache, redirect, credentials, responseFormat} = {}) {
        return this.sendRequest(
            url,
            HttpRequest.METHOD_POST,
            headers || undefined,
            body || undefined,
            mode || undefined,
            cache || undefined,
            redirect || undefined,
            credentials || undefined,
            responseFormat || undefined
        );
    }

    patch(url, {headers, body, mode, cache, redirect, credentials, responseFormat} = {}) {
        return this.sendRequest(
            url,
            HttpRequest.METHOD_PATCH,
            headers || undefined,
            body || undefined,
            mode || undefined,
            cache || undefined,
            redirect || undefined,
            credentials || undefined,
            responseFormat || undefined
        );
    }

    put(url, {headers, body, mode, cache, redirect, credentials, responseFormat} = {}) {
        return this.sendRequest(
            url,
            HttpRequest.METHOD_PUT,
            headers || undefined,
            body || undefined,
            mode || undefined,
            cache || undefined,
            redirect || undefined,
            credentials || undefined,
            responseFormat || undefined
        );
    }

    delete(url, {headers, mode, cache, redirect, credentials, responseFormat} = {}) {
        return this.sendRequest(
            url,
            HttpRequest.METHOD_DELETE,
            headers || undefined,
            undefined,
            mode || undefined,
            cache || undefined,
            redirect || undefined,
            credentials || undefined,
            responseFormat || undefined
        );
    }

    async sendRequest(url, method, headers, body, mode, cache, redirect, credentials, responseFormat) {
        let reqHeaders = headers || {};
        reqHeaders = Object.assign(this._headers, reqHeaders);
        const reqMode = mode || this._mode;
        const reqCache = cache || this._cache;
        const reqRedirect = redirect || this._redirect;
        const reqCredentials = credentials || this._credentials;
        const reqResponseFormat = this._filterOptionResponseFormat(responseFormat, this._responseFormat);
        let reqUrl = url;
        if (this._baseUrl.length > 0) {
            reqUrl = this._baseUrl + reqUrl;
        }

        const request = new Request(reqUrl, {
            method: HttpRequest.filterOptionMethod(method),
            body: body,
            headers: reqHeaders,
            mode: HttpRequest.filterOptionMode(reqMode),
            cache: HttpRequest.filterOptionCache(reqCache),
            redirect: HttpRequest.filterOptionRedirect(reqRedirect),
            credentials:HttpRequest.filterOptionCredentials(reqCredentials)
        });

        const response = await fetch(request);

        if (this._throwError && ! response.ok) {
            throw new HttpError(response);
        }

        if (response.ok) {
            switch (reqResponseFormat) {
                default:
                case HttpClient.RESPONSE_TEXT:
                    return response.text();

                case HttpClient.RESPONSE_ARRAY_BUFFER:
                    return response.arrayBuffer();

                case HttpClient.RESPONSE_BLOB:
                    return response.blob();

                case HttpClient.RESPONSE_FORM_DATA:
                    return response.formData();

                case HttpClient.RESPONSE_JSON:
                    return response.json();
            }
        }

        return response;
    }

    _filterOptionResponseFormat(responseFormat, defaultFormat) {
        const format = (responseFormat || defaultFormat || HttpClient.RESPONSE_RAW).toLowerCase();

        const allowed = [
            HttpClient.RESPONSE_RAW,
            HttpClient.RESPONSE_JSON,
            HttpClient.RESPONSE_FORM_DATA,
            HttpClient.RESPONSE_BLOB,
            HttpClient.RESPONSE_ARRAY_BUFFER,
            HttpClient.RESPONSE_TEXT
        ];

        if (! allowed.includes(format)) {
            throw new Error('`responseFormat` option must have value one of [' + allowed.join(',') + ']');
        }

        return format;
    }

    _filterOptionBaseUrl(baseUrl) {
        if (typeof baseUrl !== 'string') {
            throw new Error('`baseUrl` option must be non empty string');
        }

        return baseUrl.trim();
    }
}
