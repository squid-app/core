/**
 * Squid Core
 *
 * Current User state store
 *
 */

'use strict'

var Reflux      = require('reflux')
  , OrgsActions = require('../actions/orgs')
  , Core        = require('../core')

var _LOGNAME = '[Core::Store::Orgs] '

var OrgsStore = Reflux.createStore(
{
    init: function()
    {
      Core.log( _LOGNAME + 'init OrgsStore')

      this.state = {
          orgs:    []
        , message: false
      }

      this.listenToMany( OrgsActions )

      // trigger fetch on init
      this.callFetchOrgs()
    }

  , onFetchOrgsCompleted: function( response )
    {
      // reset error
      this.state.message = false
      this.state.orgs    = response

      this.trigger( this.state )
    }

    // handle error
  , onFetchOrgsFailed: function( err )
    {
      Core.log( _LOGNAME + 'fetch user organizations failed' )

      this.state.orgs    = []
      this.state.message = err.message

      this.trigger( this.state )
    }

  , callFetchOrgs: function()
    {
      OrgsActions.fetchOrgs()
    }

  , getOrgs: function()
    {
      return this.state.orgs
    }
})

module.exports = OrgsStore
