var fs = require('fs')
  , inspect = require('util').inspect
  , assert = require('assert')
  , path = require('path')
exports.ensureDirSync = ensureDirSync
//ensures that a directory exists, making it if necessary.
function ensureDirSync (path,done){
  stat = existsSync(path)
  if(!stat){
    fs.mkdirSync(path,666)
    return existsSync(path)
  } else {
    return stat 
  }
}
exports.ensureRmDirSync = ensureRmDirSync

function ensureRmDirSync (path,done){
  stat = existsSync(path)
  if(stat){
    fs.rmdirSync(path)
  }
}

exports.existsSync = existsSync

function existsSync(path){
  try{
    return fs.statSync(path)
  } catch (err){
    return false;//file does not exist
  }
}

exports.exists = exists

function getArgs (args){
  var got = {}
    , toJoin = []
  for(i in args){
    if('object' == typeof args[i])
      got.obj = args[i]
    else if('function' == typeof args[i])
      got.callback = args[i]
    else
      toJoin.push(args[i])
  }
  got.path = path.join(toJoin)
  return got
}

function exists(){
  var args = getArgs(arguments)
  , file = args.path
  , callback = args.callback

  return fs.lstat(file,makeNull)
  function makeNull (err,stat){
    if(err) {
      callback(false)
    } else {
      callback(stat)
    }
  }
}
/*
exports.ensureRm = ensureRm
function ensureRm(){//list of paths
  var callback
  for(i in arguments){
    if('function' == typeof arguments[i]){
      callback = arguments[i]
      delete arguments[i]
    }
  }
}
*/

/*
  good error messages in the right place make debugging easy


*/
function typesafe(func,types,self){
  return function (){
    try{
      for(i in arguments){
        if(types[i])
          assert.equal(typeof arguments[i],types[i])
      }
    } catch (e){
      var funcStart = ("" + func).split('\n')[0] + '...'
      e.message = funcStart + " expected type '" + types[i] + "' as arg:" + i 
        + " instead got type :" + typeof arguments[i] + " === typeof " + arguments[i]
      throw e
    }
    return func.apply(self,arguments)
  }
}


exports.save = save //typesafe(save,['string','object','function'])
function save (){
  var args = getArgs(arguments)
    , file = args.path
    , obj = args.obj
    ,callback = args.callback
  //JSON obj and save to file.
  var string = JSON.stringify(obj)
//  console.log('saving: ' + file + ' = \'' + string + '\'')
  callback = callback || function (){}
  fs.writeFile(file, string, 'ascii', callback);
}

exports.load = load //typesafe(load,['string','function'])
function load (file, callback){
  var args = getArgs(arguments)
    , file = args.path
    , callback = args.callback

  //load obj from file
  fs.readFile(file, 'ascii', function(err,string){
    if (err) {
      return callback(err,string)
    }
    try{      
      obj = JSON.parse( string )
//      console.log('loaded: ' + file + ' = \'' + string + '\' ' + inspect(obj))
      callback(null,obj)
    } catch (jsonErr){
      return callback(jsonErr,string)
    }
  }); 
}

exports.rm = rm //typesafe(rm,['string','function'])
function rm (file, callback){
  var args = getArgs(arguments)
    , file = args.path
    , callback = args.callback

  //load obj from file
  fs.lstat(file,remove)
  
  function remove(err,stat){
    assert.ifError(err)
    if(stat.isDirectory()){
      fs.rmdir(file,callback)
    } else {
      fs.unlink(file,callback)
    }
  }
}
exports.join = path.join
