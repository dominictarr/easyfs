var fs = require('fs')
  , inspect = require('util').inspect
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

function exists(path,callback){
  return fs.lstat(path,makeNull)
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
exports.save = save
function save (file, obj,callback){
  //JSON obj and save to file.
  var string = JSON.stringify(obj)
  console.log('saving: ' + file + ' = \'' + string + '\'')
  callback = callback || function (){}
  fs.writeFile(file, string, 'ascii', callback); 
}

exports.load = load
function load (file, callback){
  //load obj from file
  fs.readFile(file, 'ascii', function(err,string){
    if (err) {
      return callback(err,string)
    }
    try{      
      obj = JSON.parse( string )
      console.log('loaded: ' + file + ' = \'' + string + '\' ' + inspect(obj))
      callback(null,obj)
    } catch (jsonErr){
      return callback(jsonErr,string)
    }
  }); 
}

exports.rm = rm
function rm (file, callback){
  //load obj from file
  fs.unlink(file,callback)
}
