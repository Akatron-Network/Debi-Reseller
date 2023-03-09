
var logs_conn = new Connector('logs')

class Logs{
  static async get_all_logs() {
    let log_ans = await logs_conn.get()
    return log_ans
  }
}