exports['can rm a directory with files in'] = function (test){
  var dir = rDir()
    , fd = path.join(dir,"a_file")
  easyfs.mkdirSync(dir)
  easyfs.save(fd,{whsdf:'sdfasdkhs'})
  easyfs.existsSync(fd)
  easyfs.ls(dir,c)
  function c(err,ls) {
//    test.deepEqual(ls.name,dir)
    test.deepEqual(ls,['a_file'])
    console.log(ls)
    easyfs.rm (dir,done)
    function done (err){
      test.ifError(err)
      test.ok(!easyfs.existsSync(dir))
      test.finish() 
    }
  }
}


exports['arguments save load rm automaticially joins'] = function (test){
  testSaveLoadRm(test,[process.ENV.PWD,'random_file.json'],test.finish)
  function c(){
    testSaveLoadRm(test,[process.ENV.PWD,'a','b','c.json'],c)
    function c(){
      testSaveLoadRm(test,[process.ENV.PWD,'a','b','..','c.json'],c)
      
      test.finish()
    }
  }
}
