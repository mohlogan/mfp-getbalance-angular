/**
 * @license
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * This file is a wrapper for the web SDK which is in target/jslibexpanded/app/web/worklight.js
 * Its purpose is to make the web SDK as an AMD module.
 *
 * There is a placeholder in this file which will be replaced with the web sdk during the build of client-javascript.
 * The replacement is defined in expandjslib.xml inside buildEnv_web target
 * After the replacement the file will be renamed to worklight.js
 */

(function (root, factory) {
    var wlanalytics = dummyanalytics();//This function is being injected later on the "skeleton.placeholder" below

    // scripts which are AMD defined by calling define function
    // if 'define' is in our global name space then we expose our web SDK as an AMD module with one dependency: wlanalytics.
    if (typeof define === 'function' && define.amd) {

        if (!require.specified('ibmmfpfanalytics')) {
			define("ibmmfpfanalytics",function() {
      			return dummyanalytics();
			});            
		}
        define(['ibmmfpfanalytics'], factory);

    } else {
        // not using 'define', so we expose our web sdk (WL) to the global name space.
        // if wlanalytics is not in the global name space, we use dummy implementation for them

        if (!root.ibmmfpfanalytics) {
            root.ibmmfpfanalytics = wlanalytics;
        }
        root.WL = factory(root.ibmmfpfanalytics);
    }
    
    
    function dummyanalytics() {

	  	logger = {
			pkg: _apiAnalyticsMissing,
			state: _apiAnalyticsMissing,
			capture: _apiAnalyticsMissing,
			enable: _apiAnalyticsMissing,
			updateConfigFromServer: _apiAnalyticsMissing,
			trace      : _apiAnalyticsMissing,
			debug      : _apiAnalyticsMissing,
			log        : _apiAnalyticsMissing,
			info       : _apiAnalyticsMissing,
			warn       : _apiAnalyticsMissing,
			error      : _apiAnalyticsMissing,
			fatal      : _apiAnalyticsMissing
			      
		};	
	   return {
			init: _apiAnalyticsMissing,
			enable : _apiAnalyticsMissing,
			state: _apiAnalyticsMissing,
			send: _apiAnalyticsMissing,
			setUserContext: _apiAnalyticsMissing,
			addEvent: _apiAnalyticsMissing,
			enableAutoSend: _apiAnalyticsMissing,
			_setClientId: _apiAnalyticsMissing,
			logger: logger
		}
		function _apiAnalyticsMissing(message){
			var textMssg = '';
			if (typeof message === 'string'){
				textMssg = ' (message sent: ' + message + ')';
			}		
			console.log("Sending analytics data to the MobileFirst Analytics server is ignored. Are you sure the MobileFirst Analytics JavaScript file is included in your project?." +  textMssg);
		};
	};

}(this, function(wlanalytics) {

    
    

/**
 * ================================================================= 
 * Source file taken from :: wldeferredjs.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license
 * deferred-js https://github.com/warpdesign/deferred-js#licence
 * Copyright 2012 © Nicolas Ramz
 * Released under the MIT license
 */

(function(global) {
	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}

	function foreach(arr, handler) {
		if (isArray(arr)) {
			for (var i = 0; i < arr.length; i++) {
				handler(arr[i]);
			}
		}
		else
			handler(arr);
	}

	function D(fn) {
		var status = 'pending',
			doneFuncs = [],
			failFuncs = [],
			progressFuncs = [],
			resultArgs = null,

			promise = {
				done: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'resolved') {
									arr[j].apply(this, resultArgs);
								}

								doneFuncs.push(arr[j]);
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'resolved') {
								arguments[i].apply(this, resultArgs);
							}

							doneFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				fail: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'rejected') {
									arr[j].apply(this, resultArgs);
								}

								failFuncs.push(arr[j]);
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'rejected') {
								arguments[i].apply(this, resultArgs);
							}

							failFuncs.push(arguments[i]);
						}
					}

					return this;
				},

				always: function() {
					return this.done.apply(this, arguments).fail.apply(this, arguments);
				},

				progress: function() {
					for (var i = 0; i < arguments.length; i++) {
						// skip any undefined or null arguments
						if (!arguments[i]) {
							continue;
						}

						if (isArray(arguments[i])) {
							var arr = arguments[i];
							for (var j = 0; j < arr.length; j++) {
								// immediately call the function if the deferred has been resolved
								if (status === 'pending') {
									progressFuncs.push(arr[j]);
								}
							}
						}
						else {
							// immediately call the function if the deferred has been resolved
							if (status === 'pending') {
								progressFuncs.push(arguments[i]);
							}
						}
					}

					return this;
				},

				then: function() {
					// fail callbacks
					if (arguments.length > 1 && arguments[1]) {
						this.fail(arguments[1]);
					}

					// done callbacks
					if (arguments.length > 0 && arguments[0]) {
						this.done(arguments[0]);
					}

					// notify callbacks
					if (arguments.length > 2 && arguments[2]) {
						this.progress(arguments[2]);
					}
				},

				promise: function(obj) {
					if (obj == null) {
						return promise;
					} else {
						for (var i in promise) {
							obj[i] = promise[i];
						}
						return obj;
					}
				},

				state: function() {
					return status;
				},

				debug: function() {
					console.log('[debug]', doneFuncs, failFuncs, status);
				},

				isRejected: function() {
					return status === 'rejected';
				},

				isResolved: function() {
					return status === 'resolved';
				},

				pipe: function(done, fail, progress) {
					return D(function(def) {
						foreach(done, function(func) {
							// filter function
							if (typeof func === 'function') {
								deferred.done(function() {
									var returnval = func.apply(this, arguments);
									// if a new deferred/promise is returned, its state is passed to the current deferred/promise
									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									}
									else {	// if new return val is passed, it is passed to the piped done
										def.resolve(returnval);
									}
								});
							}
							else {
								deferred.done(def.resolve);
							}
						});

						foreach(fail, function(func) {
							if (typeof func === 'function') {
								deferred.fail(function() {
									var returnval = func.apply(this, arguments);

									if (returnval && typeof returnval === 'function') {
										returnval.promise().then(def.resolve, def.reject, def.notify);
									} else {
										def.reject(returnval);
									}
								});
							}
							else {
								deferred.fail(def.reject);
							}
						});
					}).promise();
				}
			},

			deferred = {
				resolveWith: function(context) {
					if (status === 'pending') {
						status = 'resolved';
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < doneFuncs.length; i++) {
							doneFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				rejectWith: function(context) {
					if (status === 'pending') {
						status = 'rejected';
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < failFuncs.length; i++) {
							failFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				notifyWith: function(context) {
					if (status === 'pending') {
						var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
						for (var i = 0; i < progressFuncs.length; i++) {
							progressFuncs[i].apply(context, args);
						}
					}
					return this;
				},

				resolve: function() {
					return this.resolveWith(this, arguments);
				},

				reject: function() {
					return this.rejectWith(this, arguments);
				},

				notify: function() {
					return this.notifyWith(this, arguments);
				}
			}

		var obj = promise.promise(deferred);

		if (fn) {
			fn.apply(obj, [obj]);
		}

		return obj;
	}

	D.when = function() {
		if (arguments.length < 2) {
			var obj = arguments.length ? arguments[0] : undefined;
			if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
				return obj.promise();
			}
			else {
				return D().resolve(obj).promise();
			}
		}
		else {
			return (function(args){
				var df = D(),
					size = args.length,
					done = 0,
					rp = new Array(size);	// resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved

				for (var i = 0; i < args.length; i++) {
					(function(j) {
						var obj = null;

						if (args[j].done) {
							args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(df, rp); }})
								.fail(function() { df.reject(arguments); });
						} else {
							obj = args[j];
							args[j] = new Deferred();

							args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(df, rp); }})
								.fail(function() { df.reject(arguments); }).resolve(obj);
						}
					})(i);
				}

				return df.promise();
			})(arguments);
		}
	},

	D.isEmptyObject = function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	}

	global.Deferred = D;
	global.WLJQ = D;
	global.WLJQ.Deferred = function () {
		return new Deferred();
	}
})(window);/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
 

/**
 * ================================================================= 
 * Source file taken from :: stacktrace.min.js
 * ================================================================= 
 */

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
// https://github.com/eriwen/javascript-stacktrace/blob/v0.5.0/stacktrace.js
function printStackTrace(e){e=e||{guess:true};var t=e.e||null,n=!!e.guess;var r=new printStackTrace.implementation,i=r.run(t);return n?r.guessAnonymousFunctions(i):i}if(typeof module!=="undefined"&&module.exports){module.exports=printStackTrace}printStackTrace.implementation=function(){};printStackTrace.implementation.prototype={run:function(e,t){e=e||this.createException();t=t||this.mode(e);if(t==="other"){return this.other(arguments.callee)}else{return this[t](e)}},createException:function(){try{this.undef()}catch(e){return e}},mode:function(e){if(e["arguments"]&&e.stack){return"chrome"}else if(e.stack&&e.sourceURL){return"safari"}else if(e.stack&&e.number){return"ie"}else if(typeof e.message==="string"&&typeof window!=="undefined"&&window.opera){if(!e.stacktrace){return"opera9"}if(e.message.indexOf("\n")>-1&&e.message.split("\n").length>e.stacktrace.split("\n").length){return"opera9"}if(!e.stack){return"opera10a"}if(e.stacktrace.indexOf("called from line")<0){return"opera10b"}return"opera11"}else if(e.stack){return"firefox"}return"other"},instrumentFunction:function(e,t,n){e=e||window;var r=e[t];e[t]=function(){n.call(this,printStackTrace().slice(4));return e[t]._instrumented.apply(this,arguments)};e[t]._instrumented=r},deinstrumentFunction:function(e,t){if(e[t].constructor===Function&&e[t]._instrumented&&e[t]._instrumented.constructor===Function){e[t]=e[t]._instrumented}},chrome:function(e){var t=(e.stack+"\n").replace(/^\S[^\(]+?[\n$]/gm,"").replace(/^\s+(at eval )?at\s+/gm,"").replace(/^([^\(]+?)([\n$])/gm,"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,"{anonymous}()@$1").split("\n");t.pop();return t},safari:function(e){return e.stack.replace(/\[native code\]\n/m,"").replace(/^(?=\w+Error\:).*$\n/m,"").replace(/^@/gm,"{anonymous}()@").split("\n")},ie:function(e){var t=/^.*at (\w+) \(([^\)]+)\)$/gm;return e.stack.replace(/at Anonymous function /gm,"{anonymous}()@").replace(/^(?=\w+Error\:).*$\n/m,"").replace(t,"$1@$2").split("\n")},firefox:function(e){return e.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^[\(@]/gm,"{anonymous}()@").split("\n")},opera11:function(e){var t="{anonymous}",n=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;var r=e.stacktrace.split("\n"),i=[];for(var s=0,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){var a=u[4]+":"+u[1]+":"+u[2];var f=u[3]||"global code";f=f.replace(/<anonymous function: (\S+)>/,"$1").replace(/<anonymous function>/,t);i.push(f+"@"+a+" -- "+r[s+1].replace(/^\s+/,""))}}return i},opera10b:function(e){var t=/^(.*)@(.+):(\d+)$/;var n=e.stacktrace.split("\n"),r=[];for(var i=0,s=n.length;i<s;i++){var o=t.exec(n[i]);if(o){var u=o[1]?o[1]+"()":"global code";r.push(u+"@"+o[2]+":"+o[3])}}return r},opera10a:function(e){var t="{anonymous}",n=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;var r=e.stacktrace.split("\n"),i=[];for(var s=0,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){var a=u[3]||t;i.push(a+"()@"+u[2]+":"+u[1]+" -- "+r[s+1].replace(/^\s+/,""))}}return i},opera9:function(e){var t="{anonymous}",n=/Line (\d+).*script (?:in )?(\S+)/i;var r=e.message.split("\n"),i=[];for(var s=2,o=r.length;s<o;s+=2){var u=n.exec(r[s]);if(u){i.push(t+"()@"+u[2]+":"+u[1]+" -- "+r[s+1].replace(/^\s+/,""))}}return i},other:function(e){var t="{anonymous}",n=/function\s*([\w\-$]+)?\s*\(/i,r=[],i,s,o=10;while(e&&e["arguments"]&&r.length<o){i=n.test(e.toString())?RegExp.$1||t:t;s=Array.prototype.slice.call(e["arguments"]||[]);r[r.length]=i+"("+this.stringifyArguments(s)+")";e=e.caller}return r},stringifyArguments:function(e){var t=[];var n=Array.prototype.slice;for(var r=0;r<e.length;++r){var i=e[r];if(i===undefined){t[r]="undefined"}else if(i===null){t[r]="null"}else if(i.constructor){if(i.constructor===Array){if(i.length<3){t[r]="["+this.stringifyArguments(i)+"]"}else{t[r]="["+this.stringifyArguments(n.call(i,0,1))+"..."+this.stringifyArguments(n.call(i,-1))+"]"}}else if(i.constructor===Object){t[r]="#object"}else if(i.constructor===Function){t[r]="#function"}else if(i.constructor===String){t[r]='"'+i+'"'}else if(i.constructor===Number){t[r]=i}}}return t.join(",")},sourceCache:{},ajax:function(e){var t=this.createXMLHTTPObject();if(t){try{t.open("GET",e,false);t.send(null);return t.responseText}catch(n){}}return""},createXMLHTTPObject:function(){var e,t=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var n=0;n<t.length;n++){try{e=t[n]();this.createXMLHTTPObject=t[n];return e}catch(r){}}},isSameDomain:function(e){return typeof location!=="undefined"&&e.indexOf(location.hostname)!==-1},getSource:function(e){if(!(e in this.sourceCache)){this.sourceCache[e]=this.ajax(e).split("\n")}return this.sourceCache[e]},guessAnonymousFunctions:function(e){for(var t=0;t<e.length;++t){var n=/\{anonymous\}\(.*\)@(.*)/,r=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,i=e[t],s=n.exec(i);if(s){var o=r.exec(s[1]);if(o){var u=o[1],a=o[2],f=o[3]||0;if(u&&this.isSameDomain(u)&&a){var l=this.guessAnonymousFunction(u,a,f);e[t]=i.replace("{anonymous}",l)}}}}return e},guessAnonymousFunction:function(e,t,n){var r;try{r=this.findFunctionName(this.getSource(e),t)}catch(i){r="getSource failed with url: "+e+", exception: "+i.toString()}return r},findFunctionName:function(e,t){var n=/function\s+([^(]*?)\s*\(([^)]*)\)/;var r=/['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;var i=/['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;var s="",o,u=Math.min(t,20),a,f;for(var l=0;l<u;++l){o=e[t-l-1];f=o.indexOf("//");if(f>=0){o=o.substr(0,f)}if(o){s=o+s;a=r.exec(s);if(a&&a[1]){return a[1]}a=n.exec(s);if(a&&a[1]){return a[1]}a=i.exec(s);if(a&&a[1]){return a[1]}}}return"(?)"}}


/**
 * ================================================================= 
 * Source file taken from :: wljsx.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

 /*globals WLJSX, WLJQ*/

/*jshint unused:false*/
function __WL() {}
var WL = WL ? WL : {};

window.WLJSX = {

  /*jshint strict:false*/

  /*
   * Constant values, required for prototype.js functionality
   */
  emptyFunction: function() {},

  /**
   * Search for an element with a specified ID and returns it as a DOM element.
   * Returns null if element is not found
   *
   * @Param selector - a string with the requires DOM element's Id
   */
  $: function(id) {
    var elements = WLJQ('#' + id);
    if (elements.length === 0) {
      return null;
    } else {
      return elements[0];
    }
  },

  /**
   * Searches for the elements with a specified selector and returns them as an array of DOM elements
   *
   * @Param selector - a string representing a CSS selector
   */
  $$: function(selector) {
    return WLJQ(selector);
  },

  $$$: function(elem) {
    var elements = WLJQ(elem);
    if (elements.length === 0) {
      return null;
    } else {
      return elements[0];
    }
  },

  /**
   * Same as $$ but searches inside of a given element only. Returns array of DOM elements
   *
   * @Param el - the DOM element to search inside of
   * @Param selector - a string representing a CSS selector
   */
  find: function(el, selector) {
    return WLJQ(el).find(selector);
  },

  /**
   * Creates a new DOM element and returns it
   *
   * @Param type - a string representing the element type (tag name, e.g. '<div/>')
   * @Param attrs - an object of attributes to be added to newly created element
   */
  newElement: function(type, attrs) {
    return WLJQ(type, attrs)[0];
  },

  /**
   * Appends the content before the end of a DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to append content to
   * @Param content - new content to be appended
   */
  append: function(el, content) {
    WLJQ(el).append(content);
  },

  /**
   * Prepends the content at the beginning of a DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to prepend content to
   * @Param content - new content to be prepended
   */
  prepend: function(el, content) {
    WLJQ(el).prepend(content);
  },

  /**
   * Sets or Gets DOM element's content
   *
   * @Param el - the DOM element to update content in
   * @Param content - new content, can be string or other DOM elements
   */
  html: function(el, content) {
    if (content) {
      WLJQ(el).html(content);
    } else {
      return WLJQ(el).html();
    }
  },

  /**
   * Empties the content of a given DOM element
   *
   * @Param el - the DOM element (or CSS selector string) to empty
   */
  empty: function(el) {
    WLJQ(el).empty();
  },

  /**
   * Shows a DOM element (makes visible)
   *
   * @Param el - the DOM element (or CSS selector string) to make visible
   */
  show: function(el) {
    WLJQ(el).show();
  },

  /**
   * Hides a DOM element (makes invisible)
   *
   * @Param el - the DOM element (or CSS selector string) to hide
   */
  hide: function(el) {
    WLJQ(el).hide();
  },

  /**
   * Adds a specified CSS class to DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to add the CSS class to
   * @Param className - string with the class' name
   */
  addClass: function(el, className) {
    WLJQ(el).addClass(className);
  },

  /**
   * Removes a specified CSS class from DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to remove the CSS class from
   * @Param className - string with the class' name
   */
  removeClass: function(el, className) {
    WLJQ(el).removeClass(className);
  },

  /**
   * Sets or Gets the width of a DOM element (first one in case several elements fit CSS selector)
   *
   * @Param el - the DOM element to get/set width
   * @Param width - new width to set
   */
  width: function(el, width) {
    if (width) {
      WLJQ(el).width(width);
    } else {
      return WLJQ(el).width();
    }
  },

  /**
   * Sets or Gets the height of a DOM element (first one in case several elements fit CSS selector)
   *
   * @Param el - the DOM element to get/set height
   * @Param height - new height to set
   */
  height: function(el, height) {
    if (height) {
      WLJQ(el).height(height);
    } else {
      return WLJQ(el).height();
    }
  },

  /**
   * Removes an element from the DOM.
   *
   * @Param el - the DOM element (or CSS selector string) to remove
   */
  remove: function(el) {
    WLJQ(el).remove();
  },

  /**
   * Sets specific CSS style on the DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to set CSS style on
   * @Param style - an object of CSS styles to be set
   */
  css: function(el, style) {
    WLJQ(el).css(style);
  },

  /**
   * Sets or Gets the attribute of a DOM element
   *
   * @Param el - the DOM element to get/set attribute
   * @Param attrName - the name of an attribute
   * @Param attrValue - the new value of the attribute
   */
  attr: function(el, attrName, attrValue) {
    if (attrValue) {
      WLJQ(el).attr(attrName, attrValue);
    } else {
      return WLJQ(el).attr(attrName);
    }
  },

  /**
   * Adds the event listener to DOM elements for a specified event
   *
   * @Param el - the DOM element (or CSS selector string) to add event listener to
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   * @Param callback - a JavaScript function to be invoked once event is triggered
   */
  bind: function(el, event, callback) {
    WLJQ(el).bind(event, callback);
  },

  /**
   * Removes the event listener from DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to remove event listener form
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   */
  unbind: function(el, event) {
    if (event) {
      WLJQ(el).unbind(event);
    } else {
      WLJQ(el).unbind();
    }
  },

  /**
   * Triggers a specific event on DOM elements
   *
   * @Param el - the DOM element (or CSS selector string) to trigger the event on
   * @Param event - string with the event's name, e.g. 'click', 'change' etc.
   */
  trigger: function(el, event) {
    WLJQ(el).trigger(event);
  },

  /**
   * Retrieves the element that triggered the event (event's target)
   *
   * @Param event - event to get the target from
   */
  eventTarget: function(event) {
    return event.target;
  },

  /*
   * Detects browser types. Implementation taken from Prototype.js
   */
  detectBrowser: function() {
    var userAgent = navigator.userAgent;
    /*jshint eqeqeq:false*/
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      isIE: !!window.attachEvent && !isOpera,
      isOpera: isOpera,
      isWebKit: userAgent.indexOf('AppleWebKit/') > -1,
      isGecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
      isMobileSafari: /Apple.*Mobile/.test(userAgent),
      isWP81RT: userAgent.indexOf('Windows Phone 8.1') > -1
    };
  },

  /*
   * Returns viewport root element depending on a browser. Implementation taken from Prototype.js
   */
  getViewportRootElement: function() {
    var browser = WLJSX.detectBrowser();

    if (browser.isWebKit && !document.evaluate) {
      return document;
    }

    if (browser.isOpera && window.parseFloat(window.opera.version()) < 9.5) {
      return document.body;
    }

    return document.documentElement;
  },

  /*
   * Returns the width of a viewport
   */
  getViewportWidth: function() {
    return (this.getViewportRootElement())['clientWidth'];
  },

  /*
   * Returns the height of a viewport
   */
  getViewportHeight: function() {
    return (this.getViewportRootElement())['clientHeight'];
  },

  isEmptyObject: function(obj) {
    return WLJQ.isEmptyObject(obj);
  }


};

/*
 * The following namespaces are taken from prototypejs framework and adopted to work with MobileFirst Platform
 */

/*
 * Class object defines a Class.create API for object oriented JS approach
 */
window.WLJSX.Class = (function() {
  var IS_DONTENUM_BUGGY = (function() {
    for (var p in {
        toString: 1
      }) {
      if (p === 'toString') {
        return false;
      }
    }
    return true;
  })();

  function subclass() {}

  function create() {
    var parent = null;
    var properties = WLJSX.Object.toArray(arguments);

    if (WLJSX.Object.isFunction(properties[0])) {
      parent = properties.shift();
    }

    function klass() {
      this.initialize.apply(this, arguments);
    }

    WLJSX.Object.extend(klass, WLJSX.Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      /*jshint newcap:false*/
      klass.prototype = new subclass();
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      klass.addMethods(properties[i]);
    }

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = WLJSX.emptyFunction;
    }

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor = this.superclass && this.superclass.prototype,
      properties = WLJSX.Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      /*jshint eqeqeq:false*/
      if (source.toString != Object.prototype.toString) {
        properties.push('toString');
      }
      if (source.valueOf != Object.prototype.valueOf) {
        properties.push('valueOf');
      }
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i],
        value = source[property];

      if (ancestor && WLJSX.Object.isFunction(value) && value.argumentNames()[0] == '__super') {
        var method = value;
        /*jshint -W083*/
        value = (function(m) {
          return function() {
            return ancestor[m].apply(this, arguments);
          };
        })
        (property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }
    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();

/*
 * WLJSX.Object APIs are responsible for Object related functionality
 *
 * WLJSX.Object.objectSize(obj) - returns the number of properties in the supplied object
 * WLJSX.Object.toArray(iterable) - coverts object to array
 * WLJSX.Object.toJSON(obj) - converts object to it's JSON representation
 * WLJSX.Object.extend(destination, source) - extends destination object with properties from the source object
 * WLJSX.Object.toQueryString(obj) - converts object to a query string
 * WLJSX.Object.keys(obj) - returns object keys as array
 * WLJSX.Object.clone(obj) - returns a new copy of a supplied object
 * WLJSX.Object.isArray(obj) - checks whether object is an array
 * WLJSX.Object.isFunction(obj) - checks whether object is a function
 * WLJSX.Object.isString(obj) - checks whether object is a string
 * WLJSX.Object.isNumber(obj) - checks whether object is a number
 * WLJSX.Object.isDate(obj) - checks whether object is a date
 * WLJSX.Object.isUndefined(obj) - checks whether object is undefined
 */
window.WLJSX.Object = {
  _toString: Object.prototype.toString,
  NULL_TYPE: 'Null',
  UNDEFINED_TYPE: 'Undefined',
  BOOLEAN_TYPE: 'Boolean',
  NUMBER_TYPE: 'Number',
  STRING_TYPE: 'String',
  OBJECT_TYPE: 'Object',
  FUNCTION_CLASS: '[object Function]',
  BOOLEAN_CLASS: '[object Boolean]',
  NUMBER_CLASS: '[object Number]',
  STRING_CLASS: '[object String]',
  ARRAY_CLASS: '[object Array]',
  DATE_CLASS: '[object Date]',

  NATIVE_JSON_STRINGIFY_SUPPORT: (window.JSON &&
    typeof JSON.stringify === 'function' &&
    JSON.stringify(0) === '0' &&
    typeof JSON.stringify(function(x) {
      return x;
    }) === 'undefined'),

  objectSize: function(obj) {
    var count = 0;
    /*jshint forin:false*/
    for (var key in obj) {
      count++;
    }
    return count;
  },

  toArray: function(iterable) {
    if (!iterable) {
      return [];
    }
    if ('toArray' in Object(iterable)) {
      return iterable.toArray();
    }
    var length = iterable.length || 0;
    var result = new Array(length);
    while (length--) {
      result[length] = iterable[length];
    }
    return result;
  },

  Type: function(o) {
    switch (o) {
      case null:
        return WLJSX.Object.NULL_TYPE;
      case (void 0):
        return WLJSX.Object.UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch (type) {
      case 'boolean':
        return WLJSX.Object.BOOLEAN_TYPE;
      case 'number':
        return WLJSX.Object.NUMBER_TYPE;
      case 'string':
        return WLJSX.Object.STRING_TYPE;
    }
    return WLJSX.Object.OBJECT_TYPE;
  },

  extend: function(destination, source) {
    /*jshint forin:false*/
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  },

  toJSON: function(object) {
    if (WLJSX.Object.NATIVE_JSON_STRINGIFY_SUPPORT) {
      return JSON.stringify(object);
    }
    else {
      return WLJSX.Object.Str('', {
        '': object
      }, []);
    }
  },

  Str: function(key, holder, stack) {
    var value = holder[key];
    var type = typeof value;
    if (WLJSX.Object.Type(value) === WLJSX.Object.OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }
    var _class = WLJSX.Object._toString.call(value);
    switch (_class) {
      case WLJSX.Object.NUMBER_CLASS:
      case WLJSX.Object.BOOLEAN_CLASS:
      case WLJSX.Object.STRING_CLASS:
        value = value.valueOf();
    }
    switch (value) {
      case null:
        return 'null';
      case true:
        return 'true';
      case false:
        return 'false';
    }
    type = typeof value;
    switch (type) {
      case 'string':
        return value;
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':
        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError();
          }
        }
        stack.push(value);
        var partial = [];
        if (_class === WLJSX.Object.ARRAY_CLASS) {
          for (i = 0, length = value.length; i < length; i++) {
            var str = WLJSX.Object.Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = '[' + partial.join(',') + ']';
        } else {
          var keys = WLJSX.Object.keys(value);
          for (i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            var strResult = WLJSX.Object.Str(key, value, stack);
            if (typeof strResult !== 'undefined') {
              partial.push(WLJSX.String.inspect(key, true) + ':' + strResult);
            }
          }
          partial = '{' + partial.join(',') + '}';
        }
        stack.pop();
        return partial;
    }
  },

  toQueryString: function(object) {
    var results = [];

    /*jshint forin:false*/
    for (var key in object) {
      key = encodeURIComponent(key);
      var value = object[key];
      var queryPair = (WLJSX.Object.isUndefined(value)) ? key : key + '=' + encodeURIComponent(WLJSX.String.interpret(value));
      results.push(queryPair);
    }
    return results.join('&');
  },

  keys: function(object) {
    if (WLJSX.Object.Type(object) !== WLJSX.Object.OBJECT_TYPE) {
      throw new TypeError();
    }
    var results = [];
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        results.push(property);
      }
    }
    return results;
  },

  clone: function(object) {
    return WLJSX.Object.extend({}, object);
  },

  isArray: function(object) {
    if ((typeof Array.isArray === 'function') && Array.isArray([]) && !Array.isArray({})) {
      return Array.isArray(object);
    } else {
      return WLJSX.Object._toString.call(object) === WLJSX.Object.ARRAY_CLASS;
    }
  },

  isFunction: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.FUNCTION_CLASS;
  },

  isString: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.STRING_CLASS;
  },

  isNumber: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.NUMBER_CLASS;
  },

  isDate: function(object) {
    return WLJSX.Object._toString.call(object) === WLJSX.Object.DATE_CLASS;
  },

  isUndefined: function(object) {
    return typeof object === 'undefined';
  }
};

/*jshint -W100*/

/*
 * WLJSX.String APIs are responsible for String related functionality
 *
 * WLJSX.String.stripScripts(str) - stripts <script> tags from string
 * WLJSX.String.escapeHTML(str) - replaces &, < and > characters with their escaped HTML values
 * WLJSX.String.inspect(str) - Returns a debug-oriented version of the string (i.e. wrapped in single or double quotes, with backslashes and quotes escaped)
 * WLJSX.String.interpret(str) - Forces value into a string. Returns an empty string for null
 * WLJSX.String.strip(str) - Strips all leading and trailing whitespace from a string
 * WLJSX.String.isJSON(str) - validates whether string is a valid JSON representation
 * WLJSX.String.isBlank(str) - Check if the string is 'blank' � either empty (length of 0) or containing only whitespace.
 * WLJSX.String.unfilterJSON(str) - Strips comment delimiters around Ajax JSON or JavaScript responses. This security method is called internally
 * WLJSX.String.evalJSON(str) - Evaluates the JSON in the string and returns the resulting object
 * WLJSX.String.parseResponseHeaders(str) - Parses the string returned by the XMLHttpRequest.getAllResponseHeaders() method and returns an map holding the response headers
 * WLJSX.String.getHeaderByKey(headers, key) - case insenstive search in a map for a given key, Returns the header as json
 */
window.WLJSX.String = {
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  },
  stripScripts: function(str) {
    return str.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
  },

  escapeHTML: function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  interpret: function(str) {
    return str === null ? '' : String(str);
  },

  strip: function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  toQueryParams: function(str) {
    var match = WLJSX.String.strip(str).match(/([^?#]*)(#.*)?$/);
    if (!match) {
      return {};
    }

    var paramsArray = match[1].split('&');
    var paramsObj = {};
    for (var i = 0; i < paramsArray.length; i++) {
      var pair = paramsArray[i].split('=');
      if (pair[0]) {
        (pair.shift()).toString().replace(/%/g , '%25');
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value !== undefined) {
          value = decodeURIComponent(value);
        }
        paramsObj[key] = value;
      }
    }
    return paramsObj;
  },

  isJSON: function(str) {
    if (WLJSX.String.isBlank(str)) {
      return false;
    }
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
  },

  isBlank: function(str) {
    return (/^\s*$/).test(str);
  },

  inspect: function(str, useDoubleQuotes) {
    var escapedString = str.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in WLJSX.String.specialChar) {
        return WLJSX.String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) {
      return '"' + escapedString.replace(/"/g, '\\"') + '"';
    }
    return '\'' + escapedString.replace(/'/g, '\\\'') + '\'';
  },

  unfilterJSON: function(str) {
    return str.replace(/^\/\*-secure-([\s\S]*)\*\/\s*$/, '$1');
  },

  evalJSON: function(str, sanitize) {
    var json = WLJSX.String.unfilterJSON(str);
    if (window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test) {
      // Native json parse support
      return JSON.parse(json);
    } else {
      // No native json parse support
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      if (cx.test(json)) {
        json = json.replace(cx, function(a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      try {
        if (!sanitize || WLJSX.String.isJSON(json)) {
          /*jshint evil:true*/
          return eval('(' + json + ')');
        }
      } catch (e) {}
      throw new SyntaxError('Badly formed JSON string: ' + WLJSX.String.inspect(str));
    }
  },
  
  parseResponseHeaders: function(responseHeadersString) {
    var responseHeaders = {};
    if (responseHeadersString !== null && typeof (responseHeadersString) !== 'undefined') {
       var delimiter = responseHeadersString.indexOf('\r') > -1 ? '\r\n' : '\n';
       var allHeaders = responseHeadersString.split(delimiter);

       /*jshint maxdepth:4*/
       for (var i = 0; i < allHeaders.length; i++) {
         var pair = allHeaders[i];
         var index = pair.indexOf(': ');
         /*jshint maxdepth:5*/
         if (index > 0) {
           var key = pair.substring(0, index);
           var value = pair.substring(index + 2);
           responseHeaders[key] = value;
         }
       }
    }
    return responseHeaders;
  },
  
  getHeaderByKey: function(headers, key) {
	//case insensitive search
	for (var headerKey in headers) {
		if (headerKey.toLowerCase() === key.toLowerCase()) {
			var jsonHeader = {};
			jsonHeader[key] = headers[headerKey];
			return jsonHeader;
		}
	}
	return null;
  }
};

/*
 * WLJSX.PeriodicalExecuter APIs are responsible for PeriodicalExecuter related functionality
 *
 * WLJSX.Object.execute() - Executes a callback supplied at initialization
 * WLJSX.Object.stop() - Stops the timer interval execution
 * new WLJSX.PeriodicalExecuter(callback, frequency) - returns new WLJSX.PeriodicalExecuter() object
 * which will call callback at specified frequencies (in seconds)
 */
window.WLJSX.PeriodicalExecuter = function(callback, frequency) {
  var currentlyExecuting = false;

  function onTimerEvent() {
    if (!currentlyExecuting) {
      try {
        currentlyExecuting = true;
        callback();
        currentlyExecuting = false;
      } catch (e) {
        currentlyExecuting = false;
        throw e;
      }
    }
  }

  var timer = setInterval(onTimerEvent.bind(this), frequency * 1000);

  return {
    execute: function() {
      callback(this);
    },

    stop: function() {
      if (!timer) {
        return;
      }
      clearInterval(timer);
      timer = null;
    }
  };
};


/*
 * Extends JavaScript Function object
 *
 * Public API:
 * functionName.argumentNames - http://api.prototypejs.org/language/Function/prototype/argumentNames/
 * finctionName.bind - http://api.prototypejs.org/language/Function/prototype/bind/
 * functionName.bindAsEventListener - http://api.prototypejs.org/language/Function/prototype/bindAsEventListener/
 * functionName.curry - http://api.prototypejs.org/language/Function/prototype/curry/
 * functionName.delay - http://api.prototypejs.org/language/Function/prototype/delay/
 * functionName.defer - http://api.prototypejs.org/language/Function/prototype/defer/
 * functionName.wrap - http://api.prototypejs.org/language/Function/prototype/wrap/
 */
WLJSX.Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length,
      length = args.length;
    while (length--) {
      array[arrayLength + length] = args[length];
    }
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    /*jshint eqeqeq:false*/
    return names.length == 1 && !names[0] ? [] : names;
  }

  function bind(obj) {
      var args = Array.prototype.slice.call(arguments, 1),
          self = this,
          Nop = function() {
          },
          bound = function() {
              return self.apply(
                  this instanceof Nop ? this : (obj || {}), args.concat(
                      Array.prototype.slice.call(arguments)
                  )
              );
          };
      Nop.prototype = this.prototype || {};
      bound.prototype = new Nop();
      return bound;
  }

  function bindAsEventListener(context) {
    var __method = this,
      args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    };
  }

  function curry() {
    if (!arguments.length) {
      return this;
    }
    var __method = this,
      args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    };
  }

  function delay(timeout) {
    var __method = this,
      args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    };
  }

  return {
    argumentNames: argumentNames,
    bind: bind,
    bindAsEventListener: bindAsEventListener,
    curry: curry,
    delay: delay,
    defer: defer,
    wrap: wrap
  };
})());


