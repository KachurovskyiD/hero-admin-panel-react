import { combineReducers } from 'redux';

import filters from './filters';
import heroes from './heroes';

const rootReducer = combineReducers({
  filters,
  heroes,
});

export default rootReducer;
