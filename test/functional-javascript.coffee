fjs = require '../lib/functional-javascript'
expect = require('chai').expect

a_xs = [1, 2, 3]
o_obj = {"a": "foo", "b": "bar", "c": "baz"}

f_id = (x) -> x
f_add1 = (x) -> x + 1
f_mut_add1 = (x) -> ++x

C_Foo = ->

describe 'Error Classes', ->
  describe 'NotImplementedError', ->
    msg = '[f] is not implemented yet'
    notImplementedError = new fjs.NotImplementedError(msg)
    it 'should contain the correct message', ->
      expect(notImplementedError.message).to.equal(msg)
    it 'should be both an instance of Error and of NotImplementedError', ->
      expect(notImplementedError).to.be.an.instanceof(Error).and.to.be.an.instanceof(fjs.NotImplementedError)

  describe 'ArgumentError', ->
    msg = '[x] should be [y]'
    argumentError = new fjs.ArgumentError(msg)
    it 'should contain the correct message', ->
      expect(argumentError.message).to.equal(msg)
    it 'should be both an instance of Error and of ArgumentError', ->
    expect(argumentError).to.be.an.instanceof(Error).and.to.be.an.instanceof(fjs.ArgumentError)

describe 'Library', ->
  describe 'fn', ->
    newFn = fjs.fn('It\'s just', 'a test', f_id)
    it 'should have a well populated doc argument', ->
      expect(newFn.doc).to.equal('It\'s just\na test')
    it 'should return its first argument', ->
      expect(newFn(2)).to.equal(2)

  describe 'loop', ->
    it 'should loop correctly with both index and value on an array', ->
      i = 0
      f = (idx, val) ->
        expect(i+'').to.equal(idx)
        expect(i+1).to.equal(val)
        i++
      fjs.loop f, a_xs
      expect(i).to.equal(3)

    it 'should loop correctly with both index and value on an array also if Array.prototype has been modified', ->
      Array::foo = 0
      xs = [1, 2, 3]
      i = 0
      f = (idx, val) ->
        expect(i+'').to.equal(idx)
        expect(i+1).to.equal(val)
        i++
      fjs.loop f, xs
      expect(i).to.equal(3)

    it 'should loop correctly with both index and value on a js object', ->
      i = 0
      res = ''
      f = (idx, val) ->
        res += val
        switch idx
          when 'a' then i += 1
          when 'b' then i += 2
          when 'c' then i += 3
      fjs.loop f, o_obj
      expect(i).to.equal(6)
      expect(res).to.equal('foobarbaz')

  describe 'is', ->
    it 'should return a function (see further for detailed tests)', ->
      expect(fjs.is('Array')).to.be.a('function')

  describe 'isa', ->
    it 'should return true', ->
      expect(fjs.isa({}, Object)).to.be.true
      expect(fjs.isa(new C_Foo, C_Foo)).to.be.true
      expect(fjs.isa(new C_Foo, Object, C_Foo)).to.be.true
      expect(fjs.isa(new fjs.ArgumentError('Error'), fjs.ArgumentError, Error, Object)).to.be.true

    it 'should return false', ->
      expect(fjs.isa(new C_Foo, Error)).to.be.false
      expect(fjs.isa({}, Function)).to.be.false

  describe 'owns', ->
    it 'should return true', ->
      expect(fjs.owns(a_xs, 0)).to.be.true
      expect(fjs.owns(a_xs, '0')).to.be.true
      expect(fjs.owns(a_xs, '2')).to.be.true
      expect(fjs.owns(o_obj, 'a')).to.be.true
      expect(fjs.owns(o_obj, 'c')).to.be.true

    it 'should return false', ->
      Array::foo = 1
      expect(fjs.owns(a_xs, 'foo')).to.be.false
      expect(fjs.owns(a_xs, '3')).to.be.false
      expect(fjs.owns(o_obj, 'd')).to.be.false
      expect(fjs.owns(o_obj, 'foo')).to.be.false

  describe 'not', ->
    it 'should return true',  ->
      expect(fjs.not(false)).to.equal(true)
      expect(fjs.not('')).to.equal(true)
      expect(fjs.not(0)).to.equal(true)

    it 'should return false', ->
      expect(fjs.not(true)).to.equal(false)
      expect(fjs.not('foo')).to.equal(false)
      expect(fjs.not(1)).to.equal(false)

  describe 'eq2', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.eq2(1, 1)).to.be.true
      expect(fjs.eq2(1, '1')).to.be.true
      expect(fjs.eq2('foo', 'foo')).to.be.true
      expect(fjs.eq2(true, true)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.eq2(1, 2)).to.be.false
      expect(fjs.eq2('foo', 'bar')).to.be.false
      expect(fjs.eq2(true, false)).to.be.false

    it 'should return true several arguments', ->
      expect(fjs.eq2(1, 1, 1)).to.be.true
      expect(fjs.eq2(1, '1', '1', 1)).to.be.true
      expect(fjs.eq2('foo', 'foo', 'foo')).to.be.true
      expect(fjs.eq2(true, 1, '1')).to.be.true
      expect(fjs.eq2(false, 0, '')).to.be.true

    it 'should return false several arguments', ->
      expect(fjs.eq2(1, 1, 2)).to.be.false
      expect(fjs.eq2('foo', 'bar', 'baz')).to.be.false
      expect(fjs.eq2(true, true, true, false)).to.be.false

  describe 'eq3', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.eq3(1, 1)).to.be.true
      expect(fjs.eq3('foo', 'foo')).to.be.true
      expect(fjs.eq3(true, true)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.eq3(1, '1')).to.be.false
      expect(fjs.eq3(1, 2)).to.be.false
      expect(fjs.eq3('foo', 'bar')).to.be.false
      expect(fjs.eq3(true, false)).to.be.false

    it 'should return true several arguments', ->
      expect(fjs.eq3(1, 1, 1)).to.be.true
      expect(fjs.eq3('foo', 'foo', 'foo')).to.be.true

    it 'should return false several arguments', ->
      expect(fjs.eq3(false, 0, '')).to.be.false
      expect(fjs.eq3(true, 1, '1')).to.be.false
      expect(fjs.eq3(1, '1', '1', 1)).to.be.false
      expect(fjs.eq3(1, 1, 2)).to.be.false
      expect(fjs.eq3('foo', 'bar', 'baz')).to.be.false
      expect(fjs.eq3(true, true, true, false)).to.be.false

  describe 'neq2', ->
    it 'should return false with 2 arguments', ->
      expect(fjs.neq2(1, 1)).to.be.false
      expect(fjs.neq2(1, '1')).to.be.false
      expect(fjs.neq2('foo', 'foo')).to.be.false
      expect(fjs.neq2(true, true)).to.be.false

    it 'should return true with 2 arguments', ->
      expect(fjs.neq2(1, 2)).to.be.true
      expect(fjs.neq2('foo', 'bar')).to.be.true
      expect(fjs.neq2(true, false)).to.be.true

    it 'should return false several arguments', ->
      expect(fjs.neq2(1, 1, 1)).to.be.false
      expect(fjs.neq2(1, '1', '1', 1)).to.be.false
      expect(fjs.neq2('foo', 'foo', 'foo')).to.be.false
      expect(fjs.neq2(true, 1, '1')).to.be.false
      expect(fjs.neq2(false, 0, '')).to.be.false

    it 'should return true several arguments', ->
      expect(fjs.neq2(1, 1, 2)).to.be.true
      expect(fjs.neq2('foo', 'bar', 'baz')).to.be.true
      expect(fjs.neq2(true, true, true, false)).to.be.true

  describe 'neq3', ->
    it 'should return false with 2 arguments', ->
      expect(fjs.neq3(1, 1)).to.be.false
      expect(fjs.neq3('foo', 'foo')).to.be.false
      expect(fjs.neq3(true, true)).to.be.false

    it 'should return true with 2 arguments', ->
      expect(fjs.neq3(1, '1')).to.be.true
      expect(fjs.neq3(1, 2)).to.be.true
      expect(fjs.neq3('foo', 'bar')).to.be.true
      expect(fjs.neq3(true, false)).to.be.true

    it 'should return false several arguments', ->
      expect(fjs.neq3(1, 1, 1)).to.be.false
      expect(fjs.neq3('foo', 'foo', 'foo')).to.be.false

    it 'should return true several arguments', ->
      expect(fjs.neq3(false, 0, '')).to.be.true
      expect(fjs.neq3(true, 1, '1')).to.be.true
      expect(fjs.neq3(1, '1', '1', 1)).to.be.true
      expect(fjs.neq3(1, 1, 2)).to.be.true
      expect(fjs.neq3('foo', 'bar', 'baz')).to.be.true
      expect(fjs.neq3(true, true, true, false)).to.be.true

#  describe 'lt', ->
#    it 'should return true with 2 arguments', ->
#      expect(false).to.be.true