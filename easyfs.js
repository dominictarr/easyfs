var fs = require('fs')
  , inspect = require('util').inspect
  , assert = require('assert')
  , path = require('path')
  , exec = require('child_process')

function getArgs (args){
  var got = {}
    , toJoin = []
  for(i in args){
    if (args[i] instanceof Array) {
      toJoin = args[i]
    }  else if('function' == typeof args[i]) {
      got.callback = args[i]
    } else if ('string' == typeof args[i]) {
      toJoin = [args[i]]
    } else if('object' == typeof args[i]){
      got.obj = args[i] 
    } else {
      throw new Error("getArgs cannot handle object:" + args[i])
    }
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
function toArray(obj){
  ary = []
  for(i in obj){
    ary[i] = obj[i]
  }
  return ary
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

  console.log('load', file)
  if(!file)
    throw new Error('file to load not specified')

  //load obj from file
  fs.readFile(file, 'utf-8', function(err,string){
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

function toPath(name){
  return ('string' === typeof name) ? name : path.join.apply(null,name)
}

exports.open = open

function open (filename,flags,r){
  flags = flags || 'r'
  file = toPath(filename)
  fs.open(file,755,c)
  function c(err,fd){
    if (err) r(err)
    
    r(null,
      { 
      
      } )
    
  }
}

function curry (){
  var args = toArray(arguments)
    , func = args.shift()
  return function () {
    var a = [].concat(args).concat(toArray(arguments))
    console.log(a)
    func.apply(null,a)
  }
}
/*
curry.right = function (){
  var args = toArray(arguments)
    , func = args.shift()
  return function () {
    var a = [].concat(toArray(arguments)).concat(args)
    console.log(a)
    func.apply(null,a)
  }
}
*/

exports.Temp = Temp

function Temp(name){
//  if(!(this instanceof Temp)) return new Temp()

  var name = ((name || "temp_") + Math.round(Math.random() * 1000000))
    , dir = '/tmp'
    , _path = path.join(dir,name)
    
    return new File(_path)
}

exports.File = File

function File(_path,ready){
  if(!(this instanceof File)) 
    return new File(_path)

  var self = this

  /*if(ready){
  
  } else {
    self.stat = fs.statSync(_path)
    self.exists = true
    self.isDir = fs.isDirectory
  }*/

  self.save = curry(save, _path)
  self.load = curry(load, _path)
  self.rm = curry(rm, _path)
  self.name = exports.file(_path)
  self.dir = exports.dir(_path)
  self.path = _path
  self.isOpen = false
  self.mode = 0666 //755
  self.encoding = 'utf-8'
  var _opening = false
  self.open = function (flags,r){
    if(_opening)
      return
    _opening = true

    if('function' === typeof flags) {
      return r(new Error("expected flags = 'r','w' or 'a'"))
    }

    flags = flags || 'r'

    fs.open(self.path,flags,self.mode,c)
    function c(err,fd){
      if(err) r(err)
      _opening = false
      self.fd = fd
      self.isOpen = true
      r(null,self)    
    }
  }
  self.close = function (r){
    if(!self.isOpen){
      //throw new Error(self.path + " is not open, cannot close")
      r()
    }
    fs.close(self.fd,function(err){
      self.isOpen = false
      r(err)
    })
  }
  
  var toWrite = []
 
  //queue a write 
  self.write = function (string,d){
    toWrite.push({s:string,r:d})
    write()
  }
  self.writeln = function (string,d){
    self.write(string + '\n',d)
  }
  //drain queue
  function write(){
    if(self.isOpen){
        console.log('opened!' + self.path)
      if(toWrite.length > 0) {
        var cbs = []
        var chunk = toWrite.map(function (v){
          if(v.r && -1 == cbs.indexOf(v.r)){
            cbs.push(v.r)
          }
          return v.s
        }).join('')
        console.log('write: "',chunk,'"')
        
        var b = new Buffer(chunk,self.encoding)
        
        fs.write(self.fd,b,0,b.length,null,wrote )
        function wrote (err){
          console.log('wrote!:',chunk.s)
          
          if(!cbs.length & err) throw err

          cbs.forEach(function (e){
            console.log("callback!")
            e(err)
          })
          }
          
      } else return
    } else {
      console.log('opening!')
      self.open('w',write) } }

  self.read = function(r){
    fs.readFile(_path, self.encoding, r)}
 
 /*
  fs is like, _so_ low-level
 
 */
 
  self.readLines = function (line,end){
    var stream = 
      fs.createReadStream(self.path,
        { flags: 'r'
        , encoding:self.encoding
        , mode: 0666
        , bufferSize: 256 /*4 * 1024*/ }  )
    
      stream.on('data',chunk)
      var cur = []
      
      function chunk (data){
        data.split('').forEach( function(ch){
          cur.push(ch)
          if(ch == '\n')
            sendLine()
            } ) }

      function sendLine(){
        line(cur.join(''))
        cur = []
        }

      stream.on('close',function (){
        console.log("close!" + self.path)
        if(cur.length)
          sendLine()
        if(end) { end() } else { line(null) }
        } )

    return stream
    } }//end of File ()

