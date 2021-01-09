;(function ( w ) {
    'use strict';
    
    var d = w.document;

    require.config({
        baseUrl: '/themes/db-5/js',
        urlArgs: "bust=" + (new Date()).getTime(),
        paths: {
            xhr            :  "libs/xhr",
            goScroll       :  "libs/goScroll",
            d1             :  "libs/d1",
            lodash         :  "libs/lodash.custom",

            app            :  "app",
            templates      :  "pageTpl",
            Grid           :  "Grid",
            Page           :  "Page"
        }
    });

    require([
        'app',
        'Grid',
        'Page'
    ], function ( app, Grid, Page ) {
        var isWin = !w.navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i),
            state = {
                pageLoad : 1,
                isSingle : w.location.pathname !== '/',
                siteTitle : d.getElementById( 'site-title' ).getAttribute( 'content' ),
                title : d.title,
                url   : w.location.href
            };

        if ( isWin ) { d.body.classList.add('is-win'); }
        
        if ( app.util.support.isTouch ) {
            d.body.classList.add('is-touch');
        } else {
            d.body.classList.add('no-touch');
        }

        // History handling
        if ( app.hasHistory ) {
            // On pop state launch view
            w.addEventListener( 'popstate', function ( e ) {
                // prevent pop state on first load for Safari & Chrome 34-
                if ( !e.state ) { return; }
                app.handlePopState( e.state );
            });

            // Replace initial state to store the initial content so we can revisit it later.
            w.history.replaceState( state, state.title, state.url );
        }

        // Set up grid
        app.views.grid = new Grid({
            el: d.getElementById( 'grid' )
        });

        // Start
        app.initialize( state );

        // Set up the page, if needed
        if ( state.isSingle ) {
            app.views.page = new Page({});
            app.views.grid.shiftGrid( d.querySelector( '.col.open' ) );
            app.views.grid.onColumnExpanded();
        }

        app.initial.pageLoad = 0;
    });
})( window );