/**
 * ================================================================= 
 * Source file taken from :: validators.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */


/**
 * Validators are responsible for validating method arguments in development mode.
 */
WL.Validators = {
    // Validation should be disabled by default - so Welcome pages do not validate in production.
    // If we want validation for the welcome page we must add a solution to turn it off in production.
    isValidationEnabled : false,
    verbose : true,

    // True when 'o' is set, the native JavaScript event is defined, and 'o' has an event phase
    isEvent : function(obj) {
	return obj && obj.type;
    },

    logAndThrow : function(msg, callerName) {
	// Logger is not be available in public resources (welcome page).
	if (WL.Logger) {
	    if (callerName) {
		msg = "Invalid invocation of method " + callerName + "; " + msg;
	    }
	    if (this.verbose) {
		WL.Logger.error(msg);
	    }
	}
	throw new Error(msg);
    },

    enableValidation : function() {
	this.isValidationEnabled = true;
    },

    disableValidation : function() {
	this.isValidationEnabled = false;
    },

    validateArguments : function(validators, args, callerName) {
	if (validators.length < args.length) {
	    // More arguments than validators ... accept only if last argument is an Event.
	    if ((validators.length !== (args.length - 1)) || !this.isEvent(args[args.length - 1])) {
		this.logAndThrow("Method was passed " + args.length + " arguments, expected only " + validators.length + " " + WLJSX.Object.toJSON(validators) + ".", callerName);
	    }
	}
	this.validateArray(validators, args, callerName);
    },

    validateMinimumArguments : function(args, mandatoryArgsLength, callerName) {
	if (args.length < mandatoryArgsLength) {
	    this.logAndThrow("Method passed: " + args.length + " arguments. Minimum arguments expected are: " + mandatoryArgsLength + " arguments.", callerName);
	}
    },

    /**
     * Validates each argument in the array with the matching validator. @Param array - a JavaScript array.
     * @Param validators - an array of validators - a validator can be a function or a simple JavaScript type
     * (string).
     */
    validateArray : function(validators, array, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	for ( var i = 0; i < validators.length; ++i) {
	    this.validateArgument(validators[i], array[i], callerName);
	}
    },

    /**
     * Validates a single argument. @Param arg - an argument of any type. @Param validator - a function or a
     * simple JavaScript type (string).
     */
    validateArgument : function(validator, arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	switch (typeof validator) {
	    // Case validation function.
	    case 'function':
		validator.call(this, arg);
		break;
	    // Case direct type.
	    case 'string':
		if (typeof arg !== validator) {
		    this.logAndThrow("Invalid value '" + WLJSX.Object.toJSON(arg) + "' (" + (typeof arg) + "), expected type '" + validator + "'.", callerName);
		}
		break;
	    default:
		// This error can be caused only if IBM MobileFirst Platform code is bugged.
		this.logAndThrow("Invalid or undefined validator for argument '" + WLJSX.Object.toJSON(arg) + "'", callerName);
	}
    },

    /**
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptions : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, true, callerName);

    },

    /**
     * Validates that option attribute in the given options have a valid name and type - only if they are
     * explicitly defined in validOptions. If an option attribute does not exist in validOptions, it is simply
     * ignored @Param options - the options to validate. @Param validOptions - the valid options hash with
     * their validators: validOptions = { onSuccess : 'function', timeout : function(value){...} }
     * 
     */
    validateOptionsLoose : function(validOptions, options, callerName) {
	this.validateObjectProperties(validOptions, options, false, callerName);
    },

    /**
     * Validates that each option attribute in the given options has a valid name and type. @Param options -
     * the options to validate. @Param validOptions - the valid options hash with their validators:
     * validOptions = { onSuccess : 'function', timeout : function(value){...} } @Param strict - a boolean
     * indicating whether options' properties that don't exist in validOptions are allowed
     * 
     */
    validateObjectProperties : function(validOptions, options, strict, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	for ( var att in options) {
	    // Check that the attribute exists in the validOptions.
	    if (!validOptions[att]) {
		if (strict) {
		    this.logAndThrow("Invalid options attribute '" + att + "', valid attributes: " + WLJSX.Object.toJSON(validOptions), callerName);
		} else {
		    continue;
		}
	    }
	    try {
		// Check that the attribute type is valid.
		this.validateArgument(validOptions[att], options[att], callerName);
	    } catch (e) {
		this.logAndThrow("Invalid options attribute '" + att + "'. " + (e.message || e.description), callerName);
	    }
	}
    },

    /**
     * Validates that each option attribute in the given options is from the one of the validators type.
     * @Param options - the options to validate. @Param validatos - the valid types (in string format):
     * validators = ['string','null','undefined',someFunction,'boolean'...]
     * 
     */
    validateAllOptionTypes : function(validators, options, callerName) {
	if (!this.isValidationEnabled || typeof options === 'undefined') {
	    return;
	}
	var isValidAtt = false;
	for ( var att in options) {
	    isValidAtt = false;
	    for ( var i = 0; i < validators.length; ++i) {
		try {
		    // Check that the attribute type is valid.
		    this.verbose = false;
		    this.validateArgument(validators[i], options[att], callerName);
		    isValidAtt = true;
		    break;
		} catch (e) {
		    // do nothing
		}
	    }
	    this.verbose = true;
	    if (!isValidAtt) {
		this.logAndThrow("Invalid options attribute '" + att + "' (" + typeof (options[att]) + "). Please use just the following types: " + validators.join(","), callerName);
	    }
	}
    },

    validateStringOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'string')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'string'.", callerName);
	}
    },
    
    validateNumberOrNull : function(arg, callerName) {
    	if (!this.isValidationEnabled) {
    	    return;
    	}
    	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'number')) {
    	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'number'.", callerName);
    	}
    },
        
    validateBooleanOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'boolean')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'boolean'.", callerName);
	}
    },
    
    validateObjectOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'object')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'object'.", callerName);
	}
    },

    validateArrayObjectOrNull : function(arg, callerName) {
    	if (!this.isValidationEnabled) {
    	    return;
    	}

    	if ((typeof arg !== 'undefined') && (arg !== null) && (!Array.isArray(arg))) {	
    		this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'array'.", callerName);
    	}
    	
    },
        
    validateFunctionOrNull : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'undefined') && (arg !== null) && (typeof arg !== 'function')) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected null or 'function'.", callerName);
	}
    },
	/**
	 * Validates that the url is a valid url
	 * Throws exception if not
	 * @param validOptions
	 * @param options
	 * @param callerName
	 */
	validateURLOrNull : function(url, callerName) {
		if (!this.isValidationEnabled || typeof url === 'undefined' || url == null) {
			return;
		}
		var pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		if(!url.match(pattern)) {
			this.logAndThrow("Invalid URL : " + url, callerName);
		}
	},
	validateDefined : function(arg, callerName) {
		if(typeof (arg) === 'undefined' || arg === null){
			this.logAndThrow("Invalid argument value '" + arg + "', expected not empty string.", callerName);
		}
	},
    isDefined : function(arg) {
        return(typeof (arg) === 'undefined' || arg === null)
    },

    validateNotEmptyString : function(arg, callerName) {
	if (!this.isValidationEnabled) {
	    return;
	}
	if ((typeof arg !== 'string') || arg.length == 0) {
	    this.logAndThrow("Invalid argument value '" + arg + "', expected not empty string.", callerName);
	}
    },
	isNullOrUndefined: function (object) {
		return object === null || typeof object === 'undefined';
	},
	isString: function (object) {
	    return (typeof (object) === 'string');
	},
    isBoolean: function (object) {
        return (typeof (object) === 'boolean');
    },
    isNumber: function (object) {
        return (typeof (object) === 'number');
    },
    isArray: function (object) {
        return Array.isArray(object);
    }
};


/**
 * ================================================================= 
 * Source file taken from :: wlconfig.js
 * ================================================================= 
 */


/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLConfig = function() {
    /*jshint strict:false, maxparams:4*/
    var baseURL;
    var applicationName;
    var contextRoot;
    var sdkProtocolVersion;
    var serverRelativeTime;

    this.__getBaseURL = function() {
        if(typeof baseURL === 'undefined' || baseURL === null) {
            baseURL = this.__getContext() + '/api';
        }
        return baseURL;
    };

    this.__setBaseURL = function(url) {
        WL.Validators.validateURLOrNull(url, '__setBaseURL');
        baseURL = url;
    };

    this.__getApplicationName = function() {
        return applicationName;
    };

    this.__setApplicationName = function(app) {
        WL.Validators.validateDefined(app, '__setApplicationName');
        applicationName = app;
    };

    this.__setSDKProtocolVersion = function(protocolVersion) {
        sdkProtocolVersion = protocolVersion;
    }

    this.__getSDKProtocolVersion = function () {
        var data = {};
        if(sdkProtocolVersion){
            data['sdk_protocol_version'] = sdkProtocolVersion;
        }
        else{
            data['sdk_protocol_version'] = 2;
        }
        return data;
    };
    
    this.__getClientPlatform = function () {
        return 'web';
    };

    this.__getApplicationData = function () {
        var data = {};
        data['clientPlatform'] = this.__getClientPlatform();
        data['id'] = this.__getApplicationName();
        return data;
    };

    this.__getServerRelativeTime = function () {
        return WL.Validators.isNullOrUndefined(serverRelativeTime) ? 0 : serverRelativeTime;
    };

    this.__setServerRelativeTime = function (time) {
        WL.Validators.validateNumberOrNull(time, '__setServerRelativeTime');
        serverRelativeTime = time;
    };

    this.__getContext = function () {
        return contextRoot;
    };

    this.__setContext = function (ctx) {
        contextRoot = ctx;
    };
};

__WL.prototype.Config = new __WLConfig;
WL.Config = new __WLConfig;




/**
 * ================================================================= 
 * Source file taken from :: wlproperties.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*
 * NOTICE: All server errors MUST be defined with same values in the ErrorCode
 * java enumeration.
 */
var __WLErrorCode = {
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
    API_INVOCATION_FAILURE: 'API_INVOCATION_FAILURE',
    USER_INSTANCE_ACCESS_VIOLATION: 'USER_INSTANCE_ACCESS_VIOLATION',
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    DOMAIN_ACCESS_FORBIDDEN: 'DOMAIN_ACCESS_FORBIDDEN',

    // Client Side Errors
    UNRESPONSIVE_HOST: 'UNRESPONSIVE_HOST',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
    PROCEDURE_ERROR: 'PROCEDURE_ERROR',
    UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
    UNSUPPORTED_BROWSER: 'UNSUPPORTED_BROWSER',
    DISABLED_COOKIES: 'DISABLED_COOKIES',
    CONNECTION_IN_PROGRESS: 'CONNECTION_IN_PROGRESS',
    AUTHORIZATION_FAILURE: 'AUTHORIZATION_FAILURE',
    CHALLENGE_HANDLING_CANCELED: 'CHALLENGE_HANDLING_CANCELED',
    MINIMUM_SERVER: "MINIMUM_SERVER"
};

WL.Language = {
  DIRECTION_LTR: 0,
  DIRECTION_RTL: 1,
  LANGUAGES_RTL: ['he', 'iw', 'ar']
};

__WL.prototype.ErrorCode = __WLErrorCode;
WL.ErrorCode = __WLErrorCode;


/**
 * ================================================================= 
 * Source file taken from :: wllocalstoragedb.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/*globals WLConfig */

var isSessionDefault = false;

__WLLocalStorageDB = function() {
    /*jshint strict:false, maxparams:4*/

    var appNamePrefix;

    // By Default, we work with localStorage, unless it is changed during a set/get
    var storage = window.localStorage;

	/**
     * Initializes the database and verifies it is accessible
     * @returns {*}
     */
    this.init = function() {
        appNamePrefix = WL.Config.__getApplicationName();
    };

    /**
     * Sets an item in the database
     * @param key
     * @param value
     * @param options {{session : boolean, global : boolean}}
     * @returns {*}
     */
    this.setItem = function(key, value, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        var finalValue = value ? JSON.stringify(value) : null;
        storage.setItem(finalKey, finalValue);
    };

    /**
     * Gets an item in the database
     * @param key
     * @param options {{session : boolean, global : boolean}}
     * @returns {string - JSON representation of value for given key}
     */
    this.getItem = function(key, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        var value = storage.getItem(finalKey);
        return value ? JSON.parse(value) : null;
    };

    /**
     * Removes an item in the database
     * @param key
     * @param options {{session : boolean, global : boolean}}
     * @returns {*}
     */
    this.removeItem = function(key, options) {
        var finalOptions = initOptions(options);
        var finalKey = buildKey(key, finalOptions);
        storage.removeItem(finalKey);
    };

    /**
     * Takes the options the user entered (if any) and appends them to the default
     * options, overriding the default values
     * @param userOptions
     * @returns {{global: boolean, session: boolean}}
     */
    function initOptions(userOptions) {
        var options = {
            'session' : isSessionDefault,
            'global' : false
        };
        for (var property in userOptions) {
            options[property] = userOptions[property];
        }

        // Init the storage
        storage = options.session ? window.sessionStorage : window.localStorage;

        return options;
    }

    function buildKey(key, options) {
        return options.global ? key : appNamePrefix + '.' + key;
    }
};

WL.LocalStorageDB = new __WLLocalStorageDB();



/**
 * ================================================================= 
 * Source file taken from :: wlclient.web.js
 * ================================================================= 
 */

/*
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */


__WLClient = function() {

    this.__chMap = {};
    this.__globalHeaders = {};
    var userInfo = {};
    var initOptions = {};
    var MESSAGE_ID = 'messageId';

    var isConnecting = false;

    this.addGlobalHeader = function (headerName, headerValue) {
        this.__globalHeaders[headerName] = headerValue;
    };

    this.__getGlobalHeaders = function(onSuccess){
        return this.__globalHeaders;
    };

    this.getEnvironment = function () {
        return 'web';
    };

    this.getMessageID = function() {
        return MESSAGE_ID;
    };


    this.init = function (initOptions) {
        var dfd = WLJQ.Deferred();
        setInitParams(initOptions);

        // Init the DBs
        WL.DAO.init();

        // init analytics - analytics is defined in AMDWrapper.js
        wlanalytics.init(WL.BrowserManager.getWLUniqueID(),WL.Config.__getApplicationName(), WL.Config.__getContext());

        var hasWlCommonInit = window.wlCommonInit !== undefined;
        //Call to load localized user visible messages based on device locale.
        WL.Utils.setLocalization().always(function () {
            WL.CertManager.init().then(
            function(){
                if (hasWlCommonInit) {
                    wlCommonInit();
                }
                dfd.resolve();
            }
            ,function(error) {
                dfd.reject(error);
            });
        });

        if(!hasWlCommonInit) {
            // We return a promise onlyWL if the user didn't implement wlCommonInit();
            return dfd.promise();
        }
    };

    function setInitParams(params) {
        WL.Validators.enableValidation();

        // assign params to initOptions inside WL.Client class
        initOptions = params;

        var mfpContextRoot = params['mfpContextRoot'];
        var sdkProtocolVersion = params['sdkProtocolVersion'];
        WL.Validators.validateDefined(mfpContextRoot, 'init');
	
        if(params['sessionMode'] !== undefined){
          if(params['sessionMode'] === true || params['sessionMode'] === false){
               isSessionDefault = params['sessionMode'];
          }else{
               console.log('sessionMode has to be only either true or false and cannot be any other value. Default is false.');
          }
        }
	
        var appId = params['applicationId'];
        WL.Validators.validateDefined(appId, 'init');

        // Pass to config
        WL.Config.__setContext(mfpContextRoot);
        WL.Config.__setApplicationName(appId);
        WL.Config.__setSDKProtocolVersion(sdkProtocolVersion);
    }

    this.invokeProcedure = function (invocationData, options) {
        WL.Validators.validateOptions({
            onSuccess : 'function',
            onFailure : 'function',
            invocationContext : function() {
            },
            onConnectionFailure : 'function',
            timeout : 'number',
            fromChallengeRequest : 'boolean'
        }, options, 'WL.Client.invokeProcedure');

        options = extendWithDefaultOptions(options);

        var blocked = false;

        function onInvokeProcedureSuccess(transport) {
            if (!blocked) {
                blocked = true;
                if (!transport.responseJSON || (transport.responseJSON && !transport.responseJSON.isSuccessful)) {
                    var failResponse = new WL.Response(transport, options.invocationContext);
                    failResponse.errorCode = WL.ErrorCode.PROCEDURE_ERROR;
                    failResponse.errorMsg = 'Procedure invocation error.';
                    failResponse.invocationResult = transport.responseJSON;
                    if (!failResponse.invocationResult) {
                    }
                    else if (failResponse.invocationResult.errors) {
                        failResponse.errorMsg += " " + failResponse.invocationResult.errors;
                    }
                    WL.Logger.error(failResponse.errorMsg);
                    options.onFailure(failResponse);
                } else {
                    var response = new WL.Response(transport, options.invocationContext);
                    response.invocationResult = transport.responseJSON;
                    options.onSuccess(response);
                }
            }

        }

        function onInvokeProcedureFailure(transport) {
            if (!blocked) {
                blocked = true;
                setConnected(false);
                var errorCode = transport.responseJSON.errorCode;
                if (options.onConnectionFailure && (errorCode == WL.ErrorCode.UNRESPONSIVE_HOST || errorCode == WL.ErrorCode.REQUEST_TIMEOUT)) {
                    options.onConnectionFailure(new WL.FailResponse(transport, options.invocationContext));
                } else {
                    options.onFailure(new WL.FailResponse(transport, options.invocationContext));
                }
            }
        }

        var resourceRequest = {};

        if (!WLJSX.Object.isUndefined(options.timeout)) {
            resourceRequest = new WLResourceRequest("/adapters/" + invocationData.adapter + "/" + invocationData.procedure, WLResourceRequest.GET, options.timeout);
        } else {
            resourceRequest = new WLResourceRequest("/adapters/" + invocationData.adapter + "/" + invocationData.procedure, WLResourceRequest.GET);
        }

        //add parameters
        resourceRequest.setQueryParameter("params", WLJSX.Object.toJSON(invocationData.parameters));

        var environment = WL.Client.getEnvironment();

        resourceRequest.send().then(
            onInvokeProcedureSuccess,
            onInvokeProcedureFailure
        );
    };


    this.pinTrustedCertificatePublicKey = function(certificateFilename){};

    this.reloadApp = function () {
        document.location.reload();
    };

    this.setHeartBeatInterval = function (interval) {
        WL.Validators.validateArguments(['number'], arguments, 'WL.Client.setHeartBeatInterval');
        if (typeof(WLAuthorizationManager) !== 'undefined' && WLAuthorizationManager !== null) {
            WLAuthorizationManager.__sendHeartBeat(interval);
        }
    };

    this.setDeviceDisplayName = function(deviceDisplayName, options) {
        WL.Validators.validateArguments(['string', WL.Validators.validateObjectOrNull], arguments, 'WL.Client.setDeviceDisplayName');

        if ( typeof options !== "undefined") {
            WL.Validators.validateOptions({
                onSuccess : 'function',
                onFailure : 'function'
            }, options, 'WL.Client.setDeviceDisplayName');
        } else {
            options = {};
            options.onSuccess = function(){};
            options.onFailure = function(){};
        }

        WL.DeviceAuth.__setDeviceDisplayName(deviceDisplayName, options.onSuccess, options.onFailure);
    };

    this.getDeviceDisplayName = function(options) {

        WL.Validators.validateArguments(['object'], arguments, 'WL.Client.getDeviceDisplayName');

        WL.Validators.validateOptions({
            onSuccess : 'function',
            onFailure : 'function'
        }, options, 'WL.Client.getDeviceDisplayName');

        WL.DeviceAuth.__getDeviceDisplayName(options.onSuccess, options.onFailure);
    };


    this.removeGlobalHeader = function (headerName) {
        delete this.__globalHeaders[headerName];
    };


    this.getCookies = function () {};


    this.setCookie = function (cookie) {};


    this.deleteCookie = function (name) {};


    this.getLanguage = function() {};

    this.isWl401 = function(response) {
        if (response.status == 401) {
            var challengesHeader = response.getHeader("WWW-Authenticate");
            if (( typeof challengesHeader !== "undefined") && (challengesHeader == "MFP-Challenge")) {
                return true;
            }
        }
        return false;
    };
    
	/**
	 * @ignore
	 * Go over all non MFP challenge handlers and call it's canHandleResponse function.
	 * Return true if ChallengeHander was called
	 */
	this.isGatewayResponse = function(response){

		for (var processorRealm in WL.Client.__chMap) {
			if (Object.prototype.hasOwnProperty.call(WL.Client.__chMap, processorRealm)) {
				var handler = WL.Client.__chMap[processorRealm];
				if (!handler.isWLHandler && handler.canHandleResponse(response)) {
					return true;
				}
			}
		}
	};

    /**
     * @ignore
     * check is a IBM MobileFirst Platform 403 response
     */
    this.isWl403 = function(response) {
        if (response.status == 403 || response.status == 222) {
            if (( typeof response.responseJSON !== "undefined") && (response.responseJSON != null) && response.responseJSON["failures"]) {
                return true;
            }
        }
        return false;
    };

    this.checkResponseForChallenges = function(wlRequest, response, responseForPostAnswersRealm) {
        var containsChallenges = false;

        // iterate over successes in json
        if (( typeof response.responseJSON !== "undefined") && (response.responseJSON != null) && (response.responseJSON["successes"] !== "undefined") && (response.responseJSON["successes"] != null)) {
            successes = response.responseJSON["successes"];
            handleSuccess(successes);
        }

        if (this.isWl401(response)) {
            var challengeRealms = response.responseJSON.challenges;
            wlRequest.setExpectedAnswers(challengeRealms);
            var realm = getDirectUpdateRealm(challengeRealms);
            if (realm) {
                executeChallenge(challengeRealms, realm);
            } else {
                for (realm in challengeRealms) {
                    executeChallenge(challengeRealms, realm);
                }
            }
            containsChallenges = true;
        }
        // check if wl403
        else if (this.isWl403(response)) {
            var wlFailure = response.responseJSON["failures"];
            isConnecting = false;
            // only one failure in this type of message
            for (var realm in wlFailure) {
                if (Object.prototype.hasOwnProperty.call(wlFailure, realm)) {
                    handler = this.__chMap[realm];
                    if (handler != null && typeof handler !== 'undefined') {
                        handler.handleFailure(wlFailure[realm], wlRequest, response);
                        handler.clearWaitingList();
                        wlRequest.onFailure(response);
                    }
                }
            }
            containsChallenges = true;
        }
        else {
            for (var processorRealm in WL.Client.__chMap) {
                if (Object.prototype.hasOwnProperty.call(WL.Client.__chMap, processorRealm)) {
                    var handler = WL.Client.__chMap[processorRealm];
                    if (!handler.isWLHandler && handler.canHandleResponse(response)) {
                        handler.startChallengeHandling(wlRequest, response);
                        containsChallenges = true;
                        break;
                    }
                }
            }
        }
        // Handle successes
        function handleSuccess(successes) {
            for (var securityCheck in successes) {
                if (Object.prototype.hasOwnProperty.call(successes, securityCheck)) {
                    // always add the identity to userInfo even if there is
                    // no cp to handle it (like SingleIdentity)
                    userInfo[securityCheck] = successes[securityCheck];
                    var cp = WL.Client.__chMap[securityCheck];
                    if ( typeof cp !== "undefined") {
                        if (cp.isWLHandler) {
                            cp.handleSuccess(successes[securityCheck]);
                            cp.releaseWaitingList();
                        }
                    }
                }
            }
        }

        /**
         * Search for the direct update scope in an array of realms
         * @param realms - an array of realms
         * @returns the update realm if it found or null if it doesn't
         */
        function getDirectUpdateRealm(realms) {

            for (var scope in realms) {
                if (scope == 'directUpdate') {
                    return scope;
                }
            }

            return null;
        }

        /**
         * handle the challenge (execute it if everything is ok)
         * @param challengeRealms - an array of realms that the given realm is part of
         * @param realm - the realm of the challenge that needs to be execute
         */
        function executeChallenge(challengeRealms,realm)
        {
            if (Object.prototype.hasOwnProperty
                    .call(challengeRealms, realm)) {
                // get the correct challenge
                var handler = WL.Client.__chMap[realm];
                if (handler == null || typeof handler == 'undefined') {
                    var errorMsg = "unknown challenge arrived, cannot proccess challenge handler: "
                        + realm + ". register challenge handler using WL.Client.createSecurityCheckChallengeHandler()";
                    WL.Logger.error(errorMsg);
                    var transportFailure = {
                        status: -1,
                        responseJSON: {
                            errorCode: WL.ErrorCode.UNEXPECTED_ERROR,
                            errorMsg: errorMsg
                        }
                    };
                    wlRequest.onFailure(transportFailure);

                } else {
                    handler.startChallengeHandling(wlRequest,
                        challengeRealms[realm]);
                }
            }
        }

        return containsChallenges;
    };



    this.createGatewayChallengeHandler = function(gatewayName) {
            // Creates abstract challenge handler
            var challengeHandler = new AbstractChallengeHandler(gatewayName);
            challengeHandler.isWLHandler = false;

            // Extends it by adding new methods (can also override methods)

            /**
             * User calls this function when the the challange was handled successfully.
             * When a success is submitted, the state of successes is checked for all chalanges issued per original request.
             * What this means is that, if all challenges are succesfully met, the original message would be resent automagically.
             */
            challengeHandler.submitSuccess = function() {
                // ch has done its job, now we can set the activRequest to null.
                challengeHandler.activeRequest.removeExpectedAnswer(this.realm);
                challengeHandler.activeRequest = null;
                challengeHandler.releaseWaitingList();

            };

            /**
             * Must be implemented by developer.
             *
             * This method will be invoked by the IBM MobileFirst Platform for every server response.
             * It is responsible to detect whether server response contains data
             * that should be processed by this challenge handler.
             */
            challengeHandler.canHandleResponse = function(transport) {
                return false;
            };

            /**
             * This method should be used in a challenge handler to submit authentication of a form, in case of form
             * based authentication.
             */
            challengeHandler.submitLoginForm = function(reqURL, options, submitLoginFormCallback) {
                var timer = null;

                WL.Logger.debug("Request [login]");

                function onUnresponsiveHost(transport) {
                    if (isTimeout()) {
                        return;
                    }
                    cancelTimer();

                    WLJSX.Ajax.WLRequest.setConnected(false);
                    submitLoginFormCallback(transport);
                }

                function onLoginFormResponse(transport) {
                    if (isTimeout()) {
                        return;
                    }
                    cancelTimer();
                    submitLoginFormCallback(transport);
                }

                setTimer(WLJSX.Ajax.WLRequest.options.timeout);

                var requestHeaders = WL.CookieManager.createCookieHeaders();

                // add headers
                if (options && options.headers) {
                    var headers = options.headers;
                    if (( typeof headers != "undefined") && (headers != null)) {
                        for (var headerName in headers) {
                            if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
                                requestHeaders[headerName] = headers[headerName];
                            }
                        }
                    }
                }

                var reqOptions = {
                    method : 'post',
                    contentType : 'application/x-www-form-urlencoded',
                    onSuccess : onLoginFormResponse,
                    onFailure : onLoginFormResponse,
                    // Unresponsive host: Some desktops treat as success if not
                    // defined explicitly.
                    on0 : onUnresponsiveHost.bind(this),
                    requestHeaders : requestHeaders
                };

                
                reqOptions.parameters = options.parameters;

                var finalUrl = null;

                if (reqURL.indexOf("http") == 0 && reqURL.indexOf(':') > 0) {
                    finalUrl = reqURL;
                } else {
                    finalUrl = WL.Utils.createAPIRequestURL(reqURL);
                }

                var ajaxRequest = null;

                __sendRequest();

                function __sendRequest() {
                    ajaxRequest = new WLJSX.Ajax.Request(finalUrl, reqOptions);
                }

                function setTimer(timeout) {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                    }
                    timer = window.setTimeout(onTimeout, timeout);
                }

                function onTimeout() {
                    timer = null;
                    if (ajaxRequest !== null) {
                        ajaxRequest.transport.abort();
                    }

                    var transport = {};
                    transport.responseJSON = {
                        errorCode : WL.ErrorCode.REQUEST_TIMEOUT,
                        errorMsg : WL.ClientMessages.requestTimeout
                    };
                    transport.responseText = null;
                    submitLoginFormCallback(transport);
                }

                function cancelTimer() {
                    if (timer !== null) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                }

                function isTimeout() {
                    return (timer === null);
                }

            };


            return challengeHandler;
    };


    this.createSecurityCheckChallengeHandler = function (securityCheckName) {
            // Creates SUPER challenge processor
            var challengeHandler = new AbstractChallengeHandler(securityCheckName);
            challengeHandler.isWLHandler = true;

            challengeHandler.MAX_NUMBER_OF_FAILURES = 3;
            challengeHandler.numOfFailures = 0;

            // Extends it by adding new methods (can also override methods)
            challengeHandler.submitChallengeAnswer = function(answer) {
                if (( typeof answer === "undefined") || answer == null) {
                    challengeHandler.activeRequest.removeExpectedAnswer(this.realm);
                } else {
                    challengeHandler.activeRequest.submitAnswer(this.realm, answer);
                }
                // cp has done its job, now we can set the activRequest to null.
                challengeHandler.activeRequest = null;
            };

            // when a WL success arrives, this user method is called.
            challengeHandler.handleSuccess = function(identity) {

            };

            // when a WL failure arrives, this user method is called.
            challengeHandler.handleFailure = function(err) {

            };

            // Returns it
            return challengeHandler;

    };


    function AbstractChallengeHandler(securityCheckName) {
        this.realm = securityCheckName;
        this.isWLHandler = false;
        this.activeRequest = null;
        this.requestWaitingList = [];

        /**
         * @ignore
         * in case this is the first request that is associated with the
         * challenge, set activeRequest and handleChallenge. If this is not the
         * first request, we place it in a queue for handling once we finish
         * handling the first request (just get the result).
         */
        this.startChallengeHandling = function(wlRequest, obj) {
            if (this.activeRequest == null) {
                this.activeRequest = wlRequest;
            } else if (WLJSX.Object.isUndefined(wlRequest.options.fromChallengeRequest)) {
                this.requestWaitingList.push(wlRequest);
                return;
            }

            this.handleChallenge(obj);

        };

        /**
         * @ignore
         * Must be implemented by developer.
         *
         * This method is responsible for actual challenge handling.
         * It will be invoked by the IBM MobileFirst Platform in case canHandleResponse() API has
         * returned true value
         *
         */
        this.handleChallenge = function(obj) {
        };

        /**
         * @ignore
         * In case of cancel we need to clear the waiting list of request,
         * without further handling.
         */
        this.clearWaitingList = function() {
            this.requestWaitingList = [];
        };

        /**
         * @ignore
         * When processing is successful (onSuccess) we assume the challenge is
         * answered, and does need further handling so we remove the expected
         * answer from the waiting list. Then we clear the waiting list.
         */
        this.releaseWaitingList = function() {
            if (this.requestWaitingList.length > 0) {
                for (var i = 0; i < this.requestWaitingList.length; i++) {
                    this.requestWaitingList[i].removeExpectedAnswer(this.realm);
                }
            }
            this.requestWaitingList = [];
        };

        /**
         * @ignore
         * This method is used to cancel the processing of the challenge
         * Because this is a failure to authenticate, the original message will be discarded
         * (i.e. will not be sent again, even if all other challenges are successfull)
         */
        this.cancel = function() {
            isConnecting=false;
            // store active request before calling to clearWaitingList, because of later call on onFailure
            var request = this.activeRequest;
            this.activeRequest = null;
            this.clearWaitingList();
            if (request !== null && typeof(request.options) !== 'undefined' &&
                typeof(request.options.onAuthRequestFailure) !== 'undefined') {
                var transport = {
                    status : 0,
                    responseJSON : {
                        errorCode: WL.ErrorCode.CHALLENGE_HANDLING_CANCELED,
                        errorMsg: 'Challenge handler operation was cancelled.'
                    },
                    responseText : 'Challenge handler operation was cancelled.'
                };

                var err = new WL.Response(transport, null);
                request.options.onAuthRequestFailure(err);
            }
        };

        this.moveToWaitingList = function(wlRequest) {
            this.requestWaitingList.push(wlRequest);
        };

        this.removeFromWaitingList = function(wlRequest) {
            for (var i = 0; i < this.requestWaitingList.length; i++) {
                if (this.requestWaitingList[i] === wlRequest) {
                    spliced = this.requestWaitingList.splice(i - 1, 1);
                    break;
                }
            }
        };

        WL.Client.__chMap[securityCheckName] = this;
    }

    /*
     * Check if the user added a default handler for OnRemoteDisableDenial and
     * if so, activate it. If not then call the defaultRemoteDisableDenial.
     */
    this.__handleOnRemoteDisableDenial = function(defaultonErrorRemoteDisableDenial, that, msg, downloadLink) {
        if (initOptions.onErrorRemoteDisableDenial) {
            initOptions.onErrorRemoteDisableDenial(msg, downloadLink);
        } else {
            defaultonErrorRemoteDisableDenial(that, msg, downloadLink);
        }
    };

    this.isShowCloseButtonOnRemoteDisable = function() {
      return initOptions.showCloseOnRemoteDisableDenial ? true : false;
    };
};


__WL.prototype.Client = new __WLClient;
WL.Client = new __WLClient;


/**
 * ================================================================= 
 * Source file taken from :: jwt.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLAuthorizationManager, WLConfig, WLJSX */

/*jshint strict:false, maxparams:4*/



WL.JWT = WLJSX.Class.create({
    iss :  null,
    sub : null,
    exp : 0,
    iat : 0,
    jti : null,
    aud : null,

    initialize : function JWT (jti, aud) {
        var DEFAULT_JWT_EXP_MILLIS = 60 * 1000;
        var currentTime = new Date().getTime() + WL.Config.__getServerRelativeTime();

        this.iss = WL.Config.__getApplicationName() + '$' + WL.Config.__getClientPlatform();
        this.sub = WLAuthorizationManager.__getClientId();
        this.exp = currentTime + DEFAULT_JWT_EXP_MILLIS;
        this.iat = currentTime;
        this.jti = typeof jti === 'undefined' ? null : jti;
        this.aud = typeof aud === 'undefined' ? null : aud;
    }
});

/**
 * ================================================================= 
 * Source file taken from :: accessToken.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX */

/*jshint strict:false, maxparams:4*/
WL.AccessToken = WLJSX.Class.create({
    value : null,
    expiration : 0,
    scope : null,
    asAuthorizationRequestHeader : null,
    asFormEncodedBodyParameter : null,

    initialize : function(token, expiration, scope) {
        var currentTime = new Date().getTime();
        this.value = token;

        // Expiration is in seconds, we transform to millis and add current time
        this.expiration = currentTime + (expiration * 1000);
        this.scope = scope;
        this.asAuthorizationRequestHeader = 'Bearer ' + token;
        this.asFormEncodedBodyParameter = 'access_token=' + token;
    }
});


