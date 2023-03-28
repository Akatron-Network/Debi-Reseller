

async function render_users(filter) {
  
  let query
  $('.btn-filter').removeClass('selected')

  if (filter === 'ExpNear') {
    query = { orderBy: { membership_expiration: "asc" }}
    $('#filter-ExpNear').addClass('selected')
  }
  else if (filter === 'ExpFinished') {
    query = { where: { membership_expiration: { lt: new Date() }}}
    $('#filter-ExpFinished').addClass('selected')
  }
  else {
    query = { orderBy: { username: "asc" }}
    $('#filter-all').addClass('selected')
  }

  let user_conn = new Connector('app_user')
  let users = await user_conn.get({query})

  let ht = '';
  let ht_table = '';
  let r = 1;

  console.log(users);

  for (let u of users) {
    let bwusage = (u.bandwidth_usage / u.bandwidth_limit) * 100

    ht += '<div class="user-card">' +
      '  <div class="row title active">' +
      '    <div class="col-10" style="padding: 0;"><i class="fa-solid fa-user"></i>&nbsp; ' + u.username + '</div>' +
      '    <div class="col-2" style="margin: 0; padding: 0; text-align: right;">' +
      '      <button onclick="show_user_details(\'' + u.username + '\')" type="button" class="btn btn-link btn-user-details"><i class="fa-solid fa-gears"></i></button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="content">' +
      '    <table class="table">' +
      '      <tr>' +
      '        <th>Ürün</th>' +
      '        <td>' + u.product_code + '</td>' +
      '      </tr>' +
      '      <tr>' +
      '        <th>Kullanım (Ay)</th>' +
      '        <td> %' + bwusage + ' &nbsp;-&nbsp; ' + u.bandwidth_usage + '/' + u.bandwidth_limit + '</td>' +
      '      </tr>' +
      '      <tr>' +
      '        <th>Kayıt Tarihi</th>' +
      '        <td>' + u.register_date.replace('T00:00:00.000Z','') + '</td>' +
      '      </tr>' +
      '      <tr>' +
      '        <th>Vade Tarihi</th>' +
      '        <td>' + u.membership_expiration.replace('T00:00:00.000Z','') + '</td>' +
      '      </tr>' +
      '      <tr>' +
      '        <th>Firma</th>' +
      '        <td>' + u.details.company_name + '</td>' +
      '      </tr>' +
      '    </table>' +
      '  </div>' +
      '</div>'

    ht_table += '<tr>' +
      '<td>' + r + '</td>' +
      '<td>' + u.username + '</td>' +
      '<td>' + u.product_code + '</td>' +
      '<td>%' + bwusage + ' &nbsp;-&nbsp; ' + u.bandwidth_usage + '/' + u.bandwidth_limit + '</td>' +
      '<td>' + u.register_date.replace('T00:00:00.000Z','') + '</td>' +
      '<td>' + u.membership_expiration.replace('T00:00:00.000Z','') + '</td>' +
      '<td>' + u.details.company_name + '</td>' +
      '<td style="padding: 4px; width: 40px;"><button onclick="show_user_details(\'' + u.username + '\')" type="button" class="btn btn-sm btn-link btn-user-details"><i class="fa-solid fa-gear"></i></button></td>' +
      '</tr>'

    r++
  }

  document.getElementById('user-list').innerHTML = ht;
  document.getElementById('user-list-table-body').innerHTML = ht_table;
}

function switch_list_view() {
  let list = document.getElementById('user-list')
  let tabl = document.getElementById('user-list-table')
  
  let btn = document.getElementById('view-switch-btn')

  if (list.style.display === 'none') {
    list.style.display = '';
    tabl.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-list"></i>'
  }
  else {
    list.style.display = 'none';
    tabl.style.display = '';
    btn.innerHTML = '<i class="fa-solid fa-grip"></i>'
  }

  btn.blur();
}

