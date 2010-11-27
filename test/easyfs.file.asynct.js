var fs = require ('fs')
  , path = require ('path')
  , easyfs = require ('easyfs')
  , inspect = require('util').inspect


exports ['can save a temp file'] = function (test){

  var obj = {obj: 1234453}
  var temp = easyfs.Temp()
  temp.save(obj)
  temp.load(c)
  console.log(temp.path)
  function c(err,_obj){
    test.ifError(err)
    test.deepEqual(_obj,obj)
    test.finish()
  }
}

/*

OKAY: tempfiles

also, curry the interface so you can say:
easyfs.open('file').write('dsgasdgas')
or
easyfs.openTemp().write('dsgasdgas')
*/

exports ['can open a file'] = function (test){
   

  var t = easyfs.Temp()
  test.equal(t.isOpen,false)
  t.open ('w', c)
  function c(err){
   test.ifError(err)
   test.equal (t.isOpen, true,"file should be open")
    t.close(c)
    function c(){
      test.equal(t.isOpen,false)
      test.finish()      
      } } }


exports ['can open and write to a file'] = function (test){
  throw null
 

  var t = easyfs.Temp()
  t.write("hello ",c) // automaticially opens file.
  function c(){
    test.ok(false)

    t.close(test.finish)
    }
}

exports ['can open and write to a file, and then read'] = function (test){
  throw null

  var t = easyfs.Temp()
  t.write("hello ",c) // automaticially opens file.
  function c(){
    t.write("there\n",c)
    function c(){
      t.close(c)
      function c(){
          var read = t.read(c)
          function c (err,text){
            test.ifError(err)
            test.equal(text,"hello there\n")
    test.ok(false)
            test.finish() 
            
            } } } } }


exports ['write/writeln callback only once'] = function (test){

  var t = easyfs.Temp()
    , calls = 0
    , lines = 0
  t.write("1\n",c) // automaticially opens file.
  t.write("2\n",c) // automaticially opens file.
  t.writeln("3",c) // automaticially opens file.
  t.writeln("4",c) // automaticially opens file.

  function c(err){
    test.ifError(err)
    test.finish()
    } }


exports ['can read a file a line at a time'] = function (test){
  var t = easyfs.Temp()
    , lines = 0

  t.write([1,2,3,4].join('\n'),c) // automaticially opens file.

  function c(){
    t.readLines(rl)
    /*
    IMPLEMENT READ LINES
    
    */
    
    function rl(err,line){
      test.ifError(err)
      lines ++
      console.log("line:", line)
      test.equal(line,'' + lines + '\n')
      if(lines == 4)
        test.finish()
        } } }


/**/

