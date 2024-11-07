// src/components/HomePage.js
import React from 'react';
import '../styles/HomePage.css';


function HomePage() {
  return (
    <div className="HomePage">
      <div className="Frame2">
      <img className="Header" src={`${process.env.PUBLIC_URL}/image/header.jpg`} alt="Header" />
        <div className="Frame1">
          <div className="SwipeAdoptLove">
            <span className="black-text">Connect. </span>
            <span className="highlighted-text">Match</span>
            <span className="black-text">.Wag!</span>
          </div>
          <button className="GetStartedButton">Get Started</button>
        </div>
      </div>

      <div className="Group7">
        <div className="PetPalsPromise"> Pet Pal Promise</div>
        <div className="PawPrint2">
          <div className="G3023">
             <img src={`${process.env.PUBLIC_URL}/image/g3023.svg`} alt="Paw Print" />
          </div>
        </div>
      </div>

      <div className="Frame">
        <div className="Frame-mini">
          <img className="Owner1" src={`${process.env.PUBLIC_URL}/image/1.jpg`} alt="Owner Profile" />
          <div className="SetYourProfile">SET YOUR PROFILE</div>
        </div>
        <div className="Frame-mini">
          <img className="PetShop1" src={`${process.env.PUBLIC_URL}/image/2.jpg`} alt="Pet Shop" />
          <div className="MatchAndChat">MATCH AND CHAT</div>
        </div>
        <div className="Frame-mini">
          <img className="PetsAllowed1" src={`${process.env.PUBLIC_URL}/image/3.jpg`} alt="Pets Allowed" />
          <div className="FindPlaceToWalking">FIND PLACE TO WALKING</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
