import * as actions from '../Actions/type';
const initSate = {
    receipts:[],
};

const ReceiptReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_RECEIPTS: {
      return {
        ...state,
        receipts: [...action.payload],
      };
    }
    default: {
      return state;
    }
  }
};

export default ReceiptReducer;
