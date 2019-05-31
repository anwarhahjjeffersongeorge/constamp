'use strict'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { createHash } from 'crypto'
import { hostname, userInfo, type, platform, totalmem } from 'os'
dayjs.extend(utc)
dayjs.utc()
// console.log(dayjs.utc().isUTC());
const { arch, cwd, execPath } = process
const { bigint } = process.hrtime
const { PWD } = process.env

const hashAlgorithm = 'Whirlpool'
const hashEncoding = 'hex'

/**
 * A class that produces context stamp instances.
 */
class Constamp {
  #isCopy = false
  #template = Constamp.format
  #t = {
    t: dayjs().utc(),
    b: bigint()
  }
  #toJson = () => {
    const o = {
      t: {
        t: this.#t.t,
        b: this.#t.b.toString()
      }
    }
    const params = [this.#w, this.#d]
    const labels = ['w', 'd']
    for (let i = 0; i < params.length; i++) {
      const p = params[i]
      o[labels[i]] = p
    }
    return JSON.stringify(o)
  }
  #d = {
    cwd: cwd(),
    pwd: PWD,
    execPath
  }
  #w = {
    arch,
    user: userInfo(),
    hostname: hostname(),
    type: type(),
    platform: platform(),
    totalmem: totalmem()
  }
  #h = null
  #hashes = {}

  /**
   * constructor - Create an immutable stamp relating to various data, including the
   *
   * - **D**: execPath, cwd and pwd,
   * - **T**: time and hrtime, and
   * - **W**:  type, user info, arch, hostname, totalmem and platform.
   *
   * @param  {object} o = { format: null } parameters
   * @param  {?string} o.format a dayjs-recognizeable template string
   * @param  {?string} o.json a valid json string to copy from
   */
  constructor (o = { format: null, json: null }) {
    const formatJson = (j) => j.replace(/\s/g, '')
    const hexmatcher = /^[0-9a-f]+$/
    const { format, json } = o
    let hashes = null
    let djs = null
    try {
      if (json) {
        hashes = JSON.parse(json)
        if (['t', 'w', 'd'].every(v => (v in hashes) && (typeof hashes[v] === 'string'))) {
          djs = dayjs(hashes.t).utc()
          if (['w', 'd'].every(v => hexmatcher.test(hashes[v])) && djs.isValid()) {
            this.#isCopy = true
          }
        }
      }
    } catch (e) {
      throw e
    } finally {
      this.#template = (typeof format === 'string') ? format : this.#template
      this.#t.t = (this.#isCopy && djs) ? djs : this.#t.t
      const str = formatJson(this.#toJson())
      const hash = createHash(hashAlgorithm)
      hash.update(str)
      this.#h = hash.digest(hashEncoding)

      const ps = [ 'd', 'w' ]
      const vs = [ this.#d, this.#w ]
      ps.map((p, i) => {
        if (this.#isCopy) {
          this.#hashes[p] = hashes[p]
        } else {
          const h = createHash(hashAlgorithm)
          h.update(formatJson(JSON.stringify(vs[i])))
          this.#hashes[p] = h.digest(hashEncoding)
        }
      })
      Object.freeze(this.#hashes)
      Object.freeze(this.#t)
      Object.freeze(this.#d)
      Object.freeze(this.#w)
      Object.freeze(this)
    }
  }

  /**
   * get isCopy - was this instance copied from json?
   *
   * @return {boolean} true IFF it was made from a valid json string
   */
  get isCopy () {
    return this.#isCopy
  }
  /**
   * get time - the timestamp UTC epoch time as dayjs
   *
   * @return {dayjs} approximate time of instantiation
   * @see {@link https://github.com/iamkun/dayjs/blob/dev/docs/en/API-reference.md#format-formatstringwithtokens-string}
   */
  get time () {
    return this.#t.t
  }
  /**
   * get timeString - the formatted timestamp UTC epoch time
   *
   * @return {string} the formated approximate time of instantiation
   * @see {@link constructor}
   * @see {@link get time}
   * @see {@link https://github.com/iamkun/dayjs}
   */
  get timeString () {
    return this.#t.t.format(this.#template)
  }
  /**
   * get hrtime - the timestamp high-resolution real time
   *
   * @return {bigint} approximate real time of instantiation
   * @see {@link https://nodejs.org/api/process.html#process_process_hrtime_bigint}
   */
  get hrtime () {
    return this.#t.b
  }
  /**
   * get user - the logged-in user's name
   *
   * @return {string} user's name
   * @see {@link https://nodejs.org/api/process.html#process_process_env}
   */
  get user () {
    return this.#w.user
  }
  /**
   * get arch - operating system cpu architecture
   *
   * @return {string} architecture for which node.js binary was compiled
   * @see {@link https://nodejs.org/api/process.html#process_process_arch}
   */
  get arch () {
    return this.#w.arch
  }
  /**
   * get type - operating system type
   *
   * @return {string} operating system as returned by `uname(3)`
   * @see {@link https://nodejs.org/api/os.html#os_os_type}
   */
  get type () {
    return this.#w.type
  }
  /**
   * get hostname - system's host name
   *
   * @return {string} host name
   * @see {@link https://nodejs.org/api/os.html#os_os_hostname}
   */
  get hostname () {
    return this.#w.hostname
  }
  /**
   * get platform - operating system platform as set during node.js compile time
   *
   * @return {string} platform
   * @see {@link https://nodejs.org/api/os.html#os_os_platform}
   */
  get platform () {
    return this.#w.platform
  }
  /**
   * get totalmem - total system memory
   *
   * @return {number} integer number of bytes
   * @see {@link https://nodejs.org/api/os.html#os_os_totalmem}
   */
  get totalmem () {
    return this.#w.totalmem
  }
  /**
   * get cwd - current working directory of the Node.js process
   *
   * @return {string}  current working directory
   * @see {@link https://nodejs.org/api/process.html#process_process_cwd}
   */
  get cwd () {
    return this.#d.cwd
  }
  /**
   * get pwd - current working directory of the shell
   *
   * @return {string}  current working directory
   * @see {@link https://nodejs.org/api/process.html#process_process_env}
   */
  get pwd () {
    return this.#d.pwd
  }
  /**
   * get execPath - absolute pathname of the executable that started the Node.js process
   *
   * @return {string}  absolute pathname
   * @see {@link https://nodejs.org/api/process.html#process_process_execpath}
   */
  get execPath () {
    return this.#d.execPath
  }
  [Symbol.toPrimitive] (hint) {
    switch (hint) {
      case 'number':
        return this.valueOf()
      default:
        return this.toString()
    }
  }
  /**
   * toJson - serialize as a JSON string containg the fields:
   *
   * - **d**: hash,
   * - **t**: utc, and
   * - **w**: hash.
   *
   * @return {string} JSON
   */
  toJson () {
    return JSON.stringify({
      t: this.time,
      ...this.#hashes
    })
  }
  /**
   * toString - a hash string representation of instance
   *
   * @return {string}  hash hex
   */
  toString () {
    return this.#h
  }
  /**
   * sharesDWith - determine whether this instance has the same directories as another Constamp instance
   *
   * @param  {Constamp} b the other instance to compare with
   * @return {boolean} true IFF d hashes equal
   */
  sharesDWith (b) {
    if (!(b instanceof Constamp)) {
      return false
    }
    return this.#hashes.d === b.#hashes.d
  }
  /**
   * sharesTimeWith - determine whether this instance has the same epoch time as another Constamp instance
   *
   * @param  {Constamp} b the other instance to compare with
   * @return {boolean} true IFF timestamps equal
   */
  sharesTimeWith (b) {
    if (!(b instanceof Constamp)) {
      return false
    }
    return this.time.isSame(b.time)
  }
  /**
   * sharesWWith - determine whether this instance has the same who as another Constamp instance
   *
   * @param  {Constamp} b the other instance to compare with
   * @return {boolean} true IFF w hashes equal
   */
  sharesWWith (b) {
    if (!(b instanceof Constamp)) {
      return false
    }
    return this.#hashes.w === b.#hashes.w
  }
  /**
   * valueOf - the timestamp UTC epoch time as number
   *
   * @return {number}  UTC epoch ms
   * @see {@link https://github.com/iamkun/dayjs/blob/HEAD/docs/en/API-reference.md#unix-timestamp-milliseconds-valueof}
   */
  valueOf () {
    return this.#t.t.valueOf()
  }
}

Object.defineProperties(Constamp, {
  /**
   * the default timestamp format
   * @default 'YYYY-MM-DD HH:mm ss.SSS'
   * @memberof Constamp
   * @name format
   * @static
   */
  format: {
    value: 'YYYY-MM-DD HH:mm ss.SSS',
    enumerable: true,
    configurable: false,
    writable: false
  },
  /**
   * determine whether given arguments share dir locations
   * @memberof Constamp
   * @method
   * @name D
   * @param {Constamp} a The first Constamp to compare
   * @param {Constamp} b The other Constamp to compare
   * @static
   */
  D: {
    value: (a, b) => {
      return (a instanceof Constamp) && a.sharesDWith(b)
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  /**
   * determine whether given arguments share epoch timestamps
   * @memberof Constamp
   * @method
   * @name T
   * @param {Constamp} a The first Constamp to compare
   * @param {Constamp} b The other Constamp to compare
   * @static
   */
  T: {
    value: (a, b) => {
      return (a instanceof Constamp) && a.sharesTimeWith(b)
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  /**
   * determine whether given arguments share user/platform
   * @memberof Constamp
   * @method
   * @name W
   * @param {Constamp} a The first Constamp to compare
   * @param {Constamp} b The other Constamp to compare
   * @static
   */
  W: {
    value: (a, b) => {
      return (a instanceof Constamp) && a.sharesWWith(b)
    },
    enumerable: true,
    configurable: false,
    writable: false
  },
  /**
   * @memberof Constamp
   * @method
   * @name sameDirs
   * @see Constamp.D
   * @static
   */
  sameDirs: {
    get () {
      return Constamp.D
    },
    enumerable: true,
    configurable: false
  },
  /**
   * @memberof Constamp
   * @method
   * @name sameTimes
   * @see Constamp.T
   * @static
   */
  sameTimes: {
    get () {
      return Constamp.T
    },
    enumerable: true,
    configurable: false
  },
  /**
   * @memberof Constamp
   * @method
   * @name sameWhos
   * @see Constamp.W
   * @static
   */
  sameWhos: {
    get () {
      return Constamp.W
    },
    enumerable: true,
    configurable: false
  }
})

export {
  Constamp
}
