import * as actions from '../Actions/type';
const initSate = {
    notifications:[],
};

const NotificationsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_NOTIFICATIONS: {
      return {
        ...state,
        notifications: [...action.payload],
      };
    }

    default: {
      return state;
    }
  }
};

export default NotificationsReducer;
