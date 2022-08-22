import React, { useState } from "react";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Line } from "react-chartjs-2";
Chart.register(CategoryScale);
export const IotChart = (props) => {
    return (
        <div style={{ backgroundColor: '#ffffff' }} >
            <Line data={props.data} />
        </div >
    );
};