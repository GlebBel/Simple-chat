import React, { Component } from 'react';

class CommentForm extends Component {
 constructor(props) {
 super(props);
 this.state = { text: '' };
 this.handleTextChange = this.handleTextChange.bind(this);
 this.handleSubmit = this.handleSubmit.bind(this);
 }

 render() {
	 return (
		 <form  onSubmit={ this.handleSubmit }>
			 <input
				 type='text'
				 placeholder='Say something…'
				 value={ this.state.text }
				 onChange={ this.handleTextChange } />
			 <input
				 type='submit'
				 value='Post' />
		 </form>
	 )
 }
 

 handleTextChange(e) {
 	this.setState({ text: e.target.value });
 }

 handleSubmit(e) {
     e.preventDefault();
     const text = this.state.text.trim();
     if (!text){
     	return;
     }
     this.props.onCommentSubmit({ text: text });
     this.setState({ text: ''});
 }
}
export default CommentForm;