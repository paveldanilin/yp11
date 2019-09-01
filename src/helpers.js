export function random(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function loadHtml(url, callback)
{
    if ( !window.XMLHttpRequest ) return;

    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if ( callback && typeof( callback ) === 'function' ) {
            callback( this.responseXML );
        }
    };

    xhr.open( 'GET', url );
    xhr.responseType = 'document';
    xhr.send();
}
