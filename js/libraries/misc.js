async function templateLoader(template_name, html_element, location = 'afterbegin') {
  
  if (!html_element) html_element = document.getElementsByTagName('body')[0]
  
  await $.ajax({
    type: 'GET',
    async: false,
    url: '/' + template_name + '.html',
    success: function (file_html) {
      html_element.insertAdjacentHTML(location, reCompileTemplate(file_html))
      if (template_modules[template_name]) template_modules[template_name]()
    }
  });
}


function reCompileTemplate(temp_str) {
  
  let repkey = '<#>'

  let repcount = countInstances(temp_str, repkey)
  if (repcount%2 !== 0) throw new Error('replace tag count is not correct')


  // while (temp_str.indexOf(repkey) > 0) {
  for (let i = 0; i < repcount; i++) {
    let stindex = temp_str.indexOf(repkey)
    let enindex = temp_str.indexOf('.', stindex)

    let container = temp_str.substring(stindex, enindex).replace(repkey, '')
    let key = temp_str.substring(enindex+1, temp_str.indexOf(repkey, enindex))
    let outerKey = repkey + container + "." + key + repkey

    if (container.includes('<script')) continue;

    console.log(container + " - " + key);

    let repval = "--HATA--"
    if (container === 'Local') {
      try { repval = getValFromJson(getLocals(), key) }
      catch (e) {  
        console.error(e);
        repval = container + "." + key
      }
    }

    if (key.includes('date')) { repval = repval.split('T')[0] + " &nbsp; " + repval.split('T')[1].split('.')[0]}
    
    temp_str = temp_str.replace(outerKey, repval)
  }

  return temp_str
}

function getValFromJson(obj, path) {
  if (path.includes('.')) {
    let k = path.substring(0, path.indexOf('.'))
    if (typeof(obj[k]) !== 'object') { throw new Error('not object')}
    else return getValFromJson(obj[k], path.replace(k + ".", ''))
  }
  else {
    if (obj[path]) return obj[path]
    else return '-'
  }
}

function countInstances(string, word) {
  return string.split(word).length - 1;
}


function getLocals() {
  let nlocal = {}
  for (let k in localStorage) {
    if (typeof(localStorage[k]) === 'string' && localStorage[k].startsWith('{"')) {
      nlocal[k] = JSON.parse(localStorage[k])
    }
    else if (typeof(localStorage[k]) !== 'function') {
      nlocal[k] = localStorage[k]
    }
  }

  return nlocal
}
