import {combineReducers} from 'redux';

import stockReducer from './reduces/stockSlice';
import themeReducer from './reduces/themeSlice';
import userReducer from './reduces/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  stock: stockReducer,
});

export default rootReducer;
