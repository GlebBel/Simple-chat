import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';


export default class Profile extends Component{
	constructor(props){
		super(props);
		this.setState =this.setState.bind(this)
		this.state = {
			photoUrl:this.props.photoUrl,
		}
	}

	componentDidMount(){
		console.log(this.props.owner,'props')
		if(document.getElementById("input")){
			document.getElementById("input").addEventListener("change", this.handleChangePhoto.bind(document.getElementById("input"), this.setState), false);
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
		    photoUrl: nextProps.photoUrl,
	    });
	    console.log(123, nextProps.photoUrl)
	}

	render(){
		console.log(this.state.photoUrl)
		return(
			<div>
				<img src={this.state.photoUrl}/>
				{this.props.owner ? <input type="file" id="input"/> : null}
			</div>
		)
	}

	handleChangePhoto(fn){
		console.log('hi1',this)
		let formData = new FormData();
		let fileList = this.files
		formData.append('photo', fileList[0]);
        axios({
        	method: 'POST',               
	        processData: false, // important
	        contentType: false, // important
	        data: formData,
	        url: 'http://localhost:5000/api/setPhoto',
	        dataType : 'json', 
    	}) 
			.then((res)=>{
				console.log('hi2',res.data)
				if(!res.data.err) fn({photoUrl: res.data})
			});
	}
}