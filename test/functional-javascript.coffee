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

  describe 'lt', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.lt(1, 2)).to.be.true
      expect(fjs.lt(10, 20)).to.be.true
      expect(fjs.lt('0', '1')).to.be.true
      expect(fjs.lt(false, true)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.lt(2, 1)).to.be.false
      expect(fjs.lt(20, 10)).to.be.false
      expect(fjs.lt('1', '0')).to.be.false
      expect(fjs.lt(true, false)).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.lt(1, 2, 3)).to.be.true
      expect(fjs.lt(10, 20, 30, 40)).to.be.true
      expect(fjs.lt('0', '1', '2')).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.lt(3, 2, 1)).to.be.false
      expect(fjs.lt(1, 2, 3, 4, 5, 5)).to.be.false
      expect(fjs.lt('2', '1', '0')).to.be.false

  describe 'gt', ->
    it 'should return false with 2 arguments', ->
      expect(fjs.gt(1, 2)).to.be.false
      expect(fjs.gt(10, 20)).to.be.false
      expect(fjs.gt('0', '1')).to.be.false
      expect(fjs.gt(false, true)).to.be.false

    it 'should return true with 2 arguments', ->
      expect(fjs.gt(2, 1)).to.be.true
      expect(fjs.gt(20, 10)).to.be.true
      expect(fjs.gt('1', '0')).to.be.true
      expect(fjs.gt(true, false)).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.gt(1, 2, 3)).to.be.false
      expect(fjs.gt(10, 20, 30, 40)).to.be.false
      expect(fjs.gt('0', '1', '2')).to.be.false
      expect(fjs.gt(5, 4, 3, 2, 1, 1)).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.gt(3, 2, 1)).to.be.true
      expect(fjs.gt('2', '1', '0')).to.be.true

  describe 'lte', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.lte(1, 2)).to.be.true
      expect(fjs.lte(1, 1)).to.be.true
      expect(fjs.lte('0', '1')).to.be.true
      expect(fjs.lte('0', '0')).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.lte(2, 1)).to.be.false
      expect(fjs.lte('1', '0')).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.lte(1, 2, 3)).to.be.true
      expect(fjs.lte(1, 1, 1, 1, 1)).to.be.true
      expect(fjs.lte('1', '1', '2', '3')).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.lte(3, 2, 1)).to.be.false
      expect(fjs.lte('3', '2', '2')).to.be.false

  describe 'gte', ->
    it 'should return false with 2 arguments', ->
      expect(fjs.gte(1, 2)).to.be.false
      expect(fjs.gte('0', '1')).to.be.false

    it 'should return true with 2 arguments', ->
      expect(fjs.gte(1, 1)).to.be.true
      expect(fjs.gte(2, 1)).to.be.true
      expect(fjs.gte('1', '0')).to.be.true
      expect(fjs.gte('0', '0')).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.gte(1, 2, 3)).to.be.false
      expect(fjs.gte('1', '1', '2', '3')).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.gte(1, 1, 1, 1, 1)).to.be.true
      expect(fjs.gte(3, 2, 1)).to.be.true
      expect(fjs.gte('3', '2', '2')).to.be.true

  describe 'and', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.and(true, true)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.and(true, false)).to.be.false
      expect(fjs.and(false, false)).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.and(true, true, true, true)).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.and(true, true, true, false)).to.be.false
      expect(fjs.and(false, false, false, false)).to.be.false

  describe 'or', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.or(true, true)).to.be.true
      expect(fjs.or(false, true)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.or(false, false)).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.or(true, true, true, true)).to.be.true
      expect(fjs.or(false, false, false, true)).to.be.true
      expect(fjs.or(true, true, true, false)).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.or(false, false, false, false)).to.be.false

  describe 'xor', ->
    it 'should return true with 2 arguments', ->
      expect(fjs.xor(true, false)).to.be.true

    it 'should return false with 2 arguments', ->
      expect(fjs.xor(true, true)).to.be.false
      expect(fjs.xor(false, false)).to.be.false

    it 'should return true with several arguments', ->
      expect(fjs.xor(true, false, true, false)).to.be.true
      expect(fjs.xor(false, false, false, true)).to.be.true
      expect(fjs.xor(true, false, false, false)).to.be.true

    it 'should return false with several arguments', ->
      expect(fjs.xor(true, true, true, true, true)).to.be.false
      expect(fjs.xor(false, false, false)).to.be.false

  describe 'bitand', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitand(1, 2)).to.equal(0)
      expect(fjs.bitand(1, 3)).to.equal(1)

    it 'should compute with several arguments', ->
      expect(fjs.bitand(0, 4, 1)).to.equal(0)
      expect(fjs.bitand(1, 3, 1)).to.equal(1)
      expect(fjs.bitand(1, 3, 1, 2)).to.equal(0)

  describe 'bitor', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitor(1, 2)).to.equal(3)
      expect(fjs.bitor(4, 3)).to.equal(7)

    it 'should compute with several arguments', ->
      expect(fjs.bitor(0, 4, 1)).to.equal(5)
      expect(fjs.bitor(1, 3, 1)).to.equal(3)
      expect(fjs.bitor(1, 3, 1, 5)).to.equal(7)

  describe 'bitxor', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitxor(1, 2)).to.equal(3)
      expect(fjs.bitxor(4, 6)).to.equal(2)

    it 'should compute with several arguments', ->
      expect(fjs.bitxor(0, 4, 1)).to.equal(5)
      expect(fjs.bitxor(1, 3, 1)).to.equal(3)
      expect(fjs.bitxor(1, 3, 1, 5)).to.equal(6)

  describe 'bitnot', ->
    it 'should compute', ->
      expect(fjs.bitnot(0)).to.equal(-1)
      expect(fjs.bitnot(1)).to.equal(-2)
      expect(fjs.bitnot(4)).to.equal(-5)

  describe 'bitlshift', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitlshift(1, 2)).to.equal(4)
      expect(fjs.bitlshift(4, 6)).to.equal(256)

    it 'should compute with several arguments', ->
      expect(fjs.bitlshift(0, 4, 1)).to.equal(0)
      expect(fjs.bitlshift(1, 3, 1)).to.equal(16)
      expect(fjs.bitlshift(1, 3, 1, 5)).to.equal(512)

  describe 'bitrshift2', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitrshift2(1, 2)).to.equal(0)
      expect(fjs.bitrshift2(4, 1)).to.equal(2)

    it 'should compute with several arguments', ->
      expect(fjs.bitrshift2(53, 1, 2)).to.equal(6)
      expect(fjs.bitrshift2(1, 3, 1)).to.equal(0)
      expect(fjs.bitrshift2(1, 3, 1, 5)).to.equal(0)

  describe 'bitrshift3', ->
    it 'should compute with 2 arguments', ->
      expect(fjs.bitrshift3(1, 2)).to.equal(0)
      expect(fjs.bitrshift3(4, 1)).to.equal(2)

    it 'should compute with several arguments', ->
      expect(fjs.bitrshift3(53, 1, 2)).to.equal(6)
      expect(fjs.bitrshift3(1, 3, 1)).to.equal(0)
      expect(fjs.bitrshift3(1, 3, 1, 5)).to.equal(0)

  describe 'complement', ->
    f_id_complement = fjs.complement(f_id)
    it 'should return a function', ->
      expect(f_id_complement).to.be.a('Function')

    it 'sould return true', ->
      expect(f_id_complement(false)).to.be.true

    it 'should return false', ->
      expect(f_id_complement(true)).to.be.false

  #describe 'applyWith', ->
