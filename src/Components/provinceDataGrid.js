//This page is to show the grid of datas from the province of indivisual countries if there is any

import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../App.css';
import './CSS/covidAPI.css';

class ProvinceDataGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
            columnDefs: [],
            rowData: [],
            hasData: false,
            gridStyle: { width: "600px", padding: "16px", margin: "auto", fontWeight:"bold"},
            updatedDate: ""
        }
    }
    componentDidMount() {
        this.updateProvinceData(this.props);
        if (this.isMobile()) {
            this.setState({
                gridStyle:
                    { width: "370px", padding: "16px", margin: "auto", fontWeight:"bold" }
            });
        }
    }
    componentWillReceiveProps(newProps) {
        if (this.props.country !== newProps.country)
            this.updateProvinceData(newProps);
    }
    updateProvinceData(params) {
        this.setState({
            isDataLoaded: false,
            hasData: false,
        });
        fetch('https://corona.lmao.ninja/v2/jhucsse/')
            .then(res => res.json())
            .then(json => {
                const arrProvince = [];
                var countryName = params.country;
                if (params.country === "USA") {
                    countryName = "US";
                }
                if (params.country === "UK") {
                    countryName = "United Kingdom";
                }
                for (var i = 0; i < json.length; i++) {
                    if (json[i].country === countryName) {
                        arrProvince.push(json[i]);
                    }
                }
                if (arrProvince[0].province === null) {
                    return;
                }
                const tempColumnObj = [];
                const tempRowObj = [];
                const desiredFieldArr = ["provinces", "confirmed", "deaths", "recovered"];
                const desiredHeaderArr = ["Provinces", "Confirmed", "Deaths", "Recovered"];
                for (i = 0; i < desiredHeaderArr.length; i++) {
                    const columnObj = {};
                    columnObj["field"] = desiredFieldArr[i];
                    columnObj["headerName"] = desiredHeaderArr[i];
                    columnObj["width"] = 70;
                    columnObj["minWidth"] = 60;
                    columnObj["flex"] = 1;

                    if (desiredFieldArr[i] === "confirmed") {
                        columnObj["sort"] = "dsc";
                    }

                    columnObj["valueFormatter"] = NumberFormatter;
                    tempColumnObj[i] = columnObj;
                }

                for (var i = 0; i < arrProvince.length; i++) {
                    if (arrProvince[i].province !== "Recovered" && arrProvince[i].province !== "" && arrProvince[i].province !== null) {
                        if(arrProvince[i].stats["recovered"] === 0){
                            arrProvince[i].stats["recovered"] = "";
                        }
                        arrProvince[i].stats["provinces"] = arrProvince[i].province;
                        tempRowObj.push(arrProvince[i].stats);
                    }
                }
                this.setState({
                    columnDefs: tempColumnObj,
                    rowData: tempRowObj,
                    isDataLoaded: true,
                    hasData: true,
                    updatedDate: arrProvince[0].updatedAt
                });
            });
    }
    isMobile() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    render() {
        const {
            isDataLoaded,
            hasData,
            gridStyle,
            updatedDate
        } = this.state;
        if (isDataLoaded && hasData) {
            return (
                <div className="chart-margin">
                    <label className="topic-style">{this.props.country} Provinces</label>
                    <div className="updated-date" style={{ opacity: "0.6", color: "#9E9E9E" }}>Last Updated: {<br />}{updatedDate}</div>
                    <div className="ag-theme-balham province-data-grid" style={gridStyle}>
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            domLayout='autoHeight'
                            defaultColDef={{
                                editable: false,
                                sortable: true,
                                filter: false,
                                resizable: true,
                                cellClass: 'number-cell',
                            }}>
                        </AgGridReact>
                    </div>
                    <label style={{color:"red", fontSize:"12px"}}>*Some "Recovered" data may be not updated properly.</label>
                </div>
            );
        }
        else if (!hasData) {
            return (<div></div>);
        }
        else {
            return (
                <div className="loader">
                </div>
            );
        }
    }
}

export default ProvinceDataGrid;
function NumberFormatter(params) {
    if (typeof params.value === "number") {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else
        return params.value;
}