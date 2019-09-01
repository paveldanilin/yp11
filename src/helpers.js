export function random(min, max) {
    const minRounded = Math.ceil(min);

    return Math.floor(Math.random() * (Math.floor(max) - minRounded + 1)) + minRounded;
}


export function loadHtml(url, callback) {
    if ( !window.XMLHttpRequest ) {
        return;
    }
    // В каком то спринте было в задании fetch
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if ( callback && typeof( callback ) === 'function' ) {
            return callback( this.responseXML );
        }
    };

    xhr.open( 'GET', url );
    xhr.responseType = 'document';
    xhr.send();
}