async function show_user_details(username) {

  $('#details-modal').modal('show');

  let user_conn = new Connector('app_user')
  let user = (await user_conn.get({query: {where: {username}}}))[0]

  let bwusage = '%' + ((user.bandwidth_usage / user.bandwidth_limit) * 100)
  if (user.bandwidth_limit === -1) bwusage = ''
  
  setByID('udet.username', user.username)
  setByID('udet.register_date', user.register_date.split('T')[0])
  setByID('udet.register_ip', user.register_ip)
  setByID('udet.membership_expiration', user.membership_expiration.split('T')[0])
  setByID('udet.product_code', user.product_code)
  setByID('udet.bandwidth_usage', bwusage + ' &nbsp;-&nbsp; ' + user.bandwidth_usage + '/' + (user.bandwidth_limit === -1 ? '<i class="fa-solid fa-infinity"></i>' : user.bandwidth_limit))
  setByID('udet.page_limit', (user.page_limit === -1 ? '<i class="fa-solid fa-infinity"></i>' : user.page_limit))
  setByID('udet.directory_limit', (user.directory_limit === -1 ? '<i class="fa-solid fa-infinity"></i>' : user.directory_limit))
  setByID('udet.collection_limit', (user.collection_limit === -1 ? '<i class="fa-solid fa-infinity"></i>' : user.collection_limit))
  
  setByID('udet.name', user.details.name)
  setByID('udet.surname', user.details.surname)
  setByID('udet.company_name', user.details.company_name)
  setByID('udet.department', user.details.department)
  setByID('udet.country', user.details.country)
  setByID('udet.city', user.details.city)
  setByID('udet.province', user.details.province)
  setByID('udet.address', user.details.address)
  setByID('udet.mail', user.details.mail)
  setByID('udet.phone', user.details.phone)
  setByID('udet.phone2', user.details.phone2)

  document.getElementById('udet.btn.renewal').onclick = () => (show_renewal_modal(user.details.company_name))
  document.getElementById('udet.btn.changepass').onclick = () => (show_pass_modal(user.username))
}


function show_renewal_modal(company_name) {
  renewal_modal_settings()

  setByID('renewal.company_name', company_name)

  $('#renewal-modal').modal('show');
}

function renewal_modal_settings() {
  const renewal_modal = document.getElementById('renewal-modal')
  renewal_modal.addEventListener('show.bs.modal', e => {
    $('#details-modal-dialog').css('filter', 'brightness(0.4)');
  })
  renewal_modal.addEventListener('hide.bs.modal', e => {
    $('#details-modal-dialog').css('filter', '');
  })
}

async function save_renewal() {
  let user_conn = new Connector('app_user')
  await user_conn.put({
    operation: 'Renewal',
    data: {
      company_name: getFromID('renewal.company_name'),
      payment_interval: getFromID('renewal.payment_interval')
    }
  })
  
  show_succ_modal()
}


function show_pass_modal(username) {
  pass_modal_settings()
  setByID('pass.username', username)
  $('#pass-modal').modal('show');
}

function pass_modal_settings() {
  const pass_modal = document.getElementById('pass-modal')
  pass_modal.addEventListener('show.bs.modal', e => {
    $('#details-modal-dialog').css('filter', 'brightness(0.4)');
  })
  pass_modal.addEventListener('hide.bs.modal', e => {
    $('#details-modal-dialog').css('filter', '');
  })
}

async function save_pass() {
  if (getFromID('pass.password') !== getFromID('pass.password-2')) alert('Şifreler uyuşmuyor!');

  let user_conn = new Connector('app_user')
  await user_conn.put({
    operation: 'ChangePassword',
    data: {
      username: getFromID('pass.username'),
      password: getFromID('pass.password')
    }
  })
  
  show_succ_modal()
}


function show_succ_modal() {
  $('.modal-dialog').css('filter', 'brightness(0.5)');
  $('#success-modal>.modal-dialog').css('filter', '');
  
  const succ_modal = document.getElementById('success-modal')
  succ_modal.addEventListener('hide.bs.modal', e => {
    location.reload()
  })
  $('#success-modal').modal('show');
}


