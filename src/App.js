/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import "normalize.css/normalize.css";
import "./App.css";
import UserStatus from "./containers/UserStatus";
import { Layout, Sidebar, Main, Content } from "./components/Layout";
import { Provider } from "react-redux";
import { injectGlobal } from "styled-components";
import colors from "yoast-components/style-guide/colors.json";

/*
 * Helper method to write global CSS.
 * Only use it for the rare @font-face definition or body styling.
 */
injectGlobal`
	body {
		margin: 0;
		padding: 0;
		font: normal 16px/1.5 "Open Sans", sans-serif;
		font-size: 1rem;
		min-height: 100%;
		background: ${colors.$background};
	}
`;

class App extends Component {
	render() {
		return (
			<Provider store={this.props.store}>
				<Layout>
					<Sidebar>
						<UserStatus />
					</Sidebar>
					<Main>
						<Content>
						</Content>
					</Main>
				</Layout>
			</Provider>
		);
	}
}

App.propTypes = {
	store: React.PropTypes.object,
};

export default App;
