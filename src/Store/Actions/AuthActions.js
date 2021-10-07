import * as actions from './type';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in';
import APIModel from '../../Models/APIModal';


const fallBackErrorMessage = 'Something went wrong, please try again later!';

const register = options => async dispatch => {
  const { data, onSuccess, onError } = options;
  try {

    const { data: user } = await axios.post(`${APIModel.HOST}/auth/user_register`, data, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const message = user.message;
    delete user.message;

    dispatch({
      type: actions.LOGIN,
      payload: {
        user,
      },
    });

    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const sendPasswordsResetCode = options => async () => {
  const { data, onSuccess, onError } = options;
  try {

    const { data: response } = await axios.post(`${APIModel.HOST}/passwordsReset/send`, data, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (onSuccess) {
      onSuccess(response);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const changePassword = options => async () => {
  const { data, onSuccess, onError } = options;
  try {

    const { data: response } = await axios.post(`${APIModel.HOST}/passwordsReset/change`, data, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (onSuccess) {
      onSuccess(response);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const sendNumberVerificationCode = options => async () => {
  const { token, onSuccess, onError } = options;
  try {

    const { data: response } = await axios.post(`${APIModel.HOST}/auth/user/numberVerification/send`, {}, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (onSuccess) {
      onSuccess(response);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const verifyNumber = options => async dispatch => {
  const { data, onSuccess, onError, token } = options;
  try {

    const { data: {user,message} } = await axios.post(`${APIModel.HOST}/auth/user/numberVerification/verify`, data, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    dispatch({
      type: actions.SET_USER,
      payload: {
        user,
      },
  });
    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const login = options => async dispatch => {
  const { data, onSuccess, onError } = options;
  try {

    const { data: user } = await axios.post(`${APIModel.HOST}/auth/login`, data, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const message = user.message;
    delete user.message;

    dispatch({
      type: actions.LOGIN,
      payload: {
        user,
      },
    });

    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {

    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const syncWithAsyncStorage = options => async dispatch => {
  try {

    const { onSuccess, onError } = options;
    let user = await AsyncStorage.getItem('user');
    let skiped = await AsyncStorage.getItem('skiped');
    let welcome = await AsyncStorage.getItem('welcome');

    user = JSON.parse(user);


    dispatch({
      type: actions.SYNC_WITH_ASYNC_STORAGE,
      payload: {
        user, skiped, welcome
      },
    });

    if (onSuccess) {
      onSuccess({
        user, skiped, welcome
      });
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const getSocialUser = async (provider) => {
  if (provider === 'google') {
    return new Promise(async (resolve, reject) => {
      try {
        
        await GoogleSignIn.initAsync();
        await GoogleSignIn.askForPlayServicesAsync();
        const result = await GoogleSignIn.signInAsync();

        if (result.type === "success") {
          const user = await GoogleSignIn.signInSilentlyAsync();
          const {
            uid: provider_user_id,
            displayName:name,
          } = user;
          return resolve({ provider_user_id, name, provider });
        }

        reject(new Error('User Canceled Login Process'));

      } catch (error) {
        reject(error)
      }
    });
  }


  // facebook

  return new Promise(async (resolve, reject) => {
    try {
      
      await Facebook.initializeAsync('214106956407112');
      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });

      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        const {
          id: provider_user_id,
          name
        } = await response.json();
        return resolve({
          provider_user_id,name,provider
        });
      }

      return reject(new Error('User Canceled Login Process'));

    } catch (error) {
      reject(error)
    }
  });
}
const socialLogin = options => async dispatch => {
  const { data, onSuccess, onError } = options;
  try {

    let socialUser = await getSocialUser(data.provider);
    const { data: user } = await axios.post(`${APIModel.HOST}/auth/socialLogin`, socialUser, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const message = user.message;
    delete user.message;

    dispatch({
      type: actions.LOGIN,
      payload: {
        user,
      },
    });

    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

const logout = options => async (dispatch) => {
  const { onSuccess, onError, token } = options;
  try {


    const { data: { message } } = await axios.post(`${APIModel.HOST}/auth/logout`, {}, {
      'headers': {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    dispatch({
      type: actions.LOGOUT,
    });

    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {
    const { data } = error.response;
    const message = data.message || error.message || fallBackErrorMessage;

    if (onError) {
      onError(message);
    }
  }
};

export { register, syncWithAsyncStorage, sendPasswordsResetCode, changePassword, sendNumberVerificationCode, verifyNumber, login, socialLogin, logout };