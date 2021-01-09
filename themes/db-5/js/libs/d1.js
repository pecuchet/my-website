define([], function () {
    'use strict';

    var w = window,
        d = w.document,
        support = {
            Transition : false,
            Transform : false
        },
        D = {}, // library,

    // cache
        navigator = w.navigator,

    // browser support test
        test = d.createElement('div'),
        vendors = [ '', 'Webkit', 'Moz', 'O', 'ms' ],
        callbacks = [ 'transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd' ],
        testStyle = test.style,
        p, i = 0;

    for ( p in support ) {
        for ( i; i < 5; i++ ) {
            if ( support.hasOwnProperty( p ) ) {
                if ( testStyle[ p.toLowerCase() ] !== undefined ) {
                    support[p.toLowerCase()] = p.toLowerCase();
                    support.transitionEnd = callbacks[i];
                    break;
                }
                if ( testStyle[ vendors[i] + p ] !== undefined ) {
                    support[p.toLowerCase()] = '-' + vendors[i].toLowerCase() + '-' + p.toLowerCase();
                    support.transitionEnd = callbacks[i];
                }
            }
        }
    }

    // Screen density
    support.scrDensity = 'devicePixelRatio' in w ? w.devicePixelRatio : 1;
    // isTouch ?
    support.isTouch = 'ontouchstart' in w || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    // Finalise compatibility checks
    test = null;
    D.support = support;

    /*
     |--------------------------------------------------------------------------
     | Utilities
     |--------------------------------------------------------------------------
     |
     |
     */

    D.isIE9 = function () {
        var nav = navigator.userAgent.toLowerCase();
        return ( nav.indexOf('msie') !== -1 ) ? parseInt( nav.split('msie')[1] ) === 9 : false;
    };

    D.toggleTransition = function ( element, state ) {
        element.style[ this.support.transition ] = state ? '' : 'none';
    };

    /*
     |--------------------------------------------------------------------------
     | DOM functions
     |--------------------------------------------------------------------------
     |
     |
     */

    D.parent = function( element, tagname ) {
        tagname = tagname.toLowerCase();
        do {
            if (element.tagName.toLowerCase() === tagname)
                return element;
        } while (element = element.parentNode);
        return null;
    };

    D.elementArray = function ( nodeList ) {
        return Array.prototype.slice.call( nodeList );
    };

    D.elementIndex = function ( node ) {
        var index = 0;
        while ( node = node.previousElementSibling ) {
            index++;
        }
        return index;
    };

    return D;
});