
const SELF = require("sdk/self");
const PROMISE = require("sdk/core/promise");
const { ActionButton } = require("sdk/ui/button/action");


exports.addButton = function (options) {
    let deferred = PROMISE.defer();

	var button = ActionButton({
		id: options.id,
		label: options.label,
		icon: SELF.data.url("images/icons/fp.ico"),
		onClick: function (state) {
		    return options.onClick(state);
		}
	});

	return PROMISE.resolve(button);
}
