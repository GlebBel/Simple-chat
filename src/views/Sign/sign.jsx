import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export default class Sing extends Component{
	constructor(props){
		super(props);
		this.state = {userName:'',
					  userNameIsOk:false,
					  password1:'', 
					  password2:'',
					  passIsOk:false,
					  errors:{
					  	shortName:false,
					  	engagedName:false,
					  	differentPass:false,
					  	shortPass:false,
					  },
					  redirect:false,
					}
	}


	render(){
		return(
			<div>
				<form onSubmit={this.handleSubmit.bind(this)}>
						<label>User name: </label>
    					<input  type='text' 
    							id='userName' 
		    					onChange={this.handleUNameChange.bind(this)} 
		    					value={this.state.userName}/>
		    					{this.state.errors.shortName ? 'The name has to have at least 6 symbols' : null}
		    					{this.state.errors.engagedName ? 'The name is engaged' : null}

    					<label>Password: </label>
    					<input  type='text'
    							id='password1'
    							onChange={this.handlePas1Change.bind(this)} 
		    					value={this.state.password1}/>
		    					{this.state.errors.shortPass ? 'The password has to have at least 6 symbols' : null}

    					<label>Password again: </label>
    					<input  type='text' 
    							id='password2'
    							onChange={this.handlePas2Change.bind(this)} 
		    					value={this.state.password2}/>
		    					{this.state.errors.differentPass ? 'The passwords are different' : null}

		    			<input
								type='submit'
								value='Post' />

				</form>
				{this.state.redirect === true ? <Redirect to='/login'/> : null}
			</div>
		)
	}

	handleUNameChange(e){
		if(e.target.value.length <= 12){
			this.setState({ userName: e.target.value });
			if(e.target.value.length >= 6){
				this.setState({errors:{shortName:false}});
				axios.post('http://localhost:5000/api/userExist', {data:e.target.value})
					.then((res) => {
							console.log('here', res)
							res.data.exist ? this.setState({errors:{engagedName:true}}) : this.setState({errors:{engagedName:false}})
						})
				console.log('More then 6 and lass then 12', e.target.value);

			}
			else if(e.target.value.length){
				this.setState({errors:{shortName:true}});
			}
			else{
				this.setState({errors:{shortName:false}});
			}
		}
	}

	handlePas1Change(e){
		if(e.target.value.length <= 12){
			this.setState({ password1: e.target.value });
			if(e.target.value.length >= 6){
				this.setState({errors:{shortPass:false}});
			}
			else if(e.target.value.length){
				this.setState({errors:{shortPass:true}})
			}
			else{
				this.setState({errors:{shortPass:false}});
			}
		}
	}

	handlePas2Change(e){
		if(e.target.value.length <= 12){
			this.setState({ password2: e.target.value });
			if(e.target.value && e.target.value !== this.state.password1){
				console.log('differentPass');
				this.setState({errors:{differentPass:true}});
			}
			else{
				this.setState({errors:{differentPass:false}});
			}
		}

	}

	handleSubmit(e){
		e.preventDefault();
		if(this.readyToSend()){
			console.log('send');
			let data={
				userName:this.state.userName,
				password:this.state.password1,
			}
			axios.post('http://localhost:5000/api/newUser', data)
				.then((res) => 	{if(!res.data.err) this.setState({redirect: true})})
				.catch((err) => console.error(err, 'hi'));
		}

	}

	readyToSend(){
		if(	 !this.state.errors.shortName &&
			 !this.state.errors.shortPass && 
			 !this.state.errors.differentPass && 
			 !this.state.errors.engagedName){
			return true;
		}
		else return false;
	}
}