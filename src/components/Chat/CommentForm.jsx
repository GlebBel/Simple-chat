import React, { Component } from 'react';

class CommentForm extends Component {
 constructor(props) {
 super(props);
 this.state = { author: '', text: '' };
 this.handleAuthorChange = this.handleAuthorChange.bind(this);
 this.handleTextChange = this.handleTextChange.bind(this);
 this.handleSubmit = this.handleSubmit.bind(this);
 }

 render() {
	 return (
		 <form  onSubmit={ this.handleSubmit }>
			 <input
				 type='text'
				 placeholder='Your name…'
				 value={ this.state.author }
				 onChange={ this.handleAuthorChange }/>
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

 handleAuthorChange(e) {
 	this.setState({ author: e.target.value });
 }

 handleTextChange(e) {
 	this.setState({ text: e.target.value });
 }

 handleSubmit(e) {
     e.preventDefault();
     const author = this.state.author.trim();
     const text = this.state.text.trim();
     if (!author || !text){
     	return;
     }
     //this.props.onCommentSubmit({author: author, text: text});
     this.setState({author: '', text: ''});
 }
}
export default CommentForm;