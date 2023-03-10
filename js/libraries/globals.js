var host_url = "http://debiapi.akatron.net:8000/api/functions/"



var template_modules = {
  dashboard: async () => {
    let logs = await Logs.get_all_logs()
    let logs_body = document.getElementById('logs_body')

    let ht = ""

    console.log(logs);

    for (let l of logs) {
      ht += "<tr>" +
            "<td>" + l.register_date.split('T')[0] + " " + l.register_date.split('T')[1].split('.')[0] + "</td>" +
            "<td>" + l.reseller_username + "</td>" +
            "<td>" + l.explanation + "</td>" +
            "<tr>"
    }

    logs_body.innerHTML = ht

  },

  ['pages/satis']: async () => {
    let products = await Products.get()
    let prod_select = document.getElementById('product_select')
    let users_div = document.getElementById('users')

    let ht = '<option value="NONE" disabled selected>Bir ürün seçiniz.</option>'

    console.log(products);

    for (let p of products) {
      ht += "<option value='" + p.product_code + "'>" + p.product_name + " &nbsp;-&nbsp; " + p.product_group + "</option>"
    }

    prod_select.innerHTML = ht

    function getProduct () {
      let product = products.filter(r => (r.product_code === prod_select.value))[0]
      let ht = "";
      
      if (product.product_group === 'SINGLE') {
        let lht = ''
        for (let c in product.content) {
          let property = c.replaceAll('_', ' ')
          let value = product.content[c]
          if (typeof(value) === 'boolean') {
            if (value) value = '<i class="fa-solid fa-check"></i>'
            else value = '<i class="fa-solid fa-xmark"></i>'
          }
          if (typeof(value) === 'number') {
            if (value === -1) value = '<i class="fa-solid fa-infinity"></i>'
            if (value === 0) value = '<i class="fa-solid fa-xmark"></i>'
          }

          lht += '<li>' + property + ' <span class="val">' + value + '</span></li>'
        }

        ht += '<div class="user-card">' +
              '  <div class="title">' +
              '    <h2><i class="fa-regular fa-user"></i> ' + product.product_name + '</h2>' +
              '  </div>' +
              '  <div class="content">' +
              '    <ul>' + lht + '</ul>' +
              '  </div>' +
              '</div>'
      }

      users_div.innerHTML = ht


    }

    prod_select.onchange = getProduct


    let sales = await Sales.get()

    console.log(sales);

  }
}