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

  }
}