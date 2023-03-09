

//---- Connector Class
//* Backend Connector
//. handles connections for backend server
//. new Connector('auth') or new Connector('auth', 'reseller')

class Connector {
  //* Main constructor
  //r Returns Connector Object
  constructor(func, category = 'reseller') {
    this.url = host_url + category + "/" + func + "/"
  }

  async sendRequest (data, method) {
    let ans;
    await $.ajax({
      url: this.url,
      method: method,
      data: data,
      dataType: "json",
      contentType: 'application/json',
      headers: { "Token": localStorage.Token },

      success: (d, status) => {
        if (d.Success) {
          ans = d.Data
          if (d.Token) ans.Token = d.Token
        }
        else throw new Error(d.Data)
      },

      error: (d, status) => {
        throw new Error(d)
      }
    })
    return ans
  }

  //* Get Request
  //r returns answer as json
  async get (data) { return await this.sendRequest(data, 'GET') }

  //* Delete Request
  //r returns answer as json
  async del (data) { return await this.sendRequest(data, 'DELETE') }
}