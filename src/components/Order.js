import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedNumber, FormattedDate } from "react-intl";
import { RowMobileCollapse, ColumnPrimary, ColumnFixedWidth, ColumnMinWidth, makeFullWidth } from "./Tables";
import { IconButtonLink, disable, IconButton, makeButtonFullWidth, makeResponsiveIconButton } from "./Button";
import downloadIcon from "../icons/download.svg";
import formatAmount from "../../../shared/currency";
import LineItems from "./LineItems";

const messages = defineMessages( {
	date: {
		id: "orders.overview.date",
		defaultMessage: "Date",
	},
	orderNumber: {
		id: "orders.overview.orderNumber",
		defaultMessage: "Order",
	},
	items: {
		id: "orders.overview.items",
		defaultMessage: "Items",
	},
	total: {
		id: "orders.overview.total",
		defaultMessage: "Total",
	},
	status: {
		id: "orders.overview.status",
		defaultMessage: "Status",
	},
	invoice: {
		id: "orders.overview.invoice",
		defaultMessage: "Invoice",
	},
	invoiceLabel: {
		id: "orders.overview.invoice.label",
		defaultMessage: "Download invoice",
	},
} );

let ColumnMinWidthResponsive = makeFullWidth( ColumnMinWidth );
let ColumnPrimaryResponsive = makeFullWidth( ColumnPrimary );
let ColumnFixedWidthResponsive = makeFullWidth( ColumnFixedWidth );

let invoiceStatuses = [ "completed", "refunded" ];

/**
 * A page order list using table abstraction.
 *
 * @param {Object} props Properties to be passed to the table.
 * @returns {ReactElement} A row of order stuff.
 */
function Order( props ) {
	let InvoiceButton = IconButtonLink;
	if ( ! invoiceStatuses.includes( props.status ) ) {
		InvoiceButton = disable( IconButton );
	}

	let ResponsiveInvoiceButton = makeButtonFullWidth( makeResponsiveIconButton( InvoiceButton ) );

	let invoiceMessage = props.intl.formatMessage( messages.invoice );
	let invoiceLabel = props.intl.formatMessage( messages.invoiceLabel );

	return (
		<RowMobileCollapse background={ props.background }>
			<ColumnMinWidthResponsive ellipsis={ true } headerLabel={ props.intl.formatMessage( messages.date ) }>
				<FormattedDate value={ props.date } day="numeric" month="long" year="numeric"/>
			</ColumnMinWidthResponsive>
			<ColumnMinWidth ellipsis={ true } hideOnMobile={ true } hideOnTablet={ true }
						headerLabel={ props.intl.formatMessage( messages.orderNumber ) }>
				{ props.orderNumber }
			</ColumnMinWidth>
			<ColumnPrimaryResponsive ellipsis={ true } headerLabel={ props.intl.formatMessage( messages.items ) }>
				<LineItems items={ props.items }/>
			</ColumnPrimaryResponsive>
			<ColumnMinWidthResponsive ellipsis={ true } headerLabel={ props.intl.formatMessage( messages.total ) }>
				<FormattedNumber value={ formatAmount( props.total ) } style="currency" currency={ props.currency }/>
			</ColumnMinWidthResponsive>
			<ColumnMinWidthResponsive ellipsis={ true } headerLabel={ props.intl.formatMessage( messages.status ) }>
				{ props.status }
			</ColumnMinWidthResponsive>
			<ColumnFixedWidthResponsive>
				<ResponsiveInvoiceButton
					aria-label={ invoiceLabel }
					iconSource={ downloadIcon }
					to={ props.invoiceLink }
				>
					<span className="screen-reader-text">{ invoiceMessage }</span>
				</ResponsiveInvoiceButton>
			</ColumnFixedWidthResponsive>
		</RowMobileCollapse>
	);
}

Order.propTypes = {
	date: React.PropTypes.instanceOf( Date ).isRequired,
	id: React.PropTypes.string.isRequired,
	orderNumber: React.PropTypes.string.isRequired,
	total: React.PropTypes.number.isRequired,
	currency: React.PropTypes.string.isRequired,
	invoiceLink: React.PropTypes.string,
	intl: intlShape.isRequired,
	items: React.PropTypes.array,
	status: React.PropTypes.string,
	background: React.PropTypes.string,
};

Order.defaultProps = {
	items: [],
	status: "N/A",
	background: "",
};

export default injectIntl( Order );
