
var prod_conn = new Connector('products')
prod_conn.url = prod_conn.url.replace('reseller', 'service')

class Products {
  static async get() {
    let prod_ans = await prod_conn.get()
    return prod_ans
  }
}