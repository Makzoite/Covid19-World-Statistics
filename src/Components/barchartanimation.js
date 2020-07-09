//This page is to show the chart race of all the cases, recovered and deaths
//There is custom changes in npm package 'chart-race-react as well'
import React, { Component } from 'react'
import '../App.css';
import './CSS/covidAPI.css';
import BarChart from 'chart-race-react';
import Watermark from '../resources/Watermark.png';

class BarChartAnimation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Object,
            dates: [],
            flagDataLoaded: false,
            startAnimation: false,
            isNoDataFound: false,
            BarChartWidthArr: [15, 70, 15],
        };
        // This binding is necessary to make `this` work in the callback
        this.startAnimation = this.startAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.restartAnimation = this.restartAnimation.bind(this);

    }
    componentWillMount() {
        if (this.isMobile()) {
            this.setState({
                BarChartWidthArr: [20, 60, 20],
            });
        }
        if (this.props.chartSource === "SingleCountry") {
            this.updateCountryBarData(this.props.country);
        }
        else {
            fetch('https://corona.lmao.ninja/v2/historical/?lastdays=all')
                .then(res => res.json())
                .then(json => {
                    const titleCountries = {};
                    var i = 0;
                    var j = 0;
                    var k = 0;
                    if (this.props.chartSource === "TotalCases") {
                        for (i = 0; i < json.length; i++) {

                            if (!Object.keys(titleCountries).includes(json[i].country)) {
                                if (json[i].province === null) {
                                    titleCountries[json[i].country] = Object.values(json[i].timeline.cases);
                                }
                                else {
                                    const totalCountryCases = Object.values(json[0].timeline.cases);
                                    for (j = 1; j < json.length; j++) {
                                        {
                                            if (json[i].country === json[j].country) {
                                                const singleProvince = Object.values(json[j].timeline.cases);
                                                for (k = 0; k < singleProvince.length; k++) {
                                                    totalCountryCases[k] = totalCountryCases[k] + singleProvince[k];
                                                }
                                            }
                                        }
                                        titleCountries[json[i].country] = totalCountryCases;
                                    }
                                }
                            }
                        }
                        this.setState({
                            data: titleCountries,
                            dates: Object.keys(json[0].timeline.cases),
                            flagDataLoaded: true
                        })
                    }
                    else if (this.props.chartSource === "TotalDeaths") {
                        for (i = 0; i < json.length; i++) {
                            if (!Object.keys(titleCountries).includes(json[i].country)) {
                                if (json[i].province === null) {
                                    titleCountries[json[i].country] = Object.values(json[i].timeline.deaths);
                                }
                                else {
                                    const totalCountryDeaths = Object.values(json[0].timeline.deaths);
                                    for (j = 1; j < json.length; j++) {
                                        {
                                            if (json[i].country === json[j].country) {
                                                const singleProvince = Object.values(json[j].timeline.deaths);
                                                for (k = 0; k < singleProvince.length; k++) {
                                                    totalCountryDeaths[k] = totalCountryDeaths[k] + singleProvince[k];
                                                }
                                            }
                                        }
                                        titleCountries[json[i].country] = totalCountryDeaths;
                                    }
                                }
                            }
                        }
                        this.setState({
                            data: titleCountries,
                            dates: Object.keys(json[0].timeline.deaths),
                            flagDataLoaded: true
                        })
                    }
                    else if (this.props.chartSource === "TotalRecovered") {
                        for (i = 0; i < json.length; i++) {
                            if (!Object.keys(titleCountries).includes(json[i].country)) {
                                if (json[i].province === null) {
                                    titleCountries[json[i].country] = Object.values(json[i].timeline.recovered);
                                }
                                else {
                                    const totalCountryRecovered = Object.values(json[0].timeline.recovered);
                                    for (j = 1; j < json.length; j++) {
                                        {
                                            if (json[i].country === json[j].country) {
                                                const singleProvince = Object.values(json[j].timeline.recovered);
                                                for (k = 0; k < singleProvince.length; k++) {
                                                    totalCountryRecovered[k] = totalCountryRecovered[k] + singleProvince[k];
                                                }
                                            }
                                        }
                                        titleCountries[json[i].country] = totalCountryRecovered;
                                    }
                                }
                            }
                        }
                        this.setState({
                            data: titleCountries,
                            dates: Object.keys(json[0].timeline.recovered),
                            flagDataLoaded: true
                        })
                    }
                });
        }
    }
    updateCountryBarData(country) {
        fetch('https://corona.lmao.ninja/v2/historical/' + country + '?lastdays=all')
            .then(res => res.json())
            .then(json => {
                try {
                    const barTitle = {};
                    for (var i = 0; i < Object.keys(json.timeline).length; i++) {
                        barTitle[this.capitalizeFirstLetter(Object.keys(json.timeline)[i])] = Object.values(Object.values(json.timeline)[i]);
                    }
                    this.setState({
                        data: barTitle,
                        dates: Object.keys(Object.values(json.timeline)[0]),
                        flagDataLoaded: true,
                        startAnimation: false
                    });
                }
                catch{
                    this.setState({
                        flagDataLoaded: false,
                        isNoDataFound: true,
                    });
                }

            });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.chartSource === "SingleCountry" && newProps.country !== this.props.country) {
            this.setState({
                data: {},
                flagDataLoaded: false
            });
            this.updateCountryBarData(newProps.country);
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    startAnimation() {
        this.setState({
            startAnimation: true,
        });
    }
    stopAnimation() {
        this.setState({
            startAnimation: false,
        });
    }
    restartAnimation() {
        this.setState({
            startAnimation: "restart",
        });
    }
    getTrimmedStringTitle(title) {
        var maxLength = 15;
        if (this.isMobile()) {
            maxLength = 10;
        }
        var trimmedString = title;
        if (title.length >= maxLength) {

            //trim the string to the maximum length
            trimmedString = title.substr(0, maxLength - 2) + "..";

            //re-trim if we are in the middle of a word and 
            //trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
        }
        return trimmedString
    }
    isMobile() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    render() {
        const {
            data,
            dates,
            flagDataLoaded,
            startAnimation,
            isNoDataFound,
            BarChartWidthArr
        } = this.state;
        if (flagDataLoaded) {
            const randomColor = () => {
                return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255})`;
            }
            const keys = Object.keys(data);
            const len = data[Object.keys(data)[0]].length;
            const colors = keys.reduce((res, item) => ({
                ...res,
                ...{ [item]: randomColor() }
            }), {});
            const labels = keys.reduce((res, item, idx) => {
                return {
                    ...res,
                    ...{
                        [item]: (
                            <div style={{ textAlign: "left" }}>
                                <div className="title-font" title={item} >{this.getTrimmedStringTitle(item)}</div>
                            </div>
                        )
                    }
                }
            }, {});
            const time = dates;

            return (
                <div style={{ position: "relative" }}>
                    {this.props.chartSource === "SingleCountry"
                        ? <div></div>
                        : <div className="watermark">
                            <img src={Watermark} alt="logo" width="60%" height="60%" style={{ opacity: "0.2", position: "relative", left: "-50%", bottom: "-70%" }} />
                        </div>
                    }
                    <div>From <label style={{ fontWeight: "bold" }}>{time[0]}</label> To <label style={{ fontWeight: "bold" }}>{time[len - 1]}</label></div>
                    <div style={{ marginTop: "20px" }}>
                        <div className="chart-border" style={{ margin: "auto", paddingBottom: "25px", borderRadius: "12px" }}>
                            <BarChart
                                start={startAnimation}
                                data={data}
                                timeline={time}
                                labels={labels}
                                colors={colors}
                                len={len}
                                timeout={200}
                                delay={100}
                                timelineStyle={{
                                    textAlign: "center",
                                    fontSize: "30px",
                                    color: "rgb(148, 148, 148)",
                                    paddingBottom: "16px",
                                    paddingTop: "10px",
                                }}
                                textBoxStyle={{
                                    textAlign: "center",
                                    color: "rgb(133, 131, 131)",
                                }}
                                barStyle={{
                                    height: "30px",
                                    marginTop: "6px",
                                    borderRadius: "3px",
                                }}
                                width={BarChartWidthArr}
                                maxItems={15}
                            />
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <button onClick={this.startAnimation} className="button-style">
                                    Play
                    </button>
                                <button onClick={this.stopAnimation} className="button-style">
                                    Pause
                    </button>
                                <button onClick={this.restartAnimation} className="button-style">
                                    Restart
                    </button>
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
        if (!flagDataLoaded && isNoDataFound) {
            return (
                <div>No Data Available.</div>
            );

        }
        else {
            return (
                <div className="loader"></div>
            );
        }
    }
}
export default BarChartAnimation;