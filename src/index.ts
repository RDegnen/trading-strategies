require('dotenv').config()
import marketMaker from "./lib/strategies/market-making"
import pino from 'pino'

(async function main() {
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info'
  })
  logger.info('Starting Dodona')

  try {
    await marketMaker(logger)
  } catch (err) {
    logger.error(err)
  }
})()