/**
 * Squid Core
 *
 * Current User state store
 *
 */

'use strict'

var Reflux      = require('reflux')
  , UserModel   = require('../models/user')
  , UserActions = require('../actions/user')
  , Core        = require('../core')

var _LOGNAME = '[Core::Store::User] '

var UserStore = Reflux.createStore(
{
    init: function()
    {
      Core.log( _LOGNAME + 'init UserStore')

      this.state = {
          user:    false
        , message: false
      }

      this.listenToMany( UserActions )

      // trigger fetch on init
      this.callFetchProfile()
    }

    // Profile
    // --------------

  , onFetchProfileCompleted: function( response )
    {
      this.state.message = false
      this.state.user    = new UserModel( response )

      this.trigger( this.state )
    }

    // handle error
  , onFetchProfileFailed: function( err )
    {
      Core.log( _LOGNAME + 'fetchProfile failed' )

      this.state.user    = false
      this.state.message = err.message

      this.trigger( this.state )
    }

    // action trigger
  , callFetchProfile: function()
    {
      UserActions.fetchProfile()
    }

    // return model instance
  , model: function()
    {
      return this.state.user
    }
})

module.exports = UserStore
