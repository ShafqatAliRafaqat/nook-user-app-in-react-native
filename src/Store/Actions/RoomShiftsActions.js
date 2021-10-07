import * as actions from './type';
import axios from 'axios';
import APIModel from '../../Models/APIModal';

const fallBackErrorMessage = 'Something went wrong, please try again later!';

const getRoomShifts = options => async dispatch => {
    const { filter, token, onError,onSuccess } = options;
    let queryString = '';
    Object.keys(filter).forEach(key => {
        queryString=`${queryString}${key}=${filter[key]}&`;
    })
    try {

        const res = await axios.get(`${APIModel.HOST}/auth/user/room_shifts?${queryString}`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_ROOM_SHIFTS,
            payload: res.data.data
        });

        if(onSuccess){
            onSuccess(res);
        }

    } catch (error) {
        const { data } = error.response;
        const message = data.message || error.message || fallBackErrorMessage;
        if (onError) {
            onError(message);
        }
    }
};


const cancelRoomShift = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{room_shift,message}} = await axios.post(`${APIModel.HOST}/auth/user/room_shifts/cancel`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.CANCEL_ROOM_SHIFT,
            payload: room_shift
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

const addRoomShift = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{message, room_shift}} = await axios.post(`${APIModel.HOST}/auth/user/room_shifts`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.ADD_ROOM_SHIFT,
            payload: room_shift
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

export { getRoomShifts, addRoomShift, cancelRoomShift };