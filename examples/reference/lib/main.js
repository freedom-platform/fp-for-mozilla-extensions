
const PROMISE = require("sdk/core/promise");
const TIMERS = require('sdk/timers');


const { data } = require("sdk/self");
const { sandbox } = require("pinf-for-mozilla-addon-sdk");


function main() {
    var deferred = PROMISE.defer();

    sandbox(data.url("bundle.js"), function(sandbox) {

        sandbox.main();

        deferred.resolve();
    });

    return deferred.promise;
}

function boot() {
    try {
        main().then(function() {
            console.log("Shutdown complete");
        }, function (err) {
            console.error("ERROR", err);
        });
    } catch (err) {
        console.error("ERROR", err);
    }
}

boot();
//TIMERS.setInterval(function () { boot(); }, 5000);
