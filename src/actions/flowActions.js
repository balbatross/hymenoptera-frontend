import * as types from './actionTypes';

function flow_url(){
  return 'http://localhost:8000/api/flows'
}
export function receiveFlows(json){
  return {type: types.RECEIVE_FLOWS, flows: json}
}

export function fetchFlows(){
  return dispatch => {
    return fetch(flow_url()).then((r) => r.json()).then((json) => dispatch(receiveFlow(json)))
  }
}
