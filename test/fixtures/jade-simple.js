module.exports = [
  {
    "path": "/jade/index.js",
    "text": "var tmpl = require('./tmpl.jade')\n\nexports.text = tmpl({users: [{id:1,name:'uno'}]})"
  },
  {
    "path": "/jade/tmpl.jade",
    "text": "for user in users\n\tunless user.isAnonymous\n\t\tp #{user.name}"
  }
]