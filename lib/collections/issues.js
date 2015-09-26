/**
 * Squid Core
 *
 * Collection of issues
 * more details on schema at:
 * https://developer.github.com/v3/issues/
 *
 */

'use strict';

var Backbone = require('backbone')
  , Issue    = require('../models/issue')

module.exports = Backbone.Collection.extend(
{
    model: Issue

  , comparator: function( model )
    {
      return model.get('created_at')
    }
})
