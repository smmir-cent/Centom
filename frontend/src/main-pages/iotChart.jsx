import React, { useState } from "react";
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Line } from "react-chartjs-2";
Chart.register(CategoryScale);
export const IotChart = () => {
    const [state, setstate] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "First dataset",
                data: [33, 53, 85, 41, 44, 65],
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            }

        ]
    });


    const buttonFunction = () => {
        console.log(JSON.stringify(state, null, 2));

        setstate(current => {
            return {
                ...current,
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "new"],
                datasets: [
                    {
                        label: "First dataset",
                        data: [50, 50, 50, 50, 50, 50, 60],
                        fill: true,
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderColor: "rgba(75,192,192,1)"
                    }
                ],
            };
        });

        console.log(JSON.stringify(state, null, 2));
    }
    return (
        <div style={{ backgroundColor: '#ffffff' }} >
            <p style={{ color: 'black' }}>
                {JSON.stringify(state, null, 2)}
            </p>

            <Line data={state} />
            <Line data={state} />
            < button onClick={buttonFunction} > click me</button >
        </div >
    );
};