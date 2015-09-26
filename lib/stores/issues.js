/**
 * Squid Core
 *
 * List all issues across publics/privates
 * and organisations for the authenticated user
 *
 */

'use strict'

var Reflux      = require('reflux')
  , Promise     = require('bluebird')
  , Collection  = require('../collections/issues')
  , Github      = require('../services/github')
  , Core        = require('../core')

var _LOGNAME = '[Core::Store::Issues] '

var IssuesActions = Reflux.createActions({
    'fetchIssues': {
        children: ['completed', 'failed']
    }
})

// Perform data fetch
IssuesActions.fetchIssues.listen( function()
{
  // ?state=all&sort=created&direction=desc&page=1&per_page=1
  Github('/issues')
    .all()
    .then( this.completed )
    .catch( this.failed )
})

var IssuesStore = Reflux.createStore(
{
    init: function()
    {
      Core.log( 'info', _LOGNAME + 'init IssuesStore')

      this.state = {
          issues: new Collection()
        , error:  false
      }

      this.listenToMany( IssuesActions )

      // trigger fetch on init
      this.callFetchIssues()
    }

    // User Repositories
    // ----------------------

  , onFetchIssuesCompleted: function( response )
    {
      this.state.issues.set( response, { remove: false } )
      this.state.error = false

      this.trigger( this.state )
    }

    // handle error
  , onFetchIssuesFailed: function( err )
    {
      Core.log( 'error', _LOGNAME + 'fetch Repositories Issues failed' )

      this.state.issues.reset()
      this.state.error = err.message

      this.trigger( this.state )
    }

    // Utils
    // ---------------------------

    // action trigger
  , callFetchIssues: function()
    {
      IssuesActions.fetchIssues()
    }

    // return collection instance
  , collection: function()
    {
      return this.state.issues
    }
})

module.exports = IssuesStore
