import * as actions from '../Actions/type';
const initSate = {
    payments:[],
};

const PaymentReducer = (state = initSate, action) => {
  switch (action.type) {
    case actions.SET_PAYMENTS: {
      return {
        ...state,
        payments: [...action.payload],
      };
    }
    case actions.ADD_PAYMENT: {
      return {
        ...state,
        payments: [
          { ...action.payload },
          ...state.payments,
        ],
      };
    }
    default: {
      return state;
    }
  }
};

export default PaymentReducer;
