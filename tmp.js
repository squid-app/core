// Sandbox file for dev

var _PATH = './index'

// Instance
var SquidCore = require( _PATH )

SquidCore.setup({
  config: { env: 'prod' }
})

// var service = SquidCore.util('service')
// console.log(service)

var fetch = require('node-fetch');

// If you are not on node v0.12, set a Promise library first, eg.
// fetch.Promise = require('bluebird');

// plain text or html

fetch('https://github.com/')
    .then(function(res) {
        return res.text();
    }).then(function(body) {
        console.log(body);
    });

return

  // config
console.log('[CONFIG]')
console.log(SquidCore.getConfig('github.pagination', 'test'))
console.log(SquidCore._UID)

  // multiple instance
var SquidCore2 = require( _PATH )
console.log(SquidCore2._UID)
console.log('--------')
// Storage
console.log('[Storage]')
try
{
  var fail = SquidCore.getStorage('test')
}
catch( e )
{
  console.error( e.message )
}

SquidCore._storage.set('test', 'ok')

console.log(SquidCore.getStorage('test') )
console.log('--------')
// Auth
console.log('[Auth]')
try
{
  console.log(SquidCore.getCredentials())
}
catch( e )
{
  console.error( e.message )
}
console.log('--------')
// Class/Files access
console.log('[Files access]')
try
{
  var model = require( _PATH ).model('test')
}
catch( e )
{
  console.error( e.message )
}
console.log('--------')
// console.log( typeof require( _PATH ).util('xhr') )
console.log('[Model]')
var model = SquidCore.model('user') //({ name: 'michael' })
  , user  = new model({ name: 'michael' })

console.log( user.get('name'))

var UserStore = SquidCore.store('user')

console.log( UserStore.userprofile.getName() )
console.log( UserStore.userprofile.getAvatar() )
console.log('--------')
// Service
console.log('[Service]')

SquidCore.setCredentials('test')
var service = SquidCore.util('service')
  , api     = new service('/user')

api
  .get()
  .then( function( response )
  {
    console.log( response )
  })

console.log(api.get())
console.log('--------')
