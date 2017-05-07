import { connect } from "react-redux";
import ProfilePage from "../components/ProfilePage";
import { profileUpdateEmail, updateProfile } from "../actions/user";
import { url } from "gravatar";
let avatarPlaceholder = "https://s3.amazonaws.com/yoast-my-yoast/My_Yoast_default_avatar.png";

export const mapStateToProps = ( state ) => {
	return {
		email: state.user.email,
		image: url( state.user.data.profile.email, {
			s: "150",
			r: "pg",
			d: avatarPlaceholder,
			protocol: "https",
		} ),
		isSaving: state.user.savingProfile,
		error: state.user.savingError,
	};
};

export const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onUpdateEmail: ( email ) => {
			dispatch( profileUpdateEmail( email ) );
		},
		onSaveProfile: ( profile ) => {
			dispatch( updateProfile( profile ) );
		},
	};
};

export const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	let email = stateProps.email;

	const onSaveProfile = () => {
		dispatchProps.onSaveProfile( { email } );
	};

	return Object.assign( {}, ownProps, stateProps, dispatchProps, { onSaveProfile } );
};

const ProfilePageContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)( ProfilePage );

export default ProfilePageContainer;
