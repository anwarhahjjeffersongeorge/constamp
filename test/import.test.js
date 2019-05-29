'use strict'
import test from 'ava'
import { Constamp } from '..'

test('import', t => {
  t.not(typeof Constamp, undefined, 'is not undefined')
  t.is(typeof Constamp, 'function', 'is a function type')
})
