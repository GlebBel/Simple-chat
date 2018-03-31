import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Comment from './Comment.jsx';

class CommentList extends Component {
	constructor(props) {
	 	super(props);
		this.state = {
			commentNodes:[]
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.data.length){
			//if(!this.state.commentNodes) this.setState({commentNodes: this.createCommentList(nextProps.data)})
			//else{
				//console.log(this.state.commentNodes, nextProps.data, 'cn');
				this.state.commentNodes.push(this.createCommentList(nextProps.data));
				this.setState({commentNodes: this.state.commentNodes});
				console.log('nprops',nextProps, this.props);
			//}
		}
	}

	componentWillMount(){

		//if(this.props) this.createComentList();

	}

	componentDidUpdate(){

		//ReactDOM.findDOMNode(this.list).scrollTop = 9999;
	}
 	render() {
		return(
			<div>
				{this.state.commentNodes} 
			</div>
		)
	}
	createCommentList(comments){
		let commentNodes = comments.map(comment => {
			return (
				<Comment author={ comment.name } key={ comment._id } text={comment.text} photoUrl={comment.photo}/>
				)
			})
		console.log(commentNodes,'cn')
		return commentNodes
	}
}

export default CommentList;

