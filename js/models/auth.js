
var auth_conn = new Connector('auth')

class Auth {

  //* Login
  //. use it in try catch, if no error its ok
  //r Returns nothing
  static async login(username, password) {
    let login_ans = await auth_conn.get({username, password})
    localStorage.clear()
    for (let key in login_ans) { 
      let val = login_ans[key]
      if (typeof(val) === 'object') { val = JSON.stringify(val) }
      localStorage.setItem(key, val)
    }
  }

  //* Logout
  //. use it in try catch, if no error its ok
  //r Returns nothing
  static async logout() {
    await auth_conn.del()
    localStorage.clear()
  }

}