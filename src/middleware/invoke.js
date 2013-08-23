
/**
 * require the entry file
 *
 * @param {String} code
 * @return {String}
 */

module.exports = function(code){
	return code.replace(/\n(.*)$/, '("'+ this.entry + '")\n$1')
}