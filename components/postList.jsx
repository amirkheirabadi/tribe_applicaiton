import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { list } from 'postcss';

const ComponentWrapper = styled.div`
	position: relative;
	margin-top: 20px;
	box-shadow: 0px 0px 1px 1px #efefef;
	border: 1px solid #dedede;
	background: #fff;
	padding: 20px;
`;

const DeleteButton = styled(Button)`
	background: #e74c3c;
	color: #fff;
	border-color: #fff;
	padding: 9px 15px;
	font-size: 15px;
	margin-right: 15px;
`;

class PostList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.dispatch({
			type: 'API_POST_LIST',
			payload: {},
		});
	}

	deletePost(id) {
		let msg = Messenger().post({
			message: 'Are you sure about that ?',
			actions: {
				yes: {
					label: 'Yes, do it',
					phrase: 'Detele TIME',
					auto: true,
					delay: 10,
					action: () => {
						this.props.dispatch({
							type: 'API_POST_DELETE',
							payload: {
								id,
							},
						});
					},
				},
				cancel: {
					action: () => {
						return msg.cancel();
					},
				},
			},
		});
	}

	render() {
		return (
			<ComponentWrapper>
				<table className="table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Type</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{this.props.posts.map((item, i) => {
							return (
								<tr key={i}>
									<td>{item.title}</td>
									<td>{item.type}</td>
									<td>
										<DeleteButton
											onClick={this.deletePost.bind(this, item._id)}
										>
											<FontAwesomeIcon icon={faTrash} /> Delete
										</DeleteButton>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				{this.props.listLoading && <Loading />}
			</ComponentWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		posts: state.app.posts,
		listLoading: state.app.listLoading,
	};
}

export default connect(mapStateToProps)(PostList);
