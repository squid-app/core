/**
 * Squid Core
 *
 * Collection of issue's comments
 * more details on schema at:
 * https://developer.github.com/v3/issues/
 *
 */

'use strict';

var Backbone = require('backbone')
  , Comment  = require('../models/comment')

module.exports = Backbone.Collection.extend(
{
    model: Comment

  , comparator: function( model )
    {
      return model.get('created_at')
    }
})
