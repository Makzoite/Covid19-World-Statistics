//This page is used to populate data of all the countries in the grid

import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../App.css';
import './CSS/tableview.css';
import GlobeImage from "../resources/globe.png";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
            columnDefs: [],
            rowData: [],
            frameworkComponents: {},
            pinnedTopRowData: []
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.isdatatable) {
            this.setState({
                isDataLoaded: false
            });
            var newArr = {};
            var url1 = "https://corona.lmao.ninja/v2/all";
            var url = 'https://corona.lmao.ninja/v2/countries';
            if (newProps.day === "yesterday") {
                url1 = "https://corona.lmao.ninja/v2/all?yesterday=1";
                url = 'https://corona.lmao.ninja/v2/countries?yesterday=1';
            }
            //Data is grabbed twice to get total data of all countries and indivisual data of countries.
            Promise.all([
                fetch(url1).then(res => res.json()),
                fetch(url).then(res => res.json())
            ])
                .then((value) => {
                    const json1 = value[0];
                    const json = value[1];
                    newArr = json1;
                    newArr["flag"] = GlobeImage;
                    newArr["country"] = "Global Total";

                    const desiredFieldArr = ["flag", "country", "cases", "todayCases", "deaths", "todayDeaths", "recovered", "active", "critical", "casesPerOneMillion", "deathsPerOneMillion", "tests", "testsPerOneMillion"];
                    const desiredHeaderArr = ["Flag", "Country", "Cases", "New Cases", "Deaths", "New Deaths", "Recovered", "Active", "Critical", "Cases / 1M Pop.", "Deaths / 1M Pop.", "Tests", "Test / 1M Pop."];
                    const tempColumnObj = [];
                    var i = 0;
                    for (i = 0; i < desiredHeaderArr.length; i++) {
                        const columnObj = {};
                        columnObj["field"] = desiredFieldArr[i];
                        columnObj["headerName"] = desiredHeaderArr[i];
                        if (desiredFieldArr[i] === "flag") {
                            columnObj["width"] = 50;
                            columnObj["minWidth"] = 50;
                            columnObj["cellRenderer"] = "iconRenderer";
                            columnObj["sortable"] = false;
                            columnObj["pinned"] = "left";
                        }
                        else {
                            columnObj["width"] = 80;
                            columnObj["minWidth"] = 80;
                            columnObj["flex"] = 1;
                        }
                        if (desiredFieldArr[i] === "cases") {
                            columnObj["sort"] = "dsc";
                        }
                        if (desiredFieldArr[i] === "country") {
                            columnObj["width"] = 110;
                            columnObj["flex"] = 0;
                            columnObj["cellStyle"] = StyeCell;
                            columnObj["filter"] = true;
                        }
                        if (desiredFieldArr[i] === "todayCases" || desiredFieldArr[i] === "todayDeaths") {
                            columnObj["cellStyle"] = StyeCellNewCasesDeaths;
                        }
                        columnObj["valueFormatter"] = NumberFormatter;
                        tempColumnObj[i] = columnObj;
                    }
                    const tempRowObj = [];
                    for (i = 0; i < json.length; i++) {
                        const rowObj = {};
                        for (var j = 0; j < desiredFieldArr.length; j++) {
                            if (desiredFieldArr[j] === "flag") {
                                rowObj[desiredFieldArr[j]] = json[i].countryInfo[desiredFieldArr[j]];
                            }
                            else {
                                if (desiredFieldArr[j] === "todayCases" || desiredFieldArr[j] === "todayDeaths") {
                                    if (json[i][desiredFieldArr[j]] == 0) {
                                        rowObj[desiredFieldArr[j]] = "";
                                    }
                                    else {
                                        rowObj[desiredFieldArr[j]] = json[i][desiredFieldArr[j]];
                                    }
                                }
                                else {
                                    rowObj[desiredFieldArr[j]] = json[i][desiredFieldArr[j]];
                                }
                            }
                        }
                        tempRowObj[i] = rowObj
                    }
                    this.setState({
                        pinnedTopRowData: createData(newArr),
                        columnDefs: tempColumnObj,
                        rowData: tempRowObj,
                        isDataLoaded: true,
                        frameworkComponents: {
                            iconRenderer: IconRenderer,
                        },
                    });

                }).catch((err) => {
                    console.log(err);
                });
        }
    }
    render() {
        const {
            isDataLoaded
        } = this.state;
        if (isDataLoaded) {
            return (
                <div>
                    <label className="scroll-message"> ---- scroll right to view more ----></label>
                    <div id="gridView" className="ag-theme-balham all-countries-data-table" style={{ fontWeight: "bold" }}>
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            domLayout='autoHeight'
                            frameworkComponents={this.state.frameworkComponents}
                            pinnedTopRowData={this.state.pinnedTopRowData}
                            defaultColDef={{
                                editable: false,
                                sortable: true,
                                filter: false,
                                resizable: true,
                                cellClass: 'number-cell',
                            }}>
                        </AgGridReact>
                    </div>
                    <label className="scroll-message"> ---- scroll right to view more ----></label>
                </div>
            );
        }
        else {
            return (
                <div className="loader">
                </div>
            );
        }
    }
}

export default DataTable;

function NumberFormatter(params) {
    if (typeof params.value === "number") {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else
        return params.value;
}
//Rendering icon image in the table cell
function IconRenderer(params) {
    return (
        <span>
            <img className="global-box-shadow" src={params.value} width="32px" height="18px"></img>
        </span>
    );
}
//Different style for the data which is not country.
function StyeCell(params) {
    if (params.value != undefined && params.value.trimEnd() === "Diamond Princess") {
        var objStyle = {};
        objStyle["font-style"] = "italic";
        objStyle["color"] = "#207BDF";
        return objStyle;
    }
}
//Style for new cases in the table cell
function StyeCellNewCasesDeaths(params) {
    if (params.value != "" && params.value > 0) {
        var objStyle = {};
        objStyle["background-color"] = params.column.colId === "todayDeaths" ? "#F85A52" : "#D9CC2D";
        return objStyle;
    }
}
function createData(arrData) {
    var result = [];
    result[0] = arrData;
    return result;
}