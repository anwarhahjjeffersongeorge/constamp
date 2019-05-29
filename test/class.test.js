'use strict'
import test from 'ava'
import { Constamp } from '..'
// import timestamp from 'time-stamp'

test('nullary constructor', t => {
  let a
  const newTestFunc = () => {
    a = new Constamp()
  }
  t.notThrows(newTestFunc, 'instantiates without throwing')
  // t.not(typeof Constamp, undefined, 'is not undefined')
  t.is(a instanceof Constamp, true, 'makes a an instance of Constamp')
  t.is(a.timeString.length, Constamp.format.length, '.timeString.length corresponds to default class format string')
})

test('unary constructor - format param', t => {
  let a
  let format = 'YYYY MMDD HHmm ss'
  const newTestFunc = () => {
    a = new Constamp({ format })
  }
  t.notThrows(newTestFunc, 'message')
  // t.not(typeof Constamp, undefined, 'is not undefined')
  t.is(a instanceof Constamp, true, 'makes a stamp')
  t.is(typeof a.timeString, 'string', '.timeString is a string')
  t.is(a.timeString.length, format.length, '.timeString.length corresponds to format string')
})

test('unary constructor - json param', t => {
  const c = new Constamp()
  const cc = new Constamp({
    json: c.toJson()
  })
  t.is(c.isCopy, false, 'normal instance .isCopy flag unset')
  t.is(cc.isCopy, true, 'copied instance .isCopy flag set')
})
