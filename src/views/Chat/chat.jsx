import React, { Component } from 'react';
import axios from 'axios';
import CommentList from '../../components/Chat/CommentList.jsx';
import CommentForm from '../../components/Chat/CommentForm.jsx';
import io from 'socket.io-client';




class CommentBox extends Component {
	constructor(props){
	super(props);
		this.state = {
			data:{},
		}
	}
 
  loadComponentsFromServer(){
 	/*axios.get(this.props.url)
 	   .then((res) => {
 	   	   this.setState({
 	   	   	   data: res.data,
 	   	   })
 	   })*/
 }
  handleCommentSubmit(data){
 	/*axios.post(this.props.url, data)
 		.then((res) => {
 			this.setState({data: res.data,})
 			console.log(res)
 		})
 		.catch((err) => console.error(err))*/
 }

 componentDidMount(){
 	//this.loadComponentsFromServer.bind(this)();
 	//setInterval(this.loadComponentsFromServer.bind(this), this.props.pollInterval)

	const socket = io.connect('http://localhost:5000');
	socket.emit('authenticate', {token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InRlc3R0ZXN0In0.wcr8jkEt7uPIQrWnzVA9eARUQt65DSGVUwPOEMwjIAo'})
 }

 render() {
 return (
 <div>
	 <h2>Comments:</h2>
	 <CommentList data={ this.state.data }/>
	 <CommentForm onCommentSubmit={ this.handleCommentSubmit.bind(this) } />
 </div>
 )
 }
}
export default CommentBox;
