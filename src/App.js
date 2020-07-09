import React, { Component } from 'react';
import './App.css';
import MainPage from './Components/mainPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { Navbar, Nav, NavDropdown, FormControl, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VPLogo from './resources/VP-Cover-Logo.png';
import News from './Components/news';
import Footer from './Components/footer';
import facebookLogo from './resources/facebook.png';
import twitterLogo from './resources/twitter.png';
import linkedinLogo from './resources/linkedin.png';
import youtubeLogo from './resources/youtube.png';
import instagramLogo from './resources/instagram.png';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar expand="lg" style={{backgroundColor:"#FEFDE6"}}>
            <Navbar.Brand href="/">
              <img
                src={VPLogo}
                width="200"
                height="90"
                className="d-inline-block align-top"
                alt="Viral Prediction Logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
              <div className="social-icon">
                  <div style={{ float: "right", padding: "3px" }}>
                    <a href={'https://instagram.com/viralprediction'} target="_blank">
                      <img src={instagramLogo} alt="youtube" width="32" height="32" />
                    </a>
                  </div>
                  <div style={{ float: "right", padding: "3px" }}>
                    <a href={'https://www.youtube.com/channel/UCqcSqMbW-eJxhONJm7IL8BQ'} target="_blank">
                      <img src={youtubeLogo} alt="youtube" width="32" height="32" />
                    </a>
                  </div>
                  <div style={{ float: "right", padding: "3px" }}>
                    <a href={'https://linkedin.com/showcase/viralprediction'} target="_blank">
                      <img src={linkedinLogo} alt="linkedin" width="32" height="32" />
                    </a>
                  </div>
                  <div style={{ float: "right", padding: "3px" }}>
                    <a href={'https://twitter.com/viralprediction'} target="_blank">
                      <img src={twitterLogo} alt="twitter" width="32" height="32" />
                    </a>
                  </div>
                  <div style={{ float: "right", padding: "3px" }}>
                    <a href={'https://facebook.com/viralprediction'} target="_blank">
                      <img src={facebookLogo} alt="facebook" width="32" height="32" />
                    </a>
                  </div>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <MainPage />
            </Route>
          </Switch>
        </div>
        <Footer></Footer>
      </Router>
    );
  }
}

export default App;