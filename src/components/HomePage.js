import React from 'react';
import '../styles/HomePage.css';


function HomePage() {
  return (
    <div className="HomePage">
      <div className="Frame2">
        <img className="Header" src="https://via.placeholder.com/361x411" alt="Header" />
        
        <div className="Frame1">
          <div className="SwipeAdoptLove">
            <span className="black-text">Connect. </span>
            <span className="highlighted-text">Match</span>
            <span className="black-text">. Wag!</span>
          </div>
          
          <button className="GetStartedButton">Get Started</button>
        </div>
      </div>

      <div className="Group7">
        <div className="PetPalsPromise">Pet Pals Promise</div>
        <div className="PawPrint2">
          <div className="G3023">
            <div className="Path3025"></div>
            <div className="Path3027"></div>
            <div className="Path3029"></div>
            <div className="Path3031"></div>
            <div className="Path3033"></div>
          </div>
        </div>
      </div>

      <div className="Frame28">
        <div className="Frame23">
          <img className="Owner1" src="https://via.placeholder.com/116x116" alt="Owner Profile" />
          <div className="SetYourProfile">SET YOUR PROFILE</div>
        </div>
        <div className="Frame24">
          <img className="PetShop1" src="https://via.placeholder.com/102x102" alt="Pet Shop" />
          <div className="MatchAndChat">MATCH AND CHAT</div>
        </div>
        <div className="Frame22">
          <img className="PetsAllowed1" src="https://via.placeholder.com/121x121" alt="Pets Allowed" />
          <div className="FindPlaceToWalking">FIND PLACE TO WALKING</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;