/**
 * ================================================================= 
 * Source file taken from :: wlbrowsermanager.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLBrowserManager = function() {
    /*jshint strict:false, maxparams:4*/
    var uniqueId;
    var localDeviceDisplayName;

    /**
     * Unique ID taken from different parts of the browser information
     * @returns {*}
     */
    this.getWLUniqueID = function() {
        var key = 'com.mfp.browser.uniqueid';

        // BrowserID should be saved cross applications
        var globalOptions = {'global' : true};
        
        var uniqueId = WL.DAO.getItem(key, globalOptions);
        if(WL.Validators.isNullOrUndefined(uniqueId)) {
            uniqueId = generateGUID();
            WL.DAO.setItem(key, uniqueId, globalOptions);
        }
        return uniqueId;
    };

    this.__setLocalDeviceDisplayName = function(name) {
        localDeviceDisplayName = name;
    };

    /**
     * Browser Object that is used for registration
     * @returns {{}}
     */
    this.getDeviceData = function () {
        var data = {};
        data['id'] = this.getWLUniqueID();
        data['platform'] = getUserAgent();
        data['hardware'] = getPlatform();
        data['deviceDisplayName'] = localDeviceDisplayName;
        if (WL.Config.__getSDKProtocolVersion().sdk_protocol_version >= 2 && WL.Crypto.cryptoFlag == true) {
            data['sdkVersion'] = WL.Config.__getSDKProtocolVersion().sdk_protocol_version;
        }
        return data;
    };

    function getUserAgent() {
        return window.navigator.userAgent;
    }

    function getPlatform() {
        return window.navigator.platform;
    }

    /*
    Generates a unique ID based on the random information
     */
    function generateGUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
};


__WL.prototype.BrowserManager = new __WLBrowserManager;
WL.BrowserManager = new __WLBrowserManager;


/**
 * ================================================================= 
 * Source file taken from :: ajax.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX, WL, escape, unescape*/

/*jshint strict:false*/

window.WLJSX.Ajax = {
    getTransport: function() {
        var tr = null;
        try {
            tr = new XMLHttpRequest();
        } catch (e) {}

        return tr;
    }
};

window.WLJSX.Ajax.Request = WLJSX.Class.create({
    _complete: false,

    initialize: function(url, options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/json',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        WLJSX.Object.extend(this.options, options || {});

        this.options.method = this.options.method.toLowerCase();
        this.transport = window.WLJSX.Ajax.getTransport();

        this.request(url);
    },

    request: function(url) {
        this.url = url;
        this.method = this.options.method;
        var params = WLJSX.Object.isString(this.options.parameters) ?
            this.options.parameters : WLJSX.Object.toJSON(this.options.parameters);

        if (this.method !== 'get' && this.method !== 'post' && this.method !== 'put') {
            params += (params ? '&' : '') + '_method=' + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            // Query params
            params = WLJSX.Object.toQueryString(this.options.parameters);
            this.url += ((this.url.indexOf('?') > -1) ? '&' : '?') + params;
        }

        if (params && this.method.toLowerCase() === 'post' || this.method.toLowerCase() === 'put') {
            if(this.options.contentType === 'application/x-www-form-urlencoded') {
                // Send the body as form
                params = WLJSX.Object.toQueryString(this.options.parameters);
            } else {
                // Send body as JSON
                params = WLJSX.Object.toJSON(this.options.parameters);
            }
        }

        try {
            var response = new window.WLJSX.Ajax.Response(this);
            if (this.options.onCreate) {
                this.options.onCreate(response);
            }

            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

            this.transport.timeout = this.options.timeout;

            if (this.options.asynchronous) {
                this.respondToReadyState.bind(this).defer(1);
            }

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();

            /*jshint eqeqeq:false*/
            this.body = (this.method == 'post' || this.method == 'put')? (this.options.postBody || params) : null;
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if (!this.options.asynchronous && this.transport.overrideMimeType) {
                this.onStateChange();
            }

        } catch (e) {
            this.dispatchException(e);
        }
    },

    onStateChange: function() {
        var readyState = this.transport.readyState;
        /*jshint eqeqeq:false*/
        if (readyState > 1 && !((readyState == 4) && this._complete)) {
            this.respondToReadyState(this.transport.readyState);
        }
    },

    setRequestHeaders: function() {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
            'Accept-Language': WL.App.__getDeviceLocale()
        };

        /*jshint eqeqeq:false*/
        if (this.method == 'post' || this.method.toLowerCase() === 'put') {
            headers['Content-type'] = this.options.contentType + (this.options.encoding ? '; charset=' + this.options.encoding : '');

            /* Force "Connection: close" for older Mozilla browsers to work
             * around a bug where XMLHttpRequest sends an incorrect
             * Content-length header. See Mozilla Bugzilla #246651.
             */
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) {
                headers['Connection'] = 'close';
            }
        }

        if (typeof this.options.requestHeaders == 'object') {
            var extras = this.options.requestHeaders;

            if (WLJSX.Object.isFunction(extras.push)) {
                for (var i = 0, length = extras.length; i < length; i += 2) {
                    headers[extras[i]] = extras[i + 1];
                }
            }
            else {
                /*jshint forin:false*/
                for (var key in extras) {
                    var value = extras[key];
                    headers[key] = (value === null || typeof(value) == 'undefined') ? '' : value;
                }
            }
        }
        for (var name in headers) {
            this.transport.setRequestHeader(name, unescape(encodeURIComponent(headers[name])));
        }
    },

    success: function() {
        var status = this.getStatus();
        if (status === 0 && this.isSameOrigin() === false) {
            return false;
        }
        /*jshint eqeqeq:false*/
        return !status || (status >= 200 && status < 300) || status == 304 || status == 302;
    },

    getStatus: function() {
        try {
            if (this.transport.status === 1223) {
                return 204;
            }
            return this.transport.status || 0;
        } catch (e) {
            return 0;
        }
    },

    respondToReadyState: function(readyState) {
        var state = window.WLJSX.Ajax.Request.Events[readyState],
            response = new window.WLJSX.Ajax.Response(this);

        /*jshint eqeqeq:false*/
        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || WLJSX.emptyFunction)(response, response.headerJSON);
            } catch (e) {
                this.dispatchException(e);
            }

            var contentType = response.getHeader('Content-type');
            if (this.options.evalJS == 'force' || (this.options.evalJS &&
                this.isSameOrigin() &&
                contentType &&
                contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) {
                this.evalResponse();
            }
        }

        try {
            (this.options['on' + state] || WLJSX.emptyFunction)(response, response.headerJSON);
        } catch (e) {
            this.dispatchException(e);
        }

        if (state == 'Complete') {
            this.transport.onreadystatechange = WLJSX.emptyFunction;
        }
    },

    isSameOrigin: function() {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        var url = location.protocol + '//' + document.domain;
        if (location.port) {
            url += ':' + location.port;
        }
        /*jshint eqeqeq:false*/
        return (!m || (m[0] == url));
    },

    getHeader: function(name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },

    evalResponse: function() {
        try {
            /*jshint evil:true*/
            return eval(WLJSX.String.unfilterJSON(this.transport.responseText || ''));
        } catch (e) {
            this.dispatchException(e);
        }
    },

    dispatchException: function(exception) {
        (this.options.onException || WLJSX.emptyFunction)(this, exception);
    }
});

window.WLJSX.Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

window.WLJSX.Ajax.Response = WLJSX.Class.create({
    initialize: function(request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;

        /*jshint eqeqeq:false*/
        if ((readyState > 2 && !WLJSX.detectBrowser().isIE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = WLJSX.String.interpret(transport.responseText);
            this.headerJSON = this._getHeaderJSON();
        }

        if (readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML = WLJSX.Object.isUndefined(xml) ? null : xml;
            this.responseJSON = this._getResponseJSON();

        }
    },

    status: 0,

    statusText: '',

    getStatus: window.WLJSX.Ajax.Request.prototype.getStatus,

    getStatusText: function() {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return '';
        }
    },

    getHeader: window.WLJSX.Ajax.Request.prototype.getHeader,

    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null;
        }
    },

    getResponseHeader: function(name) {
        return this.transport.getResponseHeader(name);
    },

    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders();
    },

    _getHeaderJSON: function() {
        var json = this.getHeader('X-JSON');
        if (!json) {
            return null;
        }
        json = decodeURIComponent(escape(json));
        try {
            return String.wl.evalJSON(json, this.request.options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    },

    _getResponseJSON: function() {
        //Assume JSON is returned regardless, and only throw an exception
        //if we expected JSON and JSON was not returned
        var options = this.request.options;
        try {
            return WLJSX.String.evalJSON(this.responseText, (options.sanitizeJSON || !this.request.isSameOrigin()));
        } catch (e) {
            /*jshint eqeqeq:false*/
            if (!options.evalJSON || (options.evalJSON != 'force' && (this.getHeader('Content-type') || '').indexOf('application/json') < 0) || WLJSX.String.isBlank(this.responseText)) {
                return null;
            } else {
                this.request.dispatchException(e);
            }
        }
    }
});

/**
 * ================================================================= 
 * Source file taken from :: wlapp.web.js
 * ================================================================= 
 */

/**
 \ * @license
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

/**
 * @class
 * @ilog.undocumented.constructor
 * @displayname WL.App
 */
/*jshint undef:false*/
__WLApp = function() {

    /*jshint strict:false*/

    /**
     * Opens the specified URL according to the specified target and options
     * (specs). The behavior of this method depends on the app environment, as
     * follows:
     *  <table class="userTable" cellspacing="0">
     <thead>
     <tr>
     <th>Environment</th>
     <th>Description</th>
     </tr>
     </thead>
     <tbody>
     <tr>
     <td class="attributes">Adobe AIR</td>
     <td class="nameDescription">Opens a new browser window at the specified URL. The target and options parameters are ignored.</td>
     </tr>
     <tr>
     <td class="attributes">TO BE COMPLETED</td>
     <td class="nameDescription">TO BE COMPLETED.</td>
     </tr>
     </tbody>
     </table>
     *
     * @param url
     *            Mandatory. The URL of the web page to be opened.
     * @param target
     *            Optional. The value to be used as the target (or name)
     *            parameter of JavaScript <code>window.open</code> method. If
     *            no value is specified, <code>_self</code> will be used.
     *
     * @param options
     *            Optional. Parameters hash.
     *            If no value is specified, the following options are used:
     *        status=1, toolbar=1, location=1, menubar=1, directories=1, resizable=1, scrollbars=1
     * @return A reference to the newly opened window, or NULL if no window was opened.
     */
    this.__openURL = function(url, target, options) {
        WL.Validators.validateArguments(['string', WL.Validators.validateStringOrNull,
            WL.Validators.validateStringOrNull
        ], arguments, 'WL.App.openURL');

        var wnd = null;
        if (WLJSX.Object.isUndefined(options) || options === null) {
            options = 'status=1,toolbar=1,location=1,menubar=1,directories=1,resizable=1,scrollbars=1';
        }
        if (WLJSX.Object.isUndefined(target) || target === null) {
            target = '_self';
        }
        var absoluteURL = WL.Utils.createAPIRequestURL(url);
        wnd = window.open(absoluteURL, target, options);
        console.log('openURL url: ' + absoluteURL);

        return wnd;
    };

    /**
     * Returns the locale code (or device language on BlackBerry).
     * Returns the locale code according to user device settings, for example: en_US.
     * @note {Note} On BlackBerry 6 and 7, this method returns the device language (for example, en), not the device locale.
     */
    this.__getDeviceLocale = function() {
    	if (typeof navigator.languages !== 'undefined' && navigator.languages.length > 0) {
           // has navigator.languages list and it is non-empty
           // relevant only for Chrome
            return navigator.languages[0];
        }
        if (navigator.language == null){
            return navigator.browserLanguage;
        }
        return navigator.language;
    };

    /**
     * Returns the language code.
     * Returns the language code according to user device settings, for example: en.
     */
    this.__getDeviceLanguage = function() {
        return this.__getDeviceLocale().substring(0, 2);
    };

    /**
     * Returns a pattern string to format and parse numbers according to the client's user preferences.
     * Returns the pattern to the successCallback with a properties object as a parameter,that contains :
     pattern,symbol,fraction,rounding,positive etc
     */

    this.getLocalePattern = function() {
        pattern = WL.Client.getLocalePattern();
        return pattern;
    };

    /**
     * Returns the decimal separator.
     * Returns the decimal separator accoriding to the region/locale preferences. eg : French uses "," but English uses "."
     */
    this.getDecimalSeparator = function() {
        var localepattern = this.getLocalePattern();
        if (typeof localepattern === 'undefined' || localepattern === null) {
            return '.';
        }
        return localepattern.decimal;
    };

    /**
     * Extracts a string that contains an error message.
     * Extracts a string that contains the error message within the specified exception object.
     * Use for exceptions that are thrown by the IBM MobileFirst Platform client runtime.
     * @param {Function} callback Mandatory. The function that is called when Back is pressed.
     * @example {}
     * WL.App.overrideBackButton(backFunc);
     * function backFunc(){
   *    alert('you hit the back key!');
   * }
     */
    this.getErrorMessage = function(e) {
        var message;
        if (e === null) {
            message = null;
        } else if (WLJSX.Object.isString(e)) {
            message = e;
        } else if (WLJSX.Object.isArray(e)) {
            message = e.join(',');
        } else if (e.description || e.message) {
            // the exception message
            message = e.description ? e.description : e.message;

            // add file name and line number
            if (e.fileName) {
                message += ' [' + e.fileName + ': line ' + e.lineNumber + ']';
            } else if (e.sourceURL) {
                message += ' [' + e.sourceURL + ': line ' + e.line + ']';
            }
        } else {
            message = e.toString();
        }
        return message;
    };



};

/*jshint newcap:false*/
__WL.prototype.App = new __WLApp();
WL.App = new __WLApp();

/**
 * ================================================================= 
 * Source file taken from :: wlutils.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WL_, __WL, WLJSX, WLJQ, WL_LOADER_CHECKSUM, WL_I18N_MESSAGES, WL_CLASS_NAME_TRANSLATE*/

/*
 * IBM MobileFirst Platform Utils
 */
var __WLUtils = function () {

    /*jshint strict:false*/

    // ........................Private methods........................

    var IBMMFPF_SDK_NAME = 'ibmmfpf';

    function loadWLClientMessages(path, lang) {
        var dfd = WLJQ.Deferred();

        var url = 'lib/messages/' + lang + '/messages.json';
        if (lang === null || typeof lang === 'undefined' || lang.indexOf('en') === 0) {
            url = 'lib/messages/messages.json';
        }
        loadJSON(path + url).then(function(data){
            WL.ClientMessages = data;
            dfd.resolve();
        }, function(){
            WL.Logger.error('error loading messages file: ' + url);
            dfd.reject();
        });
        return dfd.promise();
    }


    var findSDKPath = (function () {
            return function (sdk) {
                var path = null;
                // search mfp sdk path using script tag
                var scripts = document.getElementsByTagName('script');
                var term = '/' + sdk + '.js';
                for (var n = scripts.length-1; n>-1; n--) {
                    var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
                    if (src.indexOf(term) === (src.length - term.length)) {
                        path = src.substring(0, src.length - term.length) + '/';
                        break;
                    }
                }
                return path;
            }
        }
    )();

    function loadJSON(path) {
        var dfd = WLJQ.Deferred();
        var xobj = new XMLHttpRequest();
        if (xobj.overrideMimeType)
            xobj.overrideMimeType("application/json");
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4) {
                if(xobj.status == "200") {
                    dfd.resolve(JSON.parse(xobj.responseText));
                } else {
                    dfd.reject();
                }
            }
        };
        xobj.send(null);
        return dfd.promise();
    }

	//Helper function to check if file is present in the given location or not
    function checkForFile(path) {
        var dfd = WLJQ.Deferred();
        var xobj = new XMLHttpRequest();
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4) {
                if(xobj.status == "200") {
                    dfd.resolve();
                } else {
                    dfd.reject();
                }
            }
        };
        xobj.send(null);
        return dfd.promise();
    }

    function addScript(url) {
        var sdkPath = findSDKPath(IBMMFPF_SDK_NAME);
        var script   = document.createElement("script");
        script.src   = sdkPath + url;
        document.head.appendChild(script);

        // remove from the dom
        //document.head.removeChild(document.head.lastChild);
        return true;
    }

    this.wlReachableCallback = function () {};

    // .................... Public methods ...........................

    this.__networkCheckTimeout = function () {
        if (!window.connectivityCheckDone) {
            WL.Logger.debug('Connectivity check has timed out');
            window.connectivityCheckDone = true;
        }
    };

    /**
     * @param {Object}
     *            value
     * @return value if defined or null otherwise.
     */
    this.safeGetValue = function (value) {
        if (!WLJSX.Object.isUndefined(value)) {
            return value;
        } else {
            return null;
        }
    };


    this.formatString = function () {
        var resStr = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'g');
            resStr = resStr.replace(re, arguments[i]);
        }
        return resStr;
    };

    this.loadLibrary = function(libPath, amdCallback){
        var sdkPath = findSDKPath(IBMMFPF_SDK_NAME);

        var path = sdkPath+libPath;
        /*For wi 119215 - dependent plugins jssha,sjcl and promiz are being installed into a web app's node_modues folder with newer node versions. 
	Our build systems though still use older node versions hence the check to see if the dependencies are present in the  
	<web-app/node_modules/ibm-mfp-web-sdk/node_modules> folder(for older node versions), if not then load the files from the <web-app/node_modules> 
	folder*/
        checkForFile(sdkPath+libPath.replace("node_modules",".."))
        .then(function(msg){
            libPath = libPath.replace("node_modules","..");
            path = sdkPath+libPath; 
            if (('function' === typeof define) && (define['amd'])){
                require([path], amdCallback); 
            } else {
                addScript(libPath);
            }
        },function(error){
        	if (('function' === typeof define) && (define['amd'])){
			    require([path], amdCallback); 
		} else {
                	addScript(libPath);
		}
        });
    }

    var __deviceLocale;
    this.setLocalization = function () {
        var dfd = WLJQ.Deferred();

        var deviceLocale = WL.App.__getDeviceLocale();
        //The json containing user facing messages needs to be loaded and assigned only once.
        //Check if the object has already been assigned.Else re-use the existing object
        if (typeof WL.ClientMessages === 'undefined' || __deviceLocale !== deviceLocale) {
            __deviceLocale = deviceLocale;
            WL.ClientMessages = undefined;
            // In web (mobile web and desktop web), we inject the proper WL.ClientMessages in the HTML file at the server,
            // so we would never get into this conditional code block.  This is a good thing!  No extra round trips to the
            // server to pick up language files.  We trust the web browser's Accept-Language header in those environments.
            // Ensure that the messages.json files are placed in lang folders or lang-COUNTRYCODE folders.
            // Ensure that the separator is '-' and not '_' as the RPX tool places translated files into folders with '-'.
            var lang = deviceLocale.substring(0, 2);
            var region = deviceLocale.substring(3);
            deviceLocale = lang.toLowerCase();
            if (region) {
                deviceLocale += '-' + region.toUpperCase();
            }

            // special fallback for zh languages (see 41026)
            if (deviceLocale.indexOf('zh-HANS') !== -1) {
                deviceLocale = 'zh';
            } else if (deviceLocale.indexOf('zh-HANT') !== -1 || deviceLocale.indexOf('zh-HK') !== -1) {
                deviceLocale = 'zh-TW';
            }

            try {
                // Get the file from which to pickup the user visible messages.
                if (typeof WL.ClientMessages === 'undefined') {
                    // find sdk path first, because messages.json is relative to it.
                    var ibmmfpsdk = findSDKPath(IBMMFPF_SDK_NAME);
                    if (!ibmmfpsdk) {
                        WL.Logger.error('could not find ' + IBMMFPF_SDK_NAME + '.js, please rename MobileFirst SDK name to: ' + IBMMFPF_SDK_NAME + '.js');
                        return dfd.reject()
                    }
                    // prefer deviceLocale, then deviceLanguage, then English, in that order
                    loadWLClientMessages(ibmmfpsdk, deviceLocale).always(function() {
                        // we don't have a deviceLanguage translation file, try deviceLanguage
                        if (typeof WL.ClientMessages === 'undefined') {
                            loadWLClientMessages(ibmmfpsdk, lang).always(function() {
                                // fall back to English
                                if (typeof WL.ClientMessages === 'undefined') {
                                    loadWLClientMessages(ibmmfpsdk, 'en').always(function(){dfd.resolve()});
                                } else {
                                    dfd.resolve();
                                }
                            });
                        } else {
                            dfd.resolve();
                        }
                    });
                } else {
                    dfd.resolve();
                }
            } catch (e) {
                WL.Logger.error(e);
            }
        }
        return dfd.promise();
    };

    this.getLanguageDirectionality = function (lang) {
        if (typeof lang !== 'string') {
            lang = WL.App.__getDeviceLanguage();
        }
        for (var i = 0; i < WL.Language.LANGUAGES_RTL.length; i++) {
            if (lang.indexOf(WL.Language.LANGUAGES_RTL[i]) !== -1) {
                return WL.Language.DIRECTION_RTL;
            }
        }
        return WL.Language.DIRECTION_LTR;
    };

    /*
     * Adds the URL prefix to the URL if not already added and
     * WL.StaticAppProps.WORKLIGHT_ROOT_URL is set This is used when working
     * with desktop gadget and we need a static URL
     */
    this.createAPIRequestURL = function (path) {
        return path;
    };

    /*
     * Extends the target object with the source object only with fields and
     * methods that do not already exist on the target.
     */
    this.extend = function (target, source) {
        target = WLJSX.Object.extend(WLJSX.Object.clone(source), target);
        return target;
    };

    /*
     * extracts the host part of a url. For example, for the input
     * url="https://212.10.0.15:8888/application/service/?arg=blue", the result
     * would be "212.10.0.15".
     */
    this.getHostname = function (url) {
        var re = new RegExp('^(?:f|ht)tp(?:s)?://([^/:]+)', 'im');
        return url.match(re)[1].toString();
    };

    this.dispatchWLEvent = function (eventName, data) {
        // ie (WP7/VISTA) support custom event
        if (typeof document.createEvent === 'undefined') {
            WLJSX.trigger(document, eventName);
        } else {
            var e = document.createEvent('Events');
            e.initEvent(eventName, false, false);
            if (data !== null) {
                e.data = data;
            }
            document.dispatchEvent(e);
        }
    };


    /**
     * Version compares 2 version numbers in strings to the length of the maxLength parameter
     * @param {string} x
     * @param {string} y
     * @param {string} maxLength
     * @return -1 if x>y, 1 if x<y, or 0 if equal
     */
    this.versionCompare = function (x, y, maxLength) {
        var i = 0,
        /*jshint camelcase:false*/
            x_components = x.split('.'),
            y_components = y.split('.'),
            len = Math.min(x_components.length, y_components.length),
            maxLng = maxLength || 5;

        if (x === y) {
            return 0;
        }

        for (i = 0; i < len; i += 1) {

            // x > y
            if (parseInt(x_components[i], 10) > parseInt(y_components[i], 10)) {
                return 1;
            }

            // y > x
            if (parseInt(x_components[i], 10) < parseInt(y_components[i], 10)) {
                return -1;
            }

            if (i >= maxLng) {
                break; //check only up to maxLength+1 parts
            }

            // If one's a prefix of the other, the longer one is greater.
            if (x_components.length > y_components.length) {
                return 1;
            }

            if (x_components.length < y_components.length) {
                return -1;
            }


        }

        return 0; //same
    };
}; // End WL.Utils


/*jshint newcap:false*/
__WL.prototype.Utils = new __WLUtils();
WL.Utils = new __WLUtils();

// Load promiz.js script
if ( typeof Promise !== 'function' ) {
	WL.Utils.loadLibrary('node_modules/promiz/promiz.min.js', function(promiz){});
}

// Load indexedDB shim (and force)
//WL.Utils.loadIndexedDBShim();
// Load SHA library
WL.Utils.loadLibrary('node_modules/sjcl/sjcl.js', function(sjcl){});
WL.Utils.loadLibrary('node_modules/jssha/src/sha.js', function(sha){window.jsSHA = sha;});




/**
 * ================================================================= 
 * Source file taken from :: wlrequest.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WLJSX, WL, WLAuthorizationManager, WL_*/

// Overwriting the prototype.js isSameOrigin method -
// Updated the original method by wrapping the return statement with try/catch
// because it does not work properly in desktop applications such as Vista
// (document.domain is undefined).
WLJSX.Ajax.Request.prototype.isSameOrigin = function () {

    /*jshint strict:false*/

    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    try {
        var url = location.protocol + '//' + document.domain;
        if (location.port) {
            url += ':' + location.port;
        }
        return (!m || (m[0] === url));
    } catch (e) {
        return true;
    }
};


WL.Response = WLJSX.Class.create({
    invocationContext: null,
    status: -1,
    errorCode: null,
    errorMsg: null,
    responseText: '',
    responseJSON: '',
    initialize: function (transport, invocationContext) {

        /*jshint strict:false*/
        this.responseHeaders = {};
        if (transport !== null && typeof transport.status !== 'undefined') {
            this.status = (transport.status || 200);
            this.responseHeaders = {};

            try {
                this.responseText = WLJSX.String.interpret(transport.responseText);
            } catch (e) {

            }

            try {
                this.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
            } catch (e) {

            }

            if (typeof (transport.responseJSON) !== 'undefined' && transport.responseJSON !== null) {
                this.errorCode = transport.responseJSON.errorCode;
                if (typeof (transport.responseJSON.error) !== 'undefined' && transport.responseJSON.error !== null) {
                    this.errorMsg = transport.responseJSON.error;
                } else {
                    this.errorMsg = transport.responseJSON.errorMsg;
                }
            }

            if (typeof (transport.getAllResponseHeaders) === 'function') {
                var responseHeadersString = transport.getAllResponseHeaders();
                this.responseHeaders = WLJSX.String.parseResponseHeaders(responseHeadersString);
            }
        }
        this.invocationContext = invocationContext;
    },

    getHeaderNames: function () {

        /*jshint strict:false*/

        var headerNames = [];
        for (var headerName in this.responseHeaders) {
            if (true) { // thanks jshint
                headerNames.push(headerName);
            }
        }
        return headerNames;
    },

    getAllHeaders: function () {

        /*jshint strict:false*/

        return this.responseHeaders;
    },

    getHeader: function (name) {
        /*jshint strict:false*/
        if (name === null || typeof (name) === 'undefined') {
            return null;
        }

        return this.responseHeaders[name];
    }
});

WL.FailResponse = WLJSX.Class.create({
    invocationContext: null,
    status: -1,
    errorCode: null,
    errorMsg: null,
    initialize: function (transport, invocationContext) {
        /*jshint strict:false*/
        if (transport !== null && typeof transport.status !== 'undefined') {
            this.status = (transport.status || 200);
            if (transport.responseJSON !== null && typeof (transport.responseJSON) !== 'undefined') {
                this.errorCode = transport.responseJSON.errorCode;
                this.errorMsg = transport.responseJSON.errorMsg;
            }
        }
        this.invocationContext = invocationContext;
    }
});


/*
 * Piggybackers should have the following optional properties:
 *  - a function called processOptions(options) (called before the request is sent)
 *  - a function called onSuccess(transport, options)
 *  - a function called onFailure(transport, options)
 */
window.WLJSX.Ajax.WlRequestPiggyBackers = [];

/*
 * A wrapper for the prototype Ajax.Request. The wrapper is responsible for: 1.
 * Add double-cookie headers to the request. 2. Parse cookies from the response.
 * 3. Invoke the authenticator on demand.
 */
window.WLJSX.Ajax.WLRequest = WLJSX.Class.create({
    instanceId: null,
    wlAnswers: {},
    postAnswerRealm: '',
    MAX_AUTH_HEADER_SIZE: 900,
    MAX_TOTAL_HEADER_SIZE: 3000,
    MAX_CONFLICT_ATTEMPTS: 7,

    initialize: function (url, options) {
        /*jshint strict:false*/
        this.options = WLJSX.Object.clone(WLJSX.Ajax.WLRequest.options);

        WLJSX.Object.extend(this.options, options || {});
        this.url = url;
        this.callerOptions = options;
        this.isTimeout = false;
        this.timeoutTimer = null;
        this.conflictCounter = 0;

        // this.stopPolling = false;
        this.options.onSuccess = this.onWlSuccess.bind(this);
        this.options.onFailure = this.onWlFailure.bind(this);

        // Handle Exceptions
        this.options.onException = this.onException.bind(this);

        // 0 is the response status when the host is unresponsive
        // (server is
        // down)
        this.options.on0 = this.onUnresponsiveHost.bind(this);

        // Appending the cookie headers to possibly existing ones.
        // If you pass additional headers make sure to use objects of
        // name-value
        // pairs (and not arrays).
        // this.options.requestHeaders =
        // Object.extend(CookieManager.createCookieHeaders(),
        // this.options.requestHeaders || {});
       // this.options.requestHeaders = WL.CookieManager.createCookieHeaders();

        // For GET requests - preventing Vista from returning cached GET
        // ajax
        // responses.
        // For POST requests - preventing Air from sending a GET request
        // if the
        // request has no body (even if
        // it's declared as a POST request).
        if (WLJSX.Object.isUndefined(this.options.parameters) || this.options.parameters === null || this.options.parameters === '') {
            this.options.parameters = {};
        }

        // call piggybackers to modify options
        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.processOptions) === 'function') {
                piggybacker.processOptions(this.options, url);
            }
        }
        this.wlAnswers = {};
        this.sendRequest();
    },

    /*
     * We need to know ahead of time, for challenge processing if extra work needs to be done if we try and send
     * a message which headers are too big.
     */
    createRequestHeaders: function () {
        /*jshint strict:false*/
        var requestHeaders = {};
        // requestHeaders = WL.CookieManager.createCookieHeaders();
        // requestHeaders['x-wl-app-version'] = WL.StaticAppProps.APP_VERSION;

        // add Authorization header from wlAnswres
        if (typeof this.wlAnswers !== 'undefined') {
            var authJson = {};
            var shouldSendAuthHeader = false;
            for (var realm in this.wlAnswers) {
                if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                    var answer = '';
                    /*jshint maxdepth:4*/
                    try {
                        answer = JSON.parse(this.wlAnswers[realm]);
                    } catch (e) {
                        answer = this.wlAnswers[realm];
                    }
                    // Validate we are working with standrad JSON
                    if (typeof answer === 'string' && typeof JSON === 'undefined') {
                        authJson[realm] = answer.indexOf('"') === 0 ? answer : '"' + answer + '"';
                    } else {
                        authJson[realm] = answer;
                    }
                    shouldSendAuthHeader = true;
                }
            }
            if (shouldSendAuthHeader === true) {
                this.options.parameters.challengeResponse = authJson;
            }
        }

        // add headers from WL.Client.globalHeaders in case the Single (native) HTTP Client is disabled;
        // otherwise the headers will be added in native code
        this.__addGlobalHeaders(requestHeaders);

        var optionalHeaders = this.options.optionalHeaders;
        if (typeof optionalHeaders !== 'undefined' && optionalHeaders !== null) {
            for (var headerName in optionalHeaders) {
                if (Object.prototype.hasOwnProperty.call(optionalHeaders, headerName)) {
                    requestHeaders[headerName] = optionalHeaders[headerName];
                }
            }
        }
        return requestHeaders;
    },

    // automaticResend is to be used when comming from submitAnswer or removeExpectedAnswer, we need to know if we should handle the
    // request differently (add it to the challangeHandler wiating list).
    sendRequest: function (requestHeaders) {
        /*jshint strict:false*/
        var shouldPostAnswers = false;

        console.log('Request [' + this.url + ']');

        //add headers
        if (typeof (requestHeaders) === 'undefined') {
            this.options.requestHeaders = this.createRequestHeaders();
        } else {
            this.options.requestHeaders = requestHeaders;
        }

        var postAnswersOptions = {};

        //check if we need to send the auth header in the body, becuase it is too large or the total header size is too large
        var allHeadersSize = WLJSX.Object.toJSON(this.options.requestHeaders).length;
        var authHeaderSize = typeof (this.options.requestHeaders.Authorization) === 'undefined' ? -1 :
            WLJSX.Object.toJSON(this.options.requestHeaders.Authorization).length;

        if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize > -1) {

            postAnswersOptions = WL.Utils.extend(postAnswersOptions, this.options);
            postAnswersOptions.requestHeaders = this.options.requestHeaders;
            postAnswersOptions.onSuccess = this.onPostAnswersSuccess.bind(this);
            postAnswersOptions.onFailure = this.onPostAnswersFailure.bind(this);

            postAnswersOptions.postBody = this.options.requestHeaders.Authorization;
            postAnswersOptions.requestHeaders.Authorization = 'wl-authorization-in-body';
            // Get HTTP request cannot hold a body
            postAnswersOptions.method = 'post';

            this.wlAnswers = {};
        }

        if (typeof (this.options.requestHeaders.Authorization) !== 'undefined') {
            //init the wlAnswer map...
            this.wlAnswers = {};
        }

        if (this.options.timeout > 0) {
            this.timeoutTimer = window.setTimeout(this.handleTimeout.bind(this), this.options.timeout);
        }

        var thisRequest = this;
        __sendRequest();
        /*jshint latedef: false */
        function __sendRequest() {
            new WLJSX.Ajax.Request(thisRequest.url, thisRequest.options);
        }

    },

    __addGlobalHeaders: function (requestHeaders) {
        /*jshint strict:false*/
            if ((typeof WL.Client.__globalHeaders !== 'undefined') && (WL.Client.__globalHeaders !== null)) {
                for (var headerName in WL.Client.__globalHeaders) {
                    /*jshint maxdepth:4*/
                    if (Object.prototype.hasOwnProperty.call(WL.Client.__globalHeaders, headerName)) {
                        requestHeaders[headerName] = WL.Client.__globalHeaders[headerName];
                    }
                }
            }
    },

    onSuccessParent: function (transport, par) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
        var containsChallenges = WL.Client.checkResponseForChallenges(this, transport, par);

        return containsChallenges;
    },

    /*
     * Custom success handelr for PostAnswer Request, it will not send the onSuccess to the application code,
     * because this is not a resend but a swpecial request, and the user should not be informed about it.
     */
    onPostAnswersSuccess: function (transport) {
        /*jshint strict:false*/
        this.onSuccessParent(transport, this.postAnswerRealm);
        this.postAnswerRealm = '';
    },

    /**
     * when a onWlSuccess arrives but it came from an response to a
     * postAnsweresRequest then we should not continue the onSucess any
     * further
     *
     * @param transport
     * @param responseToPostAnswers
     */
    onWlSuccess: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        var containsChallenges = this.onSuccessParent(transport);

        if (!containsChallenges) {
            this.onSuccess(transport);
        }
    },

    onSuccess: function (transport) {
        /*jshint strict:false*/
        if (transport.getAllHeaders() !== null) {
            // Handle Cookies:
            var headers = transport.getAllHeaders().split('\n');
            WL.CookieManager.handleResponseHeaders(headers);
        }

        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.onSuccess) === 'function') {
                piggybacker.onSuccess(transport, this.options);
            }
        }


        if (typeof (this.callerOptions.onSuccess) === 'function') {
            this.callerOptions.onSuccess(transport);
        }
    },

    /*
     * Custom failure handelr for PostAnswer Request, it will remove the original request from waiting list, and not send the onFailure to the application code,
     * because this is not a resend but a special request, and the user should not be informed about it.
     *
     * When a message arrives from a postAnswerRequert ('authenticate') and it is a 401,403, we need to remove it from the waitinglist so there wont be any resend on it,
     * because if has accepts in it, it will trigger the resend.
     */
    onPostAnswersFailure: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
        WL.Client.removeFromWaitingListOnPostAnsweresWlReponse(transport, this, this.postAnswerRealm);
        WL.Client.checkResponseForChallenges(this, transport, this.postAnswerRealm);
        this.postAnswerRealm = '';
    },

    onWlFailure: function (transport) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();
            if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
                var allHeaders = transport.getAllHeaders();
                if (WLJSX.Object.isString(allHeaders)) {
                    var headers = allHeaders.split('\n');
                    WL.CookieManager.handleResponseHeaders(headers);
                }
            }
        if (transport.status === 409 && WLAuthorizationManager.isAuthorizationRequired(transport.status, transport.getAllResponseHeaders()) && this.conflictCounter++ < this.MAX_CONFLICT_ATTEMPTS) {
            this.sendRequest();
        } else {
            var containsChallenges = WL.Client.checkResponseForChallenges(this, transport);
            if (!containsChallenges) {
                this.onFailure(transport);
            }
        }
    },

    onFailure: function (transport) {
        /*jshint strict:false*/
        // sometimes onFailure is called with a dummy transport object
        // for example when an authentication timeout occurs.
        if (transport && transport.getAllHeaders && transport.getAllHeaders() !== null) {
            var allHeaders = transport.getAllHeaders();
            if (WLJSX.Object.isString(allHeaders)) {
                var headers = allHeaders.split('\n');
                WL.CookieManager.handleResponseHeaders(headers);
            }
        }

        if (transport.responseJSON === null) {
            try {
                transport.responseJSON = WLJSX.String.evalJSON(transport.responseText, true);
            } catch (e) {
                transport.responseJSON = {
                    errorCode: WL.ErrorCode.UNEXPECTED_ERROR,
                    errorMsg:'unexpected error'
                };
            }
        }


        var callbackHandler = this.getCallbackForErrorCode(transport.responseJSON.errorCode);

        if (callbackHandler) {
            callbackHandler(this, transport);
        }

        if (transport.responseJSON.errorCode === WL.ErrorCode.USER_INSTANCE_ACCESS_VIOLATION) {
            WLJSX.Ajax.WLRequest.options.onAuthentication(this, transport);
            return;
        }
        console.log('[' + this.url + '] failure. state: ' + transport.status + ', response: ' + transport.responseJSON.errorMsg);

        for (var i = 0; i < WLJSX.Ajax.WlRequestPiggyBackers.length; i++) {
            var piggybacker = WLJSX.Ajax.WlRequestPiggyBackers[i];
            if (typeof (piggybacker.onFailure) === 'function') {
                piggybacker.onFailure(transport, this.options);
            }
        }


        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    getCallbackForErrorCode: function (errorCode) {
        /*jshint strict:false*/
        return this.options['on' + errorCode];
    },

    onException: function (request, ex) {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();

        if (typeof (this.options.onAuthException) === 'function') {
            this.options.onAuthException(request, ex);
        }

        console.log('[' + this.url + '] exception.', ex);
        // Workaround for prototype's known behavior of swallowing
        // exceptions.
        /*jshint -W068*/
        (function () {
            throw ex;
        }).defer();
    },

    onUnresponsiveHost: function () {
        /*jshint strict:false*/
        if (this.isTimeout) {
            return;
        }
        this.cancelTimeout();

        console.log('[' + this.url + '] Host is not responsive.');
        var transport = {};
        transport.status = 0;
        transport.responseJSON = {
            errorCode: WL.ErrorCode.UNRESPONSIVE_HOST,
            errorMsg: 'unresponsive host'
        };

        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    handleTimeout: function () {
        /*jshint strict:false*/
        console.log('Request timeout for [' + this.url + ']');
        this.cancelTimeout(); // cancel all other timers (if there are
        // any)
        this.isTimeout = true;

        var transport = {};

        //changes made

        /*transport.responseJSON = {
         errorCode : WL.ErrorCode.REQUEST_TIMEOUT,
         errorMsg : WL.Utils
         .formatString(
         'Request timed out for {0}. Make sure the host address is available to the app (especially relevant for Android and iPhone apps).',
         this.url)
         };*/
        transport.responseJSON = {
            errorCode: WL.ErrorCode.REQUEST_TIMEOUT,
            errorMsg: WL.Utils
                .formatString(
                    'timeout',
                    this.url)
        };
        if (typeof (this.callerOptions.onFailure) === 'function') {
            this.callerOptions.onFailure(transport);
        }
    },

    cancelTimeout: function () {
        /*jshint strict:false*/
        if (this.timeoutTimer !== null) {
            window.clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
            this.isTimeout = false;
        }
    },

    checkIfCanResend: function () {
        /*jshint strict:false*/
        if (typeof this.wlAnswers === 'undefined') {
            return true;
        }

        for (var realm in this.wlAnswers) {
            if (Object.prototype.hasOwnProperty.call(this.wlAnswers, realm)) {
                if (this.wlAnswers[realm] === null) {
                    return false;
                }
            }
        }

        return true;
    },

    // initialize the wlAnswer table with realm = null values
    setExpectedAnswers: function (realms) {
        /*jshint strict:false*/
        for (var realm in realms) {
            if (Object.prototype.hasOwnProperty.call(realms, realm)) {
                this.wlAnswers[realm] = null;
            }
        }
    },

    submitAnswer: function (realm, answer) {
        /*jshint strict:false*/
        this.wlAnswers[realm] = answer;
        if (this.checkIfCanResend()) {
            this.handleResendOrSendPostAnswers(realm);
        }
    },

    removeExpectedAnswer: function (realm) {
        /*jshint strict:false*/
        delete this.wlAnswers[realm];
        if (this.checkIfCanResend()) {
            this.handleResendOrSendPostAnswers(realm);
        }
    },

    /*
     * If the total header size is larger than MAX_TOTAL_HEADER_SIZE or the auth header is larger than MAX_AUTH_HEADER_SIZE
     * we need to put the original request into the waiting list, because we will send a special "authenticate" request that will have the
     * Autherization header in the body.
     *
     */
    handleResendOrSendPostAnswers: function (realm) {
        /*jshint strict:false*/
        var headers = this.createRequestHeaders();

        var moveToWaitingList = false;
        var allHeadersSize = WLJSX.Object.toJSON(headers).length;
        var authHeaderSize = typeof (headers.Authorization) === 'undefined' ? -1 :
            WLJSX.Object.toJSON(headers.Authorization).length;

        if ((allHeadersSize > this.MAX_TOTAL_HEADER_SIZE || authHeaderSize > this.MAX_AUTH_HEADER_SIZE) && authHeaderSize > -1) {
            moveToWaitingList = true;
        }

        if (moveToWaitingList) {
            //iterate over all the challageHandlers
            this.postAnswerRealm = realm;
            var handler = WL.Client.__chMap[realm];
            if (typeof (handler) !== 'undefined') {
                handler.moveToWaitingList(this);
            }
        }
        this.sendRequest(headers);
    }


});

