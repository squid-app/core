
'use strict';

var _ = require('lodash')

var logFileConfig = {
    outputTransports: 'File'
  , handleExceptions: true
  , json:             true
  , maxsize:          5242880 //5MB
  , maxFiles:         5
  , colorize:         false
}

module.exports = {
    debug:   false
  , github:
    {
        baseurl:       "https://api.github.com"
      , pagination:    50
      , authorization: "token"
      , note:          "Your Squid authorization." // A note to remind you what the OAuth token is for.
      , headers:
        {
            'Accept':        "application/vnd.github.v3+json"
          , 'Content-Type':  "application/json;charset=UTF-8"
        }
      , scopes: [
            'user'
          , 'public_repo'
          , 'repo'
          , 'repo:status'
          , 'notifications'
          , 'admin:org'
        ]
    }
  , logger: {
        exitOnError: false
      , transports: {
            info: _.merge({
                level:            'info'
              , name:             'info-log'
              , filename:         './logs/all-logs.log'
            }, logFileConfig )
          , error: _.merge({
                level:            'error'
              , name:             'error-log'
              , filename:         './logs/error-logs.log'
            }, logFileConfig )
          , debug: {
                level:            'debug'
              , name:             'debug-log'
              , outputTransports: 'Console'
              , handleExceptions: true
              , json:             false
              , colorize:         true
            }
        }
    }
}
