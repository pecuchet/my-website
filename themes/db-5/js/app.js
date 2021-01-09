define([
    'd1',
    'goScroll',
    'lodash'
], function ( d1, goScroll, lodash ) {
    'use strict';

    var w = window,
        d = w.document;

    return {

        util : d1,
        initial: {},
        views : {},
        data : {},
        mail: ['arnaud', 'arnaudcoolsaet', 'eu'],
        resolution : Math.max( screen.width, screen.height ) * d1.support.scrDensity,
        hasHistory : w.history && w.history.pushState && w.history.state !== undefined,
        showingContact: 0,
        
        initialize : function ( initialState ) {
            
            this.initial = initialState;
            this.closeBtn = d.getElementById( 'btn-close' );
            this.contactBtn = d.getElementById( 'btn-contact' );

            this.setSizable();
            this.bindHandlers();
            this.load();
        },

        bindHandlers : function () {
            var self = this;
            this.closeBtn.addEventListener( 'click', function(e){
                e.preventDefault();
                self.closePage( 1 );
            });
            this.contactBtn.addEventListener( 'click', function(e){
                self.toggleContact( e.currentTarget );
                e.preventDefault();
            });
            w.addEventListener( 'resize', lodash.debounce( function(){ self.setSizable(); }, 100 ));
        },
        
        load : function () {
            var self = this;
            if ( d.readyState === 'complete' ) {
                self.onLoad();
            } else {
                w.addEventListener( 'load', function () { self.onLoad(); } );
            }
        },

        onLoad : function () {
            var self = this;

            self.insertMail();

            if ( self.wWidth <= 780 ) {
                this.navMobile = d.getElementById( 'nav-mobile' );
                this.navMobile.addEventListener( 'click', function(e){
                    self.shiftPages(e);
                });
            }
        },

        insertMail : function () {
            var el = d.getElementById( 'mail' ),
                a = d.createElement( 'a' ),
                addr = this.mail[0] + '@' + this.mail[1] + '.' + this.mail[2],
                txt = d.createTextNode( addr );
            a.href = 'mailto:' + addr;
            a.appendChild( txt );
            el.appendChild( a );
        },

        /**
         * Push state.
         * @param state
         */
        setHistory : function ( state ) {
            if ( this.hasHistory ) {
                w.history.pushState( state, state.title, state.url );
            }
            this.resetDocument( state );
        },

        /**
         * Pop state
         * @param state
         */
        handlePopState : function ( state ) {
            if ( !state.id ) {
                this.closePage( 0 );
            } else {
                this.views.grid.launchPage( d.getElementById( state.id ), state );
            }
            this.resetDocument( state );
        },

        /**
         * Set doc title & send to Google Analytics.
         * @param state
         */
        resetDocument : function ( state ) {
            d.title = state.url === '/'
                ? this.initial.siteTitle
                : state.title + ' • ' + this.initial.siteTitle;
        },
        
        toggleCloseBtn : function ( show, test ) {
            if ( test ) {
                show = this.views.grid.activeColumn ? 1 : 0;
            }
            this.closeBtn.classList[ show ? 'remove' : 'add' ]( 'hide' );
        },

        closePage : function ( setHistory ) {
            this.toggleCloseBtn( 0 );
            this.views.grid.shrinkColumn();
            if ( setHistory ) {
                this.setHistory({
                    id : null,
                    title : this.initial.title,
                    url : '/'
                });
            }
        },

        toggleContact : function ( button ) {
            var self = this,
                scrollTo;

            if ( self.showingContact ) {
                scrollTo = 0;
                self.toggleCloseBtn( 1, true );
            } else {
                scrollTo = d.getElementById( 'pages' ).clientHeight;
                self.toggleContactVisibility( 1 );
                this.toggleCloseBtn( 0 );
            }

            self.showingContact = !self.showingContact;

            goScroll({
                to : scrollTo,
                context : d.getElementById( 'pages' ),
                callback : function () {
                    if ( !self.showingContact ) {
                        self.toggleContactVisibility(0);
                        button.innerHTML = 'contact';
                    } else {
                        button.innerHTML = 'back';
                    }
                }
            });
        },

        toggleContactVisibility : function ( show ) {
            d.getElementById('contact').parentNode.classList[ show ? 'remove' : 'add' ]( 'invisible' );
        },

        shiftPages : function ( e ) {
            var btn = e.target,
                id;

            if ( btn.tagName.toLowerCase() === 'button' ) {

                id = +btn.getAttribute('data-id');

                this.navMobile.querySelector('.active').classList.remove('active');

                if ( id !== this.currentPage ) {
                    this.currentPage = id;
                    this.toggleCloseBtn( 0 );
                    this.views.grid.shrinkColumn( id +1 );
                    w.history.replaceState( this.initial, this.initial.siteTitle, '/' );
                    this.views.grid.el.style[ this.util.support.transform ] = 'translate3d(-'+(id*25)+'%,0,0)';
                    btn.classList.add('active');
                }
            }
        },

        setSizable : function () {
            this.wWidth = w.innerWidth;
            this.gridWidth = this.views.grid.el.clientWidth;
        }
    };
});