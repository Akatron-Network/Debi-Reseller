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
    let paym_select = document.getElementById('payment_interval')
    let users_div = document.getElementById('users')
    let fee_inp = document.getElementById('total_fee')

    let ht = '<option value="NONE" disabled selected>Bir ürün seçiniz.</option>'

    console.log(products);

    for (let p of products) {
      ht += "<option value='" + p.product_code + "'>" + p.product_name + " &nbsp;-&nbsp; " + p.product_group + "</option>"
    }

    prod_select.innerHTML = ht

    function getProduct () {
      if (prod_select.value === 'NONE') return;
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
              '    <h2 style="text-align: center">' + product.product_name + '</h2>' +
              '  </div>' +
              '  <div class="content">' +
              '    <ul>' + lht + '</ul>' +
              '  </div>' +
              '</div>'
      }

      users_div.innerHTML = ht

      if (paym_select.value === 'MONTH') {
        fee_inp.value = product.price_month
      }
      else if (paym_select.value === 'YEAR') {
        fee_inp.value = (product.price_year * 12)
      }


    }

    prod_select.onchange = getProduct
    paym_select.onchange = getProduct


    let sales = await Sales.get()
    let dom_sales = document.getElementById('sales_list')

    console.log(sales);

    ht = ''

    for (let s of sales) {
      ht += '<tr>' +
            '<td>' + s.register_date.split('T')[0] + " " + s.register_date.split('T')[1].split('.')[0] + '</td>' +
            '<td>' + s.company_name + '</td>' +
            '<td>' + s.province + '</td>' +
            '<td>' + s.sector + '</td>' +
            '<td>' + s.product.product_name + '</td>' +
            '<td>' + s.reseller_username + '</td>' +
            '<td style="padding: 2px; text-align: right; width: 40px">' + 
            ' <button title="Detaylar" class="btn btn-sm btn-primary" style="padding: 3px 10px"><i class="fa-solid fa-ellipsis"></i></button>' + 
            '</td>' +
            '</tr>'  
    }

    dom_sales.innerHTML = ht;

    

  }
}



function getFromID(elm_id) {
  let e = document.getElementById(elm_id)
  let type = e.nodeName

  switch (type) {
    case "INPUT":
      return e.value;
    case "SELECT":
      return e.value;
    default:
      return e.innerText;
  }
}

async function new_sale() {
  let sale = {
    company_name: getFromID('nsale_company_name'),
    city: getFromID('nsale_city'),
    province: getFromID('nsale_province'),
    phone: getFromID('nsale_phone'),
    phone2: getFromID('nsale_phone2'),
    address: getFromID('nsale_address'),
    tax_office: getFromID('nsale_tax_office'),
    tax_no: getFromID('nsale_tax_no'),
    sector: getFromID('nsale_sector'),
    firm_size: getFromID('nsale_firm_size'),
    product_code: getFromID('product_select'),
    payment_interval: getFromID('payment_interval')
  }

  if (sale.product_code === 'NONE') return alert('Ürün seçimi yapmadınız.')

  console.log(sale);
  let ans = await Sales.post(sale)
  console.log(ans);
}