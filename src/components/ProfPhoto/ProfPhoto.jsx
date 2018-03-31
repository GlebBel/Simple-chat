import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken'


export default class Profile extends Component{
	constructor(props){
		super(props);
		this.setState =this.setState.bind(this)
		this.state = {
			photoUrl:this.props.photoUrl,
		}
	}

	componentDidMount(){
		if(document.getElementById("input")){
			document.getElementById("input").addEventListener("change", this.handleChangePhoto.bind(document.getElementById("input"), this.setState), false);
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
		    photoUrl: nextProps.photoUrl,
	    });
	}

	render(){
		return(
			<div>
				<img src={this.state.photoUrl}/>
				{this.props.owner ? <input type="file" id="input"/> : null}
			</div>
		)
	}

	handleChangePhoto(fn){
		let formData = new FormData();
		let fileList = this.files
		formData.append('photo', fileList[0]);
        axios({
        	method: 'POST',               
	        processData: false, // important
	        contentType: false, // important
	        headers:{'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
	        data: formData,
	        url: 'http://localhost:5000/api/setPhoto',
	        dataType : 'json', 
    	}) 
			.then((res)=>{
				localStorage.setItem('jwt', res.data)
				if(!res.data.err) fn({photoUrl: jwt.decode(res.data).photoUrl})
			});
	}
}