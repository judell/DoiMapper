function go() {
  let mapping

  try {
    let mappingJson = hlib.getById('mapping').value
    mapping = JSON.parse(mappingJson)
  } catch (e) {
    alert(e)
  }

  mapping.forEach(m => {
    console.log(`${m.doi}, ${m.url}`)
  })
  
}

