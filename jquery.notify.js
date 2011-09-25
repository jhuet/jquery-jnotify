/**
 * Simply creates stacking up notifications after calling
 * $.notify('zOMG notify is nice!');
 *
 * You may remove a single notification by clicking anywhere on it or make
 * them all disapear by double clicking on any of them.
 *
 * It's possible to create presets of notifications so that when you specify a
 * special type of message ($.notify('message', 'error'), it will automatically
 * use the set parameters for that preset type (for ex. timeout of 5 secs,
 * 'mega-error' css class etc.). You may add or remove presets with :
 * $.notify('addPreset', 'error', {timeout: 5, type: 'error', css: 'mega-error');
 * $.notify('removePreset', 'error');
 *
 * options may be : {
 *     'timeout' : 2, // time in seconds after wich the notify will disapear ; 0 to make it stay
 *     'type'    : 'success', // may be anything having a meaning for you ; if null will use the name of the preset
 *     'css'     : null // the css class used ; be sure to have a '.notify-'+css class set ; if null, uses type value
 * }
 *
 * You may also change the default preset used if no preset is specified with :
 * $.notify('defaultPreset', 'success');
 * Just make sure to have that preset 1st before setting it as default or it'll go back to 'info'.
 *
 * Different ways to use $.notify :
 * $.notify('This is a sweet info message!'); > creates a notification with default preset
 * $.notify('This is a sweet success message!', 'success'); > creates a notification with 'success' preset ;
 *                                                            if that preset does not exit, take default preset but still use the 'success' css class ;
 *                                                            so you don't have to always create a preset if default behavior works for you
 * $.notify('This is a sweet long info message!', {timeout: 50}); > creates a notification with default preset but a timeout of 50 seconds
 * $.notify('This is a sweet quick success message!', 'success', {timeout: 0.5}); > creates a notification with 'success' preset but a timeout of 0.5 seconds
 *
 * Notifications themselves may totally be modified to suit your needs by
 * changing css classes accordingly. The plugin creates a div#notify-stack that
 * contains the div.notify that also have a '.notify-'+css class depending on
 * the css or type given in options (ie: div.notify-success).
 *
 * @author Jeremy Huet
 */
(function($) {

    var statics = {
        defaultPreset : 'info',

        presets : {
            info : { // Do not remove this preset as it's used for the <i>backup</i> default behavior
                timeout : 2,
                type    : 'info',
                css     : null
            },
            success : {
                timeout : 2,
                type    : 'success',
                css     : null
            },
            error : {
                timeout : 5,
                type    : 'error',
                css     : null
            },
            warning : {
                timeout : 5,
                type    : 'warning',
                css     : null
            }
        }
    };

    var methods = {
        init : function(options) {

        },

        /**
         * @param string text : Text for the message
         * @param mixed opts : Either a full set of options such as statics.presets.info ; or the name of a preset or just the name of a css class
         */
        notify: function(text, opts, optss) {
            var options = $.extend({}, statics.presets[statics.defaultPreset]);
            if (typeof opts == 'string') {
                if (typeof statics.presets[opts] == 'object') {
                    opts = $.extend({}, statics.presets[opts]);
                    if (typeof optss == 'object') {
                        opts = $.extend(opts, optss);
                    }
                }
                else {
                    opts = {type: opts, css: opts};
                }
            }
            if (typeof opts == 'object') {
                $.extend(options, opts);
            }

            // Retreive the stack, create it if it isn't yet
            var $stack = $('body').find('#notify-stack');
            if ($stack.length == 0)
            {
                $stack = $('<div />');

                $stack.dblclick(function() {
                    $(this).empty();
                } );

                $stack.attr('id', 'notify-stack');
                $('body').prepend($stack);
            }

            // Create the notice
            var $notice = $('<div />');
            $notice.addClass('notify notify-' + (options.css ? options.css : options.type));
            $notice.html(text);
            $notice.hide();
            var $close = $('<div />');
            $close.addClass('close');
            $close.hide();
            $notice.mouseenter(function() {
                $(this).find('.close').show();
            }).mouseleave(function() {
                $(this).find('.close').hide();
            });

            $notice.prepend($close);
            $stack.append($notice);
            $notice.slideDown('fast');

            if (options.timeout > 0) {
                $notice.delay(options.timeout * 1000).fadeOut('slow', function() {
                    $(this).detach().remove();
                } );
            }

            $notice.click(function() {
                $(this).fadeOut('fast', function() {
                    $(this).detach().remove();
                } );
            } );
        },

        addPreset: function(preset, options) {
            statics.presets[preset] = options;
            if (! statics.presets[preset].type) {
                statics.presets[preset].type = preset;
            }
            if (! statics.presets[preset].css) {
                statics.presets[preset].css = statics.presets[preset].type;
            }
        },

        /**
         * @todo
         */
        updatePreset: function(preset, options) {

        },

        removePreset: function(preset) {
            if (statics.presets[preset] && preset != 'info') {
                delete statics.presets[preset];
                if (statics.defaultPreset == preset) {
                    methods.setDefaultPreset('info');
                }
            }
        },

        getPreset: function(preset) {
            if (statics.presets[preset]) {
                return statics.presets[preset];
            }
        },

        getPresets: function() {
            return statics.presets;
        },

        setDefaultPreset: function(preset) {
            if (statics.presets[preset]) {
                statics.defaultPreset = preset;
            }
        },

        getDefaultPreset: function() {
            return methods.getPreset(statics.defaultPreset);
        },

        getDefaultPresetName: function() {
            return statics.defaultPreset;
        }
    };

    $.notify = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'string') {
            return methods.notify.apply(this, arguments);
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments );
        }
        else {
            $.error('Method "' +  method + '" does not exist on jQuery.notify');
        }
    }

})(jQuery);


