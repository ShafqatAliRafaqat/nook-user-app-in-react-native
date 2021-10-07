import * as actions from '../Actions/type';
const initSate = {
    notices:[],
};

const NoticesReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_NOTICES: {
      return {
        ...state,
        notices: [...action.payload],
      };
    }

    case actions.CANCEL_NOTICE: {

      const notice = action.payload;
      const notices = state.notices.map(b => {
        if(b.id === notice.id){
          return {...notice};
        }
        return {...b}
      })
      return {
        ...state,
        notices
      };
    }
    default: {
      return state;
    }
  }
};

export default NoticesReducer;
