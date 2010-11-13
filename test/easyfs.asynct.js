
var fs = require ('fs')
  , path = require ('path')
  , easyfs = require ('easyfs')

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
  name = "random_dir_" + Math.round(Math.random() * 10000)
  test.equal(exists(name),false, "expected dir:" + name + "to not exist")
  test.equal(easyfs.existsSync(makePath(name)),false,"expected dir:" + name + " to not exist")
  
  test.ok(easyfs.existsSync(process.ENV.PWD),"expected dir:" + process.ENV.PWD + " to exist")
  
  test.finish()
}

exports['can check file exists'] = function(test){
  name = "random_dir_" + Math.round(Math.random() * 10000)
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
  var name = "random_dir_" + Math.round(Math.random() * 10000)
  test.ok(! easyfs.existsSync(makePath(name)))

  easyfs.ensureDirSync(makePath(name))
  test.ok(easyfs.existsSync(makePath(name)),"expected: " + name + " to have been created." )

  easyfs.ensureRmDirSync(makePath(name))

  test.ok(!easyfs.existsSync(makePath(name)),"expected: " + name + " to have been deleted." )

  test.finish()
}

//this is all the functionality that i need right now.
