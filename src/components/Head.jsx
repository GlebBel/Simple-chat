import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';

export default class Head extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div>
				<h1>head</h1>
				<h3>{this.props.isAuthenticated ? 'Hello' : null}</h3>
				<ul>

					<Route path='/signup' render={() => <li><Link to='/login'>Log in</Link></li>}/>
					<Route path='/profile' render={() => <li><Link to ='/out'>Log out</Link></li>}/>
				</ul>
			</div>
		)
	}
}