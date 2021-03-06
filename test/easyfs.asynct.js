


var fs = require ('fs')
  , path = require ('path')
  , easyfs = require ('easyfs')
  , inspect = require('util').inspect

  function random(n){
    n = n || 10000
    return Math.round(Math.random() * n)
  }
  function rDir(name){
    return path.join('/tmp',"random_dir_" + random())
  }

  function makePath(name){
    return path.join('/tmp',name)
  }
  function exists(name){
    try{
      return fs.statSync(makePath(name))
    } catch (err){
      return false;//file does not exist
    }
  }

exports['can check file existsSync 1'] = function(test){
  name =  rDir()
  test.equal(exists(name),false, "expected dir:" + name + "to not exist")
  test.equal(easyfs.existsSync(makePath(name)),false,"expected dir:" + name + " to not exist")

  test.ok(easyfs.existsSync(process.ENV.PWD),"expected dir:" + process.ENV.PWD + " to exist")
  
  test.finish()
}

exports['can check file existsSync'] = function(test){
  name =  rDir()
  easyfs.exists(name,c)
  function c(err,stat){
    test.ok(err instanceof Error, "expected dir:" + name + "to not exist")
    easyfs.exists(process.ENV.PWD,c)
    
    function c(err,stat1){    
      test.equal(err,null, "expected dir:" + process.ENV.PWD + "to exist")
      test.ok(stat1)
      easyfs.exists(process.ENV.PWD,c)
      function c(err,stat2){    
        test.equal(err,null, "expected dir:" + process.ENV.PWD + "to exist")
        test.deepEqual(stat1,stat2,"expected callback of exists to return the same thing for the same file")
        
        test.finish()
      }
    }
  }
}


exports['can check file exists'] = function(test){
  name = rDir()
  easyfs.exists(makePath(name),notFound)
  
  function notFound(err,stat){
    test.ok(err,"expected dir:" + name + " to not exist")
    easyfs.exists(process.ENV.HOME  ,found)
  }

  function found(err,stat){
    test.equal(err,null,"expected dir:" + process.ENV.HOME + " to exist")
    test.finish()
  }
}

exports['can mkdirSync to make a directory if necessary'] = function (test){
  var dir = rDir()
  test.ok(! easyfs.existsSync(dir))

  easyfs.mkdirSync(dir)
  test.ok(easyfs.existsSync(dir),"expected: " + dir + " to have been created." )

  easyfs.rmSync(dir)

  test.ok(!easyfs.existsSync(dir),"expected: " + dir + " to have been deleted." )

  test.finish()
}

exports['can mkdir to make a directory if necessary'] = function (test){
  var dir = rDir()

  test.ok(! easyfs.existsSync(dir))

  easyfs.mkdir(dir,c)
  function c (err,stat){
    test.ok(easyfs.existsSync(dir),"expected " + dir + " to exist")
    test.finish()  
  }
}

exports['mkdir returns error if a file already exists'] = function (test){
  var dir = rDir()

  test.ok(! easyfs.existsSync(dir))
  fs.writeFileSync(dir, "herlsdjgosudfosdj", encoding='utf8')

  easyfs.mkdir(dir,c)
  function c(err,stat){
    test.ok(err instanceof Error, "expected error, because there was already a file, but got:" + err)
    test.finish()
  }
}

exports['mkdir returns normally if a directory already exists'] = function (test){
  var dir = rDir()

  test.ok(! easyfs.existsSync(dir))

  easyfs.mkdir(dir,c)
  function c (err){
    test.ifError(err)    
    test.ok(easyfs.existsSync(dir),"expected " + dir + " to exist")
  
    easyfs.mkdir(dir,c)
    function c (err){
      test.equal(err,null,"expected null, but got: " + err + " when trying to create dir:" + dir)
      easyfs.exists(dir,c)
      function c(err,stat2){
        test.equal(err,null,"expected null, but got: " + err + " when trying to create dir:" + dir)
        test.ok(stat2,"expected " + dir + " to exist")
        test.finish()
      }
    }
  }
}