/**

.notify-info
{
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKcSURBVDjLpZPLa9RXHMU/d0ysZEwmMQqZiTaP0agoaKGJUiwIxU0hUjtUQaIuXHSVbRVc+R8ICj5WvrCldJquhVqalIbOohuZxjDVxDSP0RgzyST9zdzvvffrQkh8tBs9yy9fPhw45xhV5X1U8+Yhc3U0LcEdVxdOVq20OA0ooQjhpnfhzuDZTx6++m9edfDFlZGMtXKxI6HJnrZGGtauAWAhcgwVnnB/enkGo/25859l3wIcvpzP2EhuHNpWF9/dWs/UnKW4EOGDkqhbQyqxjsKzMgM/P1ymhlO5C4ezK4DeS/c7RdzQoa3x1PaWenJjJZwT9rQ1gSp/js1jYoZdyfX8M1/mp7uFaTR8mrt29FEMQILr62jQ1I5kA8OF59jIItVA78dJertTiBNs1ZKfLNG+MUHX1oaURtIHEAOw3p/Y197MWHEJEUGCxwfHj8MTZIcnsGKxzrIURYzPLnJgbxvG2hMrKdjItjbV11CYKeG8R7ygIdB3sBMFhkem0RAAQ3Fuka7UZtRHrasOqhYNilOwrkrwnhCU/ON5/q04vHV48ThxOCuoAbxnBQB+am65QnO8FqMxNCjBe14mpHhxBBGCWBLxD3iyWMaYMLUKsO7WYH6Stk1xCAGccmR/Ozs/bKJuXS39R/YgIjgROloSDA39Deit1SZWotsjD8pfp5ONqZ6uTfyWn+T7X0f59t5fqDhUA4ry0fYtjJcWeZQvTBu4/VqRuk9/l9Fy5cbnX+6Od26s58HjWWaflwkusKGxjm1bmhkvLXHvh1+WMbWncgPfZN+qcvex6xnUXkzvSiYP7EvTvH4toDxdqDD4+ygT+cKMMbH+3MCZ7H9uAaDnqytpVX8cDScJlRY0YIwpAjcNcuePgXP/P6Z30QuoP4J7WbYhuQAAAABJRU5ErkJggg==);
    border-color: #76A0CD;
    color: #1A5799;
    background-color: #EAF2F9;
}

 */