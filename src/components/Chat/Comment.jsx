import React, { Component } from 'react'
import marked from 'marked'
class Comment extends Component {
	constructor(props){
		super(props);
	}
 	rawMarkup(){
		let rawMarkup = marked(this.props.children.toString());
		return { __html: rawMarkup };
		}
	render() {
		return (
			<div>
				<h3>{this.props.author}</h3>
				<span dangerouslySetInnerHTML={ this.rawMarkup() } />
			</div>
		)
	}
}
export default Comment;