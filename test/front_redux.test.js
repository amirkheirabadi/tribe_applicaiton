// Test redux
import configureStore from 'redux-mock-store'
import createSagaMiddleware from 'redux-saga';
import mySaga, {
  postList,
  postCreate,
  postDelete
} from '../src/saga';
import {
  call,
  put,
} from 'redux-saga/effects';

const sagaMiddleware = createSagaMiddleware();
const mockStore = configureStore([sagaMiddleware])

describe('Test for saga', async () => {
  it('should dispatch postList action', async () => {
    const gen = postList()
    expect(gen.next().value).toEqual(put({
      type: 'FORM_LOADING',
      payload: true,
    }))

    const response = await gen.next().value
    expect(response.status).toEqual(200)
    expect(gen.next(response).value).toEqual(put({
      type: 'FORM_LOADING',
      payload: false,
    }))
    expect(gen.next(response).value).toEqual(put({
      type: 'POST_LIST_SUCCESS',
      payload: response.data,
    }))
    expect(gen.next().done).toEqual(true)
  }, 10000)

  it('should dispatch postCreate', async () => {
    const gen = postCreate({
      payload: {
        type: 'article'
      }
    })
    expect(gen.next().value).toEqual(put({
      type: 'FORM_LOADING',
      payload: true,
    }))

    gen.next('fake title').value
    gen.next('fake body').value

    const response = await gen.next().value
    expect(response.status).toEqual(200)
    expect(gen.next(response).value).toEqual(put({
      type: 'FORM_LOADING',
      payload: false,
    }))
    expect(gen.next().value).toEqual(call(postList))
    expect(gen.next(response).value).toEqual(put({
      type: 'POST_CREATE_SUCCESS',
      payload: '',
    }))

    expect(gen.next().done).toEqual(true)
  }, 10000)

  it('should dispatch postCreate with error', async () => {
    const gen = postCreate({
      payload: {}
    })
    expect(gen.next().value).toEqual(put({
      type: 'FORM_LOADING',
      payload: true,
    }))

    gen.next('fake body').value
    gen.next('fake body').value

    await gen.throw({
      response: {
        data: {
          messages: []
        }
      }
    }).value

    expect(gen.next().done).toEqual(true)
  }, 10000)

  it('should dispatch postDelete', async () => {
    const gen = postDelete({
      payload: {
        id: '7c6a4f74456bec8380a6092b'
      }
    })
    expect(gen.next().value).toEqual(put({
      type: 'LIST_LOADING',
      payload: true,
    }))

    const response = await gen.next().value
    expect(response.status).toEqual(200)
    expect(response.data.status).toEqual(false)

    expect(gen.next(response).value).toEqual(put({
      type: 'LIST_LOADING',
      payload: false,
    }))

    expect(gen.next().value).toEqual(call(postList))

    expect(gen.next().done).toEqual(true)
  }, 10000)
})