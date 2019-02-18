import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import createSagaMiddleware from 'redux-saga';
import withRedux from 'next-redux-wrapper';
import appReducer from '../src/reducers';
import mySaga from '../src/saga';

const makeStore = (initialState, options) => {
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		appReducer,
		initialState,
		applyMiddleware(sagaMiddleware),
	);
	sagaMiddleware.run(mySaga);
	return store;
};

class TribeApplication extends App {
	render() {
		const { Component, pageProps, store } = this.props;
		return (
			<Container>
				<Provider store={store}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		);
	}
}

export default withRedux(makeStore)(TribeApplication);
