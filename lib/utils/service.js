/**
 * Squid Core
 *
 * Github API services provider
 * Work in Progress
 *
 */

'use strict';

var Core  = require('../core')
  , fetch = require('node-fetch')
  , _     = require('lodash')

// Call a Github service
//
//      @params  {string}  service url
//      @params  {object}  xhr options
//      @return  {object}  Fetch instance
//
var Service = function( service, options )
{
  options = options || {}
  service = this.formatUrl( service )

  // Format headers' authorization property
  var authorization = [
      Core.getConfig('github.authorization')
    , Core.getCredentials()
  ].join(' ')

  // merge headers' configurations
  var baseHeaders   = _.extend( Core.getConfig('github.headers'), {
                        'Authorization': authorization
                      })

  // instance final configuration object
  var settings  = _.extend( options || {}, { headers:  baseHeaders })

  return fetch( service, settings )
}

// Format full URL to API service
//
//      @params  {string}  service's URL
//      @return  {string}
//
Service.prototype.formatUrl = function( service )
{
  if( !service )
    throw new Error( '[Core::Utils::Service] Squid need a Github API service' )

  if( service.substr(0,1) !== '/' )
    service = '/' + service

  var url = service.indexOf('//') >= 0 ? service : Core.getConfig('github.baseurl') + service

  // Add timestamp to prevent cache
  return url + ( (/\?/).test( url ) ? '&' : '?' ) + ( new Date() ).getTime()
}

// Iterate over Github service pagination, eg `repos`
//
//      @params  {string}  service url
//      @params  {object}  xhr options
//      @return  {mixed}
//
Service.prototype.apiPages = function( service, options, results )
{
  var serviceUrl = service + '?per_page='+ Core.getConfig('github.pagination')
    , next       = false
    , self       = this
    , results    = results || []
    , api        = this.api( serviceUrl )

  // pagination stolen from Github.js by Michael Aufreiter
  ;(function iterate()
  {
    api.setUrl( self.formatUrl( serviceUrl ) )
      .get()
      .then( function( response )
      {
        results.push.apply( results, response.json )

        var links = ( response.xhr.getResponseHeader('link') || '' ).split(/\s*,\s*/g)
          , next  = _.find( links, function( link ) { return /rel="next"/.test( link ) })

        if( next )
          next = (/<(.*)>/.exec(next) || [])[1]

        if( !next )
        {
          if( _.isFunction( options.onComplete ) )
            options.onComplete( results )
          else
            return results
        }
        else
        {
          serviceUrl = next
          iterate()
        }
      })

  })()

  return api
}

module.exports = Service
