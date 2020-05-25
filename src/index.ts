require('dotenv').config()
import marketMaker from "./lib/strategies/market-making"

(async function main() {
  try {
    await marketMaker()
  } catch (err) {
    console.log(err)
  }
})()