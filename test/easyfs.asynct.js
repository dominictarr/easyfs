


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

exports['can check file exists'] = function(test){
  name = rDir()
//  test.equal(exists(name),false, "expected dir:" + name + "to not exist")
  easyfs.exists(makePath(name),notFound)
  
  function notFound(stat){
    console.log(stat)
    test.ok(!stat,"expected dir:" + name + "to not exist")
    easyfs.exists(process.ENV.HOME  ,found)
  }

  function found(stat){
    console.log(stat)
    test.ok(stat,"expected dir:" + process.ENV.HOME + "to exist")
    test.finish()
  }
}

exports['can ensureDirSync to make a directory if necessary'] = function (test){
  var dir = rDir()
  test.ok(! easyfs.existsSync(dir))

  easyfs.ensureDirSync(dir)
  test.ok(easyfs.existsSync(dir),"expected: " + dir + " to have been created." )

  easyfs.ensureRmDirSync(dir)

  test.ok(!easyfs.existsSync(dir),"expected: " + dir + " to have been deleted." )

  test.finish()
}

function testSaveLoadRm(test,file_args,cb) {
  var obj = {random1: random(), random2: random()}

  easyfs.save.apply(null,file_args.concat([obj,c]))
  function c(){

    easyfs.load.apply(null,file_args.concat([c]))
    function c(err,loaded){
    
      test.deepEqual(loaded,obj, "expected: " + inspect(obj) + ", got:" + inspect(loaded));
      easyfs.rm.apply(null,file_args.concat([c]))
      function c(err){
        test.ifError(err)

        easyfs.exists.apply(null,file_args.concat([c]))
        function c(shouldBeNull){
          test.equal(shouldBeNull,false,"expected file " + path.join(file_args) 
            + "to be deleted, but got " + inspect(shouldBeNull))
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
  testSaveLoadRm(test,['crazy_dir'  , 'crazy_file.json'],c)
  function c(){
    testSaveLoadRm(test,['a','b','c.json'],c)
    function c(){
      testSaveLoadRm(test,['a','b','..','c.json'],c)
      
      test.finish()
    }
  }
}

exports['can rm a directory'] = function (test){
  var dir = rDir()
  easyfs.ensureDirSync(dir)
  easyfs.rm (dir,done)
  function done (err){
    test.ifError(err)
    test.ok(!easyfs.existsSync(dir))
    test.finish() 
  }
}

exports['can rm a directory with files in'] = function (test){
  var dir = rDir()
    , fd = path.join(dir,"a_file")
  easyfs.ensureDirSync(dir)
  easyfs.save(fd,{whsdf:'sdfasdkhs'})
  easyfs.existsSync(fd)
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