// WLRequest default options:
WLJSX.Ajax.WLRequest.options = {
    method: 'post',
    asynchronous: true,
    encoding: 'UTF-8',
    parameters: '',
    evalJSON: true,
    timeout: 60 * 1000,
    onAuthentication: null,
    isAuthResponse: null
};

/**
 * ================================================================= 
 * Source file taken from :: wlauthorizationmanager.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WLJQ, WLJSX, cordova, WLAuthorizationManager, WLIndexDB, WLConfig, WLBrowserManager, WLCrypto, WLDAO */

WLAuthorizationManager = (function () {

    /*jshint strict:false, maxparams:4*/

    var WL_AUTHORIZATION_HEADER = 'Authorization';
    var PARAM_CLIENT_ID_KEY = 'client_id';
    var PARAM_DEVICE_ID_KEY = 'device_id';
    var PARAM_SCOPE_KEY = 'scope';
    var INVALID_CLIENT_ERROR = 'INVALID_CLIENT_ID';
    var CHALLENGE_RESPONSE_KEY = 'challengeResponse';
    var WWW_AUTHENTICATE_HEADER = 'WWW-Authenticate';
    var MFP_CONFLICT_HEADER = 'MFP-Conflict';
    var LOGOUT_ERROR_MSG = 'Cannot logout while authorization request is in progress.';
    var LOGIN_ALREADY_IN_PROCESS = 'Login already in process.';
    var AZ_REDIRECT_URI = '/az/v1/authorization/redirect';
    var JWT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    var DEFAULT_SCOPE = 'RegisteredClient';
    var loginTimeout;
    var MIN_LOGIN_TIMEOUT = 5*1000;

    // Store the server clock to be synchronize with the server time
    var SERVER_RELATIVE_TIME = 0;
    var authorizationAlreadyInProgress = false;


    // The options for storing in the WL.DAO
    var scopeToTokenMappingKey = 'com.mfp.scope.token.mapping';
    var resourceToScopeMappingKey = 'com.mfp.resource.scope.mapping';
    var clientApplicationDataKey = 'com.mfp.oauth.application.data';
    var clientIdKey = 'com.mfp.oauth.clientid';
    var analyticsURLKey = 'com.worklight.oauth.analytics.url';
    var analyticsApiKey = 'com.worklight.oauth.analytics.api.key';
    var analyticsUserNameKey = 'com.worklight.oauth.analytics.username';
    var analyticsUserPasswordKey = 'com.worklight.oauth.analytics.password';
    var mappingOptions = {'session' : true};

    var __logAndThrowError = function(msg, callerName) {
        if (WL.Logger) {
            if (callerName) {
                msg = 'Invalid invocation of method ' + callerName + '; ' + msg;
            }
            WL.Logger.error(msg);
        }

        throw new Error(msg);
    };

    /*
    Adds an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function addItemToMap(mapId, key, value) {
        var map = WL.DAO.getItem(mapId, mappingOptions) || {};
        map[key] = value;
        WL.DAO.setItem(mapId, map, mappingOptions);
    }

    /*
     Gets an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function getItemFromMap(mapId, key) {
        var map = WL.DAO.getItem(mapId, mappingOptions) || {};
        return map[key];
    }

    /*
     Removes an item to a specific mapping (ResourceScope/ScopeToken)
     */
    function removeItemFromMap(mapId, key) {
        addItemToMap(mapId, key, null);
    }

    /*
     Clears the Mappings
     */
    function clearMappings() {
       WL.DAO.removeItem(scopeToTokenMappingKey, mappingOptions);
       WL.DAO.removeItem(resourceToScopeMappingKey, mappingOptions);
       //delete messageId that was received during remote disable notify challenge
       WL.DAO.removeItem(WL.Client.getMessageID());
    }

    function getAccessTokenForScope(scope) {
        var sortedScope = sortScopeAlphabetically(scope);
        var accessToken = getItemFromMap(scopeToTokenMappingKey, sortedScope);

        if(!__isUndefinedOrNull(accessToken) && isAccessTokenExpired(accessToken)) {
            // Remove
            removeItemFromMap(scopeToTokenMappingKey, sortedScope);
            accessToken = null;
        }
        return accessToken;
    }

    function isAccessTokenExpired(accessToken) {
        var currentTime = new Date().getTime();
        return currentTime >= accessToken.expiration;
    }

    function saveAccessToken(scope, accessToken) {
        var sortedScope = sortScopeAlphabetically(scope);
        addItemToMap(scopeToTokenMappingKey, sortedScope, accessToken);
    }

    var __getCachedScopeByResource = function (request) {
        var url = request.requestOptions.url;
        var method = request.requestOptions.method;
        var key = url + '_' + method;
        return getItemFromMap(resourceToScopeMappingKey, key);
    };

    var __getCachedAccessToken = function (scope) {
        if(__isUndefinedOrNull(scope)) {
            return null;
        }
        return getAccessTokenForScope(scope);
    };

    var clearAccessToken = function (accessToken) {
        var scope = accessToken.scope;
        saveAccessToken(scope, null);
    };

    var __getAuthorizationScope = function (responseAuthenticationHeader) {
        if (!__isUndefinedOrNull(responseAuthenticationHeader)) {
            var headerParts = responseAuthenticationHeader.split(',');
            for (var i = 0; i < headerParts.length; i++) {
                var headerElement = headerParts[i];
                if (headerElement.indexOf('scope=') >= 0) {
                    var scope = headerElement.split('=')[1].replace(/\"/g, '');
                    return scope;
                }
            }
        }

        return null;
    };

    var obtainAuthHeaderCallbacks = [];
    /**
     * Obtains authorization header for specified scope.
     * @param scope Specifies the scope to obtain an authorization header for. Can be null or undefined.
     * @returns A promise object that should be used to receive the authorization header asynchronously. The header is send as a string
     * Example:
     * WLAuthorizationManager.obtainAccessToken(scope)
     * .then (
     *    function(header) {
   *      // success flow with the header
   *    },
     *    function(error) {
   *      // failure flow
   *    }
     *   )
     * };
     */
    var obtainAccessToken = function (scope) {
        var dfd = WLJQ.Deferred();
        if (__isUndefinedOrNull(scope)) {
            scope = DEFAULT_SCOPE;
        }
        scope = sortScopeAlphabetically(scope);
        try {
            var accessToken = __getCachedAccessToken(scope);
            if (!__isUndefinedOrNull(accessToken)) {
                dfd.resolve(accessToken);
            } else {

                // obtainAuthHeaderCallbacks is an array of this kind objects; "clientId" will be updated in case of "unknown client" error
                // the "scope" identifies the current "deferred" object
                var callbackObj = {
                    clientId: null,
                    scope: scope,
                    deferred: dfd
                };

                obtainAuthHeaderCallbacks.push(callbackObj);

                // If there is authorization process in progress, put incoming requests to queue
                if (isAuthorizationInProgress()) {
                    return dfd.promise();
                }

                if(!shouldRegister()) {
                    startAuthorizationProcess(scope);
                } else {
                    __invokeInstanceRegistration().then(
                        function(){
                            startAuthorizationProcess(scope);
                        },
                        function(error) {
                            __deleteAuthData();
                            rejectAllCallbacks(error);
                        });
                }
            }
        } catch (e) {
            WL.Logger.error('failed obtaining token, reason: ' + JSON.stringify(e));
            processObtainAccessTokenCallbacks(null, scope, JSON.stringify(e), false);
        }
        return dfd.promise();
    };

    // this flag tells whether we have handled the invalid client error to prevent infinite loop
    var invalidClientReceived = false;

    function startAuthorizationProcess(scope) {
        // invoke authorization request with specified scope
        invokePreAuthorizationRequest(scope, null)
            .then(
                function () {
                    // On preAuth success continue to authorization endpoint
                    __invokeAuthorizationRequestForScope(scope)
                        .then(
                            function (code) {
                                // authorization request succeeded, send to token endpoint with grant-code
                                invokeTokenRequest(code)
                                    .then(
                                        function(accessToken) {
                                            // We have the access token, save it and call next in the queue
                                            saveAccessToken(scope, accessToken);
                                            processObtainAccessTokenCallbacks(__getClientId(), scope, accessToken, true);

                                        },
                                        function(error) {
                                            onAuthorizationProcessFailure(error, scope, __getClientId(), {
                                                retryFunction: startAuthorizationProcess
                                            });
                                        });
                            },
                            function(error) {
                                onAuthorizationProcessFailure(error, scope, __getClientId(), {
                                    retryFunction: startAuthorizationProcess
                                });
                            });

                },
                function(error) {
                    onAuthorizationProcessFailure(error, scope, __getClientId(), {
                        retryFunction: startAuthorizationProcess
                    });
                });
    }

    function isUnknownClientError(error) {
        if (!__isUndefinedOrNull(error) && typeof (error.status) !== 'undefined' &&
            error.status === 400 && !__isUndefinedOrNull(error.responseJSON) &&
            /*jshint camelcase:false*/
            error.responseJSON.errorCode === INVALID_CLIENT_ERROR) {
            return true;
        }

        return false;
    }

    function processObtainAccessTokenCallbacks(clientId, scope, response, isSuccess) {
        var indexesToRemove = [];
        var objectsToNotify = [];

        // loop over callbacks in queue and notify those with specified scope; store appropriate indexes for later removal
        for (var i = 0; i < obtainAuthHeaderCallbacks.length; i++) {
            var callbackObj = obtainAuthHeaderCallbacks[i];
            if (scope === callbackObj.scope) {
                objectsToNotify.push(callbackObj);
                indexesToRemove.push(i);
            }
        }

        // remove processed callbacks
        for (var j = indexesToRemove.length - 1; j >= 0; j--) {
            obtainAuthHeaderCallbacks.splice(indexesToRemove[j], 1);
        }

        // if there is at least one object in the queue, send auth request for its scope
        if (obtainAuthHeaderCallbacks.length > 0) {
            startAuthorizationProcess(obtainAuthHeaderCallbacks[0].scope);
        }

        // notify objects. This must be done after splice, because it could be that the code being notified
        // is supposed to send other requests requiring authorization. It means that the callback array
        // must be cleared before notifications are sent.
        for (var k = 0; k < objectsToNotify.length; k++) {
            isSuccess ? objectsToNotify[k].deferred.resolve(response) : objectsToNotify[k].deferred.reject(response);
        }
    }

    function rejectAllCallbacks(error) {
        var objectsToNotify = obtainAuthHeaderCallbacks.slice();
        obtainAuthHeaderCallbacks = [];
        authorizationAlreadyInProgress = false;
        // this method is called upon unrecoverable error; reject all and clear the queue
        for (var n = 0; n < objectsToNotify.length; n++) {
            objectsToNotify[n].deferred.reject(error);
        }
    }

    function updateClientIds(newClientId) {
        // update all callback objects with the new client id; called after processing of "unknown client', when the new
        // client id has been received
        for (var i = 0; i < obtainAuthHeaderCallbacks.length; i++) {
            obtainAuthHeaderCallbacks[i].clientId = newClientId;
        }
    }

    var clientInstanceIdCallbacks = [];

    function processClientInstanceCallbacks(wlresponse, isSuccess) {
        var objectsToNotify = clientInstanceIdCallbacks.slice();
        clientInstanceIdCallbacks = [];

        for (var i = 0; i < objectsToNotify.length; i++) {
            isSuccess ? objectsToNotify[i].resolve(wlresponse) : objectsToNotify[i].reject(wlresponse);
        }

    }

    var __deleteCachedScopeByResource = function (request) {
        var url = request.requestOptions.url;
        var method = request.requestOptions.method;
        var key = url + '_' + method;
        removeItemFromMap(resourceToScopeMappingKey, key);
    };

    // send a request using WL.Request to preAuthorization end point with specified clientId and scope
    function invokePreAuthorizationRequest(scope, credentials) {
        var dfd = WLJQ.Deferred();
        var requestOptions = createCallbacksForPreAuth(dfd);
        requestOptions.parameters[PARAM_CLIENT_ID_KEY] = __getClientId();

        if (!__isUndefinedOrNull(scope)) {
            requestOptions.parameters[PARAM_SCOPE_KEY] = scope;
        }
        // For login requests
        if (!__isUndefinedOrNull(credentials)) {
            var challengeResponse = {};
            challengeResponse[scope] = credentials;
            requestOptions.parameters[CHALLENGE_RESPONSE_KEY] = challengeResponse;
                
        if (!__isUndefinedOrNull(loginTimeout)) {
            requestOptions.timeout = loginTimeout;
        }
        
        }

        if(WL.Config.__getSDKProtocolVersion().sdk_protocol_version >= 2 && WL.Crypto.cryptoFlag == true){
            WL.CertManager.getEncryptedDeviceID().then(function (data) {
                requestOptions.parameters[PARAM_DEVICE_ID_KEY] = data;
                makeRequest('preauth/v1/preauthorize', requestOptions, true);
            }, function (e) {
                console.error(e);
            });
        } else{
            makeRequest('preauth/v1/preauthorize', requestOptions, true);
        }

        return dfd.promise();
    }

    var AUTHENTICATION_SERVER_VERSION_KEY = "server_version";
    var MINIMUM_SERVER_SUPPORTED = "8.0.2017020513";
    var GREATER_THAN_IFIX = "8.0.0.0-IF201701250919";

    // Validate that version was sent and it is newer than minimal version. If version is not set - return false.
    var matchMinimumServerFromResponse = function(response){
        if (WL.Client.isGatewayResponse(response)){
            return true;
        }
        if (response.responseJSON!=null && (AUTHENTICATION_SERVER_VERSION_KEY in response.responseJSON)){//did server sent version
            var version = response.responseJSON["server_version"];
            var versionParts = version.split(".");
            if (__compareVersions(versionParts,MINIMUM_SERVER_SUPPORTED.split("."))<1){
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    }

    // compares the first 3 parts of the version.
    // returns:
    //      -1 if a > b
    //      0  if a = b
    //      1  if a < b
    var __compareVersions = function(a,b){
            for (var i=0;i<3;i++){
                if (!a[i]){ //add '0' if version part is missing
                    a.push("0");
                }
                if (!b[i]){ //add '0' if version part is missing
                    b.push("0");
                }
                a[i] = addLeadingZeros(a[i]);//add leading zeros to verify string size is equal
                b[i] = addLeadingZeros(b[i]);//add leading zeros to verify string size is equal
            }
            var aStr = a.slice(0,3).join("");//create a string from the first 3 parts of the version
            var bStr = b.slice(0,3).join("");//create a string from the first 3 parts of the version
            if (aStr<bStr){
                return 1;
            }
            return aStr>bStr ? -1 : 0;

    }

    var VERSION_PART_LENGTH = 20;
    function addLeadingZeros(s) {
        while (s.length < VERSION_PART_LENGTH) s = "0" + s;
        return s;
    };

    var createCallbacksForRegistration = function(registrationCallbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            parameters: params,
            onSuccess: function (response) {
                if (matchMinimumServerFromResponse(response)){
                    if(response.status == 200) {
                        registrationCallbackDfd.resolve(response);
                    }
                    // Get the clientId from the response
                    var locationHeader = response.getHeader("Location");
                    if(__isUndefinedOrNull(locationHeader)) {
                        // If we get an error, we reject the promise
                        processClientInstanceCallbacks(new WL.Response(response), false);
                        return;
                    }
                    // Extract clientID
                    var split = locationHeader.split('/');
                    var clientId = split[split.length -1];
                    __setClientId(clientId);
                    __setClientRegisteredData(WL.BrowserManager.getDeviceData());

                    // Get Analytics information from response
                    var responseJson = response._getResponseJSON();
                    var analyticsURL = responseJson.AnalyticsURL;
                    __setAnalyticsURL(analyticsURL);
                    processClientInstanceCallbacks(response, true);
                }
                else{
                    var errorString = "This version of the MobileFirst client SDK requires a minimal server version greater than IFIX " + GREATER_THAN_IFIX;
                    var responseData = {
                        status: 505, //Represent version not supported
                        responseJSON: {
                            errorCode: WL.ErrorCode.MINIMUM_SERVER,
                            errorMsg: errorString
                        }
                    };
                    var failResponse = new WL.Response(responseData, null);
                    WL.Logger.error(errorString);
                    processClientInstanceCallbacks(failResponse, false);
                }
            },
            onFailure: function (response) {
                var failResponse = new WL.Response(response);
                if (!__isUndefinedOrNull(response)) {
                    if (!matchMinimumServerFromResponse(response)
                    && response.responseJSON.errorCode != WL.ErrorCode.UNRESPONSIVE_HOST){
                    //if the version is older then minial version and host is actually responsive
                        var errorString = "This version of the MobileFirst client SDK requires a minimal server version greater than IFIX " + GREATER_THAN_IFIX;
                        var responseData = {
                            status: 505, //Represent version not supported
                            responseJSON: {
                                errorCode: WL.ErrorCode.MINIMUM_SERVER,
                                errorMsg: errorString
                            }
                        };
                        failResponse = new WL.Response(responseData);
                    }
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                processClientInstanceCallbacks(failResponse, false);

            },
            onAuthRequestFailure: function (response) {
                processClientInstanceCallbacks(new WL.Response(response), false);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                processClientInstanceCallbacks(response, false);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    var createCallbacksForLogoutRequest = function (callbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            contentType : 'application/x-www-form-urlencoded',
            parameters: params,
            onSuccess: function (response) {
                // Clear scope to token mappings
                WL.DAO.setItem(scopeToTokenMappingKey,{}, mappingOptions);

                callbackDfd.resolve();
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Logout request failed with response: ' + response.responseText);
                }
                callbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                callbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                callbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    var createCallbacksForAuthorization = function (AuthCallbackDfd, params) {
        var requestOptions = {
            method: 'GET',
            parameters: params,
            onSuccess: function (response) {
                // Get the grant-code from the response
                var responseJSON = response.responseJSON;
                var code = responseJSON['code'];
                var error = responseJSON['error'];
                if(!__isUndefinedOrNull(error) || __isUndefinedOrNull(code)) {
                    // If we get an error, we reject the promise
                    AuthCallbackDfd.reject(new WL.Response(response));
                    return;
                }
                // resolve the promise with the grantcode
                AuthCallbackDfd.resolve(code);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                AuthCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                AuthCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                AuthCallbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };

    /*
     TODO : Make sure request is send as FORM params
     */
    var createCallbacksForTokenRequest = function (tokenCallbackDfd, params) {
        var requestOptions = {
            method: 'POST',
            parameters: params,
            contentType : 'application/x-www-form-urlencoded',
            onSuccess: function (response) {
                var responseJSON = response.responseJSON;
                var accessTokenValue = responseJSON['access_token'];
                if(__isUndefinedOrNull(accessTokenValue)) {
                    tokenCallbackDfd.reject(new WL.Response(response));
                    return;
                }
                var scope = responseJSON['scope'];
                var exp = responseJSON['expires_in'];
                var accessToken = new WL.AccessToken(accessTokenValue, exp, scope);
                tokenCallbackDfd.resolve(accessToken);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Token request failed with response: ' + response.responseText);
                }
                tokenCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                tokenCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                tokenCallbackDfd.reject(failResponse);
            }
        };
        return requestOptions;
    };


    var createCallbacksForPreAuth = function (preAuthCallbackDfd) {
        var requestOptions = {
            method: 'POST',
            parameters: {},
            onSuccess: function (response) {
                preAuthCallbackDfd.resolve(response);
            },
            onFailure: function (response) {
                if (!__isUndefinedOrNull(response)) {
                    WL.Logger.debug('Authorization request failed with response: ' + response.responseText);
                }
                preAuthCallbackDfd.reject(new WL.Response(response));
            },
            onAuthRequestFailure: function (response) {
                preAuthCallbackDfd.reject(response);
            },
            onAuthException: function (response, ex) {
                var transport = {
                    status: 500,
                    responseJSON: {
                        errorCode: WL.ErrorCode.API_INVOCATION_FAILURE,
                        errorMsg: ex.message
                    }
                };
                var failResponse = new WL.Response(transport, null);
                preAuthCallbackDfd.reject(failResponse);
            },
            optionalHeaders: {}
        };
        return requestOptions;
    };



    var __getClientId = function () {
        return WL.DAO.getItem(clientIdKey);
    };

    var __setClientId = function (id) {
        if(!id) {
            WL.DAO.removeItem(clientIdKey);
            wlanalytics._setClientId("");
        }
        WL.DAO.setItem(clientIdKey, id);
        wlanalytics._setClientId(id);
    };

    var __setAnalyticsURL = function (id) {
        if(!id) {
            WL.DAO.removeItem(analyticsURLKey);
        }
        WL.DAO.setItem(analyticsURLKey, id);
    };

    var __setAnalyticsApiKey = function (id) {
        if(!id) {
            WL.DAO.removeItem(analyticsApiKey);
        }
        WL.DAO.setItem(analyticsApiKey, id);
    };

    var __invokeInstanceRegistration = function() {
        var dfd = WLJQ.Deferred();

        // put all incoming calls to queue
        clientInstanceIdCallbacks.push(dfd);

        if (clientInstanceIdCallbacks.length > 1) {
            return dfd.promise();
        }

        var path = 'registration/v1/self';
        paramsForRegistrationRequest().then(function(params){
            var requestOptions = createCallbacksForRegistration(dfd, params);
            if(!__isUndefinedOrNull(__getClientId())) {
                // ClientID exists, this is re-registration
                requestOptions.method = 'PUT';
                path = path + '/' + __getClientId();
            }
            makeRequest(path, requestOptions, false);

        });

        return dfd.promise();
    };

    var __deleteAuthData = function () {
        var dfd = WLJQ.Deferred();

        // Remove mappings
        clearMappings();

        // Remove ClientID and Client Registration Data
        __setClientId(null);
        __setClientRegisteredData(null);

        //Remove Analytics data
        __setAnalyticsURL(null);
        __setAnalyticsApiKey(null);

        // Remove keypair
        WL.CertManager.deleteKeyPair().then(function(){
            dfd.resolve();
        });

        // WL.IndexDB.clearDB().then(function(){
        //     dfd.resolve();
        // });
        return dfd.promise();
    };

    var __invokeAuthorizationRequestForScope = function (scope) {
        var dfd = WLJQ.Deferred();
        var params = paramsForAuthorizationRequest(scope);
        var requestOptions = createCallbacksForAuthorization(dfd, params);

        makeRequest('az/v1/authorization', requestOptions, true);
        return dfd.promise();
    };

    /**
     * Invokes a request to the token endpoint
     * @param grantcode
     */
    function invokeTokenRequest(grantcode) {
        var dfd = WLJQ.Deferred();
        paramsForTokenRequest(grantcode).then(function(params){
            var requestOptions = createCallbacksForTokenRequest(dfd, params);
            makeRequest('az/v1/token', requestOptions, true);
        });
        return dfd.promise();
    }

    var __cacheScopeByResource = function (resource, scope) {
        var method = resource.requestOptions.method;
        var path = resource.requestOptions.url;
        var key = path + "_" + method;
        var sortedScope = sortScopeAlphabetically(scope);
        addItemToMap(resourceToScopeMappingKey, key, sortedScope);
    };

    var setAuthorizationServerUrl = function (url) {
        WL.Validators.validateURLOrNull(url, 'setAuthorizationServerUrl');
        WL.DAO.setItem('com.mfp.authorization.url', url);
    };

    var getAuthorizationServerUrl = function () {
        var url = WL.DAO.getItem('com.mfp.authorization.url');
        if(__isUndefinedOrNull(url)) {
            url = WL.Config.__getBaseURL();
        }
        return url;
    };

    /**
     *
     * @param isAZRequest
     * @returns The serverURL, which could be with the AZ or the MFP depending on the argument
     * @private
     */
    var __getServerUrl = function (isAZRequest) {
        return isAZRequest ? getAuthorizationServerUrl() : WL.Config.__getBaseURL();
    };

    var __getParameterByName = function (url, name) {
        var parts = url.split('?');
        if (parts.length < 2) {
            return null;
        }

        // there should be exactly two elements in the finalParts array. If we have more than two elements in the 'parts' array,
        // then the redirect url contains some other '?'
        var finalParts = [parts[0]];
        parts.splice(0, 1);
        // join extra parts back and push them to the second element of 'finalParts'
        finalParts.push(parts.join('?'));

        var results = finalParts[1].split('&');
        for (var i = 0; i < results.length; i++) {
            var pair = results[i].split('=');
            if (pair[0] === name) {
                return decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
        }
        return null;
    };

    var isAuthorizationRequired = function (responseStatus, responseHeadersString) {
        if (__isUndefinedOrNull(responseStatus) || __isUndefinedOrNull(responseHeadersString)) {
            return false;
        }
        var headersMap = WLJSX.String.parseResponseHeaders(responseHeadersString);
        var mfpConflictHeader = WLJSX.String.getHeaderByKey(headersMap, MFP_CONFLICT_HEADER);
        if (responseStatus === 409 && !__isUndefinedOrNull(mfpConflictHeader)) {
            return true;
        }
        var authenticationHeader = WLJSX.String.getHeaderByKey(headersMap, WWW_AUTHENTICATE_HEADER);
        if ((responseStatus !== 401 && responseStatus !== 403) || __isUndefinedOrNull(authenticationHeader) || __isUndefinedOrNull(authenticationHeader[WWW_AUTHENTICATE_HEADER])) {
            return false;
        }
        return (authenticationHeader[WWW_AUTHENTICATE_HEADER].indexOf('Bearer') >= 0);
    };

    var getResourceScope = function (responseHeadersString) {
        if (__isUndefinedOrNull(responseHeadersString)) {
            return null;
        }
        var headersMap = WLJSX.String.parseResponseHeaders(responseHeadersString);
        var authenticationHeader = WLJSX.String.getHeaderByKey(headersMap, WWW_AUTHENTICATE_HEADER);
        if (__isUndefinedOrNull(authenticationHeader)) {
            return null;
        }
        return WLAuthorizationManager.__getAuthorizationScope(authenticationHeader[WWW_AUTHENTICATE_HEADER]);
    };

    var __isInvalidToken = function (transport) {
        var responseAuthenticationHeader = transport.getResponseHeader(WWW_AUTHENTICATE_HEADER);
        return responseAuthenticationHeader.indexOf('invalid_token') >= 0;
    };

    var __sendHeartBeat = function (intervalInSecs) {
        setInterval(__HeartBeatTask, intervalInSecs);
    };

    var __HeartBeatTask = function () {
        var id = __getClientId();
        if (__isUndefinedOrNull(id)) {
            WL.Logger.warn('Could not send heartbeat, heartbeat is sent only after client is registered');
        }
        else {
            var jwt = new WL.JWT();
            WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
                var params = {
                    'client_assertion' : signedData,
                    'client_assertion_type' : JWT_ASSERTION_TYPE
                };
                var options = {
                    method: 'POST',
                    contentType : 'application/x-www-form-urlencoded',
                    parameters: params,
                    onSuccess: function (response) {
                        WL.Logger.debug('Heartbeat sent successfully');
                    },
                    onFailure: function (error) {
                        WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
                    }
                };
                makeRequest('preauth/v1/heartbeat', options, false);
            },
            function(error){
                WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
            });
        }
    };

    var __invokeGetRegistrationData = function() {
        var dfd = WLJQ.Deferred();

        var id = __getClientId();
        if (__isUndefinedOrNull(id)) {
            WL.Logger.warn('Could not get registration data, client is not registered');
            return dfd.reject();
        }
        else {
            var jwt = new WL.JWT();
            WL.CertManager.signJWS(jwt, {'kid' : id}).then(function(signedData){
                    var params = {
                        'client_assertion' : signedData,
                        'client_assertion_type' : JWT_ASSERTION_TYPE
                    };
                    var options = {
                        method: 'GET',
                        contentType : 'application/x-www-form-urlencoded',
                        parameters: params,
                        onSuccess: function (response) {
                            dfd.resolve(response);
                        },
                        onFailure: function (error) {
                            dfd.reject(error);
                        }
                    };
                    makeRequest('registration/v1/self/' + id, options, false);
                },
                function(error){
                    WL.Logger.debug('Failed to send heartbeat. Response:  ' + JSON.stringify(error));
                });
        }
        return dfd.promise();
    };

    var __isUndefinedOrNull = function (object) {
        return typeof (object) === 'undefined' || object === null;
    };

    function __login(securityCheck, credentials, userCallbackDfd) {
        if(!shouldRegister()) {
            sendLoginRequest(securityCheck, credentials, __getClientId(), userCallbackDfd);
        } else {
            __invokeInstanceRegistration().then(function(){
                sendLoginRequest(securityCheck, credentials, __getClientId(), userCallbackDfd);
            }, function(error) {
                // In case of an error on registration, reject all waiting requests.
                rejectAllCallbacks(error);
                userCallbackDfd.reject(error);
                __deleteAuthData();

            })
        }
    }

    function sendLoginRequest(securityCheck, credentials, clientId, userCallbackDfd) {
        invokePreAuthorizationRequest(securityCheck, credentials).then(
            function (transport) {
                // No need to continue to authorization end point.
                WL.Logger.debug('Successfully logged in to security check: ' + securityCheck);
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(clientId, securityCheck, transport, true);
                userCallbackDfd.resolve();
            },
            function (error) {
                var loginRetryObject = {
                    retryFunction: loginRetry,
                    userCallbackDfd: userCallbackDfd,
                    credentials: credentials
                };
                onAuthorizationProcessFailure(error, securityCheck, clientId, loginRetryObject);
            });
    }


    var setLoginTimeout = function(timeout) {
        if (timeout < MIN_LOGIN_TIMEOUT) {
             WL.Logger.debug('Login timeout has to be a minimum of 5 seconds. Resetting to 5 seconds');
             loginTimeout = MIN_LOGIN_TIMEOUT;
           } else {
            loginTimeout = timeout;
        }  
    };

    function login(securityCheck, credentials) {
        var dfd = WLJQ.Deferred();
        // make sure there is only one authorization request in progress
        if (isAuthorizationInProgress()) {
            var failResponse = createErrorResponse(500, WL.ErrorCode.AUTHORIZATION_FAILURE, LOGIN_ALREADY_IN_PROCESS);
            dfd.reject(failResponse);
        } else {
            if (__isUndefinedOrNull(securityCheck)) {
                securityCheck = DEFAULT_SCOPE;
            }
            authorizationAlreadyInProgress = true;
            __login(securityCheck, credentials, dfd);
        }
        return dfd.promise();
    }

    var loginRetry = function (scope, loginRetryObject) {
        __login(scope, loginRetryObject.credentials, loginRetryObject.userCallbackDfd);
    };

    var isAuthorizationInProgress = function () {
        return obtainAuthHeaderCallbacks.length > 1 || authorizationAlreadyInProgress;
    };

    var onAuthorizationProcessFailure = function (error, scope, clientId, tryAgainObject) {
            // in case of unknown client error do not process the callbacks; call the registration part instead
            var shouldProcessCallbacksOnError = true;
            var registerWithProtocolOne = false;
            registerWithProtocolOne = error.errorCode == "INVALID_REQUEST" && WL.Config.__getSDKProtocolVersion().sdk_protocol_version >= 2 && WL.Crypto.cryptoFlag == false;
            if ((isUnknownClientError(error) && !invalidClientReceived) || registerWithProtocolOne) {
                // request failed with unknown client
                invalidClientReceived = true; // set a flag that prevents infinite loop
                shouldProcessCallbacksOnError = false; // do not process callbacks, because request will be sent again
                // call the native to delete the old authentication data
                WLAuthorizationManager.__deleteAuthData()
                    .then(
                        function () {
                            // register the client again
                            __invokeInstanceRegistration()
                                .then(
                                    function () {
                                        // the registration returns the new client id.
                                        // update all callbacks in queue with the new client id
                                        updateClientIds(__getClientId());
                                        // resend the request
                                        tryAgainObject.retryFunction(scope, tryAgainObject);
                                    },
                                    function (error) {
                                        rejectAllCallbacks(error);
                                        __deleteAuthData();
                                    }
                                );
                        },
                        function (error) {
                            // unable to delete the old auth data, reject all callbacks and do not re-send the request
                            rejectAllCallbacks(error);
                        }
                    );
            }
            // notify the callers about error if it is not the 'unknown client' error thrown on the first time
            if (shouldProcessCallbacksOnError) {
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(clientId, scope, error, false);
                if (!__isUndefinedOrNull(tryAgainObject.userCallbackDfd)) {
                    tryAgainObject.userCallbackDfd.reject(error);
                }
            }
        };

	/**
         * Sorts the space separated scope alphabetically and ensures the default scope exists.
         *
         * Examples: when this flag is set to true, these will be the input and output values of
         * the method:
         * "RegisteredClient" --> "RegisteredClient"
         * null --> "RegisteredClient"
         * "RegisteredClient sc1 sc2" --> "RegisteredClient sc1 sc2"
         * "sc2 sc1" --> "RegisteredClient sc1 sc2"
         *
         * @param scope The given raw scope
         * @return The sorted scope minus the default scope
         */
        function sortScopeAlphabetically(scope) {
            if (scope == null || scope === DEFAULT_SCOPE) {
                return DEFAULT_SCOPE;
            }
            if (scope.indexOf(DEFAULT_SCOPE)<0){
                scope += " " + DEFAULT_SCOPE;
            }
            // Replace multiple spaces with a single space
            scope = scope.replace(/  +/g, ' ').trim();
            var scopeArray = scope.match(/\S+/g);
            scopeArray.sort();
            return scopeArray.join(' ');
        }

    function logout(securityCheck) {
        var dfd = WLJQ.Deferred();
        var id = __getClientId();
        if (isAuthorizationInProgress() || __isUndefinedOrNull(id)) {
            return dfd.reject(createErrorResponse(500, WL.ErrorCode.AUTHORIZATION_FAILURE, LOGOUT_ERROR_MSG));
        }
        if (__isUndefinedOrNull(securityCheck)) {
            securityCheck = DEFAULT_SCOPE;
        }
        authorizationAlreadyInProgress = true;
        __sendLogoutRequest(securityCheck).then(
            function () {
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(null, securityCheck, null, true);
                dfd.resolve();
            },
            function (error) {
                authorizationAlreadyInProgress = false;
                processObtainAccessTokenCallbacks(null, securityCheck, null, false);
                dfd.reject(error);
            });

        return dfd.promise();
    }

    function __setClientRegisteredData(data) {
        if(!data) {
            WL.DAO.removeItem(clientApplicationDataKey);
        }
        return WL.DAO.setItem(clientApplicationDataKey, data);
    }

    function __getClientRegisteredData() {
        return WL.DAO.getItem(clientApplicationDataKey);
    }

    function __sendLogoutRequest(securityCheck) {
        var dfd = WLJQ.Deferred();
        paramsForLogoutRequest(securityCheck).then(function(params){
            var requestOptions = createCallbacksForLogoutRequest(dfd, params);
            makeRequest('preauth/v1/logout', requestOptions, false);
        });
        return dfd.promise();
    }

    /* Determines if the client needs to register/reregister, or not */
    function shouldRegister() {
        var id = __getClientId();
        if(__isUndefinedOrNull(id)) {
            return true;
        }
        var registeredData = __getClientRegisteredData();
        var currentData = WL.BrowserManager.getDeviceData();
        return JSON.stringify(registeredData) !== JSON.stringify(currentData);
    }

    /* Makes a request to MFP or AZ (based on arg) */
    function makeRequest(path, requestOptions, isAZRequest) {
        var serverURL = __getServerUrl(isAZRequest);
        return new WLJSX.Ajax.WLRequest(serverURL + '/' + path, requestOptions);
    }

    function paramsForAuthorizationRequest(scope) {
        var params = {};
        params['response_type'] = 'code';
        params[PARAM_CLIENT_ID_KEY] = __getClientId();
        params['scope'] = __isUndefinedOrNull(scope) ? '' : scope;
        params['redirect_uri'] = buildRedirectURI() ;

        return params;
    }

    function paramsForLogoutRequest(securityCheck) {
        var dfd = WLJQ.Deferred();
        var jwt = new WL.JWT();

        WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
            var params = {
                'client_assertion' : signedData,
                'security_check' : securityCheck,
                'client_assertion_type' : JWT_ASSERTION_TYPE
            };
            dfd.resolve(params);
        });
        return dfd.promise();
    }

    function paramsForRegistrationRequest() {
        var dfd = WLJQ.Deferred();
        var params = {};
        var registrationData = {
            'device' : WL.BrowserManager.getDeviceData(),
            'application' : WL.Config.__getApplicationData()
        };
       if(WL.Config.__getSDKProtocolVersion().sdk_protocol_version >= 2 && WL.Crypto.cryptoFlag == true){
            registrationData['attributes'] = WL.Config.__getSDKProtocolVersion();
        }
        WL.CertManager.signJWS(registrationData).then(function(signedData){
            params['signedRegistrationData'] = decomponentJWS(signedData);
            dfd.resolve(params);
        },
        function(error){
            dfd.reject(error);
        });
        return dfd.promise();
    }

    function paramsForTokenRequest(code) {
        var dfd = WLJQ.Deferred();
        var jwt = new WL.JWT(code, 'az/v1/token');
        WL.CertManager.signJWS(jwt, {'kid' : __getClientId()}).then(function(signedData){
            var params = {
                'client_assertion' : signedData,
                'code' : code,
                'grant_type' : 'authorization_code',
                'redirect_uri' : buildRedirectURI(),
                'client_assertion_type' : JWT_ASSERTION_TYPE
            };
            dfd.resolve(params);
        },
        function(error){
            dfd.reject(error);
        });
        return dfd.promise();
    }

    function buildRedirectURI() {
        return WL.Config.__getBaseURL() + AZ_REDIRECT_URI + '/' + __getClientId();
    }

    function decomponentJWS(signedData){
        var splitData = signedData.split('.');
        return {
            'header' : splitData[0],
            'payload' : splitData[1],
            'signature' : splitData[2]
        }

    }

    function createErrorResponse(status, errorCode, errorMsg) {
        var transport = {
            status: status,
            responseJSON: {
                errorCode: errorCode,
                errorMsg: errorMsg
            }
        };
        return new WL.Response(transport, null);
    }

    return {
        isAuthorizationRequired: isAuthorizationRequired,
        obtainAccessToken: obtainAccessToken,
        getResourceScope: getResourceScope,
        clearAccessToken: clearAccessToken,
        setAuthorizationServerUrl: setAuthorizationServerUrl,
        getAuthorizationServerUrl: getAuthorizationServerUrl,
        login: login,
        setLoginTimeout:setLoginTimeout,
        logout: logout,
        __invokeGetRegistrationData : __invokeGetRegistrationData,
        __invokeInstanceRegistration : __invokeInstanceRegistration,
        __logAndThrowError : __logAndThrowError,
        __getAuthorizationScope: __getAuthorizationScope,
        __getClientId: __getClientId,
        __getCachedScopeByResource: __getCachedScopeByResource,
        __deleteAuthData: __deleteAuthData,
        __deleteCachedScopeByResource : __deleteCachedScopeByResource,
        __getWlServerUrl: __getServerUrl,
        __getParameterByName: __getParameterByName,
        __invokeAuthorizationRequestForScope: __invokeAuthorizationRequestForScope,
        __cacheScopeByResource: __cacheScopeByResource,
        __getCachedAccessToken: __getCachedAccessToken,
        __isInvalidToken: __isInvalidToken,
        __sendHeartBeat: __sendHeartBeat,
        __sendLogoutRequest: __sendLogoutRequest,
        __serverRelativeTime: SERVER_RELATIVE_TIME,
        WL_AUTHORIZATION_HEADER: WL_AUTHORIZATION_HEADER,
        WWW_AUTHENTICATE_HEADER: WWW_AUTHENTICATE_HEADER,
        DEFAULT_SCOPE: DEFAULT_SCOPE,
        MFP_CONFLICT_HEADER: MFP_CONFLICT_HEADER
    };

}());


/**
 * ================================================================= 
 * Source file taken from :: deviceAuthentication.web.js
 * ================================================================= 
 */

/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * Object which handle the device authentication
 */
__WLDeviceAuth = function() {
    this.__requestToResend = null, this.__deviceChallengeToken = null,

    /**
     * Default implementation for WL.Client.init's options
     * onGetCustomDeviceProperties. Our default implementation actually does
     * nothing. If overriding this method, the user must call
     * resumeDeviceAuthProcess with the payload
     * 
     * @param resumeDeviceAuthProcess
     *            function to call when done with getting extra data
     */
    this.__defaultOnGetCustomDeviceProperties = function(resumeDeviceAuthProcess) {
        resumeDeviceAuthProcess({});
    },

    
    /**
     * get device friendly name
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__getDeviceDisplayName = function(successCallback, failureCallback) {
       WLAuthorizationManager.__invokeGetRegistrationData().then(
           function(response){
               var responseJSON = response.responseJSON;
               var regData = responseJSON['registration'];
               var device = regData['device'];
               var displayName = device['deviceDisplayName'];
               if(!displayName) {
                   displayName = null;
               }
               successCallback(displayName);
       },
           function(error){
               failureCallback(error);
           });
    },
    
    /**
     * set device friendly name
     * 
     * @param successCallback
     * @param failureCallback
     */
    this.__setDeviceDisplayName = function(deviceDisplayName, successCallback, failureCallback) {
        var id = WLAuthorizationManager.__getClientId();
        if(!id) {
            failureCallback('Can not set display name until device is registered');
        } else {
            WL.BrowserManager.__setLocalDeviceDisplayName(deviceDisplayName);

            // After we set the deviceDisplayName locally, we invoke re-registration to set the param in the server
            WLAuthorizationManager.__invokeInstanceRegistration().then(
                function() {
                    WL.BrowserManager.__setLocalDeviceDisplayName(null);
                    successCallback(null);
            },
                function(error) {
                    WL.BrowserManager.__setLocalDeviceDisplayName(null);
                    failureCallback(error);
            });
        }
    };
};
__WL.prototype.DeviceAuth = new __WLDeviceAuth;
WL.DeviceAuth = new __WLDeviceAuth;


/**
 * ================================================================= 
 * Source file taken from :: wlcookiemanager.web.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*globals WL, WLJSX, __WL,device*/

/**
 * Cookie manager singleton
 */
WL.CookieManager = (function() {

  /*jshint strict:false, quotmark:double*/

  var COOKIE_JSESSION_ID = "JSESSIONID";
  var COOKIE_WLSESSION_ID = "WLSESSIONID";

  // WARN: This constant is also accessed in the iOS native code
  // (WLCookieExtractor.m)
  var PERSISTED_COOKIES_NAME = "cookies";

  var cookies = null;
  var cookiePersister = null;
  var gadgetName = null;
  var gadgetEnvironment = null;
  var gadgetIID = null;

  var CookiePersister = WLJSX.Class.create({
    init: function() {},
    storeCookies: function() {},
    readCookies: function() {}, // throws exception on failure.
    clearCookies: function() {}
  });
  
  //
  // Windows Phone Persister
  //
//  var WPCookiePersister = WLJSX.Class.create(CookiePersister, {
//    storeCookies: function() {
//      try {
//        var JSONCookies = WLJSX.Object.toJSON(cookies);
//        window.localStorage.setItem(PERSISTED_COOKIES_NAME, JSONCookies);
//        WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
//        this.readCookies();
//      } catch (e) {
//        WL.Logger.error("Error storing cookie: " + e.message);
//      }
//    },
//
//    readCookies: function() {
//      try {
//        var JSONCookies = window.localStorage.getItem(PERSISTED_COOKIES_NAME);
//
//        if (JSONCookies !== null) {
//          var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
//          /*jshint forin:false*/
//          for (var key in cookiesObj) {
//            cookies[key] = cookiesObj[key];
//          }
//        }
//      } catch (e) {
//        WL.Logger.error("Error reading cookies: " + e.message);
//      }
//    },
//
//    clearCookies: function() {
//      try {
//        var JSONCookies = window.localStorage.getItem(PERSISTED_COOKIES_NAME);
//        window.localStorage.removeItem(PERSISTED_COOKIES_NAME);
//        WL.Logger.debug("Delete cookies: " + JSONCookies);
//      } catch (e) {
//        WL.Logger.error("Error deleting cookies: " + e.message);
//      }
//    }
//  });

  var LocalStorageCookiePersister = WLJSX.Class.create(CookiePersister, {
    storeCookies: function() {
      try {
        var JSONCookies = WLJSX.Object.toJSON(cookies);
        WL.Logger.debug("Storing cookies: (" + JSONCookies + ")");
        __WL.LocalStorage.setValue(PERSISTED_COOKIES_NAME, JSONCookies);
      } catch (e) {
        WL.Logger.error("Error storing cookie: " + e.message);
      }
    },

    readCookies: function() {
      try {
        var JSONCookies = __WL.LocalStorage.getValue(PERSISTED_COOKIES_NAME);
        if (JSONCookies === "") {
          return;
        }
        WL.Logger.debug("Read cookies: " + JSONCookies);
        if (JSONCookies !== null) {
          var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
          /*jshint forin:false*/
          for (var key in cookiesObj) {
            cookies[key] = cookiesObj[key];
          }
        }
      } catch (e) {
        WL.Logger.error("Error reading cookies: " + e.message);
      }
    },

    clearCookies: function() {
      try {
        var JSONCookies = WLJSX.Object.toJSON(cookies);
        __WL.LocalStorage.clear(PERSISTED_COOKIES_NAME);
        WL.Logger.debug("Delete cookies: " + JSONCookies);
      } catch (e) {
        WL.Logger.error("Error deleting cookies: " + e.message);
      }
    }
  });

  // 
  // Android
  //
  var AndroidCookiePersister = LocalStorageCookiePersister;

  //
  // iPhone
  //  
  var IPhoneCookiePersister = LocalStorageCookiePersister;

  // Private methods of the cookie manager:

  // Create the cookie persister according to the environment
  var createCookiePersister = function() {
    switch (gadgetEnvironment) {
      case WL.Env.IPHONE:
        cookiePersister = new IPhoneCookiePersister();
        break;
      case WL.Env.IPAD:
        cookiePersister = new IPhoneCookiePersister();
        break;
      case WL.Env.ANDROID:
        cookiePersister = new AndroidCookiePersister();
        break;
//      case WL.Env.WINDOWSPHONE8:
//        cookiePersister = new WPCookiePersister();
//        break;
      default:
        cookiePersister = null;
        break;
    }
  };

  var parseCookiesFromHeader = function(header) {
    var resultCookies = [];
    var headerValue = header.substr(header.indexOf(":") + 1);

    var cookieParts = headerValue.split(",");
    for (var i = 0; i < cookieParts.length; i++) {
      var cookiePart = cookieParts[i];
      // WL.Logger.debug("CookiePart: " + cookiePart);
      var cookieSubparts = cookiePart.split("=");
      if (cookieSubparts.length < 2) {
        WL.Logger.error("invalid cookie header: " + header);
      } else {
        var cookie = {
          name: WLJSX.String.strip(cookieSubparts[0]),
          value: WLJSX.String.strip(cookieSubparts[1].split(";")[0])
        };
        resultCookies.push(cookie);
      }
    }
    return resultCookies;
  };

  var getCookie = function(cookieName) {
    var cookieValue = "";
    if (isCookieManagementRequired()) {
      cookieValue = cookies[cookieName];
    } else {
      if (document.cookie.length > 0) {
        var cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
          cookieStart = cookieStart + cookieName.length + 1;
          var cookieEnd = document.cookie.indexOf(";", cookieStart);
          /*jshint maxdepth:4*/
          if (cookieEnd === -1) {
            cookieEnd = document.cookie.length;
          }
          cookieValue = decodeURI(document.cookie.substring(cookieStart, cookieEnd));
        }
      }
    }
    if (typeof cookieValue === "undefined") {
      cookieValue = null;
    }
    // WL.Logger.debug("getCookieValue: " + cookieName + "=" + cookieValue);
    return {
      name: cookieName,
      value: cookieValue
    };
  };

  var isCookieManagementRequired = function() {
    return false;
  };

  // Public API methods
  return {
    init: function(gadgetDisplayName, gadgetEnv, gadgetInstanceID) {
      gadgetName = gadgetDisplayName;
      gadgetEnvironment = gadgetEnv;
      gadgetIID = gadgetInstanceID;

      cookies = {};
      createCookiePersister();

      if (cookiePersister !== null) {
        cookiePersister.init();
        try {
          cookiePersister.readCookies();
        } catch (e) {
          WL.Logger.error("error read cookies: " + e.message);
          cookiePersister.clearCookies();
        }
        WL.Logger.debug("CookieMgr read cookies: " + WLJSX.Object.toJSON(cookies));
      }
    },

    // Called by WP7 native code after call readCookies
    updateCookies: function(JSONCookies) {
      try {
        var cookiesObj = WLJSX.String.evalJSON(JSONCookies);
        /*jshint forin:false*/
        for (var key in cookiesObj) {
          cookies[key] = cookiesObj[key];
        }
      } catch (e) {
        WL.Logger.error("Problems to update cookies " + e + " " + JSONCookies);
      }
    },

    clearCookies: function() {
      cookies = {};
      if (cookiePersister !== null) {
        cookiePersister.clearCookies();
      }
    },

    createCookieHeaders: function() {
      var headers = {};
      if (isCookieManagementRequired()) {
        var cookieHeaderValue = "";
        /*jshint forin:false*/
        for (var key in cookies) {
          cookieHeaderValue += key + "=" + cookies[key] + ";";
        }

        if (cookieHeaderValue !== "") {
          headers.Cookie = cookieHeaderValue;
        }
      }

	    var deviceId =  WL.BrowserManager.getDeviceData();
	    deviceId.environment = WL.Client.getEnvironment();
	    headers.deviceId = WLJSX.Object.toJSON(deviceId);
      return headers;
    },

    handleResponseHeaders: function(headers) {
      if (!isCookieManagementRequired()) {
        return;
      }
      var sessionCookies = {};
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (header.toLowerCase().indexOf("set-cookie") > -1) {
          var parsedCookies = parseCookiesFromHeader(header);
          for (var j = 0; j < parsedCookies.length; j++) {
            var cookie = parsedCookies[j];
            // Persist only the non session cookies
            /*jshint maxdepth:4, eqeqeq:false*/
            if (cookie.name != COOKIE_JSESSION_ID && cookie.name != COOKIE_WLSESSION_ID) {
              cookies[cookie.name] = cookie.value;
            } else {
              sessionCookies[cookie.name] = cookie.value;
            }

            if (cookiePersister !== null) {
              /*jshint maxdepth:5*/
              if (cookies !== null && WLJSX.Object.objectSize(cookies) > 0) {
                // in case there is two requests immediate after
                // login we need
                // to ensure session cookies is not persist
                delete cookies[COOKIE_WLSESSION_ID];
                delete cookies[COOKIE_JSESSION_ID];
                cookiePersister.storeCookies();
              }
            }
          }
        }
      }

      // Add the session cookies into the memory cookies
      if (isCookieManagementRequired()) {
        /*jshint forin:false*/
        for (var key in sessionCookies) {
          cookies[key] = sessionCookies[key];
        }
      }

    },

    getJSessionID: function() {
      var jsessionidCookie = getCookie(COOKIE_JSESSION_ID);
      return (jsessionidCookie === null) ? null : jsessionidCookie.value;
    },

    areCookiesEnabled: function() {
      var enabled = true;
      if (WL.EnvProfile.isEnabled(WL.EPField.WEB)) {
        var date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = "testcookie=oreo; expires=" + date.toGMTString() + "; path=/";
        var cookie = getCookie("testcookie");
        enabled = (cookie.value === "oreo");
      }
      return enabled;
    }
  };
}());
/* End CookieManager */

/**
 * ================================================================= 
 * Source file taken from :: worklight.js
 * ================================================================= 
 */

/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/*globals WL, __WL, WLJSX*/

/*jshint strict:false*/

/**
 * EnvironmentProfile
 */
WL.EnvProfile = (function() {

  var profile = null;

  return {
    initialize: function(env) {
      if (typeof WL[env + 'ProfileData'] !== 'undefined') {
        profile = WL[env + 'ProfileData'];
      } else {
        profile = WL.DefaultProfileData;
      }
    },

    getValue: function(field) {
      return profile[field];
    },

    isEnabled: function(field) {
      return !!(field in profile && profile[field]);
    },

    disable: function(field) {
      if (field in profile) {
        profile[field] = false;
      }
    }
  };
})();

__WL.MultiEventListener = WLJSX.Class.create({
  isEventComplete: false,
  onEventsComplete: null,
  events: null,

  initialize: function() {
    this.events = {};
  },

  __onEvent: function(e) {
    this.events[e.type] = true;
    for (var x in this.events) {
      if (!this.events[x]) {
        return;
      }
    }
    this.onEventsComplete();
  },

  registerEvent: function(e) {
    document.addEventListener(e, this.__onEvent.bind(this), false);
    this.events[e] = false;
  }
});

var __WLEvents = {
  WORKLIGHT_IS_CONNECTED: 'WL:WORKLIGHT_IS_CONNECTED',
  WORKLIGHT_IS_DISCONNECTED: 'WL:WORKLIGHT_IS_DISCONNECTED'
};

__WL.prototype.Events = __WLEvents;
WL.Events = __WLEvents;

/*jshint undef:false*/
__WLLocalStorage = function() {
  var isSupportLocalStorage = (typeof localStorage !== 'undefined');
  var HTML5_NOT_SUPPORT_MSG = '. HTML5 localStorage not supported on current browser.';

  function deviceReadyCallback() {
    isSupportLocalStorage = (typeof localStorage !== 'undefined');
    preventClearSpecialValues();
  }

  if (typeof document.addEventListener !== 'undefined') {
    document.addEventListener('deviceready', deviceReadyCallback, false);
  } else {
    document.attachEvent('ondeviceready', deviceReadyCallback);
  }

  function preventClearSpecialValues() {
    // prevent from clear MobileFirst Platform special values
    if (typeof Storage !== 'undefined' && isSupportLocalStorage) {
      Storage.prototype.clear = function() {
        for (var item in localStorage) {
          if (item !== 'cookies' && item !== 'userName') {
            localStorage.removeItem(item);
          }
        }
      };
    }
  }

  this.getValue = function(key) {
      var value = null;
      if (isSupportLocalStorage) {
        value = localStorage.getItem(key);
      } else {
        WL.Logger.debug('Can\'t retrive value for key ' + key + HTML5_NOT_SUPPORT_MSG);
      }
      return value;
    },

    this.setValue = function(key, value) {
      if (isSupportLocalStorage) {
        localStorage.setItem(key, value);
      } else {
        WL.Logger.debug('Can\'t set value ' + value + ' for key' + key + HTML5_NOT_SUPPORT_MSG);
      }
    },

    this.clear = function(key) {
      if (isSupportLocalStorage) {
        localStorage.removeItem(key);
      } else {
        WL.Logger.debug('Can\'t clear key ' + key + HTML5_NOT_SUPPORT_MSG);
      }
    },

    this.clearAll = function() {
      if (isSupportLocalStorage) {
        localStorage.clear();
      } else {
        WL.Logger.debug('Can\'t clear storage ' + HTML5_NOT_SUPPORT_MSG);
      }
    };
};

/*jshint newcap:false*/
__WL.LocalStorage = new __WLLocalStorage();

__WLDevice = function() {
  /**
   * Supported environments: Android, iOS
   *
   * @param callback -
   *            the callback function
   * @return network info from device in JSON format The returned object
   *         consist from the following properties: isNetworkConnected,
   *         isAirplaneMode, isRoaming, networkConnectionType, wifiName,
   *         telephonyNetworkType, carrierName, ipAddress,
   */
  this.getNetworkInfo = function(callback) {
    callback({});
  };
};
__WL.prototype.Device = new __WLDevice();
WL.Device = new __WLDevice();

/**
 * ================================================================= 
 * Source file taken from :: wlresourcerequest.web.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*globals WL, WL_, WLJQ, WLAuthorizationManager*/
/*jshint maxparams:4*/
WLResourceRequest = function (_url, _method, _options) {
    /*jshint strict:false*/

    function logAndThrowError(msg, callerName) {
        if (WL.Logger) {
            if (callerName) {
                msg = 'Invalid invocation of method ' + callerName + '; ' + msg;
            }
            WL.Logger.error(msg);
        }

        throw new Error(msg);
    }

    var queryParameters = {};

    function extractQueryParamFromUrl(_url) {
        var vars = _url.split('?');
        if (vars.length > 1) {
            var tempParamaters = vars[1].split('&');
            for (var i = 0; i < tempParamaters.length; i++) {
                if (true) { // thanks jshint
                    var pair = tempParamaters[i].split('=');
                    var values = queryParameters[pair[0]];
                    /*jshint maxdepth:5*/
                    if (values === null || typeof (values) === 'undefined') {
                        values = [];
                        queryParameters[pair[0]] = values;
                    }
                    values[values.length] = pair[1];
                }
            }
        }
        return vars[0];
    }

    function isValidRequestMethod(method) {
        return (method === WLResourceRequest.GET || method === WLResourceRequest.POST || method === WLResourceRequest.PUT ||
        method === WLResourceRequest.DELETE || method === WLResourceRequest.HEAD || method === WLResourceRequest.OPTIONS ||
        method === WLResourceRequest.TRACE);
    }

    function isUndefinedOrNull(value) {
        return (typeof(value) === 'undefined' || value === null);
    }
    var url = (_url === null || typeof (_url) === 'undefined') ? logAndThrowError('Request URL must be specified.', 'WLResourceRequest') : extractQueryParamFromUrl(_url.trim());
    var method = (typeof (_method) === 'undefined' || !isValidRequestMethod(_method)) ? logAndThrowError('Request method is invalid or not specified.', 'WLResourceRequest') : _method;
    var timeout;
    var headers = {};
    var currentResourceRequest = this;
    currentResourceRequest.scope = null;
    var MAX_CONFLICT_ATTEMPTS = 7;
    var backendServiceName = null;
    var BACKEND_SERVICE = '/backendservice/';


    /* support timeout given as 3rd parameter for backward compatibility */
    if (typeof(_options) === 'number') {
        timeout = _options;
    } else {
        if (!isUndefinedOrNull(_options) && !isUndefinedOrNull(_options.timeout)) { timeout = _options.timeout;}
        if (!isUndefinedOrNull(_options) && !isUndefinedOrNull(_options.scope)) { currentResourceRequest.scope = _options.scope;}
        if (!isUndefinedOrNull(_options) && !isUndefinedOrNull(_options.backendServiceName)) {
            backendServiceName = _options.backendServiceName;
        }
    }

    /**
     * Returns request URL. The URL must have been passed to constructor.
     */
    this.getUrl = function () {
        return url;
    };

    /**
     * Returns current request method. A valid request method must have been passed to constructor.
     */
    this.getMethod = function () {
        return method;
    };

    /**
     * Returns query parameters as a JSON object with key-value pairs.
     */
    this.getQueryParameters = function () {
        var tempQueryParameters = {};
        for (var paramKey in queryParameters) {
            if (true) { // thanks jshint
                var value = queryParameters[paramKey][0];
                tempQueryParameters[paramKey] = value;
            }
        }
        return tempQueryParameters;
    };

    /**
     * Returns query parameters as string.
     */
    this.getQueryString = function () {
        return buildQueryString();
    };

    /**
     * Sets query parameters.
     * @param {parameters} A JSON object with key-value pairs.
     */
    this.setQueryParameters = function (parameters) {
        queryParameters = {};

        if (typeof (parameters) !== 'undefined' && parameters !== null) {
            for (var paramKey in parameters) {
                if (true) { // thanks jshint
                    this.setQueryParameter(paramKey, parameters[paramKey]);
                }
            }
        }
    };

    /**
     * Sets a new query parameter. If a parameter with the same name already exists, it will be replaced.
     * @param {name} Parameter name
     * @param {value} Parameter value. Should be string, number or boolean.
     */
    this.setQueryParameter = function (name, value) {
        if (typeof (name) !== 'undefined' && name !== null && typeof (value) !== 'undefined' && value !== null) {
            queryParameters[name] = [value];
        }
    };

    // receives string, returns array of header values (even if only 1). if name==undefined returns all headers
    /**
     * Returns array of header values.
     * @param {name} Header name. If header name is specified, this function returns an array of header values
     * stored with this header, or undefined, if specified header name is not found. If <i>name</i> is null, or undefined,
     * this function returns all headers.
     */
    this.getHeaders = function (name) {
        if (name === null || typeof (name) === 'undefined') {
            return headers;
        }

        var headerValue = headers[name];

        if (typeof (headerValue) === 'undefined') {
            // try case insensitive search
            headerValue = __getFirstHeaderByNameNoCase(name).value;
        }

        if (headerValue !== null) {
            if (WL.Validators.isArray(headerValue)) {
                return headerValue;
            } else {
                return [headerValue];
            }
        }

    };

    /**
     * Returns array of header names. It can be empty if no headers has been added.
     */
    this.getHeaderNames = function () {
        var headerNames = [];
        for (var headerName in headers) {
            if (true) { // thanks jshint
                headerNames.push(headerName);
            }
        }
        return headerNames;
    };

    // receives string, returns string. if multiple headers with same name - return first one
    /**
     * Returns a first header value stored with the specified header name. The value is returned as a string.
     * Can be undefined if a header with specified name does not exist.
     * @param {name} Header name.
     */
    this.getHeader = function (name) {
        if (name === null || typeof (name) === 'undefined') {
            logAndThrowError('Header name should be defined.', 'WLResourceRequest.getHeader');
        }

        var headerValue = headers[name];
        if (typeof (headerValue) === 'undefined') {
            // try case insensitive search
            headerValue = __getFirstHeaderByNameNoCase(name).value;
        }

        if (WL.Validators.isArray(headerValue)) {
            return headerValue[0];
        }
        return headerValue;
    };

    //receives JSON object similar to what getHeaders returns
    /**
     * Sets request headers. The existing headers are replaced.
     * @param {requestHeaders} JSON object with request headers. Each header value should be either string, or array of strings. This function will
     * throw error if one of specified header values is not valid.
     */
    this.setHeaders = function (requestHeaders) {
        if (requestHeaders === null || typeof (requestHeaders) === 'undefined') {
            headers = {};
            return;
        }

        // verify that each key contains array of values or simple object
        for (var headerName in requestHeaders) {
            if (true) { // thanks jshint
                var headerValue = requestHeaders[headerName];

                if (WL.Validators.isArray(headerValue)) {
                    /*jshint maxdepth:4*/
                    if (headerValue.length > 0 && !isArrayOfSimpleTypes(headerValue)) {
                        // complex type detected within array of values - throw error
                        logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeaders');
                    }
                } else if (!isSimpleType(headerValue)) {
                    logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeaders');
                }
            }
        }

        headers = {};
        for (var key in requestHeaders) {
            if (true) { // thanks jshint
                var headerValueTemp = requestHeaders[key];
                if (WL.Validators.isArray(headerValueTemp)) {
                    for (var item in headerValueTemp) {
                        /*jshint maxdepth:5*/
                        if (true) { // thanks jshint
                            this.addHeader(key, headerValueTemp[item]);
                        }
                    }
                } else {
                    this.addHeader(key, headerValueTemp);
                }
            }
        }
    };

    /**
     * Sets a new header or replaces an existing header with the same name.
     * @param {name} Header name
     * @param value Header value. The value must be of simple type (string, boolean or value).
     */
    this.setHeader = function (name, value) {
        if (!isSimpleType(value)) {
            // complex type detected instead of string - throw error
            logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.setHeader');
        }

        for (var headerName in headers) {
            if (headerName.toLowerCase() === name.toLowerCase()) {
                delete headers[headerName];
            }
        }

        headers[name] = value;
    };

    /**
     * Adds a new header. If a header with the same name already exists, the header value will be added to the existing header. The name is
     * case insensitive.
     * @param {name} Header name
     * @param {value} Header value. The value must be of simple type (string, number or boolean).
     */
    this.addHeader = function (name, value) {
        if (typeof (value) === 'undefined' || value === null) {
            logAndThrowError('Header value should not be null or undefined.', 'WLResourceRequest.addHeader');
        }
        if (!isSimpleType(value)) {
            // complex type detected instead of string - throw error
            logAndThrowError('Header value should be a simple type.', 'WLResourceRequest.addHeader');
        }

        var header = __getFirstHeaderByNameNoCase(name);
        var existingHeaderName = header.name;
        var existingHeaderValue = header.value;
        if (existingHeaderValue === null) {
            headers[name] = value;
        } else {
            if (WL.Validators.isArray(existingHeaderValue)) {
                for (var idx in existingHeaderValue) {
                    /*jshint maxdepth:4*/
                    if (existingHeaderValue[idx].toString() === value.toString()) {
                        return;
                    }
                }
                existingHeaderValue.push(value);
            } else {
                var array = [];
                array.push(existingHeaderValue);
                array.push(value);
                headers[existingHeaderName] = array;
            }
        }
    };

    function __getFirstHeaderByNameNoCase(name) {
        for (var headerName in headers) {
            if (headerName.toLowerCase() === name.toLowerCase()) {
                return {
                    name: headerName,
                    value: headers[headerName]
                };
            }
        }

        return {
            name: null,
            value: null
        };
    }

    /**
     * Returns request time out in milliseconds.
     */
    this.getTimeout = function () {
        return timeout;
    };

    /**
     * Sets request timeout. If timeout is not specified, then a default timeout will be used.
     * @param {requestTimeout} Request timeout in milliseconds.
     */
    this.setTimeout = function (requestTimeout) {
        timeout = requestTimeout;
    };

    /**
     * Sends the request to a server.
     * @param {content} Body content. It can be of simple type (like string), or object.
     * @returns Returns promise. Sample usage: <br>
     * var request = WLResourceRequest(url, method, timeout);<br>
     * request.send(content).then(<br>
     *  function(response) {// success flow}, <br>
     *  function(error) {// fail flow} <br>
     * );
     */
    this.send = function (content) {
        var contentString = '';
        if (typeof (content) !== 'undefined' && content !== null) {
            contentString = isSimpleType(content) ? content.toString() : JSON.stringify(content);
        }

        return sendRequestAsync(contentString, 0, 0);
    };

    /**
     * Sends the request to a server.
     * @param {json} Body content as JSON object or string as a form data. The content type will be set to 'application/x-www-form-urlencoded'.
     * @returns Returns promise. Sample usage: <br>
     * var request = WLResourceRequest(url, method, timeout);<br>
     * request.send(json).then(<br>
     *  function(response) {// success flow}, <br>
     *  function(error) {// fail flow} <br>
     * );
     */
    this.sendFormParameters = function (json) {
        var contentString = encodeFormParameters(json);
        this.addHeader('Content-Type', 'application/x-www-form-urlencoded');

        return sendRequestAsync(contentString, 0, 0);
    };

    function encodeFormParameters(json) {
        if (json === null || typeof (json) === 'undefined') {
            return '';
        }

        var result = '';

        if (isSimpleType(json)) {
            var params = json.split('&');
            for (var i = 0; i < params.length; i++) {
                var kv = params[i].split('=');
                if (kv.length === 0) {
                    continue;
                }

                if (kv.length === 1) {
                    result += encodeURIComponent(kv[0]);
                } else {
                    result += encodeURIComponent(kv[0]) + '=' + encodeURIComponent(kv[1]);
                }

                if (i < params.length - 1) {
                    result += '&';
                }
            }
            return result;
        } else {
            for (var key in json) {
                if (true) { // thanks jshint
                    var value = json[key];
                    /*jshint maxdepth:4*/
                    if (!isSimpleType(value)) {
                        logAndThrowError('Form value must be a simple type.', 'WLResourceRequest.sendFormParameters');
                    }

                    result += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    result += '&';
                }
            }

            if (result.length > 0 && result[result.length - 1] === '&') {
                result = result.substring(0, result.length - 1);
            }

            return result;
        }
    }

    function sendRequestAsync(contentString, attempt, conflictAttemptCounter) {
        var dfd = WLJQ.Deferred();
        var builtUrl = buildRequestUrl();
        
        
        
        __send(builtUrl, contentString, attempt, conflictAttemptCounter).then(
            function (response) {
            	wlanalytics.send(true);
                dfd.resolve(response);
            },
            function (error) {
                dfd.reject(error);
            }
        );

        return dfd.promise();
    }

    var maxRequestAttempts = 4;

    function __send(serverUrl, contentString, attempt, conflictAttemptCounter) {
        var dfd = WLJQ.Deferred();

        // create WLNativeXHR or XMLHttpRequest
        var xhr = window.WLJSX.Ajax.getTransport();

        var queryString = buildQueryString();
        var finalUrl = queryString === null ? serverUrl : serverUrl + '?' + queryString;

        //TODO - ask Yuri, why we need this?
        xhr.requestOptions = {'url' : finalUrl, 'method' : method};

        xhr.open(method, finalUrl, true);

        if (typeof (timeout) !== 'undefined') {
            xhr.timeout = timeout;
        }

        addRequestHeaders(xhr);
		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				var transport = this;
				if (this.status === 0) {
					var errorCode = this.wlFailureStatus !== 'undefined' ? this.wlFailureStatus : WL.ErrorCode.UNEXPECTED_ERROR;
					// handle errors - timeout, unresponsive host and unexpected error
					transport.status = 0;
					transport.responseJSON = {
							errorCode: errorCode,
							errorMsg: this.statusText //WL.Utils.formatString(WL.ClientMessages.handleTimeOut, finalUrl)
					};
				}

				var wlResponse = new WL.Response(this, null);

				// WL.Response sets status to 200 if transport.status is 0 - set it back to 0.
				if (this.status === 0) {
					wlResponse.status = 0;
				}

				if (typeof (WLAuthorizationManager) !== 'undefined' && isAuthorizationRequired(transport) && (transport.status !== 409 && attempt < maxRequestAttempts || transport.status === 409 && conflictAttemptCounter < MAX_CONFLICT_ATTEMPTS)) {
					processResponse(transport);
				} else if(WL.Client.isGatewayResponse(wlResponse)){
                    WLAuthorizationManager.clearAccessToken({
	                    scope: (currentResourceRequest.scope ? currentResourceRequest.scope : '')
	                });
					obtainAccessTokenAndSendRequest(currentResourceRequest.scope ? currentResourceRequest.scope : '');
				} else if (this.status >= 200 && this.status <= 299) {
					// any status in the 2xx range is considered a success
					dfd.resolve(wlResponse);
				}
				else {
					// it's not OAuth error or number of attempts is exceeded; fail the request with last error, which will be propagated up
					dfd.reject(wlResponse);
				}
			}
		};

        var isAuthorizationRequired = function(transport) {
            if (isUndefinedOrNull(transport)) {
                return false;
            }
            return WLAuthorizationManager.isAuthorizationRequired(transport.status, transport.getAllResponseHeaders());
        };

        var processResponse = function(transport) {
            // if status is 409 resend request and increment conflictAttemptCounter
            if (transport.status === 409) {
                resendRequest(attempt, ++conflictAttemptCounter);
            } else if (transport.status === 403) {
                currentResourceRequest.scope = WLAuthorizationManager.getResourceScope(transport.getAllResponseHeaders());
                if (!WL.Validators.isNullOrUndefined(currentResourceRequest.scope)) {
                    WLAuthorizationManager.__cacheScopeByResource(transport, currentResourceRequest.scope);
                    resendRequest(++attempt, conflictAttemptCounter);
                }
            } else if (WLAuthorizationManager.__isInvalidToken(transport)) {
                WLAuthorizationManager.clearAccessToken({
                    scope: currentResourceRequest.scope
                });
                resendRequest(++attempt, conflictAttemptCounter);
            } else {
                // We got 401 we need cache the resource to default scope so that next time the request will be sent with default access token.
                WLAuthorizationManager.__cacheScopeByResource(transport, WLAuthorizationManager.DEFAULT_SCOPE);
                resendRequest(++attempt, conflictAttemptCounter);
            }
        };

        var resendRequest = function (attemptNumber, conflictAttemptCounterNumber) {
            sendRequestAsync(contentString, attemptNumber, conflictAttemptCounterNumber).then(
                function (response) {
                    dfd.resolve(response);
                },
                function (error) {
                    dfd.reject(error);
                });
        };

        if (typeof (WLAuthorizationManager) !== 'undefined') {
            // If user provided scope for this resource use it, else get scope from cache.
            if (!WL.Validators.isNullOrUndefined(currentResourceRequest.scope)) {
                obtainAccessTokenAndSendRequest(currentResourceRequest.scope);
            } else {
                var cachedScope = WLAuthorizationManager.__getCachedScopeByResource(xhr);
                currentResourceRequest.scope = cachedScope;
                obtainAccessTokenAndSendRequest(cachedScope);
            }
        } else {
            sendRequest();
        }
        /*jshint latedef:false*/
        function obtainAccessTokenAndSendRequest(scope) {
            if (!WL.Validators.isNullOrUndefined(scope)) {
                WLAuthorizationManager.obtainAccessToken(scope).then(
                    function (accessToken) {
                        // Send request with accessToken as authorization header.
                        if (!WL.Validators.isNullOrUndefined(accessToken)) {
                            if(xhr.readyState == 4){
                              xhr.open(xhr.requestOptions.method,xhr.requestOptions.url,true);
                            }
                            xhr.setRequestHeader(WLAuthorizationManager.WL_AUTHORIZATION_HEADER, accessToken.asAuthorizationRequestHeader);
                        }
                        sendRequest();
                    },
                    function (error) {
                        if (error.status === 500) {
                            // if error status is 500 then it is necessary to delete resource to scope mapping.
                            // Because the scope mapping for this resource might have changed.
                            WLAuthorizationManager.__deleteCachedScopeByResource(xhr);
                                    // Unable to retrieve accessToken, fail the request; the failure will be propagated up the chain
                                    currentResourceRequest.scope = null;
                                    dfd.reject(error);
                        } else {
                            dfd.reject(error);
                        }
                    });
            } else {
                sendRequest();
            }
        }
        /*jshint latedef:false*/
        function sendRequest() {
            xhr.send(method === 'GET' ? null : contentString, true);
        }

        return dfd.promise();
    }

    function buildRequestUrl() {
        if (url.indexOf('http:') >= 0 || url.indexOf('https:') >= 0) {
            /* Absolute URL - the backendServiceName needs a relative URL */
            if ( backendServiceName !== null){
                dfd.reject('The backendServiceName option can only be used with a relative URL ');
            }
            return url;
        } else {
            var serverUrl = WL.Config.__getBaseURL();
            if (backendServiceName !== null){
                if (backendServiceName.startsWith("/")){
                    backendServiceName = backendServiceName.slice(1,backendServiceName.length);
                }
                serverUrl = serverUrl+ BACKEND_SERVICE + backendServiceName;
            }
            return __buildUrl(serverUrl);
        }

        function __buildUrl(serverUrl) {
            if (serverUrl[serverUrl.length - 1] !== '/' && url[0] !== '/' && url.length!==0) {
                serverUrl += '/';
            } else if (serverUrl[serverUrl.length - 1] === '/' && (url[0] === '/' || url.length===0)) {
                serverUrl = serverUrl.substring(0, serverUrl.length - 1);
            }
            return serverUrl + url;
        }
    }

    function addRequestHeaders(xhr) {
        for (var headerName in headers) {
            if (true) { // thanks jshint
                var headerValue = headers[headerName];
                if (isSimpleType(headerValue)) {
                    xhr.setRequestHeader(headerName, headerValue.toString());
                } else {
                    var commaSeparatedHeader = headerValue[0];
                    /*jshint maxdepth:4*/
                    for (var i = 1; i < headerValue.length; i++) {
                        commaSeparatedHeader += ', ' + headerValue[i];
                    }
                    xhr.setRequestHeader(headerName, commaSeparatedHeader);
                }
            }
        }
    }

    function buildQueryString() {
        if (queryParameters === null || typeof (queryParameters) === 'undefined' || WLJQ.isEmptyObject(queryParameters)) {
            return null;
        }

        var queryString = '';
        for (var paramKey in queryParameters) {
            if (true) { // thanks jshint
                var values = queryParameters[paramKey];
                if (values === null || typeof (values) === 'undefined' || values.length === 0) {
                    queryString += '&' + paramKey;
                } else {
                    /*jshint maxdepth:6*/
                    for (var i = 0; i < values.length; i++) {
                        var paramValue = isSimpleType(values[i]) ? values[i] : JSON.stringify(values[i]);
                        if (paramValue === null || typeof (paramValue) === 'undefined') {
                            queryString += '&' + paramKey;
                        } else {
                            queryString += '&' + paramKey + '=' + encodeURIComponent(paramValue);
                        }
                    }
                }
            }
        }

        return queryString.substr(1);
    }

    function isSimpleType(value) {
        return (WL.Validators.isString(value) || WL.Validators.isNumber(value) || WL.Validators.isBoolean(value));
    }

    function isArrayOfSimpleTypes(object) {
        for (var i = 0; i < object.length; i++) {
            if (!isSimpleType(object[i])) {
                return false;
            }
        }
        return true;
    }
}

WLResourceRequest.GET = 'GET';
WLResourceRequest.POST = 'POST';
WLResourceRequest.PUT = 'PUT';
WLResourceRequest.DELETE = 'DELETE';
WLResourceRequest.HEAD = 'HEAD';
WLResourceRequest.OPTIONS = 'OPTIONS';
WLResourceRequest.TRACE = 'TRACE';
WLResourceRequest.CONNECT = 'CONNECT';


/**
 * ================================================================= 
 * Source file taken from :: clockSyncChallengeHandler.web.js
 * ================================================================= 
 */

/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2016 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

var clockSyncChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("clockSynchronization");

clockSyncChallengeHandler.handleSuccess = function(identity) {
	var date = new Date();
	WL.Config.__setServerRelativeTime(identity.serverTimeStamp - date.getTime());
};


/**
 * ================================================================= 
 * Source file taken from :: remoteDisableChallengeHandler.web.js
 * ================================================================= 
 */

/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

var wl_remoteDisableChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("wl_remoteDisableRealm");

wl_remoteDisableChallengeHandler.handleChallenge = function(obj) {

	// get new message params
	var message = obj.message;
    var messageId = obj.messageId;
    var messageType = obj.messageType;

    // get value of previously stored message id
	var storedMessageId = WL.DAO.getItem(WL.Client.getMessageID());

	var challengeAnswer = { messageId : messageId };

	if (isDisplayMessageDialogue(storedMessageId, messageId, messageType)) {
        addRemoteDisableHTML();

        setDirectionToRemoteDisableMsg();

        document.getElementById('remoteDisableHeaderId').innerHTML = WL.ClientMessages.notificationTitle;
        document.getElementById('remoteDisableTextId').innerHTML = message;

        var remoteDisableModal = document.getElementById('remoteDisableModalId');
        remoteDisableModal.style.display = 'block';

        var remoteDisableCloseBtn = document.getElementById('remoteDisableCloseBtnId');
        remoteDisableCloseBtn.onclick = function() {
           remoteDisableModal.style.display = "none";
           wl_remoteDisableChallengeHandler.submitChallengeAnswer(challengeAnswer);
        }
		// keep the message id in the local storage
		WL.DAO.setItem(WL.Client.getMessageID(), messageId);
	} else {
		// don't show dialogue
		wl_remoteDisableChallengeHandler.submitChallengeAnswer(challengeAnswer);
	}

};


/**
 * determine whether or not to display message dialogue
 * @param storedMessageId
 * @param messageId
 * @param messageType
 * @returns {Boolean}
 */
function isDisplayMessageDialogue(storedMessageId,messageId, messageType)
{
	// restrictions apply only to notify messages
	if (messageType != "NOTIFY") {
		return true;
	}
	// display only new messages - the first time they are received
	if (typeof storedMessageId == "undefined" || storedMessageId != messageId) {
		return true;
	} else {
		return false;
	}
}

function getEnv() {
    return WL.StaticAppProps.ENVIRONMENT;
}

wl_remoteDisableChallengeHandler.handleFailure = function(err) {
	var message;

	if (typeof err == "undefined" || err == null)
	{
		message = "unknown error occurred."
	    WL.Logger.debug(">>> wl_remoteDisableChallengeHandler.handleFailure invoked with a missing err argument");
	}
	else if(err.message) {
    	message = err.message;
    } else if (err.reason) {
    	message = err.reason;
    } else {
    	WL.Logger.debug(">>> wl_remoteDisableChallengeHandler.handleFailure invoked with unexpected err format: " + JSON.stringify(err, null, 4));
    	message = "unknown error occurred."
    };
    var downloadLink = err.downloadLink;

    /*
     * Processor default handler for failure (display message and close App).
     */
    function defaultRemoteDisableDenialHandler(that, msg, downloadLink) {

        addRemoteDisableHTML();

        setDirectionToRemoteDisableMsg();

        document.getElementById('remoteDisableHeaderId').innerHTML = WL.ClientMessages.applicationDenied;
        document.getElementById('remoteDisableTextId').innerHTML = msg;

        var remoteDisableRedirectBtn = document.getElementById('remoteDisableRedirectBtnId');

        if (downloadLink) {
            //make button visible
            remoteDisableRedirectBtn.style.display = 'block';
            remoteDisableRedirectBtn.onclick = function() {
                WL.App.__openURL(downloadLink, '_new', null);
            }
        } else {
            remoteDisableRedirectBtn.style.display = 'none';
        }

        //make remoteDisableModal visible
        var remoteDisableModal = document.getElementById('remoteDisableModalId');
        remoteDisableModal.style.display = 'block';

        var remoteDisableCloseBtn = document.getElementById('remoteDisableCloseBtnId');
        remoteDisableCloseBtn.onclick = function() {
           remoteDisableModal.style.display = "none";
        }

    }

    WL.Client.__handleOnRemoteDisableDenial(defaultRemoteDisableDenialHandler, this, message, downloadLink);
};

var addRemoteDisableHTML = (function () {
    var isHtmlAlreadyAdded = false;

    return function () {
        if (!isHtmlAlreadyAdded) {
            isHtmlAlreadyAdded = true;
            var remoteDisableModel = document.createElement('div');
            remoteDisableModel.className = 'remoteDisableModalClass';
            remoteDisableModel.id = 'remoteDisableModalId';
            remoteDisableModel.innerHTML = ''
                + '<div class="remoteDisableHeaderContent">'
                +   '<h2 id="remoteDisableHeaderId" class="remoteDisableHeader"></h2>'
                +   '<div>'
                +       '<p id=remoteDisableTextId class="remoteDisableText"></p>'
                +   '</div>'
                +   '<div class=removeDisableButtons>'
                +       '<button id="remoteDisableCloseBtnId" class="closeBtn">' + WL.ClientMessages.close + '</button>'
                +       '<button id="remoteDisableRedirectBtnId" class="remoteDisableRedirectBtn">' + (WL.ClientMessages.redirect ? WL.ClientMessages.redirect : 'Redirect') + '</button>'
                +   '</div>'
                + '</div>';

            var remoteDisableCss = document.createElement('style');
            remoteDisableCss.innerHTML = ''
                + '.remoteDisableModalClass {'
                +   'display: none; /* Hidden by default */'
                +   'position: fixed; /* Stay in place */'
                +   'z-index: 1; /* Sit on top */'
                +   'padding-top: 100px; /* Location of the box */'
                +   'left: 0;'
                +   'top: 0;'
                +   'width: 100%; /* Full width */'
                +   'height: 100%; /* Full height */'
                +   'overflow: auto; /* Enable scroll if needed */'
                +   'background-color: rgb(0,0,0); /* Fallback color */'
                +   'background-color: rgba(0,0,0,0.4); /* Black w/ opacity */'
                + '}'

                + '.remoteDisableHeaderContent {'
                +   'background-color: #fefefe;'
                +   'margin: auto;'
                +   'padding: 20px;'
                +   'border: 1px solid #888;'
                +   'width: 70%;'
                +   'min-width: 40%;'
                + '}'

                + '.remoteDisableHeader {'
                +   'margin: 0 0 5px 0;'
                + '}'

                + '.remoteDisableText {'
                +   'margin: 0;'
                +   'word-wrap: break-word;'
                + '}'

                + '.removeDisableButtons {'
                +   'margin: 15px 0 33px 0;'
                +   'font-family: sans-serif'
                + '}'

                + '.closeBtn {'
                +   'float: right;'
                +   'font-size: 15px;'
                + '}'
                
                + '.remoteDisableModalClass[dir="rtl"] .closeBtn {'
                +   'float: left;'
                + '}'

                + '.remoteDisableRedirectBtn {'
                +   'display: none;'
                +   'float: left;'
                +   'font-size: 15px;'
                + '}'

                + '.remoteDisableRedirectBtn:hover {'
                +   'background-color: #555555;'
                +   'color: white;'
                +   'cursor: pointer;'
                + '}'

                + '.closeBtn:hover {'
                +   'background-color: #555555;'
                +   'color: white;'
                +   'cursor: pointer;'
                + '}';

            document.getElementsByTagName('head')[0].appendChild(remoteDisableCss);

            document.body.appendChild(remoteDisableModel);
        }
    }
})();

var setDirectionToRemoteDisableMsg = function() {
    var langDirection = WL.Utils.getLanguageDirectionality(WL.ClientMessages.lang);

        if (langDirection === WL.Language.DIRECTION_RTL) {
            document.getElementById('remoteDisableModalId').dir = 'rtl';
        }
}


/**
 * ================================================================= 
 * Source file taken from :: webcrypto-shim.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

isCryptoShim = false;
/**
 * @file Web Cryptography API shim
 * @author Artem S Vybornov <vybornov@gmail.com>
 * @license MIT
 */
!function ( global ) {
    'use strict';
    
	var userOSversion = false;
        //If it is iOS

        if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
                    version;
              
            if (match !== undefined && match !== null) {
              version = [
                parseInt(match[1], 10),
                parseInt(match[2], 10),
                parseInt(match[3] || 0, 10)
                  ];            
                userOSversion=parseFloat(version.join('.'));
            }
        }
    

	
    var _crypto = global.crypto || global.msCrypto;
    if ( !_crypto ) return;
	
    var _subtle = _crypto.subtle || _crypto.webkitSubtle;
	
    if ( !_subtle ) return;

    var _Crypto     = global.Crypto || _crypto.constructor || Object,
        _SubtleCrypto = global.SubtleCrypto || _subtle.constructor || Object,
        _CryptoKey  = global.CryptoKey || global.Key || Object;
	
	//If it is iOS and version>=11 or Safari version >=11
	/*Below changes are to accommodate apple implementing WebCrypto SubtleCrypto 
	rather than WebKitSubtleCrypto and to maintain backward compatibility*/
	if ((userOSversion  >= 11) || (navigator.userAgent.indexOf('Version/11.') > -1 && navigator.userAgent.indexOf("Safari") > -1 ))
    	{
        	var isIE    = !!global.msCrypto,
        	isWebkit = !!_crypto.subtle;
	}
	else
	{
		var isIE    = !!global.msCrypto,
        	isWebkit = !!_crypto.webkitSubtle;
	}

        if ( !isIE && !isWebkit ){
            return;
        }

    //if using crypto-shim the crypto key has to be set as extractable
	isCryptoShim = true;

    function s2a ( s ) {
        return btoa(s).replace(/\=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    function a2s ( s ) {
        s += '===', s = s.slice( 0, -s.length % 4 );
        return atob( s.replace(/-/g, '+').replace(/_/g, '/') );
    }

    function s2b ( s ) {
        var b = new Uint8Array(s.length);
        for ( var i = 0; i < s.length; i++ ) b[i] = s.charCodeAt(i);
        return b;
    }

    function b2s ( b ) {
        if ( b instanceof ArrayBuffer ) b = new Uint8Array(b);
        return String.fromCharCode.apply( String, b );
    }

    function alg ( a ) {
        var r = { 'name': (a.name || a || '').toUpperCase().replace('V','v') };
        switch ( r.name ) {
            case 'SHA-1':
            case 'SHA-256':
            case 'SHA-384':
            case 'SHA-512':
                break;
            case 'AES-CBC':
            case 'AES-GCM':
            case 'AES-KW':
                if ( a.length ) r['length'] = a.length;
                break;
            case 'HMAC':
                if ( a.hash ) r['hash'] = alg(a.hash);
                if ( a.length ) r['length'] = a.length;
                break;
            case 'RSAES-PKCS1-v1_5':
                if ( a.publicExponent ) r['publicExponent'] = new Uint8Array(a.publicExponent);
                if ( a.modulusLength ) r['modulusLength'] = a.modulusLength;
                break;
            case 'RSASSA-PKCS1-v1_5':
            case 'RSA-OAEP':
                if ( a.hash ) r['hash'] = alg(a.hash);
                if ( a.publicExponent ) r['publicExponent'] = new Uint8Array(a.publicExponent);
                if ( a.modulusLength ) r['modulusLength'] = a.modulusLength;
                break;
            default:
                throw new SyntaxError("Bad algorithm name");
        }
        return r;
    };

    function jwkAlg ( a ) {
        return {
            'HMAC': {
                'SHA-1': 'HS1',
                'SHA-256': 'HS256',
                'SHA-384': 'HS384',
                'SHA-512': 'HS512'
            },
            'RSASSA-PKCS1-v1_5': {
                'SHA-1': 'RS1',
                'SHA-256': 'RS256',
                'SHA-384': 'RS384',
                'SHA-512': 'RS512'
            },
            'RSAES-PKCS1-v1_5': {
                '': 'RSA1_5'
            },
            'RSA-OAEP': {
                'SHA-1': 'RSA-OAEP',
                'SHA-256': 'RSA-OAEP-256'
            },
            'AES-KW': {
                '128': 'A128KW',
                '192': 'A192KW',
                '256': 'A256KW'
            },
            'AES-GCM': {
                '128': 'A128GCM',
                '192': 'A192GCM',
                '256': 'A256GCM'
            },
            'AES-CBC': {
                '128': 'A128CBC',
                '192': 'A192CBC',
                '256': 'A256CBC'
            }
        }[a.name][ ( a.hash || {} ).name || a.length || '' ];
    }

    function b2jwk ( k ) {
        if ( k instanceof ArrayBuffer || k instanceof Uint8Array ) k = JSON.parse( decodeURIComponent( escape( b2s(k) ) ) );
        var jwk = { 'kty': k.kty, 'alg': k.alg, 'ext': k.ext || k.extractable };
        switch ( jwk.kty ) {
            case 'oct':
                jwk.k = k.k;
            case 'RSA':
                [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'oth' ].forEach( function ( x ) { if ( x in k ) jwk[x] = k[x] } );
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        return jwk;
    }

    function jwk2b ( k ) {
        var jwk = b2jwk(k);
        if ( isIE ) jwk['extractable'] = jwk.ext, delete jwk.ext;
	
	//If it is iOS and version>=11 or Safari version >=11
	/*Below changes are to accommodate apple implementing WebCrypto SubtleCrypto 
	rather than WebKitSubtleCrypto and to maintain backward compatibility*/
	if ((userOSversion  >= 11) || (navigator.userAgent.indexOf('Version/11.') > -1 && navigator.userAgent.indexOf("Safari") > -1 ))
    	{
        	return jwk;
	}
	else
	{
		return s2b( unescape( encodeURIComponent( JSON.stringify(jwk) ) ) ).buffer;
	}
    }

    function pkcs2jwk ( k ) {
        var info = b2der(k), prv = false;
        if ( info.length > 2 ) prv = true, info.shift(); // remove version from PKCS#8 PrivateKeyInfo structure
        var jwk = { 'ext': true };
        switch ( info[0][0] ) {
            case '1.2.840.113549.1.1.1':
                var rsaComp = [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi' ],
                    rsaKey  = b2der( info[1] );
                if ( prv ) rsaKey.shift(); // remove version from PKCS#1 RSAPrivateKey structure
                for ( var i = 0; i < rsaKey.length; i++ ) {
                    if ( !rsaKey[i][0] ) rsaKey[i] = rsaKey[i].subarray(1);
                    jwk[ rsaComp[i] ] = s2a( b2s( rsaKey[i] ) );
                }
                jwk['kty'] = 'RSA';
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        return jwk;
    }

    function jwk2pkcs ( k ) {
        var key, info = [ [ '', null ] ], prv = false;
        switch ( k.kty ) {
            case 'RSA':
                var rsaComp = [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi' ],
                    rsaKey = [];
                for ( var i = 0; i < rsaComp.length; i++ ) {
                    if ( !( rsaComp[i] in k ) ) break;
                    var b = rsaKey[i] = s2b( a2s( k[ rsaComp[i] ] ) );
                    if ( b[0] & 0x80 ) rsaKey[i] = new Uint8Array(b.length + 1), rsaKey[i].set( b, 1 );
                }
                if ( rsaKey.length > 2 ) prv = true, rsaKey.unshift( new Uint8Array([0]) ); // add version to PKCS#1 RSAPrivateKey structure
                info[0][0] = '1.2.840.113549.1.1.1';
                key = rsaKey;
                break;
            default:
                throw new TypeError("Unsupported key type");
        }
        info.push( new Uint8Array( der2b(key) ).buffer );
        if ( !prv ) info[1] = { 'tag': 0x03, 'value': info[1] };
        else info.unshift( new Uint8Array([0]) ); // add version to PKCS#8 PrivateKeyInfo structure
        return new Uint8Array( der2b(info) ).buffer;
    }

    var oid2str = { 'KoZIhvcNAQEB': '1.2.840.113549.1.1.1' },
        str2oid = { '1.2.840.113549.1.1.1': 'KoZIhvcNAQEB' };

    function b2der ( buf, ctx ) {
        if ( buf instanceof ArrayBuffer ) buf = new Uint8Array(buf);
        if ( !ctx ) ctx = { pos: 0, end: buf.length };

        if ( ctx.end - ctx.pos < 2 || ctx.end > buf.length ) throw new RangeError("Malformed DER");

        var tag = buf[ctx.pos++],
            len = buf[ctx.pos++];

        if ( len >= 0x80 ) {
            len &= 0x7f;
            if ( ctx.end - ctx.pos < len ) throw new RangeError("Malformed DER");
            for ( var xlen = 0; len--; ) xlen <<= 8, xlen |= buf[ctx.pos++];
            len = xlen;
        }

        if ( ctx.end - ctx.pos < len ) throw new RangeError("Malformed DER");

        var rv;

        switch ( tag ) {
            case 0x02: // Universal Primitive INTEGER
                rv = buf.subarray( ctx.pos, ctx.pos += len );
                break;
            case 0x03: // Universal Primitive BIT STRING
                if ( buf[ctx.pos++] ) throw new Error( "Unsupported bit string" );
                len--;
            case 0x04: // Universal Primitive OCTET STRING
                rv = new Uint8Array( buf.subarray( ctx.pos, ctx.pos += len ) ).buffer;
                break;
            case 0x05: // Universal Primitive NULL
                rv = null;
                break;
            case 0x06: // Universal Primitive OBJECT IDENTIFIER
                var oid = btoa( b2s( buf.subarray( ctx.pos, ctx.pos += len ) ) );
                if ( !( oid in oid2str ) ) throw new Error( "Unsupported OBJECT ID " + oid );
                rv = oid2str[oid];
                break;
            case 0x30: // Universal Constructed SEQUENCE
                rv = [];
                for ( var end = ctx.pos + len; ctx.pos < end; ) rv.push( b2der( buf, ctx ) );
                break;
            default:
                throw new Error( "Unsupported DER tag 0x" + tag.toString(16) );
        }

        return rv;
    }

    function der2b ( val, buf ) {
        if ( !buf ) buf = [];

        var tag = 0, len = 0,
            pos = buf.length + 2;

        buf.push( 0, 0 ); // placeholder

        if ( val instanceof Uint8Array ) {  // Universal Primitive INTEGER
            tag = 0x02, len = val.length;
            for ( var i = 0; i < len; i++ ) buf.push( val[i] );
        }
        else if ( val instanceof ArrayBuffer ) { // Universal Primitive OCTET STRING
            tag = 0x04, len = val.byteLength, val = new Uint8Array(val);
            for ( var i = 0; i < len; i++ ) buf.push( val[i] );
        }
        else if ( val === null ) { // Universal Primitive NULL
            tag = 0x05, len = 0;
        }
        else if ( typeof val === 'string' && val in str2oid ) { // Universal Primitive OBJECT IDENTIFIER
            var oid = s2b( atob( str2oid[val] ) );
            tag = 0x06, len = oid.length;
            for ( var i = 0; i < len; i++ ) buf.push( oid[i] );
        }
        else if ( val instanceof Array ) { // Universal Constructed SEQUENCE
            for ( var i = 0; i < val.length; i++ ) der2b( val[i], buf );
            tag = 0x30, len = buf.length - pos;
        }
        else if ( typeof val === 'object' && val.tag === 0x03 && val.value instanceof ArrayBuffer ) { // Tag hint
            val = new Uint8Array(val.value), tag = 0x03, len = val.byteLength;
            buf.push(0); for ( var i = 0; i < len; i++ ) buf.push( val[i] );
            len++;
        }
        else {
            throw new Error( "Unsupported DER value " + val );
        }

        if ( len >= 0x80 ) {
            var xlen = len, len = 4;
            buf.splice( pos, 0, (xlen >> 24) & 0xff, (xlen >> 16) & 0xff, (xlen >> 8) & 0xff, xlen & 0xff );
            while ( len > 1 && !(xlen >> 24) ) xlen <<= 8, len--;
            if ( len < 4 ) buf.splice( pos, 4 - len );
            len |= 0x80;
        }

        buf.splice( pos - 2, 2, tag, len );

        return buf;
    }

    function CryptoKey ( key, alg, ext, use ) {
        Object.defineProperties( this, {
            _key: {
                value: key
            },
            type: {
                value: key.type,
                enumerable: true
            },
            extractable: {
                value: (ext === undefined) ? key.extractable : ext,
                enumerable: true
            },
            algorithm: {
                value: (alg === undefined) ? key.algorithm : alg,
                enumerable: true
            },
            usages: {
                value: (use === undefined) ? key.usages : use,
                enumerable: true
            }
        });
    }

    function isPubKeyUse ( u ) {
        return u === 'verify' || u === 'encrypt' || u === 'wrapKey';
    }

    function isPrvKeyUse ( u ) {
        return u === 'sign' || u === 'decrypt' || u === 'unwrapKey';
    }

    [ 'generateKey', 'importKey', 'unwrapKey' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c ) {
                var args = [].slice.call(arguments),
                    ka, kx, ku;

                switch ( m ) {
                    case 'generateKey':
                        ka = alg(a), kx = b, ku = c;
                        break;
                    case 'importKey':
                        ka = alg(c), kx = args[3], ku = args[4];
                        if ( a === 'jwk' ) {
                            b = b2jwk(b);
                            if ( !b.alg ) b.alg = jwkAlg(ka);
                            if ( !b.key_ops ) b.key_ops = ( b.kty !== 'oct' ) ? ( 'd' in b ) ? ku.filter(isPrvKeyUse) : ku.filter(isPubKeyUse) : ku.slice();
                            args[1] = jwk2b(b);
                        }
                        break;
                    case 'unwrapKey':
                        ka = args[4], kx = args[5], ku = args[6];
                        args[2] = c._key;
                        break;
                }

                if ( m === 'generateKey' && ka.name === 'HMAC' && ka.hash ) {
                    ka.length = ka.length || { 'SHA-1': 512, 'SHA-256': 512, 'SHA-384': 1024, 'SHA-512': 1024 }[ka.hash.name];
                    return _subtle.importKey( 'raw', _crypto.getRandomValues( new Uint8Array( (ka.length+7)>>3 ) ), ka, kx, ku );
                }

                if ( isWebkit && m === 'generateKey' && ka.name === 'RSASSA-PKCS1-v1_5' && ( !ka.modulusLength || ka.modulusLength >= 2048 ) ) {
                    a = alg(a), a.name = 'RSAES-PKCS1-v1_5', delete a.hash;
                    return _subtle.generateKey( a, true, [ 'encrypt', 'decrypt' ] )
                        .then( function ( k ) {
                            return Promise.all([
                                _subtle.exportKey( 'jwk', k.publicKey ),
                                _subtle.exportKey( 'jwk', k.privateKey )
                            ]);
                        })
                        .then( function ( keys ) {
                            keys[0].alg = keys[1].alg = jwkAlg(ka);
                            keys[0].key_ops = ku.filter(isPubKeyUse), keys[1].key_ops = ku.filter(isPrvKeyUse);
                            return Promise.all([
                                _subtle.importKey( 'jwk', keys[0], ka, kx, keys[0].key_ops ),
                                _subtle.importKey( 'jwk', keys[1], ka, kx, keys[1].key_ops )
                            ]);
                        })
                        .then( function ( keys ) {
                            return {
                                publicKey: keys[0],
                                privateKey: keys[1]
                            };
                        });
                }

                if ( ( isWebkit || ( isIE && ( ka.hash || {} ).name === 'SHA-1' ) )
                        && m === 'importKey' && a === 'jwk' && ka.name === 'HMAC' && b.kty === 'oct' ) {
                    return _subtle.importKey( 'raw', s2b( a2s(b.k) ), c, args[3], args[4] );
                }

                if ( isWebkit && m === 'importKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    return _subtle.importKey( 'jwk', pkcs2jwk(b), c, args[3], args[4] );
                }

                if ( isIE && m === 'unwrapKey' ) {
                    return _subtle.decrypt( args[3], c, b )
                        .then( function ( k ) {
                            return _subtle.importKey( a, k, args[4], args[5], args[6] );
                        });
                }

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror =    function ( e ) { rej(e)               };
                        op.oncomplete = function ( r ) { res(r.target.result) };
                    });
                }

                op = op.then( function ( k ) {
                    if ( ka.name === 'HMAC' ) {
                        if ( !ka.length ) ka.length = 8 * k.algorithm.length;
                    }
                    if ( ka.name.search('RSA') == 0 ) {
                        if ( !ka.modulusLength ) ka.modulusLength = (k.publicKey || k).algorithm.modulusLength;
                        if ( !ka.publicExponent ) ka.publicExponent = (k.publicKey || k).algorithm.publicExponent;
                    }
                    if ( k.publicKey && k.privateKey ) {
                        k = {
                            publicKey: new CryptoKey( k.publicKey, ka, kx, ku.filter(isPubKeyUse) ),
                            privateKey: new CryptoKey( k.privateKey, ka, kx, ku.filter(isPrvKeyUse) )
                        };
                    }
                    else {
                        k = new CryptoKey( k, ka, kx, ku );
                    }
                    return k;
                });

                return op;
            }
        });

    [ 'exportKey', 'wrapKey' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c ) {
                var args = [].slice.call(arguments);

                switch ( m ) {
                    case 'exportKey':
                        args[1] = b._key;
                        break;
                    case 'wrapKey':
                        args[1] = b._key, args[2] = c._key;
                        break;
                }

                if ( ( isWebkit || ( isIE && ( b.algorithm.hash || {} ).name === 'SHA-1' ) )
                        && m === 'exportKey' && a === 'jwk' && b.algorithm.name === 'HMAC' ) {
                    args[0] = 'raw';
                }

                if ( isWebkit && m === 'exportKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    args[0] = 'jwk';
                }

                if ( isIE && m === 'wrapKey' ) {
                    return _subtle.exportKey( a, b )
                        .then( function ( k ) {
                            if ( a === 'jwk' ) k = s2b( unescape( encodeURIComponent( JSON.stringify( b2jwk(k) ) ) ) );
                            return  _subtle.encrypt( args[3], c, k );
                        });
                }

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror =    function ( e ) { rej(e)               };
                        op.oncomplete = function ( r ) { res(r.target.result) };
                    });
                }

                if ( m === 'exportKey' && a === 'jwk' ) {
                    op = op.then( function ( k ) {
                        if ( ( isWebkit || ( isIE && ( b.algorithm.hash || {} ).name === 'SHA-1' ) )
                                && b.algorithm.name === 'HMAC') {
                            return { 'kty': 'oct', 'alg': jwkAlg(b.algorithm), 'key_ops': b.usages.slice(), 'ext': true, 'k': s2a( b2s(k) ) };
                        }
                        k = b2jwk(k);
                        if ( !k.alg ) k['alg'] = jwkAlg(b.algorithm);
                        if ( !k.key_ops ) k['key_ops'] = ( b.type === 'public' ) ? b.usages.filter(isPubKeyUse) : ( b.type === 'private' ) ? b.usages.filter(isPrvKeyUse) : b.usages.slice();
                        return k;
                    });
                }

                if ( isWebkit && m === 'exportKey' && ( a === 'spki' || a === 'pkcs8' ) ) {
                    op = op.then( function ( k ) {
                        k = jwk2pkcs( b2jwk(k) );
                        return k;
                    });
                }

                return op;
            }
        });

    [ 'encrypt', 'decrypt', 'sign', 'verify' ]
        .forEach( function ( m ) {
            var _fn = _subtle[m];

            _subtle[m] = function ( a, b, c, d ) {
                if ( isIE && ( !c.byteLength || ( d && !d.byteLength ) ) )
                    throw new Error("Empy input is not allowed");

                var args = [].slice.call(arguments),
                    ka = alg(a);

                if ( isIE && m === 'decrypt' && ka.name === 'AES-GCM' ) {
                    var tl = a.tagLength >> 3;
                    args[2] = (c.buffer || c).slice( 0, c.byteLength - tl ),
                    a.tag = (c.buffer || c).slice( c.byteLength - tl );
                }

                args[1] = b._key;

                var op;
                try {
                    op = _fn.apply( _subtle, args );
                }
                catch ( e ) {
                    return Promise.reject(e);
                }

                if ( isIE ) {
                    op = new Promise( function ( res, rej ) {
                        op.onabort =
                        op.onerror = function ( e ) {
                            rej(e);
                        };

                        op.oncomplete = function ( r ) {
                            var r = r.target.result;

                            if ( m === 'encrypt' && r instanceof AesGcmEncryptResult ) {
                                var c = r.ciphertext, t = r.tag;
                                r = new Uint8Array( c.byteLength + t.byteLength );
                                r.set( new Uint8Array(c), 0 );
                                r.set( new Uint8Array(t), c.byteLength );
                                r = r.buffer;
                            }

                            res(r);
                        };
                    });
                }

                return op;
            }
        });

    if ( isIE ) {
        var _digest = _subtle.digest;

        _subtle['digest'] = function ( a, b ) {
            if ( !b.byteLength )
                throw new Error("Empy input is not allowed");

            var op;
            try {
                op = _digest.call( _subtle, a, b );
            }
            catch ( e ) {
                return Promise.reject(e);
            }

            op = new Promise( function ( res, rej ) {
                op.onabort =
                op.onerror =    function ( e ) { rej(e)               };
                op.oncomplete = function ( r ) { res(r.target.result) };
            });

            return op;
        };

        global.crypto = Object.create( _crypto, {
            getRandomValues: { value: function ( a ) { return _crypto.getRandomValues(a) } },
            subtle:          { value: _subtle }
        });

        global.CryptoKey = CryptoKey;
    }

    if ( isWebkit ) {
	//If it is iOS and version>=11 or Safari version >=11
	/*Below changes are to accommodate apple implementing WebCrypto SubtleCrypto 
	rather than WebKitSubtleCrypto and to maintain backward compatibility*/
	if ((userOSversion  >= 11) || (navigator.userAgent.indexOf('Version/11.') > -1 && navigator.userAgent.indexOf("Safari") > -1 ))
    	{
            //Do nothing
    	}
	else
    	{
        _crypto.subtle = _subtle;
	}

        global.Crypto = _Crypto;
        global.SubtleCrypto = _SubtleCrypto;
        global.CryptoKey = CryptoKey;
    }
}(this);


