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

var UserActions = Reflux.createActions([
    'fetchProfile'
])

var UserStore = Reflux.createStore(
{
    listenables: [ UserActions ]
  , userprofile: false

  , init: function()
    {
      console.log('init UserStore')
      this.fetchProfile()
    }

  , fetchProfile: function()
    {
      console.log('Perform data fetch')
      // Perform data fetch
      Github('/user')
        .get()
        .then(function( response )
        {
          console.log('fetch complete')
          this.userprofile = new UserModel( response )

          // update all subscribers component's states
          this.trigger( this.userprofile )
        }.bind( this ) )
        .catch( function( err )
        {
          console.log( err.name )
          console.log( err.message )
          console.log( err.url )
          console.log( err.service )
          console.log( err.options )
        })
    }

  , model: function()
    {
      return this.userprofile
    }
})

module.exports = UserStore
