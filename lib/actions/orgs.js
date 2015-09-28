/**
 * Squid Core
 *
 * User actions
 *
 */

'use strict'

var Reflux      = require('reflux')
  , Github      = require('../services/github')

var OrgsActions = Reflux.createActions({
    'fetchOrgs': {
        children: ['completed', 'failed']
    }
})

// Perform data fetch
OrgsActions.fetchOrgs.listen( function()
{
  Github('/user/orgs')
    .all()
    .then( this.completed )
    .catch( this.failed )
})

module.exports = OrgsActions
