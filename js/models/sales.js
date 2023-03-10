
var sales_conn = new Connector('sales')


class Sales {
  static async get() {
    let ans = await sales_conn.get()
    return ans
  }
}