import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';

import {
	faPaperclip,
	faTag,
	faAngleDown,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TitleInput = styled(Input)`
	border: 0px;
	height: 60px;
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
	margin-right: 15px;
`;

const TagButton = styled(Button)`
	background: #fff;
	color: ${props => (props.disabledbtn ? '#c3c4c5' : '#878a8c')};
	margin-left: 10px;
	border-color: ${props => (props.disabledbtn ? '#c3c4c5' : '#878a8c')};
	font-size: 12px;
	margin-top: 7px;
`;

const FormFooter = styled.div`
	text-align: ${props => props.align};
`;

class ArticleTab extends React.Component {
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
				<TitleInput
					type="text"
					placeholder="Title"
					value={this.props.title}
					onChange={this.changeTitle.bind(this)}
				/>
				<Editor
					initialValue="<p>Text ... (optional)</p>"
					init={{
						menubar: false,
						statusbar: false,
						plugins: 'link image code',
						toolbar:
							'undo redo | bold italic | alignleft aligncenter alignright | code',
					}}
					onChange={this.handleEditorChange.bind(this)}
				/>
				<div className="row">
					<FormFooter align="left" className="col-md-6">
						<TagButton disabledbtn="true">
							<FontAwesomeIcon icon={faPlus} /> OC
						</TagButton>

						<TagButton>
							<FontAwesomeIcon icon={faPlus} /> SPOILER
						</TagButton>

						<TagButton>
							<FontAwesomeIcon icon={faPlus} /> NSFW
						</TagButton>

						<TagButton>
							<FontAwesomeIcon icon={faTag} /> FLAIR
							<FontAwesomeIcon icon={faAngleDown} />
						</TagButton>
					</FormFooter>
					<FormFooter align="right" className="col-md-6">
						<FileButton>
							<FontAwesomeIcon icon={faPaperclip} /> File
						</FileButton>
						<PostButton type="button" onClick={this.send.bind(this)}>
							Post
						</PostButton>
					</FormFooter>
				</div>
				{this.props.formLoading && <Loading />}
			</ComponentWrapper>
		);
	}
}

ArticleTab.propTypes = {
	sendForm: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
	return {
		title: state.app.title,
		formLoading: state.app.formLoading,
	};
}

export default connect(mapStateToProps)(ArticleTab);
