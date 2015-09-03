/**
 * Squid Core
 *
 * Repository data model
 * more details on schema at:
 * https://developer.github.com/v3/repos/
 *
 */

'use strict';

var Backbone = require('backbone')
  , _        = require('lodash')

module.exports = Backbone.Model.extend(
{
    defaults :
    {
        name:         null
      , full_name:    null
      , private:      false
      , html_url:     null
    }

  , getAvatar: function( size )
    {
      size = size || 34

      var owner = this.get('owner')

      return owner.avatar_url + '&s=' + size
    }

  , getUrl: function()
    {
      return this.get('html_url')
    }

  , getOwner: function()
    {
      return this.get('owner').login
    }

  , getDesc: function()
    {
      return this.get('description')
    }

  , searchable: function()
    {
      return this.get('full_name').toLowerCase()
    }
})
