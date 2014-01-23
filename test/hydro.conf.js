
/**
 * Hydro configuration
 *
 * @param {Hydro} hydro
 */

module.exports = function(hydro) {
  hydro.set({
    suite: 'bigfile',
    formatter: require('hydro-dot'),
    plugins: [
      require('hydro-focus'),
      require('hydro-chai'),
      require('hydro-bdd'),
    ],
    chai: {
      chai: require('chai'),
      styles: ['should', 'expect', 'assert'],
      stack: true
    }
  })
}
