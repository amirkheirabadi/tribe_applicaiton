import {
  combineReducers
} from 'redux';

function app(
  state = {
    posts: [],

    title: '',
    body: '',

    listLoading: false,
    formLoading: false
  },
  action,
) {
  let nextState;

  switch (action.type) {
  case 'POST_CREATE_SUCCESS':
    return {
      ...state,
      title: '',
      body: ''
    };
    break;

  case 'FORM_LOADING':
    return {
      ...state,
      formLoading: action.payload
    }
    break;

  case 'FORM_LOADING':
    return {
      ...state,
      formLoading: action.payload
    }
    break;

  case 'LIST_LOADING':
    return {
      ...state,
      listLoading: action.payload
    }
    break;
  case 'POST_LIST_SUCCESS':
    return {
      ...state,
      posts: action.payload.posts,
      listLoading: false
    };
    break;

  case 'SET_TITLE':
    return {
      ...state,
      title: action.payload,
    };
    break;

  case 'SET_BODY':
    return {
      ...state,
      body: action.payload,
    };
    break;

  }

  return nextState || state;
}

const appReducer = combineReducers({
  app,
});

export default appReducer;