import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet();

		// Step 2: Retrieve styles from components in the page
		const page = renderPage(App => props =>
			sheet.collectStyles(<App {...props} />),
		);

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement();

		// Step 4: Pass styleTags as a prop
		return { ...page, styleTags };
	}

	render() {
		return (
			<html>
				<Head>
					<style>{`body { margin: 0 } /* custom! */`}</style>
					{this.props.styleTags}

					<link rel="stylesheet" href="/static/styles/messenger.css" />
					<link
						rel="stylesheet"
						href="/static/styles/messenger-theme-flat.css"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />

					<script src="/static/js/jquery-3.3.1.min.js" />
					<script src="/static/js/messenger.min.js" />
					<script src="/static/js/messenger-theme-flat.js" />
				</body>
			</html>
		);
	}
}
