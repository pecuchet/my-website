// Backbone.NativeAjax.js 0.3.2 | (c) 2014 Adam Krebs, Paul Miller, Exoskeleton Project | MIT license | https://github.com/akre54/Backbone.NativeAjax
define([], function ()
{
    var ajax = (function() {
        var xmlRe = /^(?:application|text)\/xml/,
            jsonRe = /^application\/json/,

            getData = function(accepts, xhr) {
                if (accepts == null) accepts = xhr.getResponseHeader('content-type');
                if (xmlRe.test(accepts)) {
                    return xhr.responseXML;
                } else if (jsonRe.test(accepts) && xhr.responseText !== '') {
                    return JSON.parse(xhr.responseText);
                } else {
                    return xhr.responseText;
                }
            },

            isValid = function(xhr) {
                return (xhr.status >= 200 && xhr.status < 300) ||
                    (xhr.status === 304) ||
                    (xhr.status === 0 && window.location.protocol === 'file:')
            },

            end = function( xhr, options, resolve, reject )
            {
                return function()
                {
                    if ( xhr.readyState !== 4 ) return;

                    var status = xhr.status, error,
                        data = getData( options.headers && options.headers.Accept, xhr );

                    // Check for validity.
                    if ( isValid( xhr ) ) {
                        if ( options.success ) options.success( data );

                        if ( resolve ) resolve( data );
                    } else {
                        error = new Error( 'Server responded with a status of ' + status );
                        if ( options.error ) options.error( xhr, status, error );
                        if ( reject ) reject( xhr );
                    }
                }
            };

        return function ( options )
        {
            var key, resolve, reject, xhr;

            if ( options == null ) throw new Error( 'You must provide options' );
            if ( options.type == null ) options.type = 'GET';

            xhr = new XMLHttpRequest();

            var PromiseFn = ajax.Promise || (typeof Promise !== 'undefined' && Promise);
            var promise = PromiseFn && new PromiseFn(function(res, rej) {
                    resolve = res;
                    reject = rej;
                });

            options.headers = options.headers || {};

            if (options.contentType) {
                options.headers['Content-Type'] = options.contentType;
            }

            // Stringify GET query params.
            if (options.type === 'GET' && typeof options.data === 'object') {
                var query = '';
                var stringifyKeyValuePair = function(key, value) {
                    return value == null ? '' :
                    '&' + encodeURIComponent(key) +
                    '=' + encodeURIComponent(value);
                };
                for ( key in options.data ) {
                    if ( options.data.hasOwnProperty( key ) ) {
                        query += stringifyKeyValuePair( key, options.data[key] );
                    }
                }

                if (query) {
                    var sep = (options.url.indexOf('?') === -1) ? '?' : '&';
                    options.url += sep + query.substring(1);
                }
            }

            xhr.onreadystatechange = end( xhr, options, resolve, reject );

            xhr.open(options.type, options.url, true);

            var allTypes = "*/".concat("*");
            var xhrAccepts = {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            };

            xhr.setRequestHeader(
                "Accept",
                options.dataType && xhrAccepts[options.dataType] ?
                xhrAccepts[options.dataType] + (options.dataType !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    xhrAccepts["*"]
            );

            if (options.headers) {
                for ( key in options.headers ) {
                    if ( !options.headers.hasOwnProperty( key ) ) continue;
                    xhr.setRequestHeader( key, options.headers[key] );
                }
            }

            if (options.beforeSend) options.beforeSend(xhr);
            xhr.send(options.data);

            return promise;
        };
    })();
    return ajax;
});