/**
 * ================================================================= 
 * Source file taken from :: wlcrypto.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Handles the Crypto API
 * 
 * @type {{signPayload, generateKeypair}}
 */
__WLCrypto = 
	
	function CreateCryptoObject () {

    /* ############## Asymmetric Native Crypto ############## */
	var dfd = WLJQ.Deferred();
	try{
      var crypto = window.crypto.subtle || window.crypto.webkitSubtle;
    }catch(e){
      WL.Logger.info('No Crypto Object in this browser! '+JSON.stringify(e));
    }

    var generateAsymmetricKeyPair = function () {
        var dfd = WLJQ.Deferred();
        var algorithmKeyGen = {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),  // Equivalent
																	// to 65537
            hash: {
                name: 'SHA-256'
            }
        };
        // When using IndexedDB AND native crypto we can set the key as
		// non-extractable. We want it 'extractable' to be TRUE when we are
		// using Crypto-Shim OR when we do NOT have IndexedDB available
        var isExtractable = !WL.AsyncDAO.isIndexedDB() || isCryptoShim;
        // changed 2nd parameter to true to accommodate extraction of keys
        crypto.generateKey(algorithmKeyGen, true, ['sign']).then(
            function (keyPair) {
                dfd.resolve(keyPair);
            },
            function (error) {
                WL.Logger.error('Failed to generate keypair ' + JSON.stringify(error));
                dfd.reject(error);
            }
        );

        return dfd.promise();
    };

    var signAsymmetricKeyPair = function (payload, kid, keyPair) {
        var dfd = WLJQ.Deferred();

        exportPublicKey(keyPair).then(
            function (jwk) {
                var alg = jwk.alg;
                jwk.kid = !WL.Validators.isNullOrUndefined(kid) ? kid : undefined;
                var header = {'alg' : alg, 'jwk' : jwk};
                var jwsHeaderAsString = JSON.stringify(header);
                var payloadAsString = JSON.stringify(payload);
                // concatenate JWS Header and payload.
                var csrHeaderAndPayload = encodeToBase64(jwsHeaderAsString) + '.' + encodeToBase64(payloadAsString);
                signData(csrHeaderAndPayload, keyPair).then(
                    function (signedData) {
                        dfd.resolve(csrHeaderAndPayload + '.' + signedData);
                    },
                    function (error) {
                        dfd.reject(error);
                    });
            },
            function (error) {
                dfd.reject(error);
            });
        return dfd.promise();
    };

    var signData = function (stringToSign, keyPair) {
        var dfd = WLJQ.Deferred();

        var algorithmSign = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        };
        crypto.sign(algorithmSign, keyPair.privateKey, new Uint8Array(str2arrayBuffer(stringToSign))).then(
            function (signedData) {
                var base64sign = btoa(String.fromCharCode.apply(null, new Uint8Array(signedData)));
                dfd.resolve(base64sign);
            })
            .catch(
                function (error) {
                    WL.Logger.error('error in signing data with keypair: ' + error.toString());
                    dfd.reject(error);
                });

        return dfd.promise();
    };

    

    var exportPublicKey = function (keyPair) {
        var dfd = WLJQ.Deferred();

        crypto.exportKey("jwk", keyPair.publicKey).then(
            function (jsonKey) {
                dfd.resolve(jsonKey);
            },
            function (error) {
                WL.Logger.error('Failed to extract public key from keypair ' + error.toString());
                dfd.reject(error);
            });

        return dfd.promise();
    };
    /* ############### End Asymmetric Native Crypto ################ */
    /* ################## Symmetric Key ####################### */

        var signSymmetric = function (payload, kid, keyPair) {
        var dfd = WLJQ.Deferred();
  	  	var jwk = createJWK(kid);
        var alg = 'HS256';
    	var header = {'alg' : alg, 'jwk' : jwk, 'key' : keyPair.publicKey};
        var jwsHeaderAsString = JSON.stringify(header);
        var payloadAsString = JSON.stringify(payload);
        // concatenate JWS Header and payload.
        var csrHeaderAndPayload = encodeToBase64(jwsHeaderAsString) + '.' + encodeToBase64(payloadAsString);
        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.setHMACKey(keyPair.publicKey, "TEXT");
        shaObj.update(csrHeaderAndPayload);
        var signedData = shaObj.getHMAC("B64");
        dfd.resolve(csrHeaderAndPayload + '.' + signedData);
        return dfd.promise();

      }
      
      var generateSymmetricKey = function (){
    	  var dfd = WLJQ.Deferred();
		  try{
			  dfd.resolve(CreateSymmetricKey(7));
		  } catch(e) {
			  // for older browsers who need to self generate seed
			  var cont = function () {
				    sjcl.random.removeEventListener('seeded', cont);
				    // The collectors can be turned off if no more entropy is
					// needed.
				    sjcl.random.stopCollectors();

					dfd.resolve(CreateSymmetricKey(4));
				};

				sjcl.random.addEventListener('seeded', cont);
				sjcl.random.startCollectors();
		  }
          return dfd.promise();
      }
      
      // creates a random key for symmetric signing
      function CreateSymmetricKey(entropy){
    	var numbers = sjcl.random.randomWords(4, entropy);
		var key = "";
		for (var i=0;i<numbers.length;i++){
			key+=btoa(numbers[i]);
		}
		key = key.replace(/=/g,"");
		key = key.substring(0,32);
		var keyPair = {};
        keyPair.privateKey = key;
        keyPair.publicKey = key;
        return keyPair;
      }
      
      /* ################## End Symmetric Key ####################### */
      /* ################## Utils ####################### */
      
      var createJWK = function(kid){
    	  var jwk = {};
          jwk.kid = !WL.Validators.isNullOrUndefined(kid) ? kid : undefined;
          jwk.use = 'enc';
          jwk.kty = 'oct';
          jwk.k = "";
          return jwk;
      }
      
      var encodeToBase64 = function (string) {
          return btoa(String.fromCharCode.apply(null, new Uint8Array(str2arrayBuffer(string))));
      };
      
      var str2arrayBuffer = function (str) {
          var buf = new ArrayBuffer(str.length);
          var bufView = new Uint8Array(buf);
          for (var i = 0, strLen = str.length; i < strLen; i++) {
              bufView[i] = str.charCodeAt(i);
          }
          return buf;
      }
      /* ################## End Utils ####################### */
      
      /*
		 * return true if asymmetric encryption based on native or shimmed
		 * capabilities false for symmetric encryption with key in local storage
		 * (no shims)
		 */
      function isAsymmetricAvailable(){
        var dfd = WLJQ.Deferred();
        if ((window.crypto && window.crypto.subtle)// Normal Browsers
            || (window.msCrypto && window.msCrypto.subtle) || // Supports
            // IE
            (window.crypto && window.crypto.webkitSubtle)) { // Supports
            // Safari
            console.log("Crypto Object is available...");
            generateAsymmetricKeyPair().then(function (keyPair) {
                dfd.resolve(true);
            }, function (err) {
                dfd.resolve(false);
            });
        } else {
            dfd.resolve(false);
        }
        return dfd.promise();
     }
      
     isAsymmetricAvailable().then(function (result) {
        console.log("isAsymmetricAvailable", result);
        // Checking for sdkProtocol version and if it is one then using the old algorithm for compatibility
        if (result && WL.Config.__getSDKProtocolVersion().sdk_protocol_version >= 2) {
            WL.Crypto = {
                signJWS: signAsymmetricKeyPair,
                generateKeyPair: generateAsymmetricKeyPair,
                cryptoFlag: true, // wi 119013,
                signData: signData
            };
        } else {
            WL.Crypto = {
                signJWS: signSymmetric,
                generateKeyPair: generateSymmetricKey,
                cryptoFlag: false // wi 119013
            };
        }
        dfd.resolve();
    });
    	  
      return dfd.promise();
};

