#!/usr/bin/env node
'use strict'
const { Constamp } = require('.')
const c = new Constamp()

const { format } = require('path')
const sade = require('sade')
const { log, error } = console
const { writeFile, readFile, open } = require('fs')
const defaults = {
  encoding: 'utf8',
  hexfileext: 'constamp',
  get hexfilename () {
    return format({
      dir: c.cwd,
      base: `${c.timeString}.${defaults.hexfileext}`
    })
  },
  get hexdump () {
    return '' + c
  }
}
const logh = () => {
  const hash = '' + c
  log('toString:')
  log(hash)
}
const prog = sade('constamp')
const show = (st) => {
  const ps = [
    'hostname',
    'arch',
    'pwd',
    'cwd',
    'execPath',
    'timeString',
    'hrtime',
    'platform',
    'totalmem'
  ]
  const strs = []
  let longest = 0
  for (let p of ps) {
    const v = st[p]
    const str = `${p}:  ${v}`
    strs.push(str)
    longest = (longest > str.length) ? longest : str.length
  }
  const { user } = st
  for (let p in user) {
    if (user.hasOwnProperty(p)) {
      const v = user[p]
      const str = `user ${p}:  ${v}`
      strs.push(str)
      longest = (longest > str.length) ? longest : str.length
    }
  }
  const cha = 'µ'
  const prf = '  '
  const len = longest + cha.length * 2 + prf.length * 4
  const l = (cc = cha, ll = len) => new Array(ll).fill(cc).join('')
  const p = (str) => {
    let oo = l(' ', len - str.length - prf.length - 2)
    return `${cha}${prf}${str}${oo}${cha}`
  }
  log(l())
  log(p('  '))
  strs.map((str, i) => {
    log(p(str))
  })
  log(p('  '))
  log(l())
  log()
  logh()
  log()
  log('toJson:')
  log(st.toJson())
  log()
}

prog
  .version('1.0.0')

prog
  .command('show')
  .describe('Display local context stamp (raw) info.')
  .action(() => show(c))

prog
  .command('save [file]')
  .option('-f, --force', 'Overwrite file.')
  .describe('Save the local context stamp (hash) to a file.')
  .example('save myNewConstamp.txt')
  .action((file = defaults.hexfilename, { f }) => {
    log(`Saving to file ${file}`)
    open(file, 'wx', (err, fd) => {
      if (err) {
        if (err.code === 'EEXIST' && !f) {
          error(`${file} already exists`)
          return
        }
        throw err
      }
      writeFile(fd, c.toJson(), {
        encoding: defaults.encoding
      }, (errr) => {
        if (errr) {
          throw errr
        }
        logh()
        log(`was saved to ${file}`)
      })
    })
  })

prog
  .command('load <file>')
  .describe('Load a saved context stamp file for comparison')
  .example('load myOldConstamp.txt')
  .action((file) => {
    let cc
    log(`Loading ${file}`)
    open(file, 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          error(`${file} does not  exist`)
          return
        }
        throw err
      }
      readFile(fd, {
        encoding: defaults.encoding
      }, (errr, data) => {
        if (errr) {
          throw errr
        }
        try {
          cc = new Constamp({
            json: data
          })
        } catch (err) {
          throw err
        } finally {
          if (cc.isCopy) {
            log('current:')
            show(c)
            log('loaded:')
            show(cc)
            log('sameness:')
            log(`time ${c.sharesTimeWith(cc)}`)
            log(`dirs ${c.sharesDWith(cc)}`)
            log(`who ${c.sharesWWith(cc)}`)
          }
        }
      })
    })
  })
prog.parse(process.argv)
