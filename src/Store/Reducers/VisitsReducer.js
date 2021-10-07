import * as actions from '../Actions/type';
const initSate = {
    visits:[],
};

const VisitsReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_VISITS: {
      return {
        ...state,
        visits: [...action.payload],
      };
    }
    case actions.CANCEL_VISIT: {
      const visit = action.payload;
      const visits = state.visits.map(b => {
        if(b.id === visit.id){
          return {...visit};
        }
        return {...b}
      })
      return {
        ...state,
        visits
      };
    }
    default: {
      return state;
    }
  }
};

export default VisitsReducer;
