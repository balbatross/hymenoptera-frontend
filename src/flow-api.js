let BASE = 'http://localhost:8000'

export function getModules(){
  return fetch(`${BASE}/api/modules`).then((r) => r.json())
}

export function getFlows(){
  
}

export function addFlow(){

}

export function saveFlow(flow){
  return fetch(`${BASE}/api/flows/${flow.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      flow: flow
    })
  }).then((r) => {
    return r.json()
  })
}

export function startFlow(flow){
  return fetch(`${BASE}/api/flows/${flow.id}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((r) => {
    return r.json()
  })
}

export function stopFlow(id){
  return fetch(`${BASE}/api/flows/${id}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r) => {
    return r.json()
  })
}

export function getConnections(){
  return fetch(`${BASE}/api/connections`).then((r) => r.json())
}

export function getConnectionsByModule(module){
  return fetch(`${BASE}/api/connections/${module}`).then((r) => r.json())
}

export function addConnection(module_id, connection){
  return fetch(`${BASE}/api/connections/${module_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      connection: connection
    })
  }).then((r) => {
    return r.json()
  })
}
