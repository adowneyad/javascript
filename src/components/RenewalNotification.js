import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "yoast-components/style-guide/colors.json";
import { FormattedMessage, FormattedDate, defineMessages, injectIntl, intlShape } from "react-intl";
import Link from "./Link";
import { CloseButtonTopRight } from "./Button";
import NewTabMessage from "../components/NewTabMessage";
import renewalNotification from "../images/renewalNotification.svg";

const messages = defineMessages( {
	header: {
		id: "renewal.notification.header",
		defaultMessage: "One or more plugins are about to expire!",
	},
	description: {
		id: "renewal.notification.description",
		defaultMessage: "When they do, you will no longer receive (security) updates or support! The first one expires on {expireDate}.",
	},
	close: {
		id: "renewal.notification.close",
		defaultMessage: "close",
	},
	linkPlaceholder: {
		id: "renewal.notification.link.placeholder",
		defaultMessage: "{renewalLink}",
	},
	linkMessage: {
		id: "renewal.notification.link.message",
		defaultMessage: "Renew your subscription(s) on this page.",
	},
} );

const MessageContainer = styled.div`
	background-color: ${ colors.$color_white };
	box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
	padding: 8px 32px;
	margin-bottom: 32px;
	position: relative;
	display:flex;

	button {
		position: absolute;
		right: 16px;
		top: 16px;
	}
`;

const MessageLink = styled( Link )`
	color: ${ colors.$color_black };
	text-decoration: underline;
	&:hover, &:focus {
		color: ${ colors.$color_blue };
	}
`;

const Block = styled.div`
	display: inline-block;
	margin-right: 32px;
	vertical-align: middle;
`;

const RenewalImage = styled.img`
	width: 150px;
`;

/**
 * Renewal notification message
 *
 * To help the customer understand what happened to licenses.
 *
 * @param {object} props Properties of the component.
 * @returns {ReactElement} Subscription component.
 * @constructor
 */
class RenewalNotification extends React.Component {
	constructor()  {
		super();
		this.state = {
			hide: false,
		};
		this.onCrossClick = this.onCrossClick.bind( this );
		this.earliestEndDate = this.earliestEndDate.bind( this );
	}

	/**
	 * Called on cross click.
	 *
	 * @param {event} event The event clicking the close cross.
	 *
	 * @returns {void}
	 */
	onCrossClick( event ) {
		event.preventDefault();
		this.setState( { hide: true } );
	}

	/**
	 * Calculates the subscription with the earliest endDate.
	 *
	 * @returns {object} The nearestEndDate.
	 */
	earliestEndDate() {
		let currentDate = new Date();

		// Filters subscriptions with an endDate in the future.
		let subscriptions = this.props.subscriptions.filter(
			( subscription ) => subscription.endDate > currentDate );

		// Makes sure subscriptions are not empty.
		if ( subscriptions.length < 1 || ! subscriptions ) {
			return null;
		}

		subscriptions = subscriptions.sort( ( a, b ) => {
			return new Date( a.endDate ) - new Date( b.endDate );
		} );

		return subscriptions[ 0 ];
	}

	/**
	 * Renders the message.
	 *
	 * @returns { ReactElement|null} Returns a message container including the renewalNotification or null.
	 */
	render() {
		let earliestSubscription = this.earliestEndDate();

		if ( this.state.hide || ! earliestSubscription ) {
			return null;
		}

		let endDate = <FormattedDate
				value={ earliestSubscription.endDate }
				year="numeric"
				month="long"
				day="2-digit"
			/>;
		let subscriptionId = earliestSubscription.id;


		return (
			<MessageContainer>
					<CloseButtonTopRight
						onClick={ this.onCrossClick }
						aria-label={ this.props.intl.formatMessage( messages.close ) }
					/>
				<Block>
					<RenewalImage src={ renewalNotification }/>
				</Block>
				<Block>
					<h2><FormattedMessage { ...messages.header }/></h2>
					<p>
						<FormattedMessage { ...messages.description } values={ { expireDate: endDate } }/>
						<br/>
						<MessageLink
							to={ "/account/subscriptions/" + subscriptionId }
							linkTarget="_blank"
						>
							<FormattedMessage { ...messages.linkMessage } />
							<NewTabMessage />
						</MessageLink>
					</p>
				</Block>
			</MessageContainer>
		);
	}
}

RenewalNotification.propTypes = {
	intl: intlShape.isRequired,
	subscriptions: PropTypes.array,
	onManage: PropTypes.func,
};

export default injectIntl( RenewalNotification );
