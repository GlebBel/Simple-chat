import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';


export default class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
			photoUrl:this.props.photoUrl,
		}
	}

	componentDidMount(){
		document.getElementById("input").addEventListener("change", this.handleChangePhoto, false);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
		    photoUrl: nextProps.photoUrl,
	    });
	    console.log(123, nextProps.photoUrl)
	}

	render(){
		return(
			<div>
				<img src={this.state.photoUrl}/>
				<input type="file" id="input"/>
			</div>
		)
	}

	handleChangePhoto(){
		let fileList = this.files
		console.log(fileList)
		axios.post('http://localhost:5000/api/setPhoto', fileList[0])
			.then((res)=>console.log(res));
	}
}