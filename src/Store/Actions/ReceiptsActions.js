import * as actions from './type';
import axios from 'axios';
import APIModel from '../../Models/APIModal';

const fallBackErrorMessage = 'Something went wrong, please try again later!';

const getReceipts = options => async dispatch => {
    const { filter, token, onError, onSuccess } = options;
    let queryString = '';
    Object.keys(filter).forEach(key => {
        queryString = `${queryString}${key}=${filter[key]}&`;
    });
    try {

        const res = await axios.get(`${APIModel.HOST}/auth/user/receipts?${queryString}`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_RECEIPTS,
            payload: res.data.data
        });

        if (onSuccess) {
            onSuccess();
        }

    } catch (error) {
        const { data } = error.response;
        const message = data.message || error.message || fallBackErrorMessage;
        if (onError) {
            onError(message);
        }
    }
};

export { getReceipts };
