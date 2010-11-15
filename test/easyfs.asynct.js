


var fs = require ('fs')
  , path = require ('path')
  , easyfs = require ('easyfs')
  , inspect = require('util').inspect
  function random(n){
    n = n || 10000
    return Math.round(Math.random() * n)
  }
  function rDir(name){
    return path.join(process.ENV.PWD,"random_dir_" + random())
  }

  function makePath(name){
    return path.join(process.ENV.PWD,name)
  }
  function exists(name){
    try{
      return fs.statSync(makePath(name))
    } catch (err){
      return false;//file does not exist
    }
  }

exports['can check file existsSync'] = function(test){
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
//  test.equal(exists(name),false, "expected dir:" + name + "to not exist")
  easyfs.exists(makePath(name),notFound)
  
  function notFound(err,stat){
    console.log(stat)
    test.ok(err,"expected dir:" + name + " to not exist")
    easyfs.exists(process.ENV.HOME  ,found)
  }

  function found(err,stat){
    console.log(stat)
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

  easyfs.save.apply(null,file_args.concat([obj,c]))
  function c(){

    easyfs.load.apply(null,file_args.concat([c]))
    function c(err,loaded){
    
      test.deepEqual(loaded,obj, "expected: " + inspect(obj) + ", got:" + inspect(loaded) + " when loading " + path.join.apply(null,file_args));
      easyfs.rm.apply(null,file_args.concat([c]))
      function c(err){
        test.ifError(err)

        easyfs.exists.apply(null,file_args.concat([c]))
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
  testSaveLoadRm(test,[makePath('random_file_' + random())],test.finish)
}

exports['arguments save load rm automaticially joins'] = function (test){
  testSaveLoadRm(test,[process.ENV.PWD,'random_file.json'],test.finish)
/*  function c(){
    testSaveLoadRm(test,[process.ENV.PWD,'a','b','c.json'],c)
    function c(){
      testSaveLoadRm(test,[process.ENV.PWD,'a','b','..','c.json'],c)
      
      test.finish()
    }
  }*/
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
  var dir = easyfs.join(process.ENV.PWD, 'examples')
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
        console.log("save : " + f)
        easyfs.save(dir,f,cur,c)

        function c (err){
          test.ifError(err)
          easyfs.load(dir,f,randFile(),c)

          function c (err,obj){
            console.log("loaded : " + f)
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
      console.log("LS " + dir)
      easyfs.ls(dir,c)
      function c (err,contents){
        console.log("LS " + dir)
        console.log("err " + err)
        test.ifError(err)
        test.deepEqual(contents.sort(),files.sort())
        easyfs.rm(dir,test.finish)        
      }
    }
  }
}

