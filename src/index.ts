import { coinSelector } from "./lib/strategies/market-making"

(async function main() {
  try {
    await coinSelector()
  } catch (err) {
    console.log(err)
  }
})()