import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import User from './User';

// Turn an object into query parameters
function serialize( obj ) {
  return '?'+Object.keys(obj).map((a,k) => k+'='+encodeURIComponent(obj[k]).join('&'))
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      favorite:null,
      set:false,
      filters:{
        name:'',
        hair:'',
        eye:''
      },
      users:[]
    }
    this.getFavorite();
  }
  componentDidMount(){
    this.getUsers();
  }
  getFavorite(){
    axios.get('/api/get').then(resp=>{
      this.setState({favorite:resp.data.favorite + ' is your favorite', set:!!resp.data.favorite})

    }).catch(err=>console.err);
  }
  setFavorite(fav){
    console.log(fav);
    axios.get('/api/set?favorite='+fav).then(resp=>{
      console.log(resp);
      this.setState({set:true});
      this.getFavorite()
    }).catch(err=>console.err);
  }
  getUsers(){
    // let filter = serialize(this.state.filters)
    let filter = '?'
    if (this.state.filters.name){
      filter+=`name=${this.state.filters.name}&`;
    }
    if (this.state.filters.eye){
      filter+=`eye=${this.state.filters.eye}&`;
    }
    if (this.state.filters.hair){
      filter+=`hair=${this.state.filters.hair}&`;
    }
    axios.get('/api/users' + filter).then(resp=>this.setState({users:resp.data}));
  }
  setFilter(filter, value){
    let filterObj = this.state.filters;
    filterObj[filter] = value;
    this.setState({filters:filterObj}, ()=>{
      this.getUsers();
    })
  }
  handleNameInput(name){
    let filterObj = Object.assign({},this.state.filters);
    filterObj.name = name;

    this.setState({filters:filterObj}, ()=>{
      this.getUsers();
    })


  }
  render() {

    let users = this.state.users.map(e=><User user={e}/>)

    return (
      <div className="App">
        <header className="App-header">
          <button onClick={()=>this.setFavorite('pizza')}>Set Favorite To pizza</button>
          <button onClick={()=>this.setFavorite('hamburger')}>Set Favorite To hamburger</button>
          <button onClick={()=>this.setFavorite('fries')}>Set Favorite To fries</button>
          <button onClick={()=>this.setFavorite('pasta')}>Set Favorite To pasta</button>
          <button onClick={()=>this.setFavorite('shakes')}>Set Favorite To shakes</button>
          <div>set: {this.state.set?"Set":"Unset"}</div>
          <div>favorite: {this.state.favorite}</div>
          <input type="text" onChange={(e)=>this.handleNameInput(e.target.value || '')}/>
          <select onChange={(e)=>this.setFilter('eye', e.target.value)}>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="green">Green</option>
          </select>

          <select onChange={(e)=>this.setFilter('hair', e.target.value)}>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="teal">Teal</option>
            <option value="blond">Blond</option>
            <option value="red">Red</option>
          </select>
        </header>
        <div className="App-intro">

          <div  style={{display:'flex', flexWrap:'wrap'}}>
          {users}
          </div>

        </div>
      </div>
    );
  }
}

export default App;
