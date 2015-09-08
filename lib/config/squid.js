
'use strict';

module.exports = {
  github:
  {
      baseurl:       "https://api.github.com"
    , pagination:    50
    , authorization: "token"
    , headers:
      {
          'Accept':        "application/vnd.github.v3+json"
        , 'Content-Type':  "application/json;charset=UTF-8"
      }
  }
}
