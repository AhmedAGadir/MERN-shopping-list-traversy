// import { v4 as uuidv4 } from 'uuid';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

const initialState = {
    items: [],
    loading: false,
    // items: [
    //     { id: uuidv4(), name: 'The Lies of Locke Lamora' },
    //     { id: uuidv4(), name: 'The Name of the Wind' },
    //     { id: uuidv4(), name: 'Frankenstein' },
    // ]
}

const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            }
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            }
        case ADD_ITEM:
            return {
                ...state,
                items: [action.payload, ...state.items]
            }
        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}

export default itemReducer;