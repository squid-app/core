/**
 * Squid Core
 *
 * User data model
 * more details on schema at:
 * https://developer.github.com/v3/users/
 *
 */

'use strict';

var Backbone = require('backbone')
  , _        = require('lodash')

module.exports = Backbone.Model.extend(
{
    _authError: false

  , defaults :
    {
        name:         null
      , public_repos: null
      , avatar_url:   null
      , email:        null
      , orgs:         []
    }

  , getName: function()
    {
      if( !_.isNull( this.get('name') ) )
        return this.get('name')

      return this.get('login')
    }

  , getProfileUrl: function()
    {
      return this.get('html_url')
    }

  , getAvatar: function( size )
    {
      size = size || 34

      return this.get('avatar_url') + '&s=' + size
    }

  , setOrgs: function( orgs )
    {
      this.set( 'orgs', orgs )
    }

  , setAuthError: function( value )
    {
      this._authError = value
    }

  , hasAuthError: function()
    {
      return this._authError
    }

  , isLogged: function()
    {
      return !_.isUndefined( this.id )
    }
})
