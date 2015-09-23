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
 */

'use strict';

var Core    = require('../core')
  , Fetch   = require('node-fetch')
  , Promise = require('bluebird')
  , _       = require('lodash')

// If you are not on node v0.12, set a Promise library first, eg.
Fetch.Promise = Promise

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
    // defaults
    this.status  = false
    this.headers = false
    this.message = 'Github service failed'

    if( response && _.isObject( response ) )
    {
      this.status  = response.status
      this.headers = response.headers.raw()
      this.message = response.statusText || this.message
    }

    if( _.isString( response ) )
    {
      this.message = response
    }

    this.name    = _LOGNAME
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

    return Fetch( url, getSettings() )
      .then( function( response )
      {
        if( !response.ok )
          throw new serviceError( response )

        // if response has no-content, eg: delete
        if( response.status === 204 )
          return response

        return response.json()
      })
  }

  // Iterate over Github service pagination, eg `repos`
  //
  //      @params  {integer}  pagination offset
  //      @return  {promise}
  //
  var callPaginate = function( pagination )
  {
    // add pagination parameter to service's URL
    url = url + '&per_page='+ ( pagination || Core.getConfig('github.pagination') )

    var results  = [] // API response collection
      , settings = getSettings()
      , resolver = Promise.defer()

    // Condition for stopping
    var condition = function()
    {
      return !_.isUndefined( url )
    }

    // call GH API, return a promise
    var iterate = function()
    {
      return new Promise( function( resolve, reject )
      {
        Fetch( url, settings )
          .then( function( response )
          {
            if( !response.ok )
              reject( new serviceError( response ) )

            // pagination parser stolen
            // from Github.js by Michael Aufreiter
            var links = ( response.headers.get('link') || '' ).split(/\s*,\s*/g)

            url = _.find( links, function( link ) { return /rel="next"/.test( link ) })

            if( url )
              url = ( /<(.*)>/.exec( url ) || [] )[1]

            return response.json()
          })
          .then( function( json )
          {
            results.push.apply( results, json )
            resolve()
          })
      })
    }


    // promise loop :
    // https://gist.github.com/victorquinn/8030190
    var loop = function()
    {
      if( !condition() )
        return resolver.resolve( results )

      return Promise
        .cast( iterate() )
        .then( loop )
        .catch( function( err )
        {
          resolver.reject( err )
        })
    };

    process.nextTick( loop )

    return resolver.promise
  }

  // Adaptater pattern
  return {
      'get': function()
      {
        return callService()
      }
    , 'all': function( pagination )
      {
        return callPaginate( pagination )
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
