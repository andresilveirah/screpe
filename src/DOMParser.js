const fs = require('fs/promises')
const { JSDOM } = require('jsdom')

JSDOM.fromFile = async (path) => new JSDOM(await fs.readFile(path, { encoding: 'utf-8' }))

module.exports = JSDOM
