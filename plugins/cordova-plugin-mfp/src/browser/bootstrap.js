/*
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var mfpreadyfired = false;

// {platform}/www/plugins/cordova-plugin-mfp/worklight
var WORKLIGHT_DIR = 'plugins/cordova-plugin-mfp/worklight';

// {platform}/www/plugins/cordova-plugin-mfp/worklight/static_app_props.js
var STATIC_APP_PROPS_PATH = WORKLIGHT_DIR + '/static_app_props.js';

// {platform}/www/plugins/cordova-plugin-mfp//worklight/wljq.js
var WLJQ_PATH = WORKLIGHT_DIR + '/wljq.js';

// {platform}/www/plugins/cordova-plugin-mfp//worklight/ibmmfpf.js
var WORKLIGHT_PATH = WORKLIGHT_DIR + '/ibmmfpf.js';

// {platform}/www/plugins/cordova-plugin-mfp/worklight/analytics/ibmmfpfanalytics.js
var ANALYTICS_PATH = WORKLIGHT_DIR + '/analytics/ibmmfpfanalytics.js';

document.addEventListener('deviceready', loadMFP, false);

function loadMFP(){
    if(typeof WL !== 'undefined' && WL.StaticAppProps){
        //console.log('Developer is injecting scripts manually');
        /*
        <script src="worklight/static_app_props.js"></script>
        <script src="cordova.js"></script>
        <script src="worklight/wljq.js"></script>
        <script src="worklight/worklight.js"></script>
        <script src="worklight/checksum.js"></script>
        */
        mfpready();
    } else {
        //console.log('Inject MFP Scripts dynamically');
        loadJQ();
    }

    function loadJQ(){
        //console.log("injecting script wljq.js");
        injectScript(findCordovaPath() + WLJQ_PATH, loadAnalytics,bootError);
    }

	function loadAnalytics(){
		//console.log("worklight/analytics/ibmmfpfanalytics.js");
        injectScript(findCordovaPath() + ANALYTICS_PATH, loadWorklight,bootError);
	}

    function loadWorklight(){
        //console.log("injecting script worklight.js");
        injectScript(findCordovaPath() + WORKLIGHT_PATH, loadStaticAppProps,bootError);
    }

    function loadStaticAppProps(){
        //console.log("worklight/static_app_props.js");
        injectScript(findCordovaPath() + STATIC_APP_PROPS_PATH, mfpready,bootError);
    }

    function mfpready (){
        //call WL.Client.init unless user defined mfpClientCustomInit = true in config.xml, and propagated to static_app_props.js
        if(WL.StaticAppProps && !WL.StaticAppProps.mfpClientCustomInit){
            console.log('Calling WL.Client.init(wlInitOptions);')
            var options = typeof wlInitOptions !== 'undefined' ? wlInitOptions : {};
        try{
            WL.Client.init(options).then(
                () => {
                    mfpFire();
                }
            );
        } catch (e) {//init function returns promise only if user did not implement wlCommonInit(); otherwise we need to catch the calling function.
            if (e instanceof TypeError) {
              mfpFire();// calling mfpFire() for normal MFP framework initialization. 
           }
        }
        } else {
            console.log('Developer will call WL.Client.init manually');
            mfpFire();
        }
        //Inform developer they should load their own jquery and not use MFP internal version
        deprecateWLJQ();
    }

    function mfpFire(){
        //console.log("bootstrap.js dispatching mfpjsloaded event");
        try {
            var wlevent = new Event('mfpjsloaded');
        }
        catch (e) {
            if (e instanceof TypeError) {
                // Trying to use old events
                wlevent = document.createEvent('Event');
                wlevent.initEvent('mfpjsloaded', true, true);
            }
            else {
                console.error(e.message);
            }
        }
        // Dispatch the event.
        document.dispatchEvent(wlevent);
        mfpreadyfired = true;
    }

    function deprecateWLJQ(){
        setTimeout(function checkWLJQ(){
            if(window.$ === WLJQ){
                console.error('Using WLJQ as your window.$ is deprecated, if needed, please load your own JQuery instance');
            } else if(window.jQuery === WLJQ){
                console.error('Using WLJQ as your window.jQuery is deprecated, if needed, please load your own JQuery instance');
            }
        },10000);
    }

    function injectScript(url, onload, onerror) {
        var script = document.createElement("script");
        // onload fires even when script fails loads with an error.
        script.onload = onload;
        // onerror fires for malformed URLs.
        script.onerror = onerror;
        script.src = url;
        document.head.appendChild(script);
    }

    function bootError(){
        console.error("mfp bootstrap failed to inject script");
    }
}

setTimeout(function mfpTimeOut(){
    if(!mfpreadyfired){
        loadMFP();
    }
},6000);


function findCordovaPath() {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var startterm = '/cordova.';
    var term = '/cordova.js';
    for (var n = scripts.length-1; n>-1; n--) {
        var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
        // APAR 119091: findCordovaPath function to work with hashed builds.
        var idx = src.indexOf(startterm);
        if (idx >= 0 && src.substring(idx).replace(/cordova\.[^\.\/]*\.js/, "cordova.js") == term) {
            term = src.substring(idx);
        }
        if (src.indexOf(term) === (src.length - term.length)) {
            path = src.substring(0, src.length - term.length) + '/';
            break;
        }
    }
    return path;
}
