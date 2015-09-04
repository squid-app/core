/**
 * Squid Core
 *
 * XMLHttpRequest library using a Promise to report
 * the success or failure of the request.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Example_using_new_XMLHttpRequest()
 */

'use strict';

var Promise = require('promise')

module.exports = function( url, options )
{
  options = options || {}

  var core =
  {
      // Private - Override curent request's URL
      setUrl: function( _url )
      {
        url = _url

        return this
      }

      // Private - Get curent request's URL
    , getUrl: function()
      {
        return url
      }

      // Private - Handle request error report
    , error: function( message )
      {
        this.name    = 'Squid Xhr'
        this.message = message || 'XHR has failed'
        this.url     = url
        this.options = options
      }

      // Private - Method that performs the ajax request
    , ajax : function( method, url, args )
      {
        // Creating a promise
        var promise = new Promise( function ( resolve, reject )
        {
          // Instantiates the XMLHttpRequest
          var client = new XMLHttpRequest()
            , uri    = url

          client.open( method, uri )
          client.dataType = 'json' || options.dataType

          // Set headers
          Object.keys( options.headers || {} )
            .forEach( function( key )
            {
              client.setRequestHeader( key, options.headers[ key ] )
            })

          // This is called even on 404 etc
          client.onload = function()
          {
            // so check the status
            if ( this.status == 200 )
            {
              resolve({
                  json: JSON.parse( this.response )
                , xhr:  this
              })
            }
            else
            {
              reject({
                  message: this.statusText
                , status:  this.status
                , xhr:     this
              })
            }
          }

          // Handle network errors
          client.onerror = function()
          {
            throw new core.error({
                message: this.statusText
              , status:  this.status
              , xhr:     this
            })
          }

          // Make the request
          client.send( options.data || null )
        })

        // Return the promise
        return promise
      }
  }

  // Adapter pattern
  return {
      'get': function( args )
      {
        return core.ajax( 'GET', url, args )
      }
    , 'post': function( args )
      {
        return core.ajax( 'POST', url, args )
      }
    , 'put': function( args )
      {
        return core.ajax( 'PUT', url, args )
      }
    , 'delete': function( args )
      {
        return core.ajax( 'DELETE', url, args )
      }
    , 'setUrl': core.setUrl
    , 'getUrl': core.getUrl
  }
}
