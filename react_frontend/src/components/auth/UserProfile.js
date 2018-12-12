import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { getUserProfile } from "../../actions/authActions";
import { Button } from "react-bootstrap";
import history from "../../utils/historyUtils";

class UserProfile extends Component {
    static propTypes = {
        getUserProfile: PropTypes.func.isRequired,
        user: PropTypes.object
    };

    componentWillMount() {
        this.props.getUserProfile();
    }

    renderUser() {
        const user = this.props.user;

        if (user) {
            return (
                <div className="mx-2">
                    <h4>username: {user.username}</h4>
                    <h4>FullName: {user.fullname}</h4>
                    <h4>Followers count: {user.followers_count}</h4>
                    <h4>Following count: {user.following_count}</h4>
                    <h4>email: {user.email}</h4>
                    <hr />
                    <h4>About Myself:</h4>
                    <p>{user.bio}</p>

                </div>
            );
        }
        return null;
    }
    
    handleUpdateProfile(){
        history.push("/profile_edit");
    }
    
    handleChangePassword(){
        history.push("/change_password");
    }
    
    render() {
        return (
            <div>
                {this.renderUser()}
                {" "}
                <hr />
                <Button bsStyle="primary" onClick={()=> this.handleUpdateProfile()}> Update Profile </Button>
                <Button bsStyle="primary" onClick={()=> this.handleChangePassword()}> Change Password </Button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { getUserProfile } )(UserProfile);