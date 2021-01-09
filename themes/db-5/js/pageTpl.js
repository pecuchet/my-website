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
            return html + '<ul>' + li.join('') + '</ul>'
                + '<footer><p><small>This work is licensed under a Creative Commons <a rel="license" itemprop="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Attribution-NonCommercial-ShareAlike 4.0 International License </a>(CC BY-NC-SA 4.0).</small><br><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a></p></footer>';
        }
    }
});