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
						<Route path='/profile' render={() => <button onClick={this.handleLogOut}>Log out</button>}/>
						:
						null
					}
				</ul>
			</div>
		)
	}
	handleLogOut(){
		axios({
			method: 'get',
			url: 'http://localhost:5000/api/logout',
			headers:{'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))}}
			).then((res) => {
				console.log('ok');
			})
	}
}