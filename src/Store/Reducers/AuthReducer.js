import * as actions from '../Actions/type';
import { AsyncStorage } from 'react-native';
const initSate = {
  user: undefined,
  skiped: 'false',
  welcome: 'false',
};

const AuthReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.LOGIN: {
      const { user } = action.payload;
      AsyncStorage.setItem('user', JSON.stringify(user));
      return {
        ...state,
        user,
      };
    }
    case actions.SET_USER: {
      const { user } = action.payload;
      const {user:oldUser} =  state;
      const newUser = {
        ...oldUser,
        ...user
      };
      AsyncStorage.setItem('user', JSON.stringify(newUser));
      return {
        ...state,
        user:newUser,
      };
    }

    case actions.SYNC_WITH_ASYNC_STORAGE: {
      const { user,skiped, welcome } = action.payload;
      return {
        ...state,
        user,
        skiped,
        welcome,
      };
    }
    
    case actions.LOGOUT: {
      AsyncStorage.removeItem('user');
      return {
        ...state,
        user: null,
      };
    }

    case actions.SET_AUTH_SKIPPED: {
      const { skiped } = action.payload;
      AsyncStorage.setItem('skiped', skiped ? 'true':'false');
      return {
        ...state,
        skiped,
      };
    }

    default: {
      return state;
    }
  }
};

export default AuthReducer;
