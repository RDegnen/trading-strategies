import { remove } from 'ramda'

interface IOrder {
  i: number,
  side: string,
  price: string,
  quantity: number
}

export default class OpenOrderManager {
  openOrders: IOrder[] = []
  orderHistory: IOrder[] = [] // At some point make sure this doesn't get too large

  addOrder(order: IOrder) {
    this.openOrders.push(order)
    this.orderHistory.push(order)
  }

  removeOrder(orderId: number) {
    const orderIndex = this.openOrders.findIndex(order => order.i === orderId)
    if (orderIndex > -1) {
      this.openOrders = remove(orderIndex, 1, this.openOrders)
    }
  }
}