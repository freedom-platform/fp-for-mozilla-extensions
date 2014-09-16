
let { Cc, Ci, Cu } = require('chrome');

/* const FileUtils = */ Cu.import("resource://gre/modules/FileUtils.jsm");

const PROMISE = require("sdk/core/promise");


exports.for = function (ide) {
    let exports = {};

    exports.open = function(uri) {
        let deferred = PROMISE.defer();
        let window = ide.getWindow();
        if (
            window.UI &&
            window.AppProjects &&
            window.AppManager
        ) {
            var folder = new FileUtils.File(uri);

            function ensureAdded() {
                var project = window.AppProjects.get(folder.path);
                if (project) {
                    console.log("Found existing project '" + folder.path + "' in `AppProjects`");
                    return project;
                }
                console.log("Creating new project '" + folder.path + "' in `AppProjects`");
                return window.AppProjects.addPackaged(folder);
            }

            return ensureAdded().then(function (project) {

                function validate () {
                    console.log("Validating project '" + folder.path + "'");

                    return window.AppManager.validateProject(project).then(function() {
                        if (project.manifest) {
                            project.manifest.name = folder.path.replace(/\//g, "~");

                            console.log("Setting project name to '" + project.manifest.name + "'");

                            return window.AppManager.writeManifest(project).then(function() {
                                return window.AppManager.validateProject(project);

                            });
                        }
                        return;
                    });
                }

                return validate().then(function () {

                    console.log("Opening project '" + folder.path + "'");

                    // `window.UI.openProject()` looks at `window.AppManager.selectedProject` to find project.
                    window.AppManager.selectedProject = project;                                

                    return window.UI.openProject();
                });

            // TODO: Is there a shorter way to do this? [SIMPLE]
            }).then(deferred.resolve, deferred.reject);
        }
        return deferred.promise;
    }

    exports.run = require("./project-run").for(ide);

    return PROMISE.resolve(exports);    
}
