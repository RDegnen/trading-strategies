import Plotly from 'plotly.js-dist'
import data from '../../data/ema-data.json'
import macdData from '../../data/macd.json'
import tiData from '../../data/ti-ema-data.json'
import tiMacd from '../../data/ti-macd.json'

import './style.css'

function emaChart() {
  const element = document.createElement('div')
  const plotlyData = Object.keys(data).map(key => ({
    x: data[key].map(({ x }) => x),
    y: data[key].map(({ y }) => y),
    type: 'scatter',
    name: key
  }))
  const layout = {
    width: 2000,
    height: 800
  }

  Plotly.newPlot(element, plotlyData, layout)

  return element
}

function tiChart() {
  const element = document.createElement('div')
  const plotlyData = Object.keys(tiData).map(key => ({
    x: data[key].map(({ x }) => x),
    y: data[key].map(({ y }) => y),
    type: 'scatter',
    name: key
  }))
  const layout = {
    width: 2000,
    height: 800
  }

  Plotly.newPlot(element, plotlyData, layout)

  return element
}

function macdChart() {
  const element = document.createElement('div')
  const plotlyData = Object.keys(macdData).map(key => ({
    x: macdData[key].map(({ x }) => x),
    y: macdData[key].map(({ y }) => y),
    type: 'scatter',
    name: key
  }))
  const layout = {
    width: 2000,
    height: 800
  }

  Plotly.newPlot(element, plotlyData, layout)

  return element
}

function tiMacdChart() {
  const element = document.createElement('div')
  const plotlyData = [{
    x: tiMacd.map(({ x }) => x),
    y: tiMacd.map(({ y }) => y),
    type: 'scatter',
    name: 'macd'
  }]
  const layout = {
    width: 2000,
    height: 800
  }

  Plotly.newPlot(element, plotlyData, layout)

  return element
}

document.body.appendChild(emaChart())
document.body.appendChild(tiChart())
document.body.appendChild(macdChart())
document.body.appendChild(tiMacdChart())
