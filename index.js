function go() {
  let mapping

  try {
    let mappingJson = hlib.getById('mapping').value
    mapping = JSON.parse(mappingJson)
  } catch (e) {
    alert(e)
  }

  mapping.forEach(m => {
    let payload = createPayload(m.doi, m.url)
    postAnnotation(payload)
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