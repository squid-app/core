
'use strict';

module.exports = {
    debug: true
  , logger: {
        transports: {
            info: {
                outputTransports: 'Console'
              , filename:         false
              , json:             false
            }
        }
    }
}
