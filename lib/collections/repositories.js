/**
 * Squid Core
 *
 * Collection of repositories
 * more details on schema at:
 * https://developer.github.com/v3/repos/
 *
 */

'use strict';

var Backbone   = require('backbone')
  , Repository = require('../models/repository')

module.exports = Backbone.Collection.extend(
{
    model: Repository

  , comparator: function( model )
    {
      return model.get('name').charAt(0).toLowerCase()
    }
})