function randFile(){
  return {random1: random(), random2: random()}
}

function testSaveLoadRm(test,file_args,cb) {
  var obj = {random1: random(), random2: random()}

  easyfs.save(file_args,obj,c)

  function c(){

    easyfs.load(file_args,c)
    function c(err,loaded){
    
      test.deepEqual(loaded,obj, "expected: " + inspect(obj) + ", got:" + inspect(loaded) + " when loading " + file_args);
      easyfs.rm(file_args,c)
      function c(err){
        test.ifError(err)

        easyfs.exists(file_args,c)

        function c(err,stat){
          test.ok(err instanceof Error,"expected file " + path.join(file_args) 
            + "to be deleted, but got " + inspect(err))
          test.finish()
        }
      }
    }
  }
}

exports['can save load and rm a file'] = function(test){
  testSaveLoadRm(test,makePath('random_file_' + random()),test.finish)
}

exports['arguments save load rm joins if file arg is array'] = function (test){
  testSaveLoadRm(test,[process.ENV.PWD,'random_file.json'],test.finish)
}

exports['can rm a directory'] = function (test){
  var dir = rDir()
  easyfs.mkdirSync(dir)
  easyfs.rm (dir,done)
  function done (err){
    test.ifError(err)
    test.ok(!easyfs.existsSync(dir))
    test.finish() 
  }
}


exports['exports join'] = function (test){
  test.equal(easyfs.join('hi','there'),'hi/there')
  test.equal(easyfs.join('hi','there','..'),'hi')
  test.finish()
}
exports['easy.ls lists a directory'] = function (test){
  easyfs.ls('.',c)
  function c(err,ls){
    test.ok(ls instanceof Array)
    test.ok(ls.length > 0)
    test.finish()
  }
}
exports['easyfs.ls lists directory contents'] = function (test){
  var dir = easyfs.join(process.ENV.PWD, 'random_examples')
    , files = ["a.json","b.json","c.json"]
    , i = 0

  easyfs.mkdir(dir,c)
  function c(err){
  
    test.ifError(err)

    loop()
    function loop(){
      if(i < files.length){
        var f = files[i++]
          , cur = randFile()
        easyfs.save([dir,f],cur,c)

        function c (err){
          test.ifError(err)
          easyfs.load([dir,f],c) //************

          function c (err,obj){
            test.ifError(err)
            test.deepEqual(obj,cur)
    
            loop()
          }
        }
      } else {
        n()
      }
    }
    
    function n (){
      easyfs.ls(dir,c)
      function c (err,contents){
        test.ifError(err)
        test.deepEqual(contents.sort(),files.sort())
        easyfs.rm(dir,test.finish)        
      }
    }
  }
}

exports['can get and extensions of a file, and the name without ext'] = function(test){
  var files = 
      [ "README.markdown"
      , 'index.js'
      , 'extensions.node'
      , 'noextension'
      , 'ext.ens.ions.node'
      ]
      
  files.forEach(function(e){
    var parts = e.split('.')
      , _ext = parts.length > 1 ? '.' + parts.pop() : ''
      , _noExt = parts.join('.')
      ,  ext = easyfs.ext(e)
      ,  noExt = easyfs.noExt(e)
          
    test.equal(ext, _ext)
    test.equal(noExt,_noExt)
  })
  
  test.finish()
}

exports ['can get file name - path'] = function (test){
  var files =
      [ ['/home/dominic/.hello','/home/dominic','.hello']
      , ['./index.js','.','index.js']
      , ['../extensions.node','..','extensions.node']
      , ['/home/dominic/noextension','/home/dominic','noextension']
      , ['/home/dominic/whatever/ext.ens.ions.node','/home/dominic/whatever','ext.ens.ions.node']
      ]
 
  files.forEach(function(parts){
    var whole = parts[0]
      , dir = parts[1]    
      , file = parts[2]    
      
    test.equal(easyfs.dir(whole), dir)
    test.equal(easyfs.file(whole), file)
 })
  
     test.finish() 
}


