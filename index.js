require('dotenv').config()
const cryptoCompare = require('./src/data-sources/crypto-compare')
const { 
  connect, 
  disconnect, 
  insertDocuments, 
  findDocuments 
} = require('./src/database')
const args = require('./src/args')

async function main() {
  const argv = args()
  await connect()

  if (argv['fetch']) {
    const res = await cryptoCompare()
    insertDocuments('raw-data', res.Data.Data, result => {
      console.log(result)
    })
    disconnect()
  } else if (argv['read']) {
    findDocuments('raw-data', docs => {
      console.log(docs)
      disconnect()
    })
  }
}

main()
