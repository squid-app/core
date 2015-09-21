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
 * Usages
 *
 * Classic call
 *
 *  github('/users/michael-lefebvre/repos')
 *    .get()
 *    .then(function( response )
 *    {
 *      console.log( response.length )
 *    })
 *    .catch( function( err )
 *    {
 *      console.log( err.name )
 *      console.log( err.message )
 *      console.log( err.status )
 *      console.log( err.url )
 *      console.log( err.service )
 *      console.log( err.stack )
 *    })
 *
 * All method • AKA pagination
 *
 *  github('/user/repos')
 *    .all( function( err, repos )
 *    {
 *      if( err )
 *      {
 *        console.log( err.message )
 *        return
 *      }
 *      console.log('finale')
 *      console.log( repos.length )
 *    })
 */

'use strict';

var Core  = require('../core')
  , fetch = require('node-fetch')
  , _     = require('lodash')

// If you are not on node v0.12, set a Promise library first, eg.
fetch.Promise = require('bluebird')

var _LOGNAME = '[Core::Services::Github] '

module.exports = function( service, options )
{
  // default options
  options = options || {}

  if( !service )
    throw new Error( _LOGNAME + 'Squid need a Github API service' )

  // prevent missing leading slash
  if( service.substr(0,1) !== '/' )
    service = '/' + service

  // Format full URL of API service
  var url = service.indexOf('//') >= 0 ? service : Core.getConfig('github.baseurl') + service

  // Add timestamp to prevent cache
  url = url + ( (/\?/).test( url ) ? '&' : '?' ) + 'squiCache=' + ( new Date() ).getTime()

  // Create a new object, that prototypally inherits from the Error constructor
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  //
  //      @params  {object}  API response
  //      @return  {void}
  //
  var serviceError = function( response )
  {
    this.name    = _LOGNAME
    this.message = response.statusText || 'Github service failed'
    this.status  = response.status
    this.headers = response.headers.raw()
    this.service = service
    this.url     = url
    this.options = options
    this.stack   = (new Error()).stack
  }

  serviceError.prototype = Object.create( Error.prototype )
  serviceError.prototype.constructor = serviceError

  // Format headers' authorization property
  //
  //      @return  {object}  API headers.Authorization
  //
  var setAuthorization = function()
  {
    // if no Authorization provided
    // we try the default one
    if( _.isUndefined( options.headers ) )
    {
      try
      {
        return {
          'Authorization': [
                Core.getConfig('github.authorization')
              , Core.getGithubToken()
            ].join(' ')
        }
      }
      catch( e )
      {
        Core.log('info', _LOGNAME + ' no authorization set')
        return {}
      }
    }

    // if we don't want to send Authorization
    if( !options.headers.Authorization )
      return {}

    // if we provided an Authorization
    if( options.headers.Authorization )
      return { 'Authorization': options.headers.Authorization }
  }

  // Format headers' property
  //
  //      @return  {object}  API headers
  //
  var getHeaders = function()
  {
    var headers = _.merge( options.headers || {}, setAuthorization() )

    // merge headers' configurations
    return _.merge( Core.getConfig('github.headers'), headers )
  }

  // API call final configuration object
  //
  //      @return  {object}  API settings
  //
  var getSettings = function()
  {
    return _.merge( options, { headers: getHeaders() })
  }

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

    return fetch( url, getSettings() )
      .then( function( res )
      {
        if( !res.ok )
          throw new serviceError( res )

        return res.json()
      })
  }

  // Iterate over Github service pagination, eg `repos`
  //
  //      @params  {function}   callback
  //
  var callPaginate = function( callback )
  {
    // add pagination parameter
    url = url + '&per_page='+ Core.getConfig('github.pagination')

    if( !_.isFunction( callback ) )
      throw new Error( _LOGNAME + 'Githib `all` method expect need a callback' )

    var nextPage = false  // API next page's URL
      , results  = []     // API response collection
      , settings = getSettings()

    // pagination stolen from Github.js by Michael Aufreiter
    ;(function iterate()
    {
      fetch( url, settings )
        .then( function( response )
        {
          if( !response.ok )
            throw new serviceError( response )

          var links = ( response.headers.get('link') || '' ).split(/\s*,\s*/g)

          nextPage = _.find( links, function( link ) { return /rel="next"/.test( link ) })

          if( nextPage )
            nextPage = ( /<(.*)>/.exec( nextPage ) || [] )[1]

          return response.json()
        })
        .then( function( json )
        {
          results.push.apply( results, json )

          if( _.isUndefined( nextPage ) )
          {
            callback( null, results )
          }
          else
          {
            url = nextPage
            iterate()
          }
        })
        .catch( function( err )
        {
          callback( err, results )
        })
    })()
  }

  // Adaptater pattern
  return {
      'get': function()
      {
        return callService()
      }
    , 'all': function( callback )
      {
        return callPaginate( callback )
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
