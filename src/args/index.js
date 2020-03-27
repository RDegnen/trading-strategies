const yargs = require('yargs')

module.exports = function() {
  return yargs
    .option('fetch')
    .option('read')
    .help()
    .argv
}
