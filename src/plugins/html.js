

exports.handlers = [ html ]

/**
 * The do nothing handler
 */

function html(file){
	file.text = 'module.exports = ' + JSON.stringify(file.text)
	return file
}

html.test = function(file){
	return (/\.html$/).test(file.path)
		? 1
		: 0
}