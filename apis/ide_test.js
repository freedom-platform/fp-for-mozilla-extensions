
const PROMISE = require("sdk/core/promise");
const { env: ENV } = require('sdk/system/environment');


module.exports = function (API) {
    if (typeof ENV.WORKSPACE_ROOT === "string") {

        return API.browser.addButton({
            id: "open-ide",
            label: "Open IDE",
            onClick: function () {
                return API.ide.open().then(function(ide) {
                    return ide.project.open(ENV.WORKSPACE_ROOT).then(function () {

//return ide.editor.setTheme().then(function(editor) {
//console.log("editor", Object.keys(editor.currentEditor()), editor.currentEditor());
//});

                        // TODO: Load URL.
                        return ide.panels.bottom();
                    });
                });
            }
        }).then(function () {
            let deferred = PROMISE.defer();

            console.log("App running");

            // TODO: Hook to shutdown event.

            // NOTE: We don't resolve this promise as it represents the running application.
            return deferred.promise;
        });
    }
    throw new Error("'WORKSPACE_ROOT' environment variable must be set!");
}
