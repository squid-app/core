/**
 * Squid Core
 *
 * Current User state store
 *
 */

'use strict'

var Reflux      = require('reflux')
  , UserActions = require('../actions/user')
  , UserModel   = require('../models/user')

var UserStore = Reflux.createStore(
{
    listenables: [ UserActions ]
  , userprofile: false

  , init: function()
    {
      this.fetchProfile()
    }

  , fetchProfile: function()
    {
      // Perform data fetch
      console.log('fetch complete')
      // Fake asign
      this.userprofile =  new UserModel({
          'login': 'michael-lefebvre'
        , 'id': 279053
        , 'avatar_url': 'https://avatars.githubusercontent.com/u/279053?v=3'
        , 'gravatar_id': ''
        , 'url': 'https://api.github.com/users/michael-lefebvre'
        , 'html_url': 'https://github.com/michael-lefebvre'
        , 'followers_url': 'https://api.github.com/users/michael-lefebvre/followers'
        , 'following_url': 'https://api.github.com/users/michael-lefebvre/following{/other_user}'
        , 'gists_url': 'https://api.github.com/users/michael-lefebvre/gists{/gist_id}'
        , 'starred_url': 'https://api.github.com/users/michael-lefebvre/starred{/owner}{/repo}'
        , 'subscriptions_url': 'https://api.github.com/users/michael-lefebvre/subscriptions'
        , 'organizations_url': 'https://api.github.com/users/michael-lefebvre/orgs'
        , 'repos_url': 'https://api.github.com/users/michael-lefebvre/repos'
        , 'events_url': 'https://api.github.com/users/michael-lefebvre/events{/privacy}'
        , 'received_events_url': 'https://api.github.com/users/michael-lefebvre/received_events'
        , 'type': 'User'
        , 'site_admin': false
      })

      // update all subscribers component's states
      this.trigger( this.userprofile )
    }
})

module.exports = UserStore
