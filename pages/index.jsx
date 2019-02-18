import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';

import classnames from 'classnames';
import {
	Button,
	TabPane,
	TabContent,
	Row,
	Col,
	Card,
	CardTitle,
	CardText,
	NavItem,
	NavLink,
	Nav,
} from 'reactstrap';
import ArticleTab from '../components/articleTab';
import PostTab from '../components/postTab';
import PostList from '../components/postList';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
		};
	}

	componentDidMount() {
		Messenger.options = {
			extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-left',
			theme: 'flat',
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab,
			});
		}
	}

	sendForm(type) {
		switch (type) {
			case 'article':
				this.props.dispatch({
					type: 'API_POST_CREATE',
					payload: {
						type: 'article',
					},
				});
				break;

			case 'post':
				this.props.dispatch({
					type: 'API_POST_CREATE',
					payload: {
						type: 'post',
					},
				});
				break;
		}
	}

	render() {
		const Wrapper = styled.section`
			margin-top: 40px;
		`;

		const GlobalStyle = createGlobalStyle`
			body {
				background: #fafafa;
			}
			.tox-tinymce {
				border: 0px !important;
				 border-top: 1px solid #dedede !important;
			}
			.nav-tabs {
				border-bottom: 0px;
			}
			.nav-tabs .nav-link.active {
				background: #f0f3f8;
				border: 0px;
				border-radius: 50px;
			}
			.nav-tabs .nav-item {
				margin-right: 25px;
			}
			.nav-tabs .nav-item a{
				font-size: 16px;
				font-weight: 300;
			}

			.nav-tabs .nav-item a:hover {
				border: 0px;
			}
	
			.tox-notifications-container {
				display: none;
			}

			button svg {
				margin: 0 2px;
			}
		`;

		return (
			<div>
				<GlobalStyle />
				<Wrapper className="container">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({
									active: this.state.activeTab === '1',
								})}
								onClick={() => {
									this.toggle('1');
								}}
							>
								Article
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({
									active: this.state.activeTab === '2',
								})}
								onClick={() => {
									this.toggle('2');
								}}
							>
								Post
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({
									active: this.state.activeTab === '3',
								})}
								onClick={() => {
									this.toggle('3');
								}}
							>
								Question
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({
									active: this.state.activeTab === '4',
								})}
								onClick={() => {
									this.toggle('4');
								}}
							>
								Event
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
						<TabPane tabId="1">
							<ArticleTab sendForm={this.sendForm.bind(this)} />
						</TabPane>
						<TabPane tabId="2">
							<PostTab sendForm={this.sendForm.bind(this)} />
						</TabPane>
						<TabPane tabId="3">
							<h4>Empty</h4>
						</TabPane>
						<TabPane tabId="4">
							<h4>Empty</h4>
						</TabPane>
					</TabContent>
				</Wrapper>

				<Wrapper className="container">
					<PostList />
				</Wrapper>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {};
}

export default connect(mapStateToProps)(Home);
