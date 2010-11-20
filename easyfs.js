var fs = require('fs')
  , inspect = require('util').inspect
  , assert = require('assert')
  , path = require('path')
  , exec = require('child_process')
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
  got.path = path.join.apply(null,toJoin)
  return got
}


exports.mkdirSync = mkdirSync
function mkdirSync (path,done){
  stat = existsSync(path)
  if(!stat){
    fs.mkdirSync(path,0755)
    return existsSync(path)
  } else {
    return stat 
  }
}

exports.mkdir = mkdir
//ensures that a directory exists, making it if necessary.
function mkdir (){
  var args = getArgs(arguments)
  , file = args.path
  , r = args.callback

  stat = exists(file,c)
  function c(err,stats){
    
    if(err){
      fs.mkdir(file,0755  ,r)
    } else if (stats.isDirectory()){
      r(null,stats)
    } else {
      r(new Error("cannot create directory " + path + " a file already exists.")) 
    }
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

function exists(){
  var args = getArgs(arguments)

  return fs.lstat(args.path,args.callback)
}

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
      callback(null,obj)
    } catch (jsonErr){
      return callback(jsonErr,string)
    }
  }); 
}




exports.rm = rm //typesafe(rm,['string','function'])
function rm (){
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

exports.rmSync = rmSync //typesafe(rm,['string','function'])
function rmSync (file){
  var args = getArgs(arguments)
    , file = args.path
    , callback = args.callback

  //load obj from file
  stat = fs.statSync(file)
  
  if(stat.isDirectory()){
    fs.rmdirSync(file)
  } else {
    fs.unlinkSync(file)
  }
}

exports.join = path.join

exports.ls = function (){
  var args = getArgs(arguments)
    , file = args.path
    , callback = args.callback

  fs.readdir(file,callback)
}

exports.lsSync = function (){
  var args = getArgs(arguments)
    , file = args.path

  return fs.readdirSync(file)
}

exports.ext = path.extname 
exports.noExt = function (file){
  var parts = /(.+)\.\w+$/.exec(file)
  return parts ? parts [1] : file
}

exports.dir = path.dirname/*function (filename){
  path.dirname(filename)
}*/

exports.file = function (filename){
  return filename.replace(path.dirname(filename) + '/','')
}
