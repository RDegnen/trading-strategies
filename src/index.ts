require('dotenv').config()
import pino from 'pino'

(async function main() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info'
  })
  logger.info('Starting Dodona')

  try {
    
  } catch (err) {
    logger.error(err)
  }
})()