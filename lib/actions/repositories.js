/**
 * Squid Core
 *
 * User actions
 *
 */

'use strict'

var Reflux      = require('reflux')
  , Promise     = require('bluebird')
  , Github      = require('../services/github')
  , Core        = require('../core')

var RepositoriesActions = Reflux.createActions({
    'userOwned': {
        children: ['completed', 'failed']
    }
  , 'userOrganizations': {
        children: ['completed', 'failed']
    }
})

// Perform data fetch
RepositoriesActions.userOwned.listen( function()
{
  Github('/user/repos')
    .all()
    .then( this.completed )
    .catch( this.failed )
})

RepositoriesActions.userOrganizations.listen( function()
{
  var store = require('../stores/orgs')
    , orgs  = store.getOrgs()
    , total = orgs.length
    , done  = 0

  if( !total )
    this.completed( false )
  else
  {
    var organisations    = []
      , orgsRepositories = []
      , scope            = this

    orgs.forEach(function( org )
    {
      organisations.push( org.repos_url )
    })

    // Condition to stop loop
    var condition = function()
    {
      return ( done !== total )
    }

    // call GH API, return a promise
    var iterate = function()
    {
      return new Promise( function( resolve, reject )
      {
        Github( organisations[ done ] )
          .all()
          .then( function( repos )
          {
            orgsRepositories = orgsRepositories.concat( repos )

            ++done

            if( done === total )
              scope.completed( orgsRepositories )
            else
              resolve()
          })
          .catch( function( err )
          {
            scope.failed( err )
          })
      })
    }

    return Core.promiseWhile( condition, iterate, organisations )
  }
})

module.exports = RepositoriesActions
