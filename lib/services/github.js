/**
 * Squid Core
 *
 * Github API services provider
 *
 * note: Github API expect body parameters
 * to be a JSON string
 *
 * https://github.com/bitinn/node-fetch
 *
 */

'use strict';

var Core  = require('../core')
  , fetch = require('node-fetch')
  , _     = require('lodash')

// If you are not on node v0.12, set a Promise library first, eg.
fetch.Promise = require('bluebird')

var _LOGNAME = '[Core::Services::Github]'

module.exports = function( service, options )
{
  // default options
  options = options || {}

  if( !service )
    throw new Error( _LOGNAME + ' Squid need a Github API service' )

  // prevent missing leading slash
  if( service.substr(0,1) !== '/' )
    service = '/' + service

  // Format full URL of API service
  var url = service.indexOf('//') >= 0 ? service : Core.getConfig('github.baseurl') + service

  // Add timestamp to prevent cache
  url = url + ( (/\?/).test( url ) ? '&' : '?' ) + ( new Date() ).getTime()

  // Create a new object, that prototypally inherits from the Error constructor
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  //
  //      @params  {object}  API response
  //      @return  {void}
  //
  var serviceError = function( response )
  {
    this.name    = _LOGNAME
    this.message = response.statusText || 'Service failed'
    this.status  = response.status
    this.headers = response.headers.raw()
    this.service = service
    this.url     = url
    this.options = options
    this.stack   = (new Error()).stack
  }

  serviceError.prototype = Object.create( Error.prototype )
  serviceError.prototype.constructor = serviceError

  // Call service
  // Format valid response as JSON
  // Throw Error if response is not "ok"
  //
  //      @params  {object}  API response
  //      @return  {object}  Fetch instance
  //
  var callService = function( method )
  {
    // Setup HTTP method
    if( !_.isUndefined( method ) )
      options.method = method

    // Do we have an authorization
    var authorization = {}

    try
    {
      // Format headers' authorization property
      var authorization = {
          'Authorization': [
                Core.getConfig('github.authorization')
              , Core.getGithubToken()
            ].join(' ')
          }
    }
    catch( e ) {
      Core.log('info', _LOGNAME + ' no authorization set')
    }

    // merge headers' configurations
    var baseHeaders   = _.merge( Core.getConfig('github.headers'), authorization )

    // instance final configuration object
    var settings  = _.merge( options, { headers:  baseHeaders })

    return fetch( url, settings )
      .then( function( res )
      {
        if( !res.ok )
          throw new serviceError( res )

        // var links = ( res.headers.get('link') || '' ).split(/\s*,\s*/g)
        //   , next  = _.find( links, function( link ) { return /rel="next"/.test( link ) })

        // if( next )
        //   next = (/<(.*)>/.exec(next) || [])[1]

        // console.log( next )

        return res.json()
      })
  }

  // Iterate over Github service pagination, eg `repos`
  //
  //      @params  {string}  service url
  //      @return  {mixed}
  //
  var callPaginate = function( callback, results )
  {
    url = url + '&per_page='+ Core.getConfig('github.pagination')

    var next       = false
      , self       = this
      , results    = results || []

    // // pagination stolen from Github.js by Michael Aufreiter
    // ;(function iterate()
    // {
    //   callService()
    //     .get()
    //     .then( function( response )
    //     {
    //       results.push.apply( results, response.json )

    //       var links = ( response.xhr.getResponseHeader('link') || '' ).split(/\s*,\s*/g)
    //         , next  = _.find( links, function( link ) { return /rel="next"/.test( link ) })

    //       if( next )
    //         next = (/<(.*)>/.exec(next) || [])[1]

    //       if( !next )
    //       {
    //         if( _.isFunction( options.onComplete ) )
    //           options.onComplete( results )
    //         else
    //           return results
    //       }
    //       else
    //       {
    //         serviceUrl = next
    //         iterate()
    //       }
    //     })

    // })()

    return api
  }

  // Adaptater pattern
  return {
      'get': function()
      {
        return callService()
      }
    , 'paginate': function()
      {
        return callPaginate()
      }
    , 'post': function()
      {
        return callService( 'POST' )
      }
    , 'put': function()
      {
        return callService( 'PUT' )
      }
    , 'delete': function()
      {
        return callService( 'DELETE' )
      }
  }
}
