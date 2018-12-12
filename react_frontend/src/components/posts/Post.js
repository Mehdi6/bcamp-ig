import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { likePost, dislikePost } from "../../actions/timelineActions";
import {Thumbnail, Button} from "react-bootstrap";


class PostCard extends Component {
    constructor(props){
        super(props);
        this.state = { disableLikeButton: false, removeCard:null };
    }
    
    static propTypes = {
        likePost: PropTypes.func.isRequired,
        dislikePost: PropTypes.func.isRequired,
        liked: PropTypes.string,
        disliked: PropTypes.string
    };
    
    dislikeFunc(post_id)
    {
        this.props.dislikePost(post_id);
    }
    
    likeFunc(post_id)
    {
        this.props.likePost(post_id);
    }
    
    componentWillReceiveProps(nextProps)
    {
        // console.log('test');
        if(this.props.value.id==nextProps.liked)
            this.setState({disableLikeButton:true});
        
        if(this.props.value.id==nextProps.disliked)
            this.setState({removeCard:{display: "none"}});   
    }
    
    renderLikeButton(id)
    {
        // if the component is being rendred in the favorite list, no need to add a like button.
        return (<Button bsStyle="primary" disabled={this.state.disableLikeButton} onClick={()=> this.likeFunc(id)}>Like</Button>);
    }

    render()
    {
        const post = this.props.value;
        console.log(post.media);    
        return (
            <div style={this.state.removeCard}>
                <Thumbnail src={post.media} alt="Post content">
                    <h4 >Description: {post.description}</h4>
                    {" "}
                    <hr />
                    <Button bsStyle="danger" onClick={() => this.dislikeFunc(post._id)}>Dislike</Button>
                    {this.renderLikeButton(post._id)}
                </Thumbnail>
            </div>
        );
    }
}

function mapStateToProps(state) {
        return {
            liked: state.post.liked,
            disliked: state.post.disliked
        };
}

export default connect(mapStateToProps, { dislikePost, likePost })(PostCard);