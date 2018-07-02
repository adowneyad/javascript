import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
	ColumnIcon,
	makeFullWidth,
	responsiveHeaders,
	ColumnMinWidth,
	RowMobileCollapse,
	ColumnFixedWidth,
} from "../../Tables";
import { getUserId } from "../../../functions/auth";
import { ColumnPrimary } from "../../Tables";
import { LargeButtonLink, makeButtonFullWidth } from "../../Button";
import defaults from "../../../config/defaults.json";
import Link from "../../Link";

let ResponsiveLargeButtonLink = makeButtonFullWidth( LargeButtonLink );

const CourseIcon = styled.img`
	height: inherit;
`;

const CourseColumnIcon = styled( ColumnIcon )`
	display: inline-block;
	position: relative;
	width: 100px;
	padding-right: 40px;
	text-align: center;
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile }px ) {
		display: none;
	}

	&:after {
		position: absolute;
		padding: 0;
		right: 0;
	}
	
	img {
		margin: auto;
		height: 100%;
	}
`;

let ColumnMinWidthResponsive = makeFullWidth( responsiveHeaders( ColumnMinWidth ) );
let ColumnPrimaryResponsive = makeFullWidth( responsiveHeaders( ColumnPrimary ) );
let ColumnFixedWidthResponsive = styled( makeFullWidth( responsiveHeaders( ColumnFixedWidth ) ) )`
	flex: 0 0 192px;
	text-align: center;
`;

const messages = defineMessages( {
	course: {
		id: "progress.overview.courseName",
		defaultMessage: "Course",
	},
	progress: {
		id: "progress.overview.progress",
		defaultMessage: "Progress",
	},
	status: {
		id: "progress.overview.status",
		defaultMessage: "Status",
	},
} );

class CourseProgress extends React.Component {
	getProgressButtonLabel( progress, student, buyer ) {
		if ( progress === 100 ) {
			if ( this.props.course.certificateUrl ) {
				return <FormattedMessage id="button.certificate" defaultMessage="Certificate" />;
			}
			return <FormattedMessage id="button.retake" defaultMessage="Retake course" />;
		}
		if ( progress > 0 ) {
			return <FormattedMessage id="button.continue" defaultMessage="Continue" />;
		}
		if ( student ) {
			return <FormattedMessage id="button.getstarted" defaultMessage="Get started" />;
		}
		if ( buyer ) {
			return <FormattedMessage id="button.enroll" defaultMessage="Enroll" />;
		}
	}

	getProgressButtonUrl( progress, student, buyer ) {
		if ( progress === 100 && this.props.course.certificateUrl ) {
			return this.props.course.certificateUrl;
		}
		if ( student ) {
			return this.props.course.courseUrl;
		}
		if ( buyer ) {
			return "/courses/enrollments";
		}
	}

	render() {
		let userId = getUserId(), progress = 0, student = false, buyer = false;

		if ( this.props.courseEnrollments.length > 0 ) {
			for ( let i = 0; i < this.props.courseEnrollments.length; i++ ) {
				let enrollment = this.props.courseEnrollments[ i ];

				if ( enrollment.studentId === userId ) {
					progress = enrollment.progress;
					student  = true;
				}

				if ( enrollment.buyerId === userId && enrollment.studentId === null ) {
					buyer = true;
				}
			}
		}

		return (
			<RowMobileCollapse key={ this.props.course.id } background={ this.props.background } >
				<CourseColumnIcon separator={ true }>
					<CourseIcon src={ this.props.course.icon } alt=""/>
				</CourseColumnIcon>
				<ColumnPrimaryResponsive ellipsis={ true } headerLabel={ this.props.intl.formatMessage( messages.course ) }>
					<Link to={ this.props.course.courseUrl } linkTarget="_blank">{ this.props.course.name }</Link>
				</ColumnPrimaryResponsive>
				<ColumnMinWidthResponsive ellipsis={ true } headerLabel={ this.props.intl.formatMessage( messages.progress ) }>
					{ progress }%
				</ColumnMinWidthResponsive>
				<ColumnFixedWidthResponsive>
					<ResponsiveLargeButtonLink to={ this.getProgressButtonUrl( progress, student, buyer ) } linkTarget="_blank">
						{ this.getProgressButtonLabel( progress, student, buyer ) }
					</ResponsiveLargeButtonLink>
				</ColumnFixedWidthResponsive>
			</RowMobileCollapse>
		);
	}
}

CourseProgress.propTypes = {
	intl: intlShape.isRequired,
	courseEnrollments: PropTypes.array,
	course: PropTypes.object,
	background: PropTypes.string,
};

export default injectIntl( CourseProgress );

