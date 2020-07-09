import React, { Component } from 'react'
import '../App.css';
import './CSS/bootstrapCustom.css';
import './CSS/covidAPI.css';
import BarChartAnimation from './barchartanimation';
// import VPLogo from '../resources/VP-Cover-Logo.png';
// import facebookLogo from '../resources/facebook.png';
// import twitterLogo from '../resources/twitter.png';
// import linkedinLogo from '../resources/linkedin.png';
// import youtubeLogo from '../resources/youtube.png';
// import instagramLogo from '../resources/instagram.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tabs, Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import COVID19 from './covidAPI';
import axios from 'axios';
import DataTable from './tableview';
import News from './news';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDataISO3: "",
            dataLoaded: false,
            isDataTable: false,
            dataDay: "today",
        };
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handleDaySelect = this.handleDaySelect.bind(this);
    }
    componentDidMount() {
        this.getGeoInfo();
    }
    //Get the location of the users country
    getGeoInfo = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            let data = response.data;
            this.setState({
                userDataISO3: data.country_code_iso3,
                dataLoaded: true
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                userDataISO3: "",
                dataLoaded: true
            });
        });
    };
    //On tab select
    handleTabSelect(key) {
        if (!this.state.isDataTable)
            if (key === "tableview")
                this.setState({
                    isDataTable: true
                });
    }
    handleDaySelect(key) {
        if (key !== this.state.dataDay) {
            this.setState({
                dataDay: key
            });
        }
    }
    render() {
        const {
            
            userDataISO3,
            dataLoaded,
            isDataTable,
            dataDay
        } = this.state;
        if (dataLoaded) {
            return (
                <div>
                    {/* <div className="background">
                        <Container fluid>
                            <Row style={{ alignItems: "center" }}>
                                <Col sm>
                                    <a className="logo-div" href={'https://viralprediction.com'}>
                                        <img className="logo" src={VPLogo} alt="logo" width="200" height="90" />
                                    </a>
                                </Col>
                                <Col sm style={{ marginBottom: "16px" }}>
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
                                </Col>
                            </Row>
                        </Container>
                    </div> */}
                    <Tabs defaultActiveKey="country" className="tab-fonts" style={{ backgroundColor: "#FEFDE6"}} id="uncontrolled-tab-example" transition={false} onSelect={this.handleTabSelect}>
                        <Tab eventKey="global" title="Global">
                            <COVID19></COVID19>
                        </Tab>
                        <Tab eventKey="country" title="By Country">
                            <COVID19 Country={userDataISO3}></COVID19>
                        </Tab>
                        <Tab eventKey="tableview" title="All Countries">
                            <Nav variant="pills" defaultActiveKey="recent" style={{ margin: "auto" }} onSelect={this.handleDaySelect}>
                                <div style={{ padding: "16px", margin: "auto" }}>
                                    <Nav.Item style={{ float: "left" }}>
                                        <Nav.Link eventKey="recent">Recent</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item style={{ float: "right" }}>
                                        <Nav.Link eventKey="yesterday">Yesterday</Nav.Link>
                                    </Nav.Item>
                                </div>
                            </Nav>
                            <DataTable isdatatable={isDataTable} day={dataDay}></DataTable>
                        </Tab>
                        <Tab eventKey="news" title="News">
                            <News></News>
                        </Tab>
                    </Tabs>
                </div>
            );
        }
        else {
            return (
                <div>
                    <div className="loader"></div>
                </div>
            );
        }
    }
}

export default MainPage;
