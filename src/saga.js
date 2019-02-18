import {
  call,
  put,
  takeEvery,
  takeLatest,
  select
} from 'redux-saga/effects';
import axios from 'axios';
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1/posts',
  timeout: 10000,
});

const getTitle = state => {
  return state.app.title;
};
const getBody = state => {
  return state.app.body;
};

const validationMessage = response => {
  if (response.status == 500) {
    Messenger({
      message: 'Error in server operation. please try again in a few minutes',
      type: 'error',
      showCloseButton: true,
    });
  }
  if (response.data.messages) {
    for (const msg of response.data.messages) {
      Messenger().post({
        message: msg,
        type: 'error',
        showCloseButton: true,
      });
    }
  }
};

export function* postList(action) {
  yield put({
    type: 'FORM_LOADING',
    payload: true,
  });
  const response = yield axiosClient.get('/', {});

  yield put({
    type: 'FORM_LOADING',
    payload: false,
  });
  yield put({
    type: 'POST_LIST_SUCCESS',
    payload: response.data,
  });
}

export function* postCreate(action) {
  try {
    yield put({
      type: 'FORM_LOADING',
      payload: true,
    });
    const title = yield select(getTitle);
    const body = yield select(getBody);

    const response = yield axiosClient.post('/', {
      title,
      body,
      type: action.payload.type,
    });

    yield put({
      type: 'FORM_LOADING',
      payload: false,
    });
    yield call(postList);
    yield put({
      type: 'POST_CREATE_SUCCESS',
      payload: '',
    });
  } catch (error) {
    if (error.response) {
      validationMessage(error.response);
    }
    yield put({
      type: 'FORM_LOADING',
      payload: false,
    });
  }
}

export function* postDelete(action) {
  yield put({
    type: 'FORM_LOADING',
    payload: true,
  });
  const response = yield axiosClient.delete('/' + action.payload.id, {});

  yield call(postList);
  yield put({
    type: 'FORM_LOADING',
    payload: false,
  });
  yield put({
    type: 'POST_DELETE',
    payload: response.data,
  });
}

function* mySaga() {
  yield takeEvery('API_POST_LIST', postList);
  yield takeEvery('API_POST_CREATE', postCreate);
  yield takeEvery('API_POST_DELETE', postDelete);
}

// function* mySaga() {
// 	yield takeLatest('API_POST_LIST', postList);
//  yield takeLatest('API_POST_CREATE', postCreate);
//  yield takeLatest('API_POST_DELETE', postDelete);
// }

export default mySaga;