
let { Cc, Ci } = require('chrome');

const TIMERS = require("sdk/timers");
const PROMISE = require("sdk/core/promise");



exports.open = function () {
    let deferred = PROMISE.defer();
    let ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].getService(Ci.nsIWindowWatcher);
    let win = ww.openWindow(null, "chrome://webide/content/", "webide", "chrome,centerscreen,resizable", null);
    // TODO: Use promise interface to add/remove listeners. This is a common use-case. [SIMPLE]
    win.addEventListener("load", function onLoad() {
        win.removeEventListener("load", onLoad);

        // Give UI a bit more time to initialize.
        // TODO: Wait for a concrete event that tells us when UI is ready. Maybe a `postMessage` event on the window object?
        return TIMERS.setTimeout(function() {

            var ide = {};

            ide.getWindow = function() {
                return win;
            }

            ide.editor = {
                setTheme: function (id) {

                    console.log("Set editor theme");

                    return win.UI.getProjectEditor();
                }
            }

            ide.panels = {
                bottom: function() {

                    var iframe = win.document.querySelector("#deck-panel-projecteditor");

                    function waitForLoaded() {
                        // TODO" Attach to iframe loaded event and check loaded state.
                        var deferred = PROMISE.defer();
                        // TODO: Timeout if it takes too long.
                        (function attempt () {
                            if (iframe.contentDocument.childNodes.length > 0) {
                                return TIMERS.setTimeout(function () {
                                    return deferred.resolve();
                                }, 500);
                            }
                            return TIMERS.setTimeout(attempt, 500);
                        })();
                        return deferred.promise;
                    }

                    return waitForLoaded().then(function() {

                        var sourcesBody = iframe.contentDocument.querySelector("#main-deck");

                        console.log("Adding elements to '#sources'");

                        function createVbox () {
                            const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                            var vbox = iframe.contentDocument.createElementNS(XUL_NS, "vbox");
                            return vbox;
                        }

                        function createSplitter () {
                            const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                            var splitter = iframe.contentDocument.createElementNS(XUL_NS, "splitter");
                            splitter.setAttribute("class", "devtools-side-splitter");
                            return splitter;
                        }
                        function createPanel () {
                            const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                            var vbox = iframe.contentDocument.createElementNS(XUL_NS, "vbox");
                            vbox.setAttribute("id", "sources-panel-right");
                            vbox.setAttribute("height", 250);
                            vbox.innerHTML = "Bottom Panel!";
                            return vbox;
                        }

                        var vbox = createVbox();
                        vbox.appendChild(sourcesBody.removeChild(sourcesBody.childNodes[0]));
                        vbox.appendChild(createSplitter());

                        var panel = createPanel();
                        vbox.appendChild(panel);

                        sourcesBody.appendChild(vbox);

                        return panel;
                    });
                }
            }

            return require("./project").for(ide).then(function (project) {

                ide.project = project;

                return deferred.resolve(ide);
            });
        }, 1000);
    });
    return deferred.promise;
}



/*
Cu.import("resource://gre/modules/Services.jsm");
let {devtools} = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const {AppManager} = devtools.require("devtools/" + 'webide/app-manager');
let winObserver = function(win, topic) {
  if (topic == "domwindowopened") {
    win.addEventListener("load", function onLoadWindow() {
      win.removeEventListener("load", onLoadWindow, false);
      if (win.document.documentURI == "chrome://webide/content/webide.xul") {
        win.setTimeout(() => onWebIDEWindowOpen(win), 0);
      }
    }, false);
  }
}
Services.ww.registerNotification(winObserver);
*/
/*
const WINDOW_UTILS = require("sdk/window/utils");
TIMERS.setInterval(function() {
  var allWindows = WINDOW_UTILS.windows(null, {includePrivate:false});
  console.log("allWindows", allWindows);
  allWindows.forEach(function(window) {
    if (!window.document || window.document.URL !== "chrome://webide/content/webide.xul") return;
console.log("Web IDE opened. now patching.");
    openProject(window);
  });
}, 2000);
*/

