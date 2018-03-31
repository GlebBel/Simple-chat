import React, { Component } from 'react'
import marked from 'marked'
class Comment extends Component {
	constructor(props){
		super(props);
	}
 	// rawMarkup(){
		// let rawMarkup = marked(this.props.children.toString());
		// return { __html: rawMarkup };
		// }
	render() {
		return (
			<div>
				<img src={this.props.photoUrl} width="30" height="50"/>
				<h3>{this.props.author}</h3>
				<div>{this.props.text}</div>
			</div>
		)
	}
}
export default Comment;