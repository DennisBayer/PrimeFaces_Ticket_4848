/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * PrimeFaces SplitButton Widget
 */
var Utilities = new Object();
Utilities.widgetCache = new Object();

PrimeFaces.widget.SplitButton = PrimeFaces.widget.BaseWidget.extend({

    init: function(cfg) {
        this._super(cfg);
        
        console.log('Shadowing split button [' + this.id + ']');

        this.button = $(this.jqId + '_button');
        this.menuButton = $(this.jqId + '_menuButton');
        this.menu = $(this.jqId + '_menu');
        this.menuitems = this.menu.find('.ui-menuitem:not(.ui-state-disabled)');
        this.cfg.disabled = this.button.is(':disabled');

        if(!this.cfg.disabled) {
            this.cfg.position = {
                my: 'left top'
                ,
                at: 'left bottom'
                ,
                of: this.button
            };

            this.menu.appendTo(document.body);

            this.bindEvents();

            this.setupDialogSupport();
        }

        //pfs metadata
        this.button.data(PrimeFaces.CLIENT_ID_DATA, this.id);
        this.menuButton.data(PrimeFaces.CLIENT_ID_DATA, this.id);
    },

    //override
    refresh: function(cfg) {
        //remove previous overlay
        $(document.body).children(PrimeFaces.escapeClientId(cfg.id + '_menu')).remove();

        this.init(cfg);
    },

    bindEvents: function() {
//        var _self = this;

        PrimeFaces.skinButton(this.button).skinButton(this.menuButton);

        //mark button and descandants of button as a trigger for a primefaces overlay
        this.button.data('primefaces-overlay-target', true).find('*').data('primefaces-overlay-target', true);

        //toggle menu
//        this.menuButton.click(function() {
//            if(_self.menu.is(':hidden')) {
//                _self.show();
//            }
//            else {
//                _self.hide();
//            }
//        });
        
        this.menuButton.click($.proxy(
           function() {
              if(this.menu.is(':hidden')) {
                 this.show();
              }
              else {
                 this.hide();
              }
           },
           this
        ));
        

//        //menuitem visuals
//        this.menuitems.mouseover(function(e) {
//            var menuitem = $(this),
//            menuitemLink = menuitem.children('.ui-menuitem-link');
//
//            if(!menuitemLink.hasClass('ui-state-disabled')) {
//                menuitem.addClass('ui-state-hover');
//            }
//        }).mouseout(function(e) {
//            $(this).removeClass('ui-state-hover');
//        }).click(function() {
//            _self.hide();
//        });

        this.menuitems.mouseover(function(e) {
            var menuitem = $(this),
            menuitemLink = menuitem.children('.ui-menuitem-link');
            if(!menuitemLink.hasClass('ui-state-disabled')) {
                menuitem.addClass('ui-state-hover');
            }
        }).mouseout(function(e) {
            $(this).removeClass('ui-state-hover');
        });
        
        this.menuitems.click($.proxy(
           function() {
              this.hide();
           },
           this
        ));

        /**
        * handler for document mousedown to hide the overlay
        **/
        this.mouseDownOverlayFunction = function (e) {
            //do nothing if hidden already
            if(this.menu.is(":hidden")) {
                return;
            }

            //do nothing if mouse is on button
            var target = $(e.target);
            if(target.is(this.button)||this.button.has(target).length > 0) {
                return;
            }

            //hide overlay if mouse is outside of overlay except button
            var offset = this.menu.offset();
            if(e.pageX < offset.left ||
                e.pageX > offset.left + this.menu.width() ||
                e.pageY < offset.top ||
                e.pageY > offset.top + this.menu.height()) {

                this.button.removeClass('ui-state-focus ui-state-hover');
                this.hide();
            }
        };

//        $(document.body).bind('mousedown.ui-menubutton', this.mouseDownOverlayFunction);
        $(document.body).bind('mousedown.ui-menubutton', $.proxy(this.mouseDownOverlayFunction , this));

        //hide overlay on window resize
        var resizeNS = 'resize.' + this.id;
        $(window).unbind(resizeNS).bind(resizeNS, $.proxy(
                function() {
                if(this.menu.is(':visible')) {
                    this.menu.hide();
                }
            },
            this
        ));
    },

    dispose: function() {
        console.log('disposing id [' + this.id + ']');

        this.menuButton.off("click");
        this.menuitems.off("click mouseover mouseout");
        $(document.body).off('mousedown.ui-menubutton', this.mouseDownOverlayFunction);
        $(window).unbind('resize.' + this.id);
    },

    setupDialogSupport: function() {
        var dialog = this.button.parents('.ui-dialog:first');

        if(dialog.length == 1) {
            this.menu.css('position', 'fixed');
        }
    },

    show: function() {
        this.alignPanel();

        this.menuButton.focus();

        this.menu.show();
    },

    hide: function() {
        this.menuButton.removeClass('ui-state-focus');

        this.menu.fadeOut('fast');
    },

    alignPanel: function() {
        var fixedPosition = this.menu.css('position') == 'fixed',
        win = $(window),
        positionOffset = fixedPosition ? '-' + win.scrollLeft() + ' -' + win.scrollTop() : null;

        this.cfg.position.offset = positionOffset;

        this.menu.css({
            left:'', 
            top:'',
            'z-index': ++PrimeFaces.zindex
        }).position(this.cfg.position);
    }

});

/*
PrimeFaces.ajax.AjaxUtils.updateElement = function(id, content) {
    if(id == PrimeFaces.VIEW_STATE) {
        PrimeFaces.ajax.AjaxUtils.updateState.call(this, content);
    }
    else if(id == PrimeFaces.VIEW_ROOT) {
        document.open();
        document.write(content);
        document.close();
    }
    else {
        $(PrimeFaces.escapeClientId(id)).replaceWith(content);
    }
};
*/

PrimeFaces.createWidget = function(widgetConstructor, widgetVar, cfg, resource) {            
    console.log('Shadowing createWidget');
    if(PrimeFaces.widget[widgetConstructor]) {
        if(Utilities.widgetCache[widgetVar])
            Utilities.widgetCache[widgetVar].refresh(cfg);                                     //ajax update
        else
            Utilities.widgetCache[widgetVar] = new PrimeFaces.widget[widgetConstructor](cfg);  //page init
    }
    else {
        var scriptURI = $('script[src*="/javax.faces.resource/primefaces.js"]').attr('src').replace('primefaces.js', resource + '/' + resource + '.js'),
        cssURI = $('link[href*="/javax.faces.resource/primefaces.css"]').attr('href').replace('primefaces.css', resource + '/' + resource + '.css'),
        cssResource = '<link type="text/css" rel="stylesheet" href="' + cssURI + '" />';

        //load css
        $('head').append(cssResource);

        //load script and initialize widget
        PrimeFaces.getScript(location.protocol + '//' + location.host + scriptURI, function() {
            setTimeout(function() {
                Utilities.widgetCache[widgetVar] = new PrimeFaces.widget[widgetConstructor](cfg);
            }, 100);
        });
    }
};

jQuery(document).ajaxComplete(function(event, request, settings) {
    //---
    console.log('perform cleanup');
    //---
    for(id in Utilities.widgetCache) {
        var w = Utilities.widgetCache[id];
        
        if(w && !document.getElementById(w.id) && w.dispose) {
            console.log('widget invisible [' + w.id + ']');
            w.dispose();

            console.log('cleaning window for widget [' + id + ']');
            Utilities.widgetCache[id] = null;
            delete Utilities.widgetCache[id];
        } // end if
        else
            console.log('widget cannot be removed [' + id + ']');
    } // for
    //----
}); 
