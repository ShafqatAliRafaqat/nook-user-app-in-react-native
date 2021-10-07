import * as actions from './type';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import  APIModel, {app_id} from '../../Models/APIModal';

const fallBackErrorMessage = 'Something went wrong, please try again later!';

const updateUser = options => async dispatch => {
  const { data,token, onSuccess, onError } = options;
  try {

    const { data: {user,message} } = await axios.patch(`${APIModel.HOST}/auth/user`, data, {
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

const changePassword = options => async dispatch => {
    const { data,token, onSuccess, onError } = options;
    try {
  
      const { data: {message} } = await axios.patch(`${APIModel.HOST}/auth/user/changePassword`, data, {
        'headers': {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
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

const registerDevice = options => async dispatch => {
    const { token,user_id, onSuccess, onError } = options;
    try {
  
      const { data: {message} } = await axios.post(`https://expopush.applet.solutions/api/v1/en/user/pushNotifications`, {
        token,
        user_id,
        app_id,
      }, {
        'headers': {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
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

export { updateUser, changePassword, registerDevice };