async function render_products() {
  let prod_sel = document.getElementById('newuser.product_code')
  let prod_show = document.getElementById('newuser.product')
  let paym_sel = document.getElementById('newuser.payment_interval')

  var prod_conn = new Connector('products')
  prod_conn.url = prod_conn.url.replace('reseller', 'service')

  let prods = await prod_conn.get()
  let prods_json = {}
  let opts = '<option selected disabled>Ürün seçiniz</option>'

  for (let p of prods) {
    opts += '<option value="' + p.product_code + '">' + p.product_group + ' - ' + p.product_name + '</option>'
    prods_json[p.product_code] = p
  }

  console.log(prods_json);

  prod_sel.innerHTML = opts;

  function sel_prod() {
    let pcode = prod_sel.value;
    let p = prods_json[pcode]

    let paym_int = getFromID('newuser.payment_interval')
    if (paym_int === 'YEAR') {
      setByID('newuser.total_fee', p.price_year * 12)
    }
    else if (paym_int === 'MONTH') {
      setByID('newuser.total_fee', p.price_month)
    }   


    let content = p.content
    //* Single product
    if (content.constructor === ({}).constructor) {
      let pht = '<div class="user-card" style="margin-left: 0; width: 250px;">' +
      '    <div class="row title active" style="margin-bottom: 0;">' +
      '      <div class="col-10" style="padding: 0;"><i class="fa-solid fa-user"></i>&nbsp; ' + p.product_name + '</div>' +
      '    </div>' +
      '    <div class="content">' +
      '      <table class="table">' +
      '        <tr><td colspan="2" style="text-align: center; padding: 5px 0;">' + p.description + '</td></tr>' +
      '        <tr>' +
      '          <th>Ürün Kodu</th><td>' + p.product_code + '</td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Kullanım (Ay)</th><td>' + (content.bandwidth_limit !== -1 ? content.bandwidth_limit + ' KB' : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Sayfa Limiti</th><td>' + (content.page_limit !== -1 ? content.page_limit : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Klasör Limiti</th><td>' + (content.directory_limit !== -1 ? content.directory_limit : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Koleksiyon Limiti</th><td>' + (content.collection_limit !== -1 ? content.collection_limit : '<i class="fa-solid fa-infinity"></i>') +'</td>' +
      '        </tr>' +
      '        <tr>' +
      '          <th>Global Kullanıcı</th><td>' + (content.global_user ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>') + '</td>' +
      '        </tr>' +
      '      </table>' +
      '    </div>' +
      '  </div>'

      prod_show.innerHTML = pht;
    }

    //* Pack product
    if (content.constructor === [].constructor) {
      let pht = '';
      for (let cont of content) {
        pht += '<div class="user-card" style="margin-left: 0; width: 250px;">' +
        '    <div class="row title active" style="margin-bottom: 0;">' +
        '      <div class="col-10" style="padding: 0;"><i class="fa-solid fa-user"></i>&nbsp; ' + p.product_name + '</div>' +
        '    </div>' +
        '    <div class="content">' +
        '      <table class="table">' +
        '        <tr><td colspan="2" style="text-align: center; padding: 5px 0;">' + p.description + '</td></tr>' +
        '        <tr>' +
        '          <th>Ürün Kodu</th><td>' + p.product_code + '</td>' +
        '        </tr>' +
        '        <tr>' +
        '          <th>Kullanım (Ay)</th><td>' + (cont.bandwidth_limit !== -1 ? cont.bandwidth_limit + ' KB' : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
        '        </tr>' +
        '        <tr>' +
        '          <th>Sayfa Limiti</th><td>' + (cont.page_limit !== -1 ? cont.page_limit : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
        '        </tr>' +
        '        <tr>' +
        '          <th>Klasör Limiti</th><td>' + (cont.directory_limit !== -1 ? cont.directory_limit : '<i class="fa-solid fa-infinity"></i>') + '</td>' +
        '        </tr>' +
        '        <tr>' +
        '          <th>Koleksiyon Limiti</th><td>' + (cont.collection_limit !== -1 ? cont.collection_limit : '<i class="fa-solid fa-infinity"></i>') +'</td>' +
        '        </tr>' +
        '        <tr>' +
        '          <th>Global Kullanıcı</th><td>' + (cont.global_user ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>') + '</td>' +
        '        </tr>' +
        '      </table>' +
        '    </div>' +
        '  </div>'
      }
      prod_show.innerHTML = pht;
    }
  }

  prod_sel.onchange = sel_prod
  paym_sel.onchange = sel_prod

}

async function new_user() {
  let nuser = {
    product_code:     getFromID('newuser.product_code'),
    payment_interval: getFromID('newuser.payment_interval'),
    company_name:     getFromID('newuser.company_name'),
    details: {
      name:       getFromID('newuser.details.name'),
      surname:    getFromID('newuser.details.surname'),
      email:      getFromID('newuser.details.email'),
      title:      getFromID('newuser.details.title'),
      department: getFromID('newuser.details.department'),
      phone:      getFromID('newuser.details.phone'),
      phone2:     getFromID('newuser.details.phone2'),
      address:    getFromID('newuser.details.address'),
      city:       getFromID('newuser.details.city'),
      province:   getFromID('newuser.details.province'),
      country:    'TR'
    }
  }

  if (nuser.product_code === 'NONE') return alert('Ürün seçmediniz.')
  if (nuser.company_name.length === 0) return alert('Firma ismi girmediniz.')
  if (!nuser.details.email.includes('@')) return alert('E-Mail alanını doldurunuz.')

  let user_conn = new Connector('app_user')
  let ans = await user_conn.post(nuser)

  if (ans.length > 0) {
    show_succ_modal()
  }
}
