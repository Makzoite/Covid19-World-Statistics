//This file deals with all the consumption of covid-19 data from NOVELCovid/API

import React, { Component, Input } from 'react'
import '../App.css';
import './CSS/covidAPI.css';
import BarChartAnimation from './barchartanimation';
import VPLogo from '../resources/VP-Cover-Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ProvinceDataGrid from './provinceDataGrid';
import Charts from './charts';

class COVID19 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TotalCases: 0,
            Recovered: 0,
            Deaths: 0,
            Active: 0,
            updatedDate: "",
            flagDataLoaded: false,
            countryName: "",
            countryISO3: this.props.Country,
            countryFlag: "",
            countries: {},
            selectedOption: {},
            todayCases:0,
            todayDeaths:0,
            critical:0
        };
        this.countryChange = this.countryChange.bind(this);
    }
    componentDidMount() {
        if (this.state.countryISO3 != null) {
            fetch('https://corona.lmao.ninja/v2/countries')
                .then(res => res.json())
                .then(json => {

                    const tempObj = [];
                    json.sort(function (a, b) {
                        var textA = a.country.toUpperCase();
                        var textB = b.country.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    for (var i = 0; i < json.length; i++) {
                        const countriesObj = {};
                        countriesObj["value"] = json[i].countryInfo.iso3;
                        countriesObj["label"] = json[i].country;
                        tempObj[i] = countriesObj;
                    }
                    this.setState({
                        countries: tempObj,
                    })
                });
            this.fetchAndBindDataForCountry(this.state.countryISO3);
        }
        else {
            //Get covid data from all around the globe
            fetch('https://corona.lmao.ninja/v2/all')
                .then(res => res.json())
                .then(json => {
                    var dateUpdated = new Date(json.updated);
                    this.setState({
                        TotalCases: json.cases,
                        Recovered: json.recovered,
                        Deaths: json.deaths,
                        Active: json.active,
                        updatedDate: dateUpdated.toUTCString(),
                        flagDataLoaded: true,
                        todayCases: json.todayCases,
                        todayDeaths:json.todayDeaths,
                        critical:json.critical
                    })
                });
        }
    }
    //Get data for specific country
    fetchAndBindDataForCountry(Country) {
        fetch('https://corona.lmao.ninja/v2/countries/' + Country)
            .then(res => res.json())
            .then(json => {
                const tempObj = [];
                const countriesObj = {};
                countriesObj["value"] = json.countryInfo.iso3;
                countriesObj["label"] = json.country;
                tempObj.push(countriesObj);
                var dateUpdated = new Date(json.updated);
                this.setState({
                    TotalCases: json.cases,
                    Recovered: json.recovered,
                    Deaths: json.deaths,
                    Active: json.active,
                    updatedDate: dateUpdated.toUTCString(),
                    countryFlag: json.countryInfo.flag,
                    countryName: json.country,
                    flagDataLoaded: true,
                    selectedOption: tempObj,
                    todayCases: json.todayCases,
                    todayDeaths:json.todayDeaths,
                    critical:json.critical
                })
            });
    }
    returnNumberWithComma(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    //on country change from the drop down
    countryChange = selectedOption => {
        this.setState(
            {
                countryISO3: selectedOption.label,
                selectedOption
            });
        if (selectedOption.value === null) {
            this.fetchAndBindDataForCountry(selectedOption.label);
        }
        else {
            this.fetchAndBindDataForCountry(selectedOption.value);
        }
    };
    render() {
        const {
            TotalCases,
            Recovered,
            Deaths,
            Active,
            updatedDate,
            flagDataLoaded,
            countryName,
            countryFlag,
            countries,
            countryISO3,
            selectedOption,
            todayCases,
            todayDeaths,
            critical
        } = this.state;
        if (flagDataLoaded) {
            return (
                <div>
                    <div style={{ textAlign: "center", fontFamily: "Interstate" }}>
                        {countryISO3 != null
                            ? <div style={{ margin: "20px auto", width: "300px" }}>
                                {/* <label style={{paddingRight:"10px"}}>Select Country:</label> */}
                                <Select
                                    value={selectedOption}
                                    placeholder="Select Country"
                                    onChange={this.countryChange}
                                    options={countries}
                                />
                            </div>
                            : <div></div>
                        }
                        <div style={{ margin: "20px 40px 20px 40px" }}>
                            <div className="heading-topic">Coronavirus COVID-19 Global Pandemic</div>
                            <Container>
                                <Row>
                                    <Col></Col>
                                    <Col xs={4}>
                                        <div className="horizontal-line"></div>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Container>
                            <div className="updated-date" style={{ opacity: "0.6", color: "#9E9E9E" }}>Last Updated: {<br />}{updatedDate}</div>
                        </div>
                        {countryISO3 == null
                            ? <div></div>
                            : <div>
                                <div className="flag-container">
                                    <img className="flag" src={countryFlag} alt="Oops! Flag not found" />
                                </div>
                                <label style={{ fontWeight: "bold", fontSize: "20px", padding: "12px" }}>{countryName}</label>
                            </div>
                        }

                        <div>
                            <Container>
                                <Row className="row-padding">
                                    <Col sm className="counter-box">
                                        <div className="topic-style" style={{ color: "#9E9E9E" }}>Total Cases:</div>
                                        <div className="horizontal-line"></div>
                                        <div className="topic-style-count" style={{ color: "#9E9E9E" }}>{this.returnNumberWithComma(TotalCases)}</div>
                                        <div className="horizontal-line"></div>
                                        <div style={{color: "#9E9E9E",fontWeight:"bold"}}>+{this.returnNumberWithComma(todayCases)} (Today)</div>
                                    </Col>
                                    <Col sm className="counter-box">
                                        <div className="topic-style" style={{ color: "#EC0000" }}>Total Deaths:</div>
                                        <div className="horizontal-line"></div>
                                        <div className="topic-style-count" style={{ color: "#EC0000" }}>{this.returnNumberWithComma(Deaths)}</div>
                                        <div className="horizontal-line"></div>
                                        <div style={{color: "#EC0000", fontWeight:"bold"}}>+{this.returnNumberWithComma(todayDeaths)} (Today)</div>
                                    </Col>
                                    <Col sm className="counter-box">
                                        <div className="topic-style" style={{ color: "#2B9225" }}>Total Recovered:</div>
                                        <div className="horizontal-line"></div>
                                        <div className="topic-style-count" style={{ color: "#2B9225" }}>{this.returnNumberWithComma(Recovered)}</div>
                                    </Col>
                                    <Col sm className="counter-box">
                                        <div className="topic-style" style={{ color: "#FB7D00" }}>Active Cases:</div>
                                        <div className="horizontal-line"></div>
                                        <div className="topic-style-count" style={{ color: "#FB7D00" }}>{this.returnNumberWithComma(Active)}</div>
                                        <div className="horizontal-line"></div>
                                        <div style={{color: "#FB7D00", fontWeight:"bold"}}>{this.returnNumberWithComma(critical)} Critical</div>
                                    </Col>
                                </Row>

                            </Container>
                        </div>
                        {/* <Charts></Charts> */}
                        {countryISO3 != null
                            ? <div>
                                <ProvinceDataGrid country={countryName}></ProvinceDataGrid>
                            </div>
                            : <div></div>
                        }
                        {countryISO3 != null
                            ? <div>
                                <div className="chart-margin">
                                    <label className="topic-style">{countryName} Cases Animation Chart</label>
                                    <div>
                                        <BarChartAnimation chartSource="SingleCountry" country={countryName}></BarChartAnimation>
                                    </div>
                                </div>
                            </div>
                            : <div>
                                <div className="chart-margin">
                                    <label className="topic-style">Total Cases Animation Chart</label>
                                    <div>
                                        <BarChartAnimation chartSource="TotalCases"></BarChartAnimation>
                                    </div>
                                </div>
                                <div className="chart-margin">
                                    <label className="topic-style">Total Deaths Animation Chart</label>
                                    <BarChartAnimation className="bar-chart" chartSource="TotalDeaths"></BarChartAnimation>
                                </div>
                                <div className="chart-margin">
                                    <label className="topic-style">Total Recovered Animation Chart</label>
                                    <BarChartAnimation chartSource="TotalRecovered"></BarChartAnimation>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="loader"></div>
            );
        }
    }
}

export default COVID19;