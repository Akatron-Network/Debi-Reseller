

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
    $('#filter-all').addClass('selected')
  }

  let user_conn = new Connector('app_user')
  let users = await user_conn.get({query})

  let ht = '';

  console.log(users);

  for (let u of users) {
    let bwusage = (u.bandwidth_usage / u.bandwidth_limit) * 100

    ht += '<div class="user-card">' +
    '  <div class="row title active">' +
    '    <div class="col-10" style="padding: 0;">' + u.username + '</div>' +
    '    <div class="col-2" style="margin: 0; padding: 0; text-align: right;">' +
    '      <button onclick="show_user_details(\'' + u.username + '\')" type="button" class="btn btn-link"><i class="fa-solid fa-gears"></i></button>' +
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
  }

  document.getElementById('user-list').innerHTML = ht;
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