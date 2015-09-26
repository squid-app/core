/**
 * Squid Core
 *
 * Current User state store
 *
 */

'use strict'

var Reflux      = require('reflux')
  , UserModel   = require('../models/user')
  , Github      = require('../services/github')
  , Core        = require('../core')

var _LOGNAME = '[Core::Store::User] '

var UserActions = Reflux.createActions({
    'fetchProfile': {
        children: ['completed', 'failed']
    }
  , 'fetchOrgs': {
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

UserActions.fetchOrgs.listen( function()
{
  Github('/user/orgs')
    .all()
    .then( this.completed )
    .catch( this.failed )
})

var UserStore = Reflux.createStore(
{
    init: function()
    {
      Core.log( 'info', _LOGNAME + 'init UserStore')

      this.state = {
          user:    false
        , message: false
        , actions: 0
        , total:   2
      }

      this.listenToMany( UserActions )

      // trigger fetch on init
      this.callFetchProfile()
    }

    // do we perfom all actions
  , isComplete: function()
    {
      var isValid = ( this.state.actions === this.state.total )

      if( isValid )
        this.state.actions = 0

      return isValid
    }

    // Profile
    // --------------

  , onFetchProfileCompleted: function( response )
    {
      this.state.message = false
      this.state.user    = new UserModel( response )

      ++this.state.actions

      this.trigger( this.state )

      this.callFetchOrgs()
    }

    // handle error
  , onFetchProfileFailed: function( err )
    {
      Core.log( 'error', _LOGNAME + 'fetchProfile failed' )

      this.state.user    = false
      this.state.message = err.message

      this.trigger( this.state )
    }

    // Profile
    // --------------

  , onFetchOrgsCompleted: function( response )
    {
      // reset error
      this.state.message = false
      this.state.user.set( 'orgs', response )

      ++this.state.actions

      this.trigger( this.state )
    }

    // handle error
  , onFetchOrgsFailed: function( err )
    {
      Core.log( 'error', _LOGNAME + 'fetch user organizations failed' )

      this.state.user    = false
      this.state.message = err.message

      this.trigger( this.state )
    }
    // Utils
    // --------------

    // action trigger
  , callFetchProfile: function()
    {
      UserActions.fetchProfile()
    }

  , callFetchOrgs: function()
    {
      if( !this.state.user )
      {
        var err = _LOGNAME + 'You can not fetch organizations without fetch user profile first'

        Core.log( 'error', err )

        throw new Error( err )
      }

      UserActions.fetchOrgs()
    }

    // return model instance
  , model: function()
    {
      return this.state.user
    }
})

module.exports = UserStore
