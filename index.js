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
console.log(JSON.stringify(_payload,null, 2))
return payload
}

function postAnnotation(payload) {
  hlib.postAnnotation(payload)
    .then( data => {
      console.log(data.response)
    })
}