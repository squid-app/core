/**
 * Squid Core
 *
 * List all repositories across publics/privates
 * and organisations for the authenticated user
 *
 */

'use strict'

var Reflux      = require('reflux')
  , Promise     = require('bluebird')
  , Collection  = require('../collections/repositories')
  , Github      = require('../services/github')
  , Core        = require('../core')

var _LOGNAME = '[Core::Store::Repositories] '

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
  var user  = require('./user')
    , orgs  = user.model().get('orgs')
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
            console.log(err.message)
            scope.failed( err )
          })
      })
    }

    return Core.promiseWhile( condition, iterate, organisations )
  }
})

var RepositoriesStore = Reflux.createStore(
{
    init: function()
    {
      Core.log( 'info', _LOGNAME + 'init RepositoriesStore')

      this.state = {
          repositories: new Collection()
        , actionsDone:  0
        , actionNeeds:  2
        , error:        false
      }

      this.listenToMany( RepositoriesActions )

      // trigger fetch on init
      this.fetchUserOwned()
      this.fetchUserOrganizations()
    }

    // do we perfom all actions
  , isComplete: function()
    {
      var isValid = ( this.state.actionsDone === this.state.actionNeeds )

      if( isValid )
        this.state.actionsDone = 0

      return isValid
    }

    // User Repositories
    // ----------------------

  , onUserOwnedCompleted: function( response )
    {
      this.state.repositories.set( response, { remove: false } )
      this.state.error = false

      // actions counter
      ++this.state.actionsDone

      this.trigger( this.state )
    }

    // handle error
  , onUserOwnedFailed: function( err )
    {
      Core.log( 'error', _LOGNAME + 'fetch User Repositories failed' )

      this.state.repositories.reset()
      this.state.error = err.message

      this.trigger( this.state )
    }

    // Organizations Repositories
    // ---------------------------

  , onUserOrganizationsCompleted: function( response )
    {
      if( response )
      {
        this.state.repositories.set( response, { remove: false } )
        this.state.error = false
      }

      // actions counter
      ++this.state.actionsDone

      this.trigger( this.state )
    }

    // handle error
  , onUserOrganizationsFailed: function( err )
    {
      Core.log( 'error', _LOGNAME + 'fetch User Organizations failed' )

      this.state.repositories.reset()
      this.state.error = err.message

      this.trigger( this.state )
    }

    // Utils
    // ---------------------------

    // action trigger
  , fetchUserOwned: function()
    {
      RepositoriesActions.userOwned()
    }

  , fetchUserOrganizations: function()
    {
      RepositoriesActions.userOrganizations()
    }

    // return collection instance
  , collection: function()
    {
      return this.state.repositories
    }
})

module.exports = RepositoriesStore
