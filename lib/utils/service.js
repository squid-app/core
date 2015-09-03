/**
 * Squid Core
 *
 * Github API services methods
 * Work in Progress
 *
 */

'use strict';

// Call a Github service
//
//      @params  {string}  service url
//      @params  {object}  xhr options
//      @return  {object}  Xhr instance
//
var Service = function( service, options )
{
  options = options || {}
  service = this.formatUrl( service )

  // TODO - call core/session
  var credentials = this.getCredentials()

  // TODO - set headers based on Core config
  options = _.extend( options || {}, {
    headers:  {
        'Authorization': 'Basic ' + credentials
      , 'Accept':        'application/vnd.github.v3+json'
      , 'Content-Type':  'application/json;charset=UTF-8'
    }
  })

  return Xhr( service, options )
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

  // TODO -  get _API_URL from Core config
  var url = service.indexOf('//') >= 0 ? service : this._API_URL + service

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
  // TODO -  get this._pagination from Core config
  var serviceUrl = service + '?per_page='+ this._pagination
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
