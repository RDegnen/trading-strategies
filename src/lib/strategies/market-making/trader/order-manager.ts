export interface IOrder {
  i: number,
  side: string,
  price: string,
  quantity: number
  status: string
}

export enum OrderStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export default class OrderManager {
  orders: IOrder[] = [] // At some point make sure this doesn't get too large

  addOrder(order: IOrder) {
    this.orders.push(order)
  }

  closeOrder(orderId: number) {
    this.orders = this.orders.map(order => {
      if (order.i === orderId) return { ...order, status: OrderStatus.CLOSED }
      else return order
    })
  }
}