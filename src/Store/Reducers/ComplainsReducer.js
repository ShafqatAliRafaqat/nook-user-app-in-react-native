import * as actions from '../Actions/type';
const initSate = {
    complains:[],
};

const ComplainsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_COMPLAINS: {
      return {
        ...state,
        complains: [...action.payload],
      };
    }

    default: {
      return state;
    }
  }
};

export default ComplainsReducer;
