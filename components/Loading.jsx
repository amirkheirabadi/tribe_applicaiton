import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import { AtomSpinner, LoopingRhombusesSpinner } from 'react-epic-spinners';

const LoadingWrapper = styled.div`
	background: rgb(44, 62, 80, 0.95);
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
`;

const LoadingSpinner = styled(LoopingRhombusesSpinner)`
	margin: 0px auto;
	top: 45%;
`;

const Loading = props => {
	return (
		<LoadingWrapper>
			<LoadingSpinner color="red" size="20" />
		</LoadingWrapper>
	);
};

export default Loading;
