
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
}
