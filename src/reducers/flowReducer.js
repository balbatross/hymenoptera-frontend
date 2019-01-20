import initialState from './initialState';
import { FETCH_FLOWS, RECEIVE_FLOWS} from '../actions/actionTypes';

export default function flow(state = initialState.flows, action){
  let newState;
  switch(action.type){
    case FETCH_FLOWS:
      return action;
    case RECEIVE_FLOWS:
      newState = {...state, flows: action.flows}
      return newState
    default:
      return state;
  }
}

