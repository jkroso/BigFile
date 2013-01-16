/**
 * The do nothing handler
 */

exports.handlers = [
	{
		if: /\.js$/,
		do: function (a) {return a}
	}
]