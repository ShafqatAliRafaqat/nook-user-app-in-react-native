import * as actions from './type';
import axios from 'axios';
import APIModel from '../../Models/APIModal';

const fallBackErrorMessage = 'Something went wrong, please try again later!';

const getBookings = options => async dispatch => {
    const { filter, token, onError,onSuccess } = options;
    let queryString = '';
    Object.keys(filter).forEach(key => {
        queryString=`${queryString}${key}=${filter[key]}&`;
    });
    try {

        const res = await axios.get(`${APIModel.HOST}/auth/user/bookings?${queryString}`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_BOOKINGS,
            payload: res.data.data
        });

        if(onSuccess){
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


const cancelBooking = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{booking,message}} = await axios.post(`${APIModel.HOST}/auth/user/bookings/cancel`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.CANCEL_BOOKING,
            payload: booking
        });

        if(onSuccess){
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

export { getBookings, cancelBooking };
