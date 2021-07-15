import React, { Component } from "react";
import blank from '../blank.png'
import white from '../white.png'
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlayGame: false,
      cardsWon:[],
      shuffle:[],
      cardsDidFlip:[]
     
    };

    //Bind functions
  }

  render() {
    const chooseImage = (obj,cardId)=>{
      // console.log(window.location.origin+'./images/blank.png')
      // return window.location.origin+'/images/blank.png'
     if (this.state.cardsDidFlip.includes((cardId))){
      return `https://ipfs.infura.io/ipfs/${obj[1]}`
     }else if(this.state.cardsWon.includes((cardId))){
      return white
     }else return blank
      
      // cardId = cardId.toString()
      // if(this.state.cardsWon.includes(cardId)){
      //   return window.location.origin + '/images/white.png'
      // }else if (this.state.cardsChosenId.includes(cardId)){
      //   return CARD_ARRAY[cardId].img
      // }else {
      //   return window.location.origin+'/images/blank.png'
      // }
    }
    const flipImage = async(obj,id)=>{
      if (this.state.cardsWon.includes(id)){}
      else {
      await this.setState({
        cardsDidFlip:[... this.state.cardsDidFlip, id],
      })
      if (this.state.cardsDidFlip.length===2){
        console.log("this is cards di flip",this.state.cardsDidFlip[0])
        console.log("this is cards di flip",this.state.cardsDidFlip[1])
        console.log(this.state.shuffle[this.state.cardsDidFlip[0]][0]," ",this.state.shuffle[this.state.cardsDidFlip[1]][0])
        // this.state.shuffle[this.state.cardsDidFlip[0]][0]===this.state.shuffle[this.state.cardsDidFlip[1]][0]
       
        setTimeout(()=>{ 
          if(this.state.shuffle[this.state.cardsDidFlip[0]][0]===this.state.shuffle[this.state.cardsDidFlip[1]][0])
          {
            this.setState({
              cardsWon:[...this.state.cardsWon,...this.state.cardsDidFlip],
              
            })
            // event.preventDefault();
            this.props.completed1Image(this.state.shuffle[this.state.cardsDidFlip[0]][0]);
            console.log(this.state.cardsWon)
          }
          this.setState({
            cardsDidFlip:[],
            
          })
        }, 500);
        
      }
    }
      
      
      
    }
    
    function shuffle(newArray) {
      let array = [...newArray];
      var currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
    const get2ArrayShuffled=()=>{
      const array1 = this.props.images.filter(item => item.completed ==false);
      const children = array1.concat(array1);
      const array  = shuffle(children)
      console.log(array)
      this.setState({shuffle:array})

      return true;
    }
    const imageShuffer = (shuffledArray) => {
   
      return (
        <div
        className="col-md-4"
          style={{
            display: "flex",
            
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {shuffledArray ? (
            shuffledArray.map((obj, id) => {
              return (
                <img
                
                key ={id}
                  width="50"
                  height="50"
                  src={chooseImage(obj,id)}
                  data-id={id}
                  onClick={(event) => {
                  let cardId = event.target.getAttribute("data-id");
                  
                  flipImage(obj,id);
                  
                  }}
                />
              );
            })
          ) : (
            <span />
          )}
        </div>
      );
    };
    return (
      <div className="container-fluid text-monospace">
        <br></br>
        &nbsp;
        <br></br>
        <div
          className="column"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="col-md-3 overflow-auto text-center "
            style={{ maxHeight: "768px", minWidth: "200px" }}
          >
            <h5>
              <b>Image submit</b>
            </h5>
            <form
              onSubmit={(event) => {
                {
                  /* Upload Video...*/
                }
                event.preventDefault();
                this.props.uploadImage();
              }}
            >
              &nbsp;
              <input
                type="file"
                // accept=".png .jpeg .jpg"
                onChange={this.props.captureFile}
                style={{ width: "300px" }}
              />
              {/* Get Video...*/}
              <div className="form-group mr-sm-2"></div>
              {/* Button...*/}
              <button
                type="submit"
                className="btn btn-danger btn-block btn-sm "
              >
                Upload!
              </button>
              &nbsp;
            </form>
          </div>
          <div className="grid mb-4 row">
            {this.props.images ? (
              this.props.images.map((obj, id) => {
                
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      width="50"
                      height="50"
                      src={`https://ipfs.infura.io/ipfs/${obj[1]}`}
                      data-id={id}
                      // onClick={(event) => {
                      // let cardId = event.target.getAttribute("data-id");
                      // if (!this.state.cardsWon.includes(cardId.toString())) {
                      //   this.flipCard(cardId);
                      // }
                      // }}
                    />
                    <input
                      type="checkbox"
                      defaultChecked={obj[2]}
                      disabled={true}
                    />
                  </div>
                );
              })
            ) : (
              <span />
            )}
          </div>
          <button
            onClick={() =>
              {
                get2ArrayShuffled()
                this.setState({ isPlayGame: !this.state.isPlayGame })
              }
              
              
            }
            className="btn btn-danger btn-block btn-sm "
            style={{ width: 200, height: 40 }}
          >
            Begin a Game
          </button>
          <div
            
            style={{
              display: "flex",
              
              justifyContent: "center",
              alignItems: "center",
              
            }}
          >
            
            {this.state.isPlayGame === true ? imageShuffer(this.state.shuffle) : <span />}
           
          </div>
          <button
            onClick={() =>
              {
                this.setState({
                  cardsWon:[],
                  cardsDidFlip:[],
                  shuffle:[],
                  isPlayGame:false
                })
                this.props.startOver()
              }
              
              
            }
            className="btn btn-danger btn-block btn-sm "
            style={{ width: 200, height: 40 }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
