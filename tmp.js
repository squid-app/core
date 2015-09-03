// Sandbox file for dev

var _PATH = './index'

var SquidCore = require( _PATH ).core({
  config: { env: 'prod' }
})

console.log(SquidCore.getConfig('github.pagination.repositories', 'test'))
console.log(SquidCore._UID)

// var SquidCore2 = require( _PATH ).core({
//   config: { env: 'prod' }
// })
// console.log(SquidCore._UID)
try
{
  var model = require( _PATH ).model('test')
}
catch( e )
{
  console.error( e.message )
}

console.log( typeof require( _PATH ).util('xhr') )

var model = require( _PATH ).model('user') //({ name: 'michael' })
  , user  = new model({ name: 'michael' })

console.log( user.get('name'))

var UserStore = require( _PATH ).store('user')

console.log( UserStore.userprofile.getName() )
console.log( UserStore.userprofile.getAvatar() )
