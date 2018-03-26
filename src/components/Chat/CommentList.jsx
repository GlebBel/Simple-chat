import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Comment from './Comment.jsx';

class CommentList extends Component {
	componentWillMount(){
		console.log(this.props.data)
	}

	componentDidUpdate(){
		ReactDOM.findDOMNode(this.list).scrollTop = 9999;
	}
 render() {
/*
 let commentNodes = this.props.data.map(comment => {
	 return (
		 <Comment author={ comment.author } key={ comment['_id'] }>
		 	{ comment.text}
		 </Comment>
		 )
		 })
		 return (
		 	
		 <div ref={(el) => this.list = el}>
		 { commentNodes }
		 </div>
		 )
	 }
	 */
	 return(
		 <Comment author={ 'gleb' } key={ 1234 }>
			 	{ 'hi'}
		 </Comment>
	 )
	}
}
export default CommentList;

