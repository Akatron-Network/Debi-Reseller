
var sales_conn = new Connector('sales')


class Sales {
  static async get() {
    let ans = await sales_conn.get()
    return ans
  }

  static async post(data) {
    let ans = await sales_conn.post(data)
    return ans
  }
}