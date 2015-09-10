
'use strict';

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
            'repo'
          , 'notifications'
          , 'read:org'
        ]
    }
  , logger: {
        exitOnError: false
      , transports: {
            info: {
                level:            'info'
              , name:             'info-log'
              , outputTransports: 'File'
              , filename:         './logs/all-logs.log'
              , handleExceptions: true
              , json:             true
              , maxsize:          5242880 //5MB
              , maxFiles:         5
              , colorize:         false
            }
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
