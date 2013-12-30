/*
 * PrimeFaces SplitButton Widget
 */
var Utilities = new Object();
Utilities.splitButtonCache = new Object();

PrimeFaces.widget.SplitButton = PrimeFaces.widget.BaseWidget.extend({
    init: function(cfg) {
        this._super(cfg);

        console.log('split button [' + this.id + ']');
        Utilities.splitButtonCache[this.id] = this;

        this.button = $(this.jqId + '_button');
        this.menuButton = $(this.jqId + '_menuButton');
        this.menu = $(this.jqId + '_menu');
        this.menuitems = this.menu.find('.ui-menuitem:not(.ui-state-disabled)');
        this.cfg.disabled = this.button.is(':disabled');
        if(!this.cfg.disabled) {
            this.cfg.position = {
                my: 'left top'
                ,at: 'left bottom'
                ,of: this.button
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
        var _self = this;
        PrimeFaces.skinButton(this.button).skinButton(this.menuButton);
        //mark button and descandants of button as a trigger for a primefaces overlay
        this.button.data('primefaces-overlay-target', true).find('*').data('primefaces-overlay-target', true);
        //toggle menu
        this.menuButton.click(function() {
            if(_self.menu.is(':hidden')) {
                _self.show();
            }
            else {
                _self.hide();
            }
        });
        //menuitem visuals
        this.menuitems.mouseover(function(e) {
            var menuitem = $(this),
            menuitemLink = menuitem.children('.ui-menuitem-link');
            if(!menuitemLink.hasClass('ui-state-disabled')) {
                menuitem.addClass('ui-state-hover');
            }
        }).mouseout(function(e) {
            $(this).removeClass('ui-state-hover');
        }).click(function() {
            _self.hide();
        });
        /**
        * handler for document mousedown to hide the overlay
        **/
        this.mouseDownOverlayFunction = function (e) {
            //do nothing if hidden already
            if(_self.menu.is(":hidden")) {
                return;
            }
            //do nothing if mouse is on button
            var target = $(e.target);
            if(target.is(_self.button)||_self.button.has(target).length > 0) {
                return;
            }
            //hide overlay if mouse is outside of overlay except button
            var offset = _self.menu.offset();
            if(e.pageX < offset.left ||
                e.pageX > offset.left + _self.menu.width() ||
                e.pageY < offset.top ||
                e.pageY > offset.top + _self.menu.height()) {
                _self.button.removeClass('ui-state-focus ui-state-hover');
                _self.hide();
            }
        };
        $(document.body).bind('mousedown.ui-menubutton', this.mouseDownOverlayFunction);
        //hide overlay on window resize
        var resizeNS = 'resize.' + this.id;
        $(window).unbind(resizeNS).bind(resizeNS, function() {
            if(_self.menu.is(':visible')) {
                _self.menu.hide();
            }
        });
    },
    dispose: function() {
    	console.log('disposing id [' + this.id + ']');

    	this.menuButton.off("click");
    	this.menuitems.off("click mouseover mouseout");
    	$(document.body).off('mousedown.ui-menubutton', this.mouseDownOverlayFunction);
    	$(window).unbind('resize.' + this.id);

    	var widgetVar = "widget_" + this.id.replace(/:/g, "_");
    	console.log('cleaning window for widget [' + widgetVar + ']');
    	window[widgetVar] = null;
    	delete window[widgetVar];
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
        this.menu.css({left:'', top:'','z-index': ++PrimeFaces.zindex}).position(this.cfg.position);
    }
});
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
    	$('.ui-splitbutton').each(function(index){
    		//console.log('>>' + 'id [' + this.id + ']');
    		var btn = Utilities.splitButtonCache[this.id];
    		if(btn && btn.dispose) {
    			console.log('btn visible [' + btn.id + '][' + document.getElementById(btn.id) + ']');
    			btn.dispose();
    		}
    		Utilities.splitButtonCache[this.id] = null;
    		delete Utilities.splitButtonCache[this.id];
    	});

    	$(PrimeFaces.escapeClientId(id)).replaceWith(content);
    }
};