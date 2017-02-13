!(function($, window, document) {
    var $window = $(window);
	var $document = $(document);
	var defaults = {
		selector		: "img",
        threshold       : 50,
        failure_limit   : 0,
        speed			: 300,
        event           : "scroll",
        effect          : "fadeIn",
        attr  			: "original",
        container       : window,
        nopic			: 'images/blank.png',
        defaultImg      : 'images/default-img.png',
        placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
    };

    function Lazyload(options) {
    	this.settings = $.extend({}, defaults, options);
    	this.imgs = $(options.selector);
    	this.container = $(this.settings.container);
    	this.init();
    }

    Lazyload.prototype = {
    	init: function() {
    		this.process();
            this.bindEvent();
    	},
    	bindEvent: function() {
    		var that = this;

    		$document.ready(function() {
	            that.update();
	        });

	    	that.container.on(that.settings.event, function() {
	            return that.update();
	        });

		    /* Check if something appears when window is resized. */
	        $window.on("resize", function() {
	            that.update();
	        });
    	},
    	update: function() {
    		var that = this;
    		var counter = 0;
            var settings = {
                container: that.settings.container,
                threshold: that.settings.threshold
            }
            that.imgs.each(function() {
                var $this = $(this);
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > that.settings.failure_limit) {
                        return false;
                    }
                }
            });
    	},
    	process: function() {
    		var that = this;
    		that.imgs.one('appear', function() {
    			var e = $(this),
    				original = e.data(that.settings.attr);

    			if (e.data('loaded')) {
    				return;
    			}
    			if (original == '') {
                    e.addClass('def').attr('src', that.settings.nopic).hide()[that.settings.effect](that.settings.speed);
	    			e.data('loaded', true);
    				that.grep(e);
    			} else {
	    			var img = new Image();
	    			img.onload = function() {
	    				img.onload = null;
						e.attr('src', original).hide()[that.settings.effect](that.settings.speed);
	    				e.data('loaded', true);
    					that.grep(e);
	    			}
	    			img.onerror = function() {
	    				img.onerror = null;
	    				e.addClass('def').attr('src', that.settings.defaultImg).hide()[that.settings.effect](that.settings.speed);
	    				e.data('loaded', true);
    					that.grep(e);
	    			}
	    			img.src = original;
    			}
    		})

    	},
    	grep: function() {
    		var that = this;
    		var temp = $.grep(that.imgs, function(element) {
                return !$(element).data('loaded');
            });
            that.imgs = $(temp);
    	}
    }



    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    window.lazyload = function(options) {
        new Lazyload(options);
    };

})(jQuery, window, document);