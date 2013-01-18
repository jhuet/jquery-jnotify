/**
 * Simply creates stacking up notifications after calling
 * $.jnotify('zOMG jnotify is nice!');
 *
 * You may remove a single notification by clicking anywhere on it or make
 * them all disapear by double clicking on any of them.
 *
 * It's possible to create presets of notifications so that when you specify a
 * special type of message ($.jnotify('message', 'error'), it will automatically
 * use the set parameters for that preset type (for ex. timeout of 5 secs,
 * 'mega-error' css class etc.). You may add or remove presets with :
 * $.jnotify('addPreset', 'error', {timeout: 5, type: 'error', css: 'mega-error');
 * $.jnotify('removePreset', 'error');
 *
 * options may be : {
 *     'timeout' : 2, // time in seconds after wich the jnotify will disapear ; 0 to make it stay
 *     'type'    : 'success', // may be anything having a meaning for you ; if null will use the name of the preset
 *     'css'     : null // the css class used ; be sure to have a '.jnotify-'+css class set ; if null, uses type value
 * }
 *
 * You may also change the default preset used if no preset is specified with :
 * $.jnotify('setDefaultPreset', 'success');
 * Just make sure to have that preset 1st before setting it as default or it'll go back to 'notice'.
 *
 * Different ways to use $.jnotify :
 * $.jnotify('This is a sweet notice message!'); > creates a notification with default preset
 * $.jnotify('This is a sweet success message!', 'success'); > creates a notification with 'success' preset ;
 *                                                            if that preset does not exit, take default preset but still use the 'success' css class ;
 *                                                            so you don't have to always create a preset if default behavior works for you
 * $.jnotify('This is a sweet long notice message!', {timeout: 50}); > creates a notification with default preset but a timeout of 50 seconds
 * $.jnotify('This is a sweet quick success message!', 'success', {timeout: 0.5}); > creates a notification with 'success' preset but a timeout of 0.5 seconds
 *
 * Notifications themselves may totally be modified to suit your needs by
 * changing css classes accordingly. The plugin creates a div#jnotify-stack that
 * contains the div.jnotify that also have a '.jnotify-'+css class depending on
 * the css or type given in options (ie: div.jnotify-success).
 *
 * @author Jérémy Huet
 */
(function($) {

    var statics = {
        version: '1.2.0',

        defaultPreset : 'notice',

        presets : {
            notice : { // Do not remove this preset as it's used for the <i>backup</i> default behavior
                timeout : 2,
                type    : 'notice',
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
         * @param mixed opts : Either a full set of options such as statics.presets.notice ; or the name of a preset or just the name of a css class
         */
        jnotify: function(text, opts, optss) {
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
            var $stack = $('body').find('#jnotify-stack');
            if ($stack.length == 0) {
                $stack = $('<div />');

                $stack.dblclick(function() {
                    $(this).empty();
                } );

                $stack.attr('id', 'jnotify-stack');
                $('body').prepend($stack);
            }

            // Create the notice
            var $notice = $('<div />');
            $notice.addClass('jnotify jnotify-' + (options.css ? options.css : options.type));
            $notice.html(text);
            $notice.hide();
            var $close = $('<div />');
            $close.addClass('close');
            $close.hide();
            $notice.mouseenter(function() {
                $(this).find('.close').show();
            } ).mouseleave(function() {
                $(this).find('.close').hide();
            } );

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

        updatePreset: function(preset, options) {
            if (statics.presets[preset]) {
                methods.addPreset(preset, $.extend(statics.presets[preset], options));
            }
        },

        removePreset: function(preset) {
            if (statics.presets[preset] && preset != 'notice') {
                delete statics.presets[preset];
                if (statics.defaultPreset == preset) {
                    methods.setDefaultPreset('notice');
                }
            } else {
                $.error('"notice" preset is not allowed to be removed.');
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

    $.jnotify = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'string') {
            return methods.jnotify.apply(this, arguments);
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments );
        }
        else {
            $.error('Method "' +  method + '" does not exist on jQuery.jnotify');
        }
    }

})(jQuery);
