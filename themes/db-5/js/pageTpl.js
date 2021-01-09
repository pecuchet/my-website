define([], function () {

    return {
        allowImg : function ( image ) {
            return image && !/-posterframe\./.test( image ) ? image : null
        },

        main : function ( title, slug, image ) {
            return '<main data-slug="'+ slug +'">'
                        + '<article>'
                            + '<h2>' + title + '</h2>'
                            + ( this.allowImg( image )
                                ? '<img src="' + image + '" alt="' + title + '">'
                                : '' )
                            + '<div class="xhr-root"><p class="about">Loading...</p></div>'
                        + '</article>'
                 + '</main>';
        },

        content : function ( data ) {
            var html = '',
                liString = '',
                li = [], i = 0,
                videoSources = '', m, j,
                media = data.meta && data.meta.media ? data.meta.media : [],
                l = media.length;

            if ( data.content ) {
                html = '<div class="about">' + data.content + '</div>';
            }

            for ( i; i < l; i++ ) {
                if ( typeof media[i].src === 'string' ) {
                    liString = '<li><img src="' + media[i].src + '" alt="' + data.meta.title + '"></li>';
                } else {
                    for ( j = 0, m = media[i].src.length; j < m; j++ ) {
                        videoSources += '<source src="' + media[i].src[j].url + '" type="' + media[i].src[j].mime + '">'
                    }
                    liString = '<li><video controls preload poster="' + media[i].poster + '">'
                                + videoSources
                             + '</video></li>';
                }
                li.push( liString );
            }
            return html + '<ul>' + li.join('') + '</ul>';
        }
    }
});