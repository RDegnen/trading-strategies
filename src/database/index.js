const MongoClient = require('mongodb').MongoClient
const { URL, DB_NAME } = require('./constants')

const client = new MongoClient(URL)
let db = null

function connect() {
  return new Promise((resolve, reject) => {
    client.connect(err => {
      if (err) reject(err)
      db = client.db(DB_NAME)
      resolve()
    })
  })
}

function disconnect() {
  client.close()
}

function insertDocuments(collectionName, docs, cb) {
  const collection = db.collection(collectionName)
  collection.insertMany(docs, (err, result) => {
    if (err) console.log(err)
    cb(result)
  })
}

function findDocuments(collectionName, cb, query = {}) {
  const collection = db.collection(collectionName)
  collection.find(query).toArray((err, docs) => {
    if (err) console.log(err)
    cb(docs)
  })
}

module.exports = {
  connect,
  disconnect,
  insertDocuments,
  findDocuments
}