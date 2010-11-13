var fs = require('fs')

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
