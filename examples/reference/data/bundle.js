
PINF.bundle("", function(require) {
	require.memoize("/main.js", function(require, exports, module) {
		exports.main = function(options) {

			console.log("Hello World from freedom platform bundle! TODO: Instead of loading this bundle, load test bundles.");

		}
	});
});
