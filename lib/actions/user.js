/**
 * Squid Core
 *
 * User actions
 *
 */

'use strict'

var Reflux      = require('reflux')
  , Github      = require('../services/github')

var UserActions = Reflux.createActions({
    'fetchProfile': {
        children: ['completed', 'failed']
    }
})

// Perform data fetch
UserActions.fetchProfile.listen( function()
{
  Github('/user')
    .get()
    .then( this.completed )
    .catch( this.failed )
})

module.exports = UserActions