/**
 * ================================================================= 
 * Source file taken from :: wlIndexDb.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*jshint strict:false, maxparams:4*/
__WLIndexDB = function() {
    var defaultCategory = 'default';

    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
    var indexedDB = null;



    // Open (or create) the database, the database is always the appID
    var dbName;

    var db;

    /**
     * Initializes the DB and creates a default category, should be called on startup
     * @returns {*}
     */
    this.init = function() {
        var dfd = WLJQ.Deferred();

        indexedDB = getIndexedDB();

        // In the cases where we don't have indexedDB support
        WL.Validators.validateDefined(indexedDB, 'init');

        dbName = WL.Config.__getApplicationName();
        var request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = function(event) {
            var thisDB = event.target.result;
            if(!thisDB.objectStoreNames.contains(defaultCategory)) {
                thisDB.createObjectStore(defaultCategory, {keyPath: "key"});
            }
            var transaction = event.target.transaction;

            transaction.oncomplete =
                function() {
                   db = event.target.result;
                   dfd.resolve();
                }
        };

        request.onerror = function (event) {
            WL.Logger.error(JSON.stringify(event.target.error.message));
            dfd.reject(event.target.error);
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            dfd.resolve();
        };
        return dfd.promise();
    };

    /**
     * Sets an item in the database
     * @param key
     * @param value
     * @returns {*}
     */
    this.setItem = function(key, value) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readwrite');
        var input = {'key' : key , 'value' : value};
        var request = store.put(input);

        request.onsuccess = function() {
            dfd.resolve();
        };

        request.onerror = function(e) {
            WL.Logger.error('Error setting item in indexedDb : ' + e.target.error.name);
            dfd.reject(e);
        };
        return dfd.promise();
    };

    /**
     * Gets an item in the database
     * @param key
     * @returns {value for given key}
     */
    this.getItem = function(key) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readonly');
        var request = store.get(key);

        request.onerror = function(e) {
            WL.Logger.error('Error getting item from indexedDb : ' + e.target.error.name);
            dfd.reject(e);
        };

        request.onsuccess = function() {
            if (!WL.Validators.isNullOrUndefined(request.result)){
                dfd.resolve(request.result.value);
            } else {
                dfd.resolve();
            }
        };
        return dfd.promise();
    };

    /**
     * Removes an item in the database
     * @param key
     * @returns {*}
     */
    this.removeItem = function(key) {
        var dfd = WLJQ.Deferred();
        var store = getObjectStore('readwrite');

        var request = store.delete(key);

        request.onsuccess = function() {
            dfd.resolve();
        };
        return dfd.promise();
    };

    this.clearDB = function() {
        var dfd = WLJQ.Deferred();
        var DBOpenRequest = window.indexedDB.open(dbName, 1);
        DBOpenRequest.onsuccess = function (event) {

            // store the result of opening the database in the db variable. This is used a lot below
            var db = event.target.result;
            var transaction = db.transaction(defaultCategory, 'readwrite');
            var objectStore = transaction.objectStore(defaultCategory);
            var objectStoreRequest = objectStore.clear();

            objectStoreRequest.onsuccess = function(event) {
                dfd.resolve();
            };

            objectStoreRequest.onerror = function(event) {
                dfd.reject();
            };
        };
        return dfd.promise();
    };

    function getObjectStore(permissions) {
        WL.Validators.validateDefined(db, 'getObjectStore');
        var tx = db.transaction(defaultCategory, permissions);
        return tx.objectStore(defaultCategory);
    }

    function getIndexedDB() {
        // Get IndexedDB Factory according to browser
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    }

};



