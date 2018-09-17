function go() {

  if (! getRadioVal('format')) {
    alert('Please choose json or url and provide corresponding input')
    return
  }

  let format = getRadioVal('format')

  if (format === 'url') {

    try {
      let mappingUrl = hlib.getById('mapping').value.trim()
      fetch(mappingUrl)
        .then(r => { return r.json() } )
        .then(map => {
          processMap(map)
        })
    } catch (e) {
      alert(e)
    }

  } else {
    try {
      let mappingJson = hlib.getById('mapping').value
      let map = JSON.parse(mappingJson)
      processMap(map)
    } catch(e) {
      alert(e)
    }
  }

}

function processMap(map) {
  let i = 0
  let timeout = 200
  map.forEach(m => {
    i++
    let payload = createPayload(m.doi, m.url)
    setTimeout( _ => {
      postAnnotation(payload)
    }, timeout)
    timeout += 500
    console.log(i)
  })
}

function createPayload(doi, url) {
  let params = {
  username: hlib.getUser(),
  uri: url,
  group: hlib.getGroup(),
  tags: ['DoiMapper']
}
let payload = hlib.createAnnotationPayload(params)
let _payload = JSON.parse(payload)
_payload.document['highwire'] = {"doi": [ doi ] }
payload = JSON.stringify(_payload)
return payload
}

function postAnnotation(payload) {
  hlib.postAnnotation(payload)
    .then( data => {
      let _response = JSON.parse(data.response)
      console.log(`created ${_response.id}`)
      hlib.deleteAnnotation(_response.id)
        .then( data => {
          let _response = JSON.parse(data.response)
          console.log(`deleted ${_response.id}`)
        })
    })
}

function getRadioVal(name) {
  let val
  var radios = document.getElementsByName(name)
  for (var i=0, len=radios.length; i<len; i++) {
    if ( radios[i].checked ) {
      val = radios[i].value
      break
    }
  }
  return val
}
