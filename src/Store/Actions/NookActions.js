import * as actions from './type';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import APIModel from '../../Models/APIModal';

const fallBackErrorMessage = 'Something went wrong, please try again later!';


const getPublicNooks = options => async dispatch => {
    const { filter, token, onError,onSuccess } = options;
    let queryString = '';
    Object.keys(filter).forEach(key => {
        queryString=`${queryString}${key}=${filter[key]}&`;
    });
    try {

        const res = await axios.get(`${APIModel.HOST}/nooks?${queryString}`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_NOOKS,
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

const getMyNookDetails = options => async dispatch => {
    const { token, onError,onSuccess } = options;
    try {

        const res = await axios.get(`${APIModel.HOST}/auth/user/nook`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_MY_NOOK,
            payload: res.data
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



const addReview = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{review,message}} = await axios.post(`${APIModel.HOST}/auth/user/nook/review`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        dispatch({
            type: actions.SET_NOOK_REVIEW,
            payload: review
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

const addNookRoom = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{message}} = await axios.post(`${APIModel.HOST}/auth/user/bookings`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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

const addNookSchedule = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    try {

        const {data:{review,message}} = await axios.post(`${APIModel.HOST}/auth/user/visits`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // dispatch({
        //     type: actions.ADD_NOOK_ROOM,
        // });

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


const setDesiredLocation = options => async dispatch => {
    const {location} =  options.data;
    dispatch({
        type: actions.SET_DESIRED_LOCATION,
        payload:location
    });
};
const getArea = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    
    try {

        const {data} = await axios.get(`${APIModel.HOST}/auth/user/area`, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({
            type: actions.SET_AREA,
            payload: data.data
        });
        if(onSuccess){
            onSuccess(data);
        }

    } catch (error) {
        const { data } = error.response;
        const message = data.message || error.message || fallBackErrorMessage;
        if (onError) {
            onError(message);
        }
    }
};
const addNook = options => async dispatch => {
    const { data, token, onError,onSuccess } = options;
    
    try {

        const {data:{message}} = await axios.post(`${APIModel.HOST}/auth/user/nooks`,data, {
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
export {
    getMyNookDetails,
    addReview ,
    getPublicNooks,
    addNookRoom,
    setDesiredLocation,
    addNookSchedule,
    getArea,
    addNook,
};
