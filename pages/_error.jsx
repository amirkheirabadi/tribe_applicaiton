import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../static/styles/app.scss';

class Error extends Component {
	render() {
		return (
			<div className="container">
				<h1>error</h1>
			</div>
		);
	}
}

export default Error;
