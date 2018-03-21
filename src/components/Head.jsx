import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';

export default class Head extends Component{
	constructor(props){
		super(props);
		this.state = {
			user: JSON.parse(localStorage.getItem('user')),
		}
	}

	render(){
		return(
			<div>
				<h1>head</h1>
				<h3>{this.state.user ? 'Hello ' + this.state.user  : null}</h3>
				<ul>

					<Route path='/signup' render={() => <li><Link to='/login'>Log in</Link></li>}/>
					{this.state.user ?
						<Route path='/profile' render={() => <li><Link to ='/login' onClick={this.handleLogOut}>Log out</Link></li>}/>
						:
						null
					}
				</ul>
			</div>
		)
	}
	handleLogOut(){
		localStorage.setItem('user', null)
		axios.get('http://localhost:5000/api/logout')
			.then((res) =>{
				localStorage.setItem('user', JSON.stringify(res.data.user))
			})
	}
}