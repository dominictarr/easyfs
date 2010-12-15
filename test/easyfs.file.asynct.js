var fs = require ('fs')
  , path = require ('path')
  , easyfs = require ('easyfs')
  , inspect = require('util').inspect
  , assert = require('assert')
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
  t.write("1\n",c) // automaticially opens file if necessary
  t.write("2\n",c)
  t.writeln("3",c)
  t.writeln("4",c)

  function c(err){
    test.ifError(err)
    test.finish()
    } }

exports ['can read a file a line at a time'] = function (test){
  var t = easyfs.Temp()
    , lines = 0

  t.write([1,2,3,4].join('\n') + '\n',c) // automaticially opens file.

  function c(){
    t.readLines(rl,test.finish)
    /*
    IMPLEMENT READ LINES
    
    */
    function rl(line){
      
      lines ++
      console.log("line:", line)
      test.equal(line,lines + '\n')
      }
    function done(){
      test.equal(lines,4)
      test.finish()
      } } }

function testReadConsistantOnFile(filename,r){

  var lines = []
    , file = easyfs.File(filename)
  file.read(c)

  function c(err,code){
    lines = code.split('\n')
    //if there is another item in list, add a \n
    lines = lines.map(function (l,v){
      return (v + 1 < lines.length) ? (l + '\n') : l      
      } )
    
    
    file.readLines(ln,end)
    function ln(l){
      assert.equal(l,lines.shift())
    }    
    function end(){
      console.log("LEFTOVER :\"",inspect(lines),'"')
      assert.ok(lines.length <= 1)//the logic of the last items in split is weird.
      r()
    }
  }
}

exports ['readLine consistant with read'] = function (test){
  testReadConsistantOnFile(__filename,test.finish)
}
exports ['readLine consistant with read 2'] = function (test){
  testReadConsistantOnFile(require.resolve('easyfs'),test.finish)
}
/**
exports ['File loads sync or async, and tells whether is file or dir'] = function (test){
  test.equal(easyfs.File('.').isDir,true,'loads Sync and has isDir')

  test.finish()
}

*/

/*
  special cases: 
      when it doesn't end in a new line.
      when only first half of buffer fits into a line.
      one really long line.
      when file is open and being streamed to.

*/


