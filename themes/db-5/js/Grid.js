define([
    'app',
    'Page'
], function ( app, Page ) {
    'use strict';

    var w = window,
        d = w.document,
        isTouch = app.util.support.isTouch,
        mouseTick = false,
        isShowingThumb = 0,

        requestMouseMoveUpdate = function( e, ctx ) {
            if ( !mouseTick ) {
                var self = this;
                w.requestAnimationFrame(function() {
                    self.showHoverImage( e, ctx );
                });
            }
            mouseTick = true;
        },

        Grid = function ( options ) {
            var items = options.el.querySelectorAll( 'a.item' );

            this.el = options.el;
            this.thumb = d.getElementById( 'thumb' );
            this.activeColumn = d.querySelector( '.col.open' );

            this.bindHandlers( items );
            this.onTransitionEnd( 'width' );
        };

    Grid.prototype = {
        
        bindHandlers : function ( items ) {
            var self = this,
                i = 0, l = items.length,
                img,
                itemClickHandle = function ( e ) {
                    if ( e.currentTarget.target === '_blank' ) { return true; }
                    e.preventDefault();
                    if ( !e.currentTarget.classList.contains( 'active' ) ) {
                        self.hideThumb();
                        self.launchPage( e.currentTarget );
                    } else {
                        w.history.back();
                    }
                },
                itemMouseMoveHandle = function ( e ) {
                    requestMouseMoveUpdate.call( self, e, this );
                },
                itemMouseOutHandle = function () {
                    self.hideThumb();
                };

            for ( i; i < l; i++ ) {
                items[i].addEventListener( 'click', itemClickHandle );

                img = items[i].getAttribute( 'data-img' );

                if ( img && !isTouch ) {
                    self.preloadImage( img );
                    items[i].addEventListener( 'mousemove', itemMouseMoveHandle );
                    items[i].addEventListener( 'mouseleave', itemMouseOutHandle );
                }
            }
            if ( !isTouch ) {
                self.thumb.addEventListener( 'mouseenter', itemMouseOutHandle );
            }
        },

        preloadImage : function ( src ) {
            var img = new Image();
            img.src = src;
        },

        /**
         * @param e
         * @param item, 'this' passed from event handler, currentTarget didn't work in sf9
         */
        showHoverImage : function ( e, item ) {
            var src = item.getAttribute( 'data-img' );

            this.thumb.style.top = e.pageY + 'px';
            this.thumb.style.left = e.pageX + 'px';

            if ( isShowingThumb !== src ) {
                this.setThumb( src );
            }

            mouseTick = false;
        },

        setThumb: function ( src ) {
            isShowingThumb = src;
            this.thumb.style.display = 'block';
            this.thumb.innerHTML = '<img src="' + src + '" width="150px">';
        },

        hideThumb : function () {
            isShowingThumb = 0;
            this.thumb.style.display = 'none';
        },

        onTransitionEnd : function ( property ) {
            var self = this;

            this.el.addEventListener( app.util.support.transitionEnd, function ( e ) {
                if ( e.propertyName === property ) {
                    if ( !self.activeColumn ) {
                        self.onColumnShrunk( e.target );
                    } else {
                        self.onColumnExpanded( e.target );
                    }
                }
            });
        },
        
        launchPage : function ( item, state ) {
            var contentColumn = this.getContentColumn( item );

            this.unsetActiveItem();

            item.classList.add('active');

            app.views.page = new Page({
                el : item,
                column : contentColumn
            }, state );

            this.expandColumn( contentColumn );

            this.activeColumn = contentColumn;
        },

        getContentColumn : function ( item ) {
            var parentColumn = app.util.parent( item, 'section' );
            return d.getElementById( parentColumn.getAttribute( 'data-id' ) );
        },

        expandColumn : function ( column ) {
            var self = this;
            column.classList.remove('invisible');
            w.requestAnimationFrame(function() {
                self.shiftGrid( column );
                column.classList.add('open');
            });
        },

        shiftGrid : function ( column ) {
            var self = this,
                columnIndex = app.util.elementIndex( column ),
                leftShift;

            self.activeColumnIndex = columnIndex;

            if ( app.wWidth >= 780 ) {
                leftShift = Math.ceil( app.gridWidth * ( 11*(columnIndex -2) ) / 100 );
            } else {
                leftShift = self.mobileGridShift();
            }

            w.requestAnimationFrame(function(){
                self.el.style[ app.util.support.transform ] = 'translate3d(-'+ leftShift +'px,0,0)';
            });
        },

        mobileGridShift: function () {
            var columnIndex = this.activeColumnIndex > 1 ? this.activeColumnIndex -1: 1;
            return Math.ceil( app.gridWidth * ( 25*(columnIndex) ) / 100 );
        },

        // transitions disabled on mobile, this is not called
        onColumnExpanded : function () {
            this.toggleColumnVisibility( 0 );
        },

        shrinkColumn : function ( overrideColumnID ) {
            var self = this,
                column = self.activeColumn;

            if ( !column ) { return; } // for the mobile nav buttons

            column.classList.remove('open');

            self.unsetActiveItem();

            self.toggleColumnVisibility( 1 );

            w.requestAnimationFrame(function() {
                var shift;

                column.classList.remove('open');

                if ( app.wWidth >= 780 ) {
                    self.el.style[ app.util.support.transform ] = 'translate3d(0,0,0)';
                } else {
                    self.activeColumnIndex = overrideColumnID || self.activeColumnIndex;
                    shift = self.activeColumnIndex === 1 ? 0 : Math.ceil( app.gridWidth * 25 / 100 );
                    self.el.style[ app.util.support.transform ] = 'translate3d(-'+shift+'px,0,0)';
                }

                self.activeColumn = null;
                self.activeColumnIndex = null;
            });
        },

        unsetActiveItem : function () {
            var item = d.querySelector('a.item.active');

            if ( item ) { item.classList.remove('active'); }
        },

        // transitions disabled on mobile, this is not called
        onColumnShrunk : function ( column ) {
            w.requestAnimationFrame(function() {
                column.classList.add('invisible');
                app.views.page.destroy();
                delete app.views.page;
            });
        },

        toggleColumnVisibility : function ( show ) {
            var cols = app.util.elementArray( d.getElementsByClassName('col') ),
                activeIndex = this.activeColumnIndex -1,
                i = 0;

            cols.splice(activeIndex, 2);

            for ( i; i < cols.length; i++ ) {
                cols[i].classList[ show ? 'remove' : 'add' ]( 'invisible' );
            }
        }
    };
    return Grid;
});