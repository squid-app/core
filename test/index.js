/**
 * Squid Core
 *
 * Unit Test
 *
 */

var chai            = require('chai')
  , should          = chai.should()
  , expect          = chai.expect
  , assert          = chai.assert
  , _ENV            = 'test'
  , _INDEX_PATH     = '../index'
  , _STORAGE_ENGINE = 'Memory'
  , pjson           = require('../package.json')     // NPM package
  , cjson           = require('../lib/config/test')  // App test config file
  , gjson                                            // Github App credentials

try
{
  var gjson = require('../github.json')
}
catch( e )
{
  console.log('------------')
  console.log('TEST ABORTED')
  console.log('./github.json file not found, see:')
  console.log('')
  console.log('https://github.com/squid-app/core#github-app-configuration')
  console.log('------------')
  return
}

// New Squid Core instance
var SquidCore = require( _INDEX_PATH )

// Setup App instance w/ `test` environnement
SquidCore.setup({
    env:     _ENV
  , storage: { engine: _STORAGE_ENGINE }
})

// Test Core library
describe( '#core', function()
{
  it('Core version up-to-date with package.js', function()
  {
    SquidCore
      ._VERSION
      .should
      .equal( pjson.version )
  })

  it('Get Config environment', function()
  {
    SquidCore
      .config()
      .getEnv()
      .should
      .equal( _ENV )
  })

  it('Get Github App client ID', function()
  {
    SquidCore
      .getConfig('github.credentials.id')
      .should
      .equal( gjson.id )
  })

  it('Get Config value', function()
  {
    SquidCore
      .getConfig('github.pagination')
      .should
      .equal( cjson.github.pagination )
  })

  it('Get Storage engine name', function()
  {
    SquidCore
      .storage()
      .getEngine()
      .should
      .equal( _STORAGE_ENGINE )
  })

  it('Catch unknow Storage key', function()
  {
    (function ()
    {
      SquidCore.getStorage('test')
    })
      .should
      .throw( Error )
  })

  it('Set and Get Storage value', function()
  {
    SquidCore.storage().set('test', 'ok')

    SquidCore
      .getStorage('test')
      .should
      .equal( 'ok' )
  })

  it('Github token not define', function()
  {
    (function ()
    {
      SquidCore.getGithubToken()
    })
      .should
      .throw( Error )

    // assert
    //   .throws( SquidCore.getCredentials, Error, SquidCore._errors.credentialsNotSet )
  })

  it('User not logged in', function()
  {
    SquidCore
      .isLogin()
      .should
      .equal( false )
  })

  it('Set Github token', function()
  {
    SquidCore.setGithubToken('test')

    SquidCore
      .getGithubToken()
      .should
      .equal( 'test' )
  })

  it('User is logged in', function()
  {
    SquidCore
      .isLogin()
      .should
      .equal( true )
  })
})

// Test files manager alias
describe( '#Core/getFile', function()
{
  it('Get services/github file', function()
  {
    var type = ( typeof SquidCore.service('github') )

    type
      .should
      .equal( 'function' )
  })

  it('Catch unknow file error', function()
  {
    (function ()
    {
      new SquidCore.util('Unknow')
    })
      .should
      .throw( Error )
  })
})


// Test User Model

var userlogin = 'michael-lefebvre'
  , model     = SquidCore.model('user')
  , user      = new model({ login: userlogin })

describe( '#Models/User', function()
{
  it('Get user login', function()
  {
    user.get('login').should.equal( userlogin )
  })

  it('User do not have name, display login', function()
  {
    user.getName().should.equal( userlogin )
  })

  it('Set user name', function()
  {
    user.set('name', 'michael')
    user.getName().should.equal( 'michael' )
  })
})
