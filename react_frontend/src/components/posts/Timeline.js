import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostCard from "./Post";
import { getPosts } from "../../actions/timelineActions";
import {Pager, Grid, Row, Col } from "react-bootstrap";

class Timeline extends Component {

    constructor(props){
        super(props)
        this.state={
            dislikeThisPost: Array(1).fill(true),
            pageNumber: 1
        };
    }
    
    static propTypes = {
        getPosts: PropTypes.func.isRequired,
        posts: PropTypes.object,
    };

    componentWillMount() {
        this.props.getPosts(this.state.pageNumber);
    }
    
    // componentWillReceiveProps(nextProps){
    //     // the first time receiving props
    //     if(!this.props.userLocation && nextProps.userLocation)
    //         this.props.getPosts(this.state.pageNumber)
        
    //     if (nextProps.userLocation && this.props.userLocation
    //     && nextProps.userLocation.lat !== this.props.userLocation.lat 
    //     && nextProps.userLocation.lng !== this.props.userLocation.lng) 
    //     {
    //         this.props.getPosts(this.state.pageNumber)
    //     }
    // }
    
    componentDidUpdate() {
      //ReactDOM.findDOMNode(this).scrollTop = 0;
      window.scrollTo(0, 0);
    }
    
    handlePrevious(){
        const minusOne = this.state.pageNumber - 1;
        this.setState({pageNumber: minusOne});
        this.props.getPosts(minusOne);
    }
    
    handleNext(){
        const plusOne = this.state.pageNumber + 1
        this.setState({pageNumber: plusOne});
        this.props.getPosts(plusOne)
    }
    
    renderPosts() {
        const posts = this.props.posts;
        const numberItemsByRow = 4; // 2, 3, 4, 6
        if (posts) {
            const listItems = posts.results.map( (post) => <PostCard key={post.id} value={post} /> )
            
            let newList = []
            
            var colSize = parseInt(12/numberItemsByRow);
            var sizeList = parseInt(listItems.length/numberItemsByRow);
            var remains = listItems.length - sizeList*numberItemsByRow;
            
            // presentation
            for (var i=0; i< sizeList; i++){
                    let subList = [];
                    for (var j=0; j< numberItemsByRow; j++){
                        subList.push(<Col key={j} sm={colSize} md={colSize}>{listItems[i*numberItemsByRow + j]}</Col>);
                    }
                    newList.push(<Row key={i} className="show-grid"> {subList} </Row>)
                }
            if(remains > 0){
                let remainList = []
                for(var i=sizeList*numberItemsByRow; i<listItems.length; i++){
                    remainList.push(<Col key={i} sm={colSize} md={colSize}>{listItems[i]}</Col>);
                }
                newList.push(<Row key={listItems.length} className="show-grid">{remainList}</Row>);
            }
            
            return newList;
        }
        
        return null;
    }
    
    renderPagination(){
        let pages = [];
        
        if (this.props.posts){
            if( this.props.posts.previous){
                pages.push(<Pager.Item key={1} previous onClick={()=> this.handlePrevious()}>&larr; Previous</Pager.Item>);
            }
            pages.push(<span key={2}> {this.state.pageNumber} </span>)
            if( this.props.posts.next){
                pages.push(<Pager.Item key={3} next onClick={()=> this.handleNext()}>Next &rarr;</Pager.Item>)
            }
        }
        if (pages)
            return <Pager> {pages} </Pager>;
    }

    render() {
        return ([
            <Grid key={1}>
            {this.renderPosts()}
            </Grid>,
            <div key={2}>
            {this.renderPagination()}
            </div>]
        );
    }
}

function mapStateToProps(state) {
    
    return {
        posts: state.post.posts,
    };
}

export default connect(mapStateToProps, { getPosts } )(Timeline);