/**
 * ================================================================= 
 * Source file taken from :: wldao.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLDAO = function() {
	var dao;

	/**
	 * Initializes the database and verifies it is accessible
	 * 
	 * @returns {*}
	 */
	this.init = function() {
		try {
			dao = new __WLLocalStorageDB();
			dao.init();
			dao.setItem("testKey", "testValue");
			if (dao.getItem("testKey") == "testValue") {
				dao.removeItem("testKey");
			} else {
				throw "LocalStorage Error";
			}
		} catch (e) {
			dao = new __WLVarStorageDB();
			dao.init();
		}
	};

	/**
	 * Sets an item in the database
	 * 
	 * @param key
	 * @param value
	 * @param options
	 *            {{session : boolean, global : boolean}} - NOTE: When local storage
	 *            is not available (e.g. Safari private mode) all data will be
	 *            saved as session storage (regardless of options parameter);
	 * @returns {*}
	 */
	this.setItem = function(key, value, options) {
		dao.setItem(key, value, options);
	}

	/**
	 * Gets an item in the database
	 * 
	 * @param key
	 * @param options
	 *            {{session : boolean, global : boolean}}
	 * @returns {value for given key}
	 */
	this.getItem = function(key, options) {
		return dao.getItem(key, options);
	}

	/**
	 * Removes an item in the database
	 * 
	 * @param key
	 * @param options
	 *            {{session : boolean, global : boolean}}
	 * @returns {*}
	 */
	this.removeItem = function(key, options) {
		dao.removeItem(key, options);
	}
};

__WL.prototype.DAO = new __WLDAO;
WL.DAO = new __WLDAO;

/**
 * ================================================================= 
 * Source file taken from :: wlasyncdao.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLAsyncDAO = function() {
	var dao;
	var isIndexedDBEnabled = false;
	
	/**
     * Initializes the database and verifies it is accessible
     * @returns {*}
     */
	this.init = function() {
		var dfd = WLJQ.Deferred();
		dao = new __WLIndexDB();
		// check if IndexedDB is actually working by setting a test value and
		// then getting it by the test key. Finally removing the test key-value
		// pair and asserting that IndexDB is working by the isIndexedDBEnabled
		// variable.
		try{
		dao.init().done(function() {
			dao.setItem("testKey", "testValue").done(function() {
				dao.getItem("testKey").done(function(value) {
					if (value == "testValue") {
						dao.removeItem("testKey").done(function() {
							isIndexedDBEnabled = true;
							dfd.resolve();
						});
					} else {
						dao = new __WLSyncDAOWrapper();
						dao.init();
						dfd.resolve();
					}
				});
			});
			// all failures will be caught here and revert the underlying DAO
			// object to the synchronous DAO object.
		}).fail(function() {
			dao = new __WLSyncDAOWrapper();
			dao.init();
			dfd.resolve();
		});
		} catch (err){
			dao = new __WLSyncDAOWrapper();
			dao.init();
			dfd.resolve();
		}
		return dfd.promise();
	};
	
	/**
     * Sets an item in the database
     * @param key
     * @param value
     * @returns {*}
     */
	this.setItem = function(key, value) {
		var dfd = WLJQ.Deferred();
		dao.setItem(key, value).then(function(){
			dfd.resolve();
		});
		return dfd.promise();
	}

	/**
     * Gets an item in the database
     * @param key
     * @returns {value for given key}
     */
	this.getItem = function(key) {
		var dfd = WLJQ.Deferred();
		dao.getItem(key).then(function(value) {
			dfd.resolve(value);
		});
		return dfd.promise();
	}

	/**
     * Removes an item in the database
     * @param key
     * @returns {*}
     */
	this.removeItem = function(key) {
		var dfd = WLJQ.Deferred();
		dao.removeItem(key).then(function() {
			dfd.resolve();
		});
		return dfd.promise();
	}
	
	/**
     * Checks if IndexedDB is available and working properly
     * @returns {bool - true if IndexedDB is available}
     */
	this.isIndexedDB = function() {
		return isIndexedDBEnabled;
	}
};

/**
 * ================================================================= 
 * Source file taken from :: wldaoasyncwrapper.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
__WLSyncDAOWrapper = function() {
	var dao;
	
	/**
     * Initializes the database
     * @returns {*}
     */
	this.init = function() {
		var dfd = WLJQ.Deferred();
		dao = new __WLDAO();
		dao.init();
		dfd.resolve();
		return dfd.promise();
	};

	/**
     * Sets an item in the Database
     * @param key
     * @param value
     * @returns {*}
     */
	this.setItem = function(key, value) {
		var dfd = WLJQ.Deferred();
		dao.setItem(key, value);
		dfd.resolve();
		return dfd.promise();
	}

	this.getItem = function(key) {
		var dfd = WLJQ.Deferred();
		var value = dao.getItem(key);
		dfd.resolve(value);
		return dfd.promise();
	}

	this.removeItem = function(key) {
		var dfd = WLJQ.Deferred();
		dao.removeItem(key);
		dfd.resolve();
		return dfd.promise();
	}
};

/**
 * ================================================================= 
 * Source file taken from :: wlvarstorage.js
 * ================================================================= 
 */

/*
 Licensed Materials - Property of IBM

 (C) Copyright 2016 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

__WLVarStorageDB = function() {

	var appNamePrefix;
	var storage = {};

	/**
     * Initializes the database and verifies it is accessible
     * @returns {*}
     */
	this.init = function() {
		appNamePrefix = WL.Config.__getApplicationName();
	};

    /**
     * Sets an item in the Database
     * @param key
     * @param value
     * @returns {*}
     */
	this.setItem = function(key, value) {
		var finalKey = buildKey(key);
		var finalValue = value ? JSON.stringify(value) : null;
		storage[finalKey] = finalValue;
	};

    /**
     * Gets an item in the Database
     * @param key
     * @returns {string - JSON representation of value for given key}
     */
	this.getItem = function(key) {
		var finalKey = buildKey(key);
		value = storage[finalKey];
		return value ? JSON.parse(value) : null;
	};

	/**
     * Removes an item in the database
     * @param key
     * @returns {*}
     */
	this.removeItem = function(key) {
		var finalKey = buildKey(key);
		delete storage[finalKey];
	};

	
	 // Builds the key with the appName prefeix
	function buildKey(key) {
		return appNamePrefix + '.' + key;
	}
};


/**
 * ================================================================= 
 * Source file taken from :: wlgap.web.js
 * ================================================================= 
 */

/**
 * Created by orep on 4/12/16.
 */
//TODO

/**
 * ================================================================= 
 * Source file taken from :: wlcertmanager.js
 * ================================================================= 
 */

/*
 * Licensed Materials - Property of IBM
 * 5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/* Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved. */

