import { combineReducers} from 'redux';
import flow from './flowReducer'
import editor from './editorReducer';

const rootReducer = combineReducers({
  flow,
  editor
})

export default rootReducer;
