import React, { Component } from 'react';
import axios from 'axios';
import CommentList from '../../components/Chat/CommentList.jsx';
import CommentForm from '../../components/Chat/CommentForm.jsx';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken'




class CommentBox extends Component {
	constructor(props){
	super(props);
		this.state = {
			data:[],
			soket:{},

		}
	}
 
 //  loadComponentsFromServer(){
 // 	socket.on('message', date() => {
 // 		this.setState(date: date);
 // 	})
 // }
  createMess(user, mess){
   	return {
    	name: user.userName,
     	photo: user.photoUrl,
     	time: new Date,
     	text: mess.text,
     	_id: Math.random() * Date.now(),
 	}
 }
  handleCommentSubmit(data){
 	this.state.socket.emit('message', data);
 	const mess = this.createMess(jwt.decode(localStorage.getItem('jwt')), data);
 	this.setState({data: [mess]})
 }

 componentDidMount(){
 	//this.loadComponentsFromServer.bind(this)();
 	//setInterval(this.loadComponentsFromServer.bind(this), this.props.pollInterval)

	const socket = io.connect('http://localhost:5000');
	this.setState({})
	socket.emit('authenticate', {token: localStorage.getItem('jwt')})

	socket.on('messList', (data) => {
		console.log('new mess',data);
		this.setState({data: data, socket: socket});
	})
	socket.on('newToken', (data)=>{
		localStorage.setItem('jwt', data.token)
	})
	socket.on('disconnect', () =>{
	    console.log('disconnect');
	})
	socket.on('message', (data) => {
 		this.setState(data: data);
 	})
 }

 render() {
 	console.log('render',this.state.data)
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