WL.CertManager = (function () {
    /*jshint strict:false, maxparams:4*/

    var KEYPAIR_OAUTH_ID = 'com.mfp.oauth.keypair';

    // Map of keypairId -> keypair generated by WL.Crypto.generateKeyPair
    var keyPairMapping = {};

    
    var getEncryptedDeviceID = function () {
        var dfd = WLJQ.Deferred();
        var deviceId = WL.BrowserManager.getDeviceData().id;
        if (!deviceId) return null;
        try {
            getOrCreateKeyPair(KEYPAIR_OAUTH_ID).then(
                function (keyPair) {
                    WL.Crypto.signData(deviceId, keyPair).then(function (signedData) {
                        dfd.resolve(signedData);
                    }, function (err) {
                        dfd.reject(err);
                    });
                },
                function (error) {
                    dfd.reject(error);
                });
        } catch (e) {
            dfd.reject(e);
        }
        return dfd.promise();;
    };

    /**
     * Generate keypair(private+public) and save it in indexDB and in memory.
     */
    var generateKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        keyPairId = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;
        WL.Crypto.generateKeyPair().then(
            function (keyPair) {
                keyPairMapping[keyPairId] = keyPair;
             
             if(WL.Crypto.cryptoFlag==true){ // wi 119013
                        saveOrUpdateKeyPair(keyPairId, keyPair).then(
                            function () {
                                dfd.resolve(keyPair);
                            },
                            function (error) {
                                WL.Logger.error('Failed to save keypair in indexDB ' + JSON.stringify(error));
                                dfd.reject(error);
                            });
                        }else{ 
                            dfd.resolve(keyPair);
                        }
             },
            function (error) {
                dfd.reject(error);
            });

        return dfd.promise();
    };

    var getOrCreateKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        var keyForDB = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;
        if (keyPairMapping.hasOwnProperty(keyPairId) && !WL.Validators.isNullOrUndefined(keyPairMapping[keyPairId])) {
            dfd.resolve(keyPairMapping[keyPairId]);
        } else {
            getKeyPair(keyForDB).then(
                function (keyPair) {
                    if (!WL.Validators.isNullOrUndefined(keyPair)) {
                        dfd.resolve(keyPair);
                    } else {
                        generateKeyPair(keyPairId).then(
                            function (keyPair) {
                                dfd.resolve(keyPair)
                            },
                            function (error) {
                                dfd.reject(error);
                            });
                    }
                },
                // failed to read from DB
                function (error) {
                    dfd.reject(error)
                });
        }

        return dfd.promise();
    };

    var deleteKeyPair = function (keyPairId) {
        var dfd = WLJQ.Deferred();

        var keyForDB = !WL.Validators.isNullOrUndefined(keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;

        if (keyPairMapping.hasOwnProperty(keyForDB)) {
            keyPairMapping.keyPairId = null;
        }
        removeKeyPair(keyForDB).then(
            function () {
                dfd.resolve();
            },
            function (error) {
                dfd.reject(error);
            });
        return dfd.promise();
    };
    /**
     *
     * @param payload - payload to sign
     * @param options - optional json object, {"kid": client_id, "keyPairId" : idForKeyPair}
     */
    var signJWS = function (payload, options) {
        var optionParams = WL.Validators.isNullOrUndefined(options) ? {} : options;
        var dfd = WLJQ.Deferred();

        var kid = optionParams.kid;
        var keyPairId = !WL.Validators.isNullOrUndefined(optionParams.keyPairId) ? keyPairId : KEYPAIR_OAUTH_ID;

        getOrCreateKeyPair(keyPairId).then(
            function (keyPair) {
                WL.Crypto.signJWS(payload, kid, keyPair).then(
                    function (jws) {
                        dfd.resolve(jws);
                    },
                    function (error) {
                        dfd.reject(error);
                    });
            },
            function (error) {
                dfd.reject(error);
            });

        return dfd.promise();
    };

    var exportKey = function (cryptoKey) {
        var dfd = WLJQ.Deferred();
        try {
            var crypto = window.crypto.subtle || window.crypto.webkitSubtle;
            crypto.exportKey(
                "jwk",
                cryptoKey
            ).then(function (jsonKeyData) {
                dfd.resolve(jsonKeyData);
            }).catch(function (err) {
                console.error(err);
            });
        } catch (e) {
            WL.Logger.info('No Crypto Object in this browser! ' + JSON.stringify(e));
        }
        return dfd.promise();
    }

    var importKey = function (jsonKey) {
        var dfd = WLJQ.Deferred();
        try {
            var crypto = window.crypto.subtle || window.crypto.webkitSubtle;
            crypto.importKey(
                "jwk",
                jsonKey,
                {
                    name: 'RSASSA-PKCS1-v1_5',
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {
                        name: 'SHA-256'
                    }
                },
                true,
                jsonKey.key_ops
            ).then(function (importedKey) {
                dfd.resolve(importedKey);
            }).catch(function (err) {
                console.error(err);
                dfd.reject(err);
            });
        } catch (e) {
            WL.Logger.info('No Crypto Object in this browser! ' + JSON.stringify(e));
        }
        return dfd.promise();
    }
    
    var saveOrUpdateKeyPair = function(keyId, keypair) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        var privateKey = keypair.privateKey;
        var publicKey = keypair.publicKey;

        // Save public key
        exportKey(privateKey).then(function (jsonKeyData) {
            exportKey(publicKey).then(function(publicJsonKeyData) {
                WL.AsyncDAO.setItem(publicKeyKey, publicJsonKeyData).then(
                    function () {
                        // save exported json key in indexedDB
                        WL.AsyncDAO.setItem(privateKeyKey, jsonKeyData).then(
                            function () {
                                dfd.resolve();
                            }, function (error) {
                                dfd.reject(error);
                            });
                    }, function (error) {
                        dfd.reject(error);
                    });
            })
        });
        return dfd.promise();
    };


    var getKeyPair = function (keyId) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        var keypair = {};
        if (WL.Crypto.cryptoFlag == true) { // wi 119013
            //Get private key
            WL.AsyncDAO.getItem(privateKeyKey).then(
                function (privateKeyJsonExported) {
                    console.log('Getting the private from DB --> ' ,privateKeyJsonExported)
                    if (!privateKeyJsonExported) {
                        dfd.resolve(null);
                    }
                    importKey(privateKeyJsonExported).then(function (privateKey) {
                        // Continue to  get public key
                        console.log('Getting the privatekey by importing --> ' ,privateKey)
                        keypair['privateKey'] = privateKey;
                        WL.AsyncDAO.getItem(publicKeyKey)
                            .then(
                                function (publicKeyJsonExported) {
                                    console.log('Getting the public from DB --> ' ,publicKeyJsonExported)
                                    if (!publicKeyJsonExported) {
                                        dfd.resolve(null);
                                    } 
                                    if(publicKeyJsonExported instanceof CryptoKey){
                                        console.log('Saved key is an instance of type cryptokey --> ' ,publicKeyJsonExported);
                                        keypair['publicKey'] = publicKeyJsonExported;
                                        dfd.resolve(keypair);
                                    }
                                    else{
                                        console.log('Saved key is an not an instance of type cryptokey --> ' ,publicKeyJsonExported);
                                        importKey(publicKeyJsonExported).then(function (publicKey) {
                                            keypair['publicKey'] = publicKey;
                                            console.log('Returning KeyPair --> ' ,keypair);
                                            dfd.resolve(keypair);
                                        });
                                    }
                                },
                                function (e) {
                                    dfd.reject(e);
                                });
                    });
                }, function (e) {
                    dfd.reject(e);
                });
        } else {  // wi 119013
            WL.Crypto.generateKeyPair().then(
                function (keyPair) {
                    dfd.resolve(keyPair);
                },
                function (error) {
                    dfd.reject(error);
                });
        }
        return dfd.promise();
    };

    var removeKeyPair = function(keyId) {
        var dfd = WLJQ.Deferred();
        var privateKeyKey = keyId + '.private.key';
        var publicKeyKey = keyId + '.public.key';
        WL.AsyncDAO.removeItem(privateKeyKey).always(
            function(){
            	WL.AsyncDAO.removeItem(publicKeyKey).always(function(){
                dfd.resolve();
            });
        });
        return dfd.promise();
    };
    
    var init = function(){
        var dfd = WLJQ.Deferred();
    	__WL.prototype.AsyncDAO = new __WLAsyncDAO();
    	WL.AsyncDAO = new __WLAsyncDAO();
    	WL.AsyncDAO.init().done(
                function () {
                	new __WLCrypto().done(function(){//synchronized this function to avoid MFP APIs unaccessible immediately after wlCommonInit() function gets called. 
                	  dfd.resolve();	
                	});
                });
    	return dfd.promise();
    };

    return {
    	init:init,
        signJWS: signJWS,
        getEncryptedDeviceID: getEncryptedDeviceID,
        deleteKeyPair: deleteKeyPair,
        getOrCreateKeyPair: getOrCreateKeyPair
    };

}());

     // Exposing WL.ResourceRequest and WL.AuthorizationManager to the global name space is for backward compatibility and for consistency to hybrid client
    WL.ResourceRequest = WLResourceRequest;
    WL.AuthorizationManager = WLAuthorizationManager;
    
    // Compatibility with Analytics hybrid client
    WL.Logger = wlanalytics.logger;
    WL.Logger.send = wlanalytics.send;
    WL.Logger.on = wlanalytics.enable;
    WL.Analytics = wlanalytics;
    
    return WL;
}));
;"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.cipher.aes=function(a){this.s[0][0][0]||this.O();var b,c,d,e,f=this.s[0][4],g=this.s[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var a=this.s[0],b=this.s[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;0x100>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1)for(m=g^g<<1^g<<2^g<<3^g<<4,m=m>>8^m&255^99,c[f]=m,d[m]=f,n=h[e=h[l=h[f]]],p=0x1010101*n^0x10001*e^0x101*l^0x1010100*f,n=0x101*h[m]^0x1010100*m,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8;for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function t(a,b,c){if(4!==b.length)throw new sjcl.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,r=[0,0,0,0];h=a.s[c];a=h[0];var q=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],k=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],l=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=
0;4>m;m++)r[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return r}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.$(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.$(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},$:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},i:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(a,b,c){var d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f="",g=0,h=sjcl.codec.base32.B,k=0,l=sjcl.bitArray.bitLength(a);c&&(h=sjcl.codec.base32.X);for(c=0;f.length*d<l;)f+=h.charAt((k^a[c]>>>g)>>>e),g<d?(k=a[c]<<d-g,g+=e,c++):(k<<=d,g-=d);for(;f.length&7&&!b;)f+="=";return f},toBits:function(a,b){a=a.replace(/\s|=/g,"").toUpperCase();var c=sjcl.codec.base32.BITS,
d=sjcl.codec.base32.BASE,e=sjcl.codec.base32.REMAINING,f=[],g,h=0,k=sjcl.codec.base32.B,l=0,n,m="base32";b&&(k=sjcl.codec.base32.X,m="base32hex");for(g=0;g<a.length;g++){n=k.indexOf(a.charAt(g));if(0>n){if(!b)try{return sjcl.codec.base32hex.toBits(a)}catch(p){}throw new sjcl.exception.invalid("this isn't "+m+"!");}h>e?(h-=e,f.push(l^n>>>h),l=n<<c-h):(h+=d,l^=n<<c-h)}h&56&&f.push(sjcl.bitArray.partial(h&56,l,1));return f}};
sjcl.codec.base32hex={fromBits:function(a,b){return sjcl.codec.base32.fromBits(a,b,1)},toBits:function(a){return sjcl.codec.base32.toBits(a,1)}};
sjcl.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.B,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.B,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++){h=f.indexOf(a.charAt(d));
if(0>h)throw new sjcl.exception.invalid("this isn't base64!");26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e)}e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.O();a?(this.F=a.F.slice(0),this.A=a.A.slice(0),this.l=a.l):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.F=this.Y.slice(0);this.A=[];this.l=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.A=sjcl.bitArray.concat(this.A,a);b=this.l;a=this.l=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.A,c=this.F,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.l/0x100000000));for(b.push(this.l|0);b.length;)u(this,b.splice(0,16));this.reset();return c},Y:[],b:[],O:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}for(var b=0,c=2,d,e;64>b;c++){e=!0;for(d=2;d*d<=c;d++)if(0===c%d){e=
!1;break}e&&(8>b&&(this.Y[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};
function u(a,b){var c,d,e,f=a.F,g=a.b,h=f[0],k=f[1],l=f[2],n=f[3],m=f[4],p=f[5],r=f[6],q=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+q+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(r^m&(p^r))+g[c],q=r,r=p,p=m,m=n+d|0,n=l,l=k,k=h,h=d+(k&l^n&(k^l))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;f[0]=f[0]+h|0;f[1]=f[1]+k|0;f[2]=f[2]+l|0;f[3]=f[3]+n|0;f[4]=f[4]+m|0;f[5]=f[5]+p|0;f[6]=f[6]+r|0;f[7]=
f[7]+q|0}
sjcl.mode.ccm={name:"ccm",G:[],listenProgress:function(a){sjcl.mode.ccm.G.push(a)},unListenProgress:function(a){a=sjcl.mode.ccm.G.indexOf(a);-1<a&&sjcl.mode.ccm.G.splice(a,1)},fa:function(a){var b=sjcl.mode.ccm.G.slice(),c;for(c=0;c<b.length;c+=1)b[c](a)},encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];if(7>k)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,
8*(15-f));b=sjcl.mode.ccm.V(a,b,c,d,e,f);g=sjcl.mode.ccm.C(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,h-e),h=(h-e)/8;if(7>g)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl.mode.ccm.C(a,k,c,l,e,b);a=sjcl.mode.ccm.V(a,k.data,c,d,e,b);if(!f.equal(k.tag,a))throw new sjcl.exception.corrupt("ccm: tag doesn't match");
return k.data},na:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,k=h.i;d=[h.partial(8,(b.length?64:0)|d-2<<2|f-1)];d=h.concat(d,c);d[3]|=e;d=a.encrypt(d);if(b.length)for(c=h.bitLength(b)/8,65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c])),g=h.concat(g,b),b=0;b<g.length;b+=4)d=a.encrypt(k(d,g.slice(b,b+4).concat([0,0,0])));return d},V:function(a,b,c,d,e,f){var g=sjcl.bitArray,h=g.i;e/=8;if(e%2||4>e||16<e)throw new sjcl.exception.invalid("ccm: invalid tag length");
if(0xffffffff<d.length||0xffffffff<b.length)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");c=sjcl.mode.ccm.na(a,d,c,e,g.bitLength(b)/8,f);for(d=0;d<b.length;d+=4)c=a.encrypt(h(c,b.slice(d,d+4).concat([0,0,0])));return g.clamp(c,8*e)},C:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.i;var k=b.length,l=h.bitLength(b),n=k/50,m=n;c=h.concat([h.partial(8,f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)g>n&&(sjcl.mode.ccm.fa(g/
k),n+=m),c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl.mode.ocb2.S,k=sjcl.bitArray,l=k.i,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));
d.length&&(n=l(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){if(128!==sjcl.bitArray.bitLength(c))throw new sjcl.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl.mode.ocb2.S,h=sjcl.bitArray,k=h.i,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,r=sjcl.bitArray.bitLength(b)-e,q=[];d=d||[];for(c=0;c+4<r/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),q=q.concat(m),n=g(n);p=r-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,
0,0]));l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl.mode.ocb2.pmac(a,d)));if(!h.equal(h.clamp(l,e),h.bitSlice(b,r)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return q.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.S,e=sjcl.bitArray,f=e.i,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);
return a.encrypt(f(d(f(h,d(h))),g))},S:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.C(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.C(!1,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return a.data},ka:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.i;e=[0,0,
0,0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.ka(b,a);return b},C:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,r,q=sjcl.bitArray;m=c.length;p=q.bitLength(c);r=q.bitLength(d);h=q.bitLength(e);
g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl.mode.gcm.j(g,[0,0,0,0],e),e=sjcl.mode.gcm.j(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.j(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.j(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=q.clamp(c,p);a&&(d=sjcl.mode.gcm.j(g,h,c));a=[Math.floor(r/0x100000000),r&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.j(g,d,a);k=b.encrypt(e);
d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.W=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.w=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.w[0].update(c[0]);this.w[1].update(c[1]);this.R=new b(this.w[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this.aa)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]);this.aa=!1};sjcl.misc.hmac.prototype.update=function(a){this.aa=!0;this.R.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.R.finalize(),a=(new this.W(this.w[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E4;if(0>d||0>c)throw new sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++)for(f=a.encrypt(f),h=0;h<f.length;h++)e[h]^=f[h];l=l.concat(e)}d&&(l=n.clamp(l,d));return l};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.m=[0];this.P=0;this.H={};this.N=0;this.U={};this.Z=this.f=this.o=this.ha=0;this.b=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.L=void 0;this.M=a;this.D=!1;this.K={progress:{},seeded:{}};this.u=this.ga=0;this.I=1;this.J=2;this.ca=0x10000;this.T=[0,48,64,96,128,192,0x100,384,512,768,1024];this.da=3E4;this.ba=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.u)throw new sjcl.exception.notReady("generator isn't seeded");if(d&this.J){d=!(d&this.I);e=[];var f=0,g;this.Z=e[0]=(new Date).valueOf()+this.da;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.m[g],this.m[g]=0,d||!(this.P&1<<g));g++);this.P>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.m.push(0));this.f-=f;f>this.o&&(this.o=
f);this.P++;this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.L=new sjcl.cipher.aes(this.b);for(d=0;4>d&&(this.h[d]=this.h[d]+1|0,!this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.ca&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=a},addEntropy:function(a,
b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.H[c],h=this.isReady(),k=0;d=this.U[c];void 0===d&&(d=this.U[c]=this.ha++);void 0===g&&(g=this.H[c]=0);this.H[c]=(this.H[c]+1)%this.c.length;switch(typeof a){case "number":void 0===b&&(b=1);this.c[g].update([d,this.N++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(k=1),c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&
(k=1);if(!k){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.N++,2,b,f,a.length].concat(a))}break;case "string":void 0===b&&(b=a.length);this.c[g].update([d,this.N++,3,b,f,a.length]);this.c[g].update(a);break;default:k=1}if(k)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.f+=b;h===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},
isReady:function(a){a=this.T[void 0!==a?a:this.M];return this.o&&this.o>=a?this.m[0]>this.ba&&(new Date).valueOf()>this.Z?this.J|this.I:this.I:this.f>=a?this.J|this.u:this.u},getProgress:function(a){a=this.T[a?a:this.M];return this.o>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.D){this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)};if(window.addEventListener)window.addEventListener("load",
this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl.exception.bug("can't attach event");
this.D=!0}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",
this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=!1)},addEventListener:function(a,b){this.K[a][this.ga++]=b},removeEventListener:function(a,b){var c,d,e=this.K[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},la:function(){C(this,1)},oa:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},qa:function(a){a=
a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},ma:function(){C(this,2)},ea:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};
function A(a,b){var c,d=sjcl.random.K[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy((new Date).valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.L=new sjcl.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.h[b]=a.h[b]+1|0,!a.h[b]);b++);return a.L.encrypt(a.h)}
function B(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var D,E,F,G;if(G="undefined"!==typeof module&&module.exports){var H;try{H=require("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array((new Uint8Array(D)).buffer),sjcl.random.addEntropy(D,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);
else break a;sjcl.random.addEntropy(F,1024,"crypto['getRandomValues']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}
sjcl.json={defaults:{v:1,iter:1E4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.g({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.g(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));if(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||
4<f.iv.length)throw new sjcl.exception.invalid("json encrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.g(d,f);d.key=a;f.ct="ccm"===f.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&
b instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.encrypt(g,b,f.iv,c,f.ts):sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,b,c,d){var e=sjcl.json,f=e.ja.apply(e,arguments);return e.encode(f)},ia:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.g(e.g(e.g({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));if(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===
typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)throw new sjcl.exception.invalid("json decrypt: invalid parameters");"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f="ccm"===
b.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&b.ct instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.decrypt(g,b.ct,b.iv,b.tag,f,b.ts):sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.g(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl.json;return e.ia(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");c+=d+'"'+
b+'":';d=",";switch(typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type");}}return c+"}"},decode:function(a){a=a.replace(/\s/g,"");if(!a.match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");
null!=d[3]?b[d[2]]=parseInt(d[3],10):null!=d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):null!=d[5]&&(b[d[2]]="true"===d[5])}return b},g:function(a,b,c){void 0===a&&(a={});if(void 0===b)return a;for(var d in b)if(b.hasOwnProperty(d)){if(c&&void 0!==a[d]&&a[d]!==b[d])throw new sjcl.exception.invalid("required parameter overridden");a[d]=b[d]}return a},sa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ra:function(a,
b){var c={},d;for(d=0;d<b.length;d++)void 0!==a[b[d]]&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.pa={};sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.pa,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=void 0===b.salt?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

;/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2016
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(X){function C(f,b,c){var d=0,a=[],k=0,g,e,n,h,m,r,t,q,v=!1,u=[],w=[],x,y=!1,z=!1;c=c||{};g=c.encoding||"UTF8";x=c.numRounds||1;n=J(b,g);if(x!==parseInt(x,10)||1>x)throw Error("numRounds must a integer >= 1");if("SHA-1"===f)m=512,r=K,t=Y,h=160,q=function(b){return b.slice()};else if(0===f.lastIndexOf("SHA-",0))if(r=function(b,d){return L(b,d,f)},t=function(b,d,c,a){var l,k;if("SHA-224"===f||"SHA-256"===f)l=(d+65>>>9<<4)+15,k=16;else if("SHA-384"===f||"SHA-512"===f)l=(d+129>>>
10<<5)+31,k=32;else throw Error("Unexpected error in SHA-2 implementation");for(;b.length<=l;)b.push(0);b[d>>>5]|=128<<24-d%32;d=d+c;b[l]=d&4294967295;b[l-1]=d/4294967296|0;c=b.length;for(d=0;d<c;d+=k)a=L(b.slice(d,d+k),a,f);if("SHA-224"===f)b=[a[0],a[1],a[2],a[3],a[4],a[5],a[6]];else if("SHA-256"===f)b=a;else if("SHA-384"===f)b=[a[0].a,a[0].b,a[1].a,a[1].b,a[2].a,a[2].b,a[3].a,a[3].b,a[4].a,a[4].b,a[5].a,a[5].b];else if("SHA-512"===f)b=[a[0].a,a[0].b,a[1].a,a[1].b,a[2].a,a[2].b,a[3].a,a[3].b,a[4].a,
a[4].b,a[5].a,a[5].b,a[6].a,a[6].b,a[7].a,a[7].b];else throw Error("Unexpected error in SHA-2 implementation");return b},q=function(b){return b.slice()},"SHA-224"===f)m=512,h=224;else if("SHA-256"===f)m=512,h=256;else if("SHA-384"===f)m=1024,h=384;else if("SHA-512"===f)m=1024,h=512;else throw Error("Chosen SHA variant is not supported");else if(0===f.lastIndexOf("SHA3-",0)||0===f.lastIndexOf("SHAKE",0)){var F=6;r=D;q=function(b){var f=[],a;for(a=0;5>a;a+=1)f[a]=b[a].slice();return f};if("SHA3-224"===
f)m=1152,h=224;else if("SHA3-256"===f)m=1088,h=256;else if("SHA3-384"===f)m=832,h=384;else if("SHA3-512"===f)m=576,h=512;else if("SHAKE128"===f)m=1344,h=-1,F=31,z=!0;else if("SHAKE256"===f)m=1088,h=-1,F=31,z=!0;else throw Error("Chosen SHA variant is not supported");t=function(b,f,a,d,c){a=m;var l=F,k,g=[],e=a>>>5,h=0,p=f>>>5;for(k=0;k<p&&f>=a;k+=e)d=D(b.slice(k,k+e),d),f-=a;b=b.slice(k);for(f%=a;b.length<e;)b.push(0);k=f>>>3;b[k>>2]^=l<<24-k%4*8;b[e-1]^=128;for(d=D(b,d);32*g.length<c;){b=d[h%5][h/
5|0];g.push((b.b&255)<<24|(b.b&65280)<<8|(b.b&16711680)>>8|b.b>>>24);if(32*g.length>=c)break;g.push((b.a&255)<<24|(b.a&65280)<<8|(b.a&16711680)>>8|b.a>>>24);h+=1;0===64*h%a&&D(null,d)}return g}}else throw Error("Chosen SHA variant is not supported");e=B(f);this.setHMACKey=function(b,a,c){var l;if(!0===v)throw Error("HMAC key already set");if(!0===y)throw Error("Cannot set HMAC key after calling update");if(!0===z)throw Error("SHAKE is not supported for HMAC");g=(c||{}).encoding||"UTF8";a=J(a,g)(b);
b=a.binLen;a=a.value;l=m>>>3;c=l/4-1;if(l<b/8){for(a=t(a,b,0,B(f),h);a.length<=c;)a.push(0);a[c]&=4294967040}else if(l>b/8){for(;a.length<=c;)a.push(0);a[c]&=4294967040}for(b=0;b<=c;b+=1)u[b]=a[b]^909522486,w[b]=a[b]^1549556828;e=r(u,e);d=m;v=!0};this.update=function(b){var f,c,g,h=0,q=m>>>5;f=n(b,a,k);b=f.binLen;c=f.value;f=b>>>5;for(g=0;g<f;g+=q)h+m<=b&&(e=r(c.slice(g,g+q),e),h+=m);d+=h;a=c.slice(h>>>5);k=b%m;y=!0};this.getHash=function(b,c){var g,m,n,r;if(!0===v)throw Error("Cannot call getHash after setting HMAC key");
n=M(c);if(!0===z){if(-1===n.shakeLen)throw Error("shakeLen must be specified in options");h=n.shakeLen}switch(b){case "HEX":g=function(b){return N(b,h,n)};break;case "B64":g=function(b){return O(b,h,n)};break;case "BYTES":g=function(b){return P(b,h)};break;case "ARRAYBUFFER":try{m=new ArrayBuffer(0)}catch(sa){throw Error("ARRAYBUFFER not supported by this environment");}g=function(b){return Q(b,h)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}r=t(a.slice(),k,d,q(e),
h);for(m=1;m<x;m+=1)!0===z&&0!==h%32&&(r[r.length-1]&=4294967040<<24-h%32),r=t(r,h,0,B(f),h);return g(r)};this.getHMAC=function(b,c){var g,n,u,x;if(!1===v)throw Error("Cannot call getHMAC without first setting HMAC key");u=M(c);switch(b){case "HEX":g=function(b){return N(b,h,u)};break;case "B64":g=function(b){return O(b,h,u)};break;case "BYTES":g=function(b){return P(b,h)};break;case "ARRAYBUFFER":try{g=new ArrayBuffer(0)}catch(z){throw Error("ARRAYBUFFER not supported by this environment");}g=function(b){return Q(b,
h)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");}n=t(a.slice(),k,d,q(e),h);x=r(w,B(f));x=t(n,h,m,x,h);return g(x)}}function a(f,b){this.a=f;this.b=b}function Z(f,b,a){var d=f.length,l,k,g,e,n;b=b||[0];a=a||0;n=a>>>3;if(0!==d%2)throw Error("String of HEX type must be in byte increments");for(l=0;l<d;l+=2){k=parseInt(f.substr(l,2),16);if(isNaN(k))throw Error("String of HEX type contains invalid characters");e=(l>>>1)+n;for(g=e>>>2;b.length<=g;)b.push(0);b[g]|=k<<
8*(3-e%4)}return{value:b,binLen:4*d+a}}function aa(f,b,a){var d=[],l,k,g,e,d=b||[0];a=a||0;k=a>>>3;for(l=0;l<f.length;l+=1)b=f.charCodeAt(l),e=l+k,g=e>>>2,d.length<=g&&d.push(0),d[g]|=b<<8*(3-e%4);return{value:d,binLen:8*f.length+a}}function ba(f,b,a){var d=[],l=0,k,g,e,n,h,m,d=b||[0];a=a||0;b=a>>>3;if(-1===f.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");g=f.indexOf("=");f=f.replace(/\=/g,"");if(-1!==g&&g<f.length)throw Error("Invalid '=' found in base-64 string");
for(g=0;g<f.length;g+=4){h=f.substr(g,4);for(e=n=0;e<h.length;e+=1)k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[e]),n|=k<<18-6*e;for(e=0;e<h.length-1;e+=1){m=l+b;for(k=m>>>2;d.length<=k;)d.push(0);d[k]|=(n>>>16-8*e&255)<<8*(3-m%4);l+=1}}return{value:d,binLen:8*l+a}}function ca(a,b,c){var d=[],l,k,g,d=b||[0];c=c||0;l=c>>>3;for(b=0;b<a.byteLength;b+=1)g=b+l,k=g>>>2,d.length<=k&&d.push(0),d[k]|=a[b]<<8*(3-g%4);return{value:d,binLen:8*a.byteLength+c}}function N(a,b,c){var d=
"";b/=8;var l,k;for(l=0;l<b;l+=1)k=a[l>>>2]>>>8*(3-l%4),d+="0123456789abcdef".charAt(k>>>4&15)+"0123456789abcdef".charAt(k&15);return c.outputUpper?d.toUpperCase():d}function O(a,b,c){var d="",l=b/8,k,g,e;for(k=0;k<l;k+=3)for(g=k+1<l?a[k+1>>>2]:0,e=k+2<l?a[k+2>>>2]:0,e=(a[k>>>2]>>>8*(3-k%4)&255)<<16|(g>>>8*(3-(k+1)%4)&255)<<8|e>>>8*(3-(k+2)%4)&255,g=0;4>g;g+=1)8*k+6*g<=b?d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>>6*(3-g)&63):d+=c.b64Pad;return d}function P(a,
b){var c="",d=b/8,l,k;for(l=0;l<d;l+=1)k=a[l>>>2]>>>8*(3-l%4)&255,c+=String.fromCharCode(k);return c}function Q(a,b){var c=b/8,d,l=new ArrayBuffer(c);for(d=0;d<c;d+=1)l[d]=a[d>>>2]>>>8*(3-d%4)&255;return l}function M(a){var b={outputUpper:!1,b64Pad:"=",shakeLen:-1};a=a||{};b.outputUpper=a.outputUpper||!1;!0===a.hasOwnProperty("b64Pad")&&(b.b64Pad=a.b64Pad);if(!0===a.hasOwnProperty("shakeLen")){if(0!==a.shakeLen%8)throw Error("shakeLen must be a multiple of 8");b.shakeLen=a.shakeLen}if("boolean"!==
typeof b.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof b.b64Pad)throw Error("Invalid b64Pad formatting option");return b}function J(a,b){var c;switch(b){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(a){case "HEX":c=Z;break;case "TEXT":c=function(a,f,c){var e=[],p=[],n=0,h,m,r,t,q,e=f||[0];f=c||0;r=f>>>3;if("UTF8"===b)for(h=0;h<a.length;h+=1)for(c=a.charCodeAt(h),p=[],128>c?p.push(c):
2048>c?(p.push(192|c>>>6),p.push(128|c&63)):55296>c||57344<=c?p.push(224|c>>>12,128|c>>>6&63,128|c&63):(h+=1,c=65536+((c&1023)<<10|a.charCodeAt(h)&1023),p.push(240|c>>>18,128|c>>>12&63,128|c>>>6&63,128|c&63)),m=0;m<p.length;m+=1){q=n+r;for(t=q>>>2;e.length<=t;)e.push(0);e[t]|=p[m]<<8*(3-q%4);n+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(h=0;h<a.length;h+=1){c=a.charCodeAt(h);"UTF16LE"===b&&(m=c&255,c=m<<8|c>>>8);q=n+r;for(t=q>>>2;e.length<=t;)e.push(0);e[t]|=c<<8*(2-q%4);n+=2}return{value:e,binLen:8*
n+f}};break;case "B64":c=ba;break;case "BYTES":c=aa;break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(d){throw Error("ARRAYBUFFER not supported by this environment");}c=ca;break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return c}function y(a,b){return a<<b|a>>>32-b}function R(f,b){return 32<b?(b=b-32,new a(f.b<<b|f.a>>>32-b,f.a<<b|f.b>>>32-b)):0!==b?new a(f.a<<b|f.b>>>32-b,f.b<<b|f.a>>>32-b):f}function v(a,b){return a>>>b|a<<32-b}function w(f,b){var c=null,
c=new a(f.a,f.b);return c=32>=b?new a(c.a>>>b|c.b<<32-b&4294967295,c.b>>>b|c.a<<32-b&4294967295):new a(c.b>>>b-32|c.a<<64-b&4294967295,c.a>>>b-32|c.b<<64-b&4294967295)}function S(f,b){var c=null;return c=32>=b?new a(f.a>>>b,f.b>>>b|f.a<<32-b&4294967295):new a(0,f.a>>>b-32)}function da(a,b,c){return a&b^~a&c}function ea(f,b,c){return new a(f.a&b.a^~f.a&c.a,f.b&b.b^~f.b&c.b)}function T(a,b,c){return a&b^a&c^b&c}function fa(f,b,c){return new a(f.a&b.a^f.a&c.a^b.a&c.a,f.b&b.b^f.b&c.b^b.b&c.b)}function ga(a){return v(a,
2)^v(a,13)^v(a,22)}function ha(f){var b=w(f,28),c=w(f,34);f=w(f,39);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ia(a){return v(a,6)^v(a,11)^v(a,25)}function ja(f){var b=w(f,14),c=w(f,18);f=w(f,41);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ka(a){return v(a,7)^v(a,18)^a>>>3}function la(f){var b=w(f,1),c=w(f,8);f=S(f,7);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ma(a){return v(a,17)^v(a,19)^a>>>10}function na(f){var b=w(f,19),c=w(f,61);f=S(f,6);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function G(a,
b){var c=(a&65535)+(b&65535);return((a>>>16)+(b>>>16)+(c>>>16)&65535)<<16|c&65535}function oa(a,b,c,d){var l=(a&65535)+(b&65535)+(c&65535)+(d&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(l>>>16)&65535)<<16|l&65535}function H(a,b,c,d,l){var e=(a&65535)+(b&65535)+(c&65535)+(d&65535)+(l&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(l>>>16)+(e>>>16)&65535)<<16|e&65535}function pa(f,b){var c,d,l;c=(f.b&65535)+(b.b&65535);d=(f.b>>>16)+(b.b>>>16)+(c>>>16);l=(d&65535)<<16|c&65535;c=(f.a&65535)+
(b.a&65535)+(d>>>16);d=(f.a>>>16)+(b.a>>>16)+(c>>>16);return new a((d&65535)<<16|c&65535,l)}function qa(f,b,c,d){var l,e,g;l=(f.b&65535)+(b.b&65535)+(c.b&65535)+(d.b&65535);e=(f.b>>>16)+(b.b>>>16)+(c.b>>>16)+(d.b>>>16)+(l>>>16);g=(e&65535)<<16|l&65535;l=(f.a&65535)+(b.a&65535)+(c.a&65535)+(d.a&65535)+(e>>>16);e=(f.a>>>16)+(b.a>>>16)+(c.a>>>16)+(d.a>>>16)+(l>>>16);return new a((e&65535)<<16|l&65535,g)}function ra(f,b,c,d,l){var e,g,p;e=(f.b&65535)+(b.b&65535)+(c.b&65535)+(d.b&65535)+(l.b&65535);g=
(f.b>>>16)+(b.b>>>16)+(c.b>>>16)+(d.b>>>16)+(l.b>>>16)+(e>>>16);p=(g&65535)<<16|e&65535;e=(f.a&65535)+(b.a&65535)+(c.a&65535)+(d.a&65535)+(l.a&65535)+(g>>>16);g=(f.a>>>16)+(b.a>>>16)+(c.a>>>16)+(d.a>>>16)+(l.a>>>16)+(e>>>16);return new a((g&65535)<<16|e&65535,p)}function A(f){var b=0,c=0,d;for(d=0;d<arguments.length;d+=1)b^=arguments[d].b,c^=arguments[d].a;return new a(c,b)}function B(f){var b=[],c;if("SHA-1"===f)b=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===f.lastIndexOf("SHA-",
0))switch(b=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],c=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],f){case "SHA-224":break;case "SHA-256":b=c;break;case "SHA-384":b=[new a(3418070365,b[0]),new a(1654270250,b[1]),new a(2438529370,b[2]),new a(355462360,b[3]),new a(1731405415,b[4]),new a(41048885895,b[5]),new a(3675008525,b[6]),new a(1203062813,b[7])];break;case "SHA-512":b=[new a(c[0],4089235720),new a(c[1],
2227873595),new a(c[2],4271175723),new a(c[3],1595750129),new a(c[4],2917565137),new a(c[5],725511199),new a(c[6],4215389547),new a(c[7],327033209)];break;default:throw Error("Unknown SHA variant");}else if(0===f.lastIndexOf("SHA3-",0)||0===f.lastIndexOf("SHAKE",0))for(f=0;5>f;f+=1)b[f]=[new a(0,0),new a(0,0),new a(0,0),new a(0,0),new a(0,0)];else throw Error("No SHA variants supported");return b}function K(a,b){var c=[],d,e,k,g,p,n,h;d=b[0];e=b[1];k=b[2];g=b[3];p=b[4];for(h=0;80>h;h+=1)c[h]=16>h?
a[h]:y(c[h-3]^c[h-8]^c[h-14]^c[h-16],1),n=20>h?H(y(d,5),e&k^~e&g,p,1518500249,c[h]):40>h?H(y(d,5),e^k^g,p,1859775393,c[h]):60>h?H(y(d,5),T(e,k,g),p,2400959708,c[h]):H(y(d,5),e^k^g,p,3395469782,c[h]),p=g,g=k,k=y(e,30),e=d,d=n;b[0]=G(d,b[0]);b[1]=G(e,b[1]);b[2]=G(k,b[2]);b[3]=G(g,b[3]);b[4]=G(p,b[4]);return b}function Y(a,b,c,d){var e;for(e=(b+65>>>9<<4)+15;a.length<=e;)a.push(0);a[b>>>5]|=128<<24-b%32;b+=c;a[e]=b&4294967295;a[e-1]=b/4294967296|0;b=a.length;for(e=0;e<b;e+=16)d=K(a.slice(e,e+16),d);
return d}function L(f,b,c){var d,l,k,g,p,n,h,m,r,t,q,v,u,w,x,y,z,F,A,B,C,D,E=[],I;if("SHA-224"===c||"SHA-256"===c)t=64,v=1,D=Number,u=G,w=oa,x=H,y=ka,z=ma,F=ga,A=ia,C=T,B=da,I=e;else if("SHA-384"===c||"SHA-512"===c)t=80,v=2,D=a,u=pa,w=qa,x=ra,y=la,z=na,F=ha,A=ja,C=fa,B=ea,I=U;else throw Error("Unexpected error in SHA-2 implementation");c=b[0];d=b[1];l=b[2];k=b[3];g=b[4];p=b[5];n=b[6];h=b[7];for(q=0;q<t;q+=1)16>q?(r=q*v,m=f.length<=r?0:f[r],r=f.length<=r+1?0:f[r+1],E[q]=new D(m,r)):E[q]=w(z(E[q-2]),
E[q-7],y(E[q-15]),E[q-16]),m=x(h,A(g),B(g,p,n),I[q],E[q]),r=u(F(c),C(c,d,l)),h=n,n=p,p=g,g=u(k,m),k=l,l=d,d=c,c=u(m,r);b[0]=u(c,b[0]);b[1]=u(d,b[1]);b[2]=u(l,b[2]);b[3]=u(k,b[3]);b[4]=u(g,b[4]);b[5]=u(p,b[5]);b[6]=u(n,b[6]);b[7]=u(h,b[7]);return b}function D(f,b){var c,d,e,k,g=[],p=[];if(null!==f)for(d=0;d<f.length;d+=2)b[(d>>>1)%5][(d>>>1)/5|0]=A(b[(d>>>1)%5][(d>>>1)/5|0],new a((f[d+1]&255)<<24|(f[d+1]&65280)<<8|(f[d+1]&16711680)>>>8|f[d+1]>>>24,(f[d]&255)<<24|(f[d]&65280)<<8|(f[d]&16711680)>>>8|
f[d]>>>24));for(c=0;24>c;c+=1){k=B("SHA3-");for(d=0;5>d;d+=1)g[d]=A(b[d][0],b[d][1],b[d][2],b[d][3],b[d][4]);for(d=0;5>d;d+=1)p[d]=A(g[(d+4)%5],R(g[(d+1)%5],1));for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)b[d][e]=A(b[d][e],p[d]);for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)k[e][(2*d+3*e)%5]=R(b[d][e],V[d][e]);for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)b[d][e]=A(k[d][e],new a(~k[(d+1)%5][e].a&k[(d+2)%5][e].a,~k[(d+1)%5][e].b&k[(d+2)%5][e].b));b[0][0]=A(b[0][0],W[c])}return b}var e,U,V,W;e=[1116352408,1899447441,3049323471,3921009573,
961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];U=[new a(e[0],3609767458),new a(e[1],602891725),new a(e[2],3964484399),new a(e[3],2173295548),new a(e[4],4081628472),new a(e[5],3053834265),new a(e[6],2937671579),new a(e[7],3664609560),new a(e[8],2734883394),new a(e[9],1164996542),new a(e[10],1323610764),new a(e[11],3590304994),new a(e[12],4068182383),new a(e[13],991336113),new a(e[14],633803317),new a(e[15],
3479774868),new a(e[16],2666613458),new a(e[17],944711139),new a(e[18],2341262773),new a(e[19],2007800933),new a(e[20],1495990901),new a(e[21],1856431235),new a(e[22],3175218132),new a(e[23],2198950837),new a(e[24],3999719339),new a(e[25],766784016),new a(e[26],2566594879),new a(e[27],3203337956),new a(e[28],1034457026),new a(e[29],2466948901),new a(e[30],3758326383),new a(e[31],168717936),new a(e[32],1188179964),new a(e[33],1546045734),new a(e[34],1522805485),new a(e[35],2643833823),new a(e[36],
2343527390),new a(e[37],1014477480),new a(e[38],1206759142),new a(e[39],344077627),new a(e[40],1290863460),new a(e[41],3158454273),new a(e[42],3505952657),new a(e[43],106217008),new a(e[44],3606008344),new a(e[45],1432725776),new a(e[46],1467031594),new a(e[47],851169720),new a(e[48],3100823752),new a(e[49],1363258195),new a(e[50],3750685593),new a(e[51],3785050280),new a(e[52],3318307427),new a(e[53],3812723403),new a(e[54],2003034995),new a(e[55],3602036899),new a(e[56],1575990012),new a(e[57],
1125592928),new a(e[58],2716904306),new a(e[59],442776044),new a(e[60],593698344),new a(e[61],3733110249),new a(e[62],2999351573),new a(e[63],3815920427),new a(3391569614,3928383900),new a(3515267271,566280711),new a(3940187606,3454069534),new a(4118630271,4000239992),new a(116418474,1914138554),new a(174292421,2731055270),new a(289380356,3203993006),new a(460393269,320620315),new a(685471733,587496836),new a(852142971,1086792851),new a(1017036298,365543100),new a(1126000580,2618297676),new a(1288033470,
3409855158),new a(1501505948,4234509866),new a(1607167915,987167468),new a(1816402316,1246189591)];W=[new a(0,1),new a(0,32898),new a(2147483648,32906),new a(2147483648,2147516416),new a(0,32907),new a(0,2147483649),new a(2147483648,2147516545),new a(2147483648,32777),new a(0,138),new a(0,136),new a(0,2147516425),new a(0,2147483658),new a(0,2147516555),new a(2147483648,139),new a(2147483648,32905),new a(2147483648,32771),new a(2147483648,32770),new a(2147483648,128),new a(0,32778),new a(2147483648,
2147483658),new a(2147483648,2147516545),new a(2147483648,32896),new a(0,2147483649),new a(2147483648,2147516424)];V=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];"function"===typeof define&&define.amd?define(function(){return C}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=C),exports=C):X.jsSHA=C})(this);

;
//# sourceMappingURL=scripts.js.map