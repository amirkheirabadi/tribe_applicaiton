import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';

import {
	faPaperclip,
	faEllipsisH,
	faImage,
	faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TitleInput = styled(Input)`
	margin: 25px 0;
	border: 0px;
	height: 70px;
`;

const ComponentWrapper = styled.div`
	position: relative;
	margin-top: 20px;
	box-shadow: 0px 0px 1px 1px #efefef;
	border: 1px solid #dedede;
	background: #fff;
	padding-bottom: 20px;
`;

const PostButton = styled(Button)`
	background: #34aa44;
	border: 0px;
	padding: 9px 23px;
	font-size: 15px;
	font-weight: lighter;
	margin-right: 20px;
`;

const FileButton = styled(Button)`
	background: #fff;
	color: #000;
	padding: 9px 15px;
	font-size: 15px;
	margin-left: 15px;
`;

const FormFooter = styled.div`
	text-align: ${props => props.align};
`;

const PostImage = styled.img`
	border-radius: 50%;
	height: 47px;
	width: 47px;
	margin-top: 20px;
	margin-left: 20px;
`;

class PostTab extends React.Component {
	constructor(props) {
		super(props);
	}

	changeTitle(e) {
		this.props.dispatch({
			type: 'SET_TITLE',
			payload: e.target.value,
		});
	}

	handleEditorChange(e) {
		this.props.dispatch({
			type: 'SET_BODY',
			payload: e.target.getContent(),
		});
	}

	send() {
		this.props.sendForm('article');
	}

	render() {
		return (
			<ComponentWrapper>
				<div className="row">
					<div className="col-md-1">
						<PostImage
							src="https://randomuser.me/api/portraits/women/65.jpg"
							alt=""
						/>
					</div>

					<div className="col-md-11">
						<TitleInput
							type="textarea"
							placeholder="Title"
							value={this.props.title}
							onChange={this.changeTitle.bind(this)}
						/>
					</div>
					<FormFooter align="left" className="col-md-6">
						<FileButton>
							<FontAwesomeIcon icon={faImage} /> Photo / Video
						</FileButton>

						<FileButton>
							<FontAwesomeIcon icon={faFileAlt} /> Article
						</FileButton>

						<FileButton>
							<FontAwesomeIcon icon={faPaperclip} /> File
						</FileButton>

						<FileButton>
							<FontAwesomeIcon icon={faEllipsisH} />
						</FileButton>
					</FormFooter>
					<FormFooter align="right" className="col-md-6">
						<PostButton type="button" onClick={this.send.bind(this)}>
							Post
						</PostButton>
					</FormFooter>
				</div>
				<Loading />
			</ComponentWrapper>
		);
	}
}

PostTab.propTypes = {
	sendForm: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	return {
		title: state.app.title,
	};
}

export default connect(mapStateToProps)(PostTab);
