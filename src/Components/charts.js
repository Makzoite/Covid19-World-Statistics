//Working on charts and graphs
//Under construction

import React, { PureComponent } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
    {date:"1/22/20", cases:555},
    {date:"1/23/20", cases:654},
    {date:"1/24/20", cases:941},
    {date:"1/25/20", cases:1434},
    {date:"1/26/20", cases:2118},
];
class Charts extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        var jsonData = {};
        var arrData=[];
        var objData = {};

    }

    render() {
        return (
            <LineChart
                width={900}
                height={300}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#8884d8" activeDot={{ r: 8 }} />
                {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
            </LineChart>
        );
    }
}

export default Charts;
