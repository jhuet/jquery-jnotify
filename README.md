Simply creates stacking up notifications after calling `$.jnotify('zOMG jnotify is nice!');`

You may remove a single notification by clicking anywhere on it or make them all disapear by double clicking on any of them.

It's possible to create presets of notifications so that when you specify a special type of message `$.jnotify('message', 'error')`, it will automatically use the set parameters for that preset type (for ex. timeout of 5 secs, 'mega-error' css class etc.). You may add, update or remove presets with :

`$.jnotify('addPreset', 'error', {timeout: 5, type: 'error', css: 'error'});`  
`$.jnotify('updatePreset', 'error', {timeout: 10, css: 'huge-error'});`  
`$.jnotify('removePreset', 'error');`

default options are :  
`    'timeout' : 2,` time in seconds after wich the jnotify will disapear ; 0 to make it stay  
`    'type'    : 'notice',` may be anything having a meaning for you ; if null will use the name of the preset  
`    'css'     : null` the css class used ; be sure to have a `'.jnotify-'+css` class set ; if null, uses type value

You may also change the default preset used if no preset is specified with : `$.jnotify('setDefaultPreset', 'success');` Just make sure to have that preset 1st before setting it as default or it'll go back to `notice`.

Different ways to use `$.jnotify` :

`$.jnotify('This is a sweet notice message!');` creates a notification with default preset (`notice` by default)  
`$.jnotify('This is a sweet success message!', 'success');` creates a notification with `success` preset ; if that preset does not exist, takes `default` preset but still use the `success` css class so you don't have to always create a preset if default behavior works for you  
`$.jnotify('This is a sweet long notice message!', {timeout: 50});` creates a notification with `default` preset but timeouts at 50 secs  
`$.jnotify('This is a sweet quick success message!', 'success', {timeout: 0.5});` creates a notification with `success` preset but a timeout of 0.5 seconds

Notifications themselves may totally be modified to suit your needs by changing css classes accordingly. The plugin creates a `div#jnotify-stack` that contains the `div.jnotify` that also have a `'.jnotify-'+css` class depending on the css or type given in options (ie: `div.jnotify-success`).
