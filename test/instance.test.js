'use strict'
import test from 'ava'
import { Constamp } from '..'
import dayjs from 'dayjs'

test('instance props', t => {
  const props = {
    w: [
      ['user', 'object'],
      ['hostname', 'string'],
      ['arch', 'string'],
      ['platform', 'string'],
      ['totalmem', 'number'],
      ['type', 'string']
    ],
    d: [
      ['pwd', 'string'],
      ['cwd', 'string'],
      ['execPath', 'string']
    ],
    t: [
      ['timeString', 'string'],
      ['hrtime', 'bigint']
    ]
  }
  const a = new Constamp()

  t.not(typeof a, undefined, 'is not undefined')
  t.is(a instanceof Constamp, true, 'makes a stamp')
  for (let oProp of ['w', 'd', 't']) {
    for (let spec of props[oProp]) {
      const [ prop, type ] = spec
      t.is(typeof a[prop], type, `has .${prop} of type ${type}`)
    }
  }
  t.is(a.time instanceof dayjs, true, 'timestamp must be instance of dayjs')
})

test('instance number casting', t => {
  const a = new Constamp()
  t.is(typeof +a, 'number', 'casts to number')
})

test('instance string casting', t => {
  const a = new Constamp()
  const hexmatcher = /^[0-9a-f]+$/
  t.not(a.toString().match(hexmatcher), null, 'some hex string')
  t.not(`${a.toString()}`.match(hexmatcher), null, 'some hex string')
})

test('instance equality', t => {
  const a = new Constamp()
  const b = new Constamp()
  t.not(a === b, true, 'successive instances mustn\'t be equal')
})

test('comparators with non instance ', t => {
  const k = new Constamp()
  const shareFuncs = [ 'sharesDWith', 'sharesTimeWith', 'sharesWWith' ]
  for (let sharef of shareFuncs) {
    t.is(k[sharef](), false, `null call to ${sharef} must return false`)
    t.is(k[sharef]({}), false, `non-instance call to ${sharef} must return false`)
  }
})

test('comparators with copied instance ', t => {
  const k = new Constamp()
  const kk = new Constamp({
    json: k.toJson()
  })
  const shareFuncs = [ 'sharesDWith', 'sharesTimeWith', 'sharesWWith' ]
  for (let sharef of shareFuncs) {
    t.is(k[sharef](kk), true, `${sharef} must return true for copy`)
  }
})
