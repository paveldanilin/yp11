
export default class HttpRequest {
    static get METHOD_GET() {
        return 'GET';
    }

    static get METHOD_POST() {
        return 'POST';
    }

    static get METHOD_DELETE() {
        return 'DELETE';
    }

    static get METHOD_PATCH() {
        return 'PATCH';
    }

    static get METHOD_PUT() {
        return 'PUT';
    }

    static get METHOD_HEAD() {
        return 'HEAD';
    }

    static get METHOD_CONNECT() {
        return 'CONNECT';
    }

    static get METHOD_OPTIONS() {
        return 'OPTIONS';
    }

    static get METHOD_TRACE() {
        return 'TRACE';
    }

    static get MODE_SAME_ORIGIN() {
        return 'same-origin';
    }

    static get MODE_NO_CORS() {
        return 'no-cors';
    }

    static get MODE_CORS() {
        return 'cors';
    }

    static get CREDENTIALS_OMIT() {
        return 'omit';
    }

    static get CREDENTIALS_SAME_ORIGIN() {
        return 'same-origin';
    }

    static get CREDENTIALS_INCLUDE() {
        return 'include';
    }

    static get CACHE_DEFAULT() {
        return 'default';
    }

    static get CACHE_NO_STORE() {
        return 'no-store';
    }

    static get CACHE_RELOAD() {
        return 'reload';
    }

    static get CACHE_NO_CACHE() {
        return 'no-cache';
    }

    static get CACHE_FORECE_CACHE() {
        return 'force-cache';
    }

    static get CACHE_ONLY_IF_CACHED() {
        return 'only-if-cached';
    }

    static get REDIRECT_FOLLOW() {
        return 'follow';
    }

    static get REDIRECT_ERROR() {
        return 'error';
    }

    static filterOptionMethod(method) {
        let reqMethod = method || HttpRequest.METHOD_GET;

        if (typeof reqMethod !== 'string') {
            throw new Error('`method` options must me string');
        }

        if (reqMethod.trim().length === 0) {
            throw new Error('`method` option must be non empty string');
        }

        reqMethod = reqMethod.toUpperCase();

        const allowed = [
            HttpRequest.METHOD_GET,
            HttpRequest.METHOD_CONNECT,
            HttpRequest.METHOD_DELETE,
            HttpRequest.METHOD_HEAD,
            HttpRequest.METHOD_OPTIONS,
            HttpRequest.METHOD_PATCH,
            HttpRequest.METHOD_POST,
            HttpRequest.METHOD_PUT,
            HttpRequest.METHOD_TRACE
        ];

        if (! allowed.includes(reqMethod)) {
            throw new Error('`method` option value must be on of [' + allowed.join(',') + ']');
        }

        return reqMethod;
    }

    static filterOptionMode(mode) {
        let reqMode = mode || HttpRequest.MODE_SAME_ORIGIN;

        if (typeof reqMode !== 'string') {
            throw new Error('`mode` options must me string');
        }

        if (reqMode.trim().length === 0) {
            throw new Error('`mode` option must be non empty string');
        }

        reqMode = reqMode.toLowerCase();

        const allowed = [HttpRequest.MODE_SAME_ORIGIN, HttpRequest.MODE_CORS, HttpRequest.MODE_NO_CORS];

        if (! allowed.includes(reqMode)) {
            throw new Error('`mode` option value must be on of [' + allowed.join(',') + ']');
        }

        return reqMode;
    }

    static filterOptionCredentials(credentials) {
        let reqCredentials = credentials || HttpRequest.CREDENTIALS_OMIT;

        if (typeof reqCredentials !== 'string') {
            throw new Error('`credentials` options must me string');
        }

        if (reqCredentials.trim().length === 0) {
            throw new Error('`credentials` option must be non empty string');
        }

        reqCredentials = reqCredentials.toLowerCase();

        const allowed = [HttpRequest.CREDENTIALS_OMIT, HttpRequest.CREDENTIALS_INCLUDE, HttpRequest.CREDENTIALS_SAME_ORIGIN];

        if (! allowed.includes(reqCredentials)) {
            throw new Error('`credentials` option value must be on of [' + allowed.join(',') + ']');
        }

        return reqCredentials;
    }

    static filterOptionCache(cache) {
        let reqCache = cache || HttpRequest.CACHE_DEFAULT;

        if (typeof reqCache !== 'string') {
            throw new Error('`cache` options must me string');
        }

        if (reqCache.trim().length === 0) {
            throw new Error('`cache` option must be non empty string');
        }

        reqCache = reqCache.toLowerCase();

        const allowed = [
            HttpRequest.CACHE_DEFAULT,
            HttpRequest.CACHE_FORECE_CACHE,
            HttpRequest.CACHE_NO_CACHE,
            HttpRequest.CACHE_NO_STORE,
            HttpRequest.CACHE_ONLY_IF_CACHED,
            HttpRequest.CACHE_RELOAD
        ];

        if (! allowed.includes(reqCache)) {
            throw new Error('`cache` option value must be on of [' + allowed.join(',') + ']');
        }

        return reqCache;
    }

    static filterOptionRedirect(redirect) {
        let reqRedirect = redirect || HttpRequest.REDIRECT_FOLLOW;

        if (typeof reqRedirect !== 'string') {
            throw new Error('`redirect` options must me string');
        }

        if (reqRedirect.trim().length === 0) {
            throw new Error('`redirect` option must be non empty string');
        }

        reqRedirect = reqRedirect.toLowerCase();

        const allowed = [HttpRequest.REDIRECT_FOLLOW, HttpRequest.REDIRECT_ERROR];

        if (! allowed.includes(reqRedirect)) {
            throw new Error('`redirect` option value must be on of [' + allowed.join(',') + ']');
        }

        return reqRedirect;
    }
}
