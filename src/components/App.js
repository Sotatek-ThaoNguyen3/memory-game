import React, { Component } from 'react';
import Memory from '../abis/Memory.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account:'',
      memory:null,
      images:[],
      loading:true
      //set states
    }

    //Bind functions
  }
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadAccount()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadAccount(){
    
  }
  startOver = () => {
    // this.setState({ loading: true })
    this.state.memory.methods.startOver().send({from:this.state.account}).then(() => {
      // this.setState({ loading: false })
      this.loadBlockchainData()
    })
  }
  completed1Image = (id) => {
    // this.setState({ loading: true })
    this.state.memory.methods.complete1Image(id).send({from:this.state.account}).then(() => {
      // this.setState({ loading: false })
      this.loadBlockchainData()
    })
  }
  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts()
   
    //Add first account the the state
    this.setState({account: accounts[0]})
    // console.log(this.state.account)
    //Get network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Memory.networks[networkId]
   
    //Check if net data exists, then
    if (networkData){
      const memory = new web3.eth.Contract(Memory.abi,networkData.address)
      // console.log("this is contract memory:",memory)
      this.setState({memory})

      this.setState({images:[]})
      const images = await memory.methods.getImages().call({from: this.state.account})
      // console.log("this is image",images)
      this.setState({images})
      

      this.setState({loading:false})
    }else {
      window.alert('contract not deployed to detected network.')
    }
  }

  //Get video
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const render = new window.FileReader()
    render.readAsArrayBuffer(file)

    render.onloadend = () => {
      this.setState({buffer:Buffer(render.result)})
      console.log("buffer:",this.state.buffer)
    }
  }

  //Upload video
  uploadImage = () => {
    console.log("Submit video on IPFS...")
    this.setState({loading:true})

    //add to ipfs
    ipfs.add(this.state.buffer, async (error,result) => {
      console.log("IPFS result:",result)

      if (error) {
        console.error("error when add buffer",error)
      }

      this.state.memory.methods.uploadImage(result[0].hash).send({from:this.state.account}).then(() => {
        this.setState({ loading: false })
        this.loadBlockchainData()
      })
      
    })
  }

  //Change Video
  changeVideo = (hash, title) => {

  }

 

  render() {
    return (
      <div>
        <Navbar 
         
          account = {this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
              uploadImage = {this.uploadImage}
              captureFile = {this.captureFile}
              images = {this.state.images}
              completed1Image = {this.completed1Image}
              startOver = {this.startOver}
              // currentHash = {this.state.currentHash}
              // cureentTitle = {this.state.title}
            />
        }
      </div>
    );
  }
}

export default App;