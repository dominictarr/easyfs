

var assert = require('assert')
  , easyfsTest = require('./easyfs.asynct')
  
  assert.finish = nextTest
  
  tests = []
  for (i in easyfsTest){
    tests.push(i)  
  }
  var i = 0
  function nextTest (){
    var name = tests[i++]
    console.log(name)
    easyfsTest[name](assert)
  }
  nextTest()

