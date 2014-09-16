
let { Cc, Ci, Cu } = require('chrome');

const PROMISE = require("sdk/core/promise");

const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const { Class } = require("sdk/core/heritage");
const { Task } = Cu.import("resource://gre/modules/Task.jsm", {});
const DevToolsUtils = devtools.require("devtools/" + 'toolkit/DevToolsUtils');
const { LocalDebuggerTransport } = devtools.require("devtools/" + 'toolkit/transport/transport');



var Connection = Class({

    initialize: function(prefix, transport, url) {
        this.url = url;
        this.prefix = prefix + ".";
        this.transport = transport;
        this.nextID = 1;
        transport.hooks = this;
        this.root = null;
        this.pools = new Set();
        this.lazyActors = new Map();
    },

    send: function(packet) {
        console.log("SEND: " + JSON.stringify(packet, null, 2));
        this.transport.send(packet);
    },

    onPacket: Task.async(function*(packet) {
        console.log("RECV:" + JSON.stringify(packet, null, 2));
    }),

    onClosed: function() {
        console.log("onClosed");
    },

    allocID: function(prefix) {
        console.log("allocID");
        return this.prefix + (prefix || '') + this.nextID++;
    },

    manageLazy: function(parent, actorID, factory) {
        console.log("manageLazy()");
        this.lazyActors.set(actorID, {
            parent: parent,
            factory: factory
        });
        return actorID;
    },

    getActor: function(actorID) {
        console.log("getActor()", actorID);
        return null;
    },

    poolFor: function(actorID) {
        console.log("poolFor()", actorID);
    },

    addActorPool: function(pool) {
        console.log("addActorPool()", pool);
        this.pools.add(pool);
    },
    removeActorPool: function(pool) {
        console.log("removeActorPool()", pool);
        this.pools.remove(pool);
    },

    listTabs: function () {
        console.log("listTabs()");
    }

});


exports.for = function (ide) {

    function addCutomRuntime() {
        let customRuntime = {
            getName: function() {
                return "custom runtime";
            },
            connect: function(connection) {
              console.log("connect()");

              let deferred = PROMISE.defer();

              try {
        /*
                  let serverTransport = new LocalDebuggerTransport();
                  let clientTransport = new LocalDebuggerTransport(serverTransport);
                  serverTransport.other = clientTransport;

                  let conn = new Connection("test" + 1, serverTransport, null);

                  conn.send({
                    from: "root",
                    applicationType: "browser",
                    // There's work to do here.
                    traits: {
                      sources: false,
                      editOuterHTML: false,
                      highlightable: false,
                      urlToImageDataResolver: false,
                      networkMonitor: false,
                      storageInspector: false,
                      storageInspectorReadOnly: false,
                      conditionalBreakpoints: false,
                      addNewRule: false
                    }
                  });

                  serverTransport.ready();
            //      clientTransport.ready();
        */
        //console.log("Object.keys", Object.keys(clientTransport));


                    let trans = new LocalDebuggerTransport();

                    trans.hooks = {
                      onPacket: function (packet) {
                          console.log("onPacket()", packet);
                      },
                      onBulkPacket: function (packet) {
                          console.log("onBulkPacket()", packet);
                      },
                      onClosed: function (reason) {
                          console.log("onClosed(" + reason + ")");
                      }
                    }

                    connection.connect(trans);

                    console.log("connect() done");
                } catch(err) {
                    console.error("connect error", err);
                }

                return deferred.promise;
            }
        }

        let window = ide.getWindow();
        window.AppManager.runtimeList.custom.push(customRuntime);
        window.AppManager.update("runtimelist");
    }

    let exports = function () {
        return PROMISE.reject(new Error("TODO: Trigger project to run"));
    }

    return PROMISE.resolve(exports);
}
