var host_url = "http://127.0.0.1:8000/api/functions/"
// var host_url = "http://debiapi.akatron.net:8000/api/functions/"



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

  ['pages/app_users']: async () => {
    render_users();
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

function setByID(elm_id, value) {
  let e = document.getElementById(elm_id)
  if (e === null) return
  let type = e.nodeName

  if (!value || value === null) value = ""
  
  switch (type) {
    case "INPUT":
      e.value = value;
      break;
    case "SELECT":
      e.value = value;
      break;
    default:
      e.innerHTML = value;
      break;
  }
}

