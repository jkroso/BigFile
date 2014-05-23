
/**
 * Hydro configuration
 *
 * @param {Hydro} hydro
 */

module.exports = function(hydro) {
  hydro.set({
    suite: 'bigfile',
    formatter: require('hydro-dot'),
    'fail-fast': true,
    plugins: [
      require('hydro-file-suite'),
      require('hydro-fail-fast'),
      require('hydro-focus'),
      require('hydro-chai'),
      require('hydro-bdd'),
    ],
    chai: {
      chai: require('chai'),
      styles: ['should', 'expect'],
      stack: true
    }
  })
}
