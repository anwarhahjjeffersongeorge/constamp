'use strict'
import test from 'ava'
import { Constamp } from '..'
// import { Worker, workerData } from 'worker_threads'
import { chdir } from 'process'
import { resolve } from 'path'
// import dayjs from 'dayjs'
//
const testOutDir = '.test_output'
const f = new Constamp()

test('comparators', t => {
  const comparators = {
    D: 'sameDirs',
    W: 'sameWhos',
    T: 'sameTimes'
  }
  for (let comparator of Object.keys(comparators)) {
    t.is(typeof Constamp[comparator], 'function', 'comparator is a class function')
    t.is(Constamp[comparator], Constamp[comparators[comparator]], 'comparator has alias')
  }
})

test('Constamp.sameDirs', async t => {
  const a = new Constamp()
  const b = new Constamp()
  t.is(Constamp.sameDirs(a, b), true, 'same-place instances are same dir')
  chdir(resolve(testOutDir))
  const c = new Constamp()
  t.is(Constamp.sameDirs(a, c), false, 'different-place instances are NOT same dir')
})

test('Constamp.sameWhos', t => {
  const a = new Constamp()
  const b = new Constamp()
  t.is(Constamp.sameWhos(a, b), true, 'same-user instances are same who')
})

test('Constamp.sameTimes', t => {
  const a = new Constamp()
  t.is(Constamp.sameTimes(a, a), true, 'same-time instances are same time')
  // const c = new Constamp()
  t.is(Constamp.sameTimes(a, f), false, 'not-same-time instances are not same time')
})
