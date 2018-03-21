import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export default class LogIn extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: JSON.parse(localStorage.getItem('user')),
			redirect: false,
			username: '',
		}
	}
	componentWillMount(){
		/*console.log(this.props.user)
		if(this.props.user){
			this.setState({user: this.props.user, redirect: true});
		}*/
	}

	render(){
		return(
			<div>
				<form onSubmit={this.handleSubmit.bind(this)}>
					<div>{this.state.isAuthenticated}</div>
					<label>User name: </label>
	    				<input  type='text' 
	    						id='userName'/>
	    			<label>Password: </label>
	    				<input  type='text' 
	    						id='password'/>
	    			<input
									type='submit'
									value='Post'/>
				</form>
				<Link to='/signup'>Forgot a password?</Link>
				{this.state.redirect ? <Redirect to={'/profile/' + this.state.user}/> : null})
			</div>
		)
	}

	handleSubmit(e){
		e.preventDefault();
		console.log(this.getFildsValue())
		axios.post('http://localhost:5000/api/login', this.getFildsValue())
			.then((res) => {
				console.log(res)
				if(!res.data.err && res.data.user) {
					localStorage.setItem('user', JSON.stringify(res.data.user))
					this.setState({user:res.data.user, redirect:true});
				}
			})
		console.log('hi');

	}

	getFildsValue(){
		return{
		userName:document.getElementById('userName').value,
		password:document.getElementById('password').value,
		}	
	}
}
