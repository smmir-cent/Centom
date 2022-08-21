import React, { domContainer, useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';
import axios from 'axios';
import './loading.css';
import { IotChart } from './iotChart';

const Monitoring = (props) => {
    let initialInfo = {
        username: "",
        password: "",
        engineId: "",
        oid_name: "",
        oid_location: "",
        oid_description: ""
    };
    let initialSpecs = {
        name_res: "",
        location_res: "",
        description_res: ""
    };
    const [networks, setNetworks] = useState([]);
    const [ips, setIps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(initialSpecs);
    const [paramsList, setParamsList] = useState([]);
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    const [info, setInfo] = useState(initialInfo);
    const handleNetChange = event => {

        let req_net = event.target.selectedOptions[0].value
        if (req_net.length === 0) {
            alert('choose a network')
            setSelectedNet('');
            setSelectedIP('');
            setIps([]);
            setInfo(initialInfo);
        } else {
            setSelectedNet(req_net);
        }
    };
    const handleIpChange = event => {

        let req_ip = event.target.selectedOptions[0].value
        if (req_ip.length === 0) {
            alert('choose a ip');
            setSelectedIP('');
            setInfo(initialInfo);

        } else {
            setSelectedIP(req_ip);
        }
    };
    function createSelectIps() {
        let items = [];
        for (let i = 0; i < ips.length; i++) {
            items.push(<option key={i} value={ips[i]}>{ips[i]}</option>);
        }
        return items;
    }
    useEffect(() => {
        async function getOptions() {
            await axios({
                method: "GET",
                url: "/get-networks",
                headers: {
                    Authorization: props.getToken()
                }
            }).then((response) => {
                setNetworks(response.data['networks'])
            })
        }

        if (loading) {

            let url = 'http://localhost:5000/monitoring?'
            url = url.concat("ip=").concat(selectedIP).concat('&')
            url = url.concat("network=").concat(selectedNet).concat('&')
            url = url.concat("name=").concat(info.oid_name).concat('&')
            url = url.concat("location=").concat(info.oid_location).concat('&')
            url = url.concat("description=").concat(info.oid_description)
            const sse = new EventSource(url)

            function handleStream(e) {
                //processing data
                const recieved_data = JSON.parse(e.data)
                console.log(recieved_data)
                if (recieved_data['name_res'] && recieved_data['location_res'] && recieved_data['description_res']) {
                    setResult(recieved_data);
                }
                else if (recieved_data['params']) {
                    setParamsList(recieved_data['params']);
                    console.log(paramsList)
                }
                // setData(e.data)
            }

            sse.onmessage = e => { handleStream(e) }
        }


        if (networks.length === 0) {
            console.log("***********************")
            getOptions();
            console.log("/***********************")
        }
    });
    useEffect(() => {
        console.log(selectedNet);
        if (selectedNet.length !== 0) {
            axios({
                method: "GET",
                url: "/get-ips",
                headers: {
                    Authorization: props.getToken()
                },
                params: {
                    subnet: selectedNet
                }
            }).then((response) => {
                console.log(response.data.ips);
                setIps(response.data.ips)
            })

        }
    }, [selectedNet]);

    function fetchConfig() {
        axios({
            method: "POST",
            url: "/fetch-config",
            headers: {
                Authorization: props.getToken()
            },
            data: {
                ip: selectedIP,
                network: selectedNet
            }
        }).then((response) => {
            // setLoading(false)
            const res = response.data
            setInfo(res.message)
            console.log(res.message)
            // setResult(res.message)
        }).catch((error) => {
            if (error.response) {
                // setResult(error.response.data.message)
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })

    }
    function monitorButton() {
        setLoading(true)
    }

    return (
        <div>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <div id="regForm">

                            <h1 style={{ color: "black" }} id="register">Monitoring</h1>

                            <h4 style={{ color: "black" }}>Saved Network</h4>
                            <label style={{ color: "black" }}>Networks: </label>
                            <select value={selectedNet} id="" className=" form-select" onChange={handleNetChange} >
                                <option value="">Choose a Network</option>
                                {
                                    networks.map((item, i) =>
                                        <option key={i} value={item.name}>{item.name}</option>
                                    )}
                            </select>

                            {
                                ips.length !== 0 ? (
                                    <div>
                                        <label style={{ color: "black" }}>IPs: </label>
                                        <select value={selectedIP} id="" className=" form-select" onChange={handleIpChange} >
                                            <option value="">Choose a IP</option>
                                            {createSelectIps()}
                                        </select>
                                    </div>) : null
                            }
                            <br />
                            {selectedIP !== '' ? (
                                <div style={{ overflow: "auto" }} id="nextprevious">
                                    <div style={{ float: "right" }}>
                                        <button onClick={fetchConfig} type="submit" className="btn btn-success">Fetch Config</button>
                                    </div>
                                </div>) : null
                            }
                            {
                                info.username !== "" ? (
                                    <div>
                                        <div className="row mt-2">
                                            <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Username</label><input readOnly value={info.username} name="username" type="text"
                                                className="form-control" placeholder="username" /></div>
                                            <div className="col-md-6"><label style={{ color: "black", fontSize: 15 }} className="labels">Password</label><input readOnly value={info.password} name="password" type="text"
                                                className="form-control" placeholder="password" /></div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-12"><label style={{ color: "black", fontSize: 15 }} className="labels">Engine ID</label><input readOnly value={info.engineId} name="engineId" type="text"
                                                className="form-control" placeholder="enginID" /></div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Name</label><input readOnly value={info.oid_name} name="oid_name" type="text"
                                                className="form-control" placeholder="oid name" /></div>
                                            <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Location</label><input readOnly value={info.oid_location} name="oid_location" type="text"
                                                className="form-control" placeholder="oid location" /></div>
                                            <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Description</label><input readOnly value={info.oid_description} name="oid_description" type="text"
                                                className="form-control" placeholder="oid description" /></div>
                                        </div>
                                    </div>) : null
                            }
                            <br />
                            {info.username !== "" ? (
                                <div style={{ overflow: "auto" }} id="nextprevious">
                                    <div style={{ float: "right" }}>
                                        <button onClick={monitorButton} type="submit" className="btn btn-success">Monitoring</button>
                                    </div>
                                </div>

                            ) : null
                            }
                            {result.name_res !== "" ? (
                                <div className="row mt-2">
                                    <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Name</label><input readOnly value={result.name_res} name="oid_name" type="text"
                                        className="form-control" placeholder="oid name" /></div>
                                    <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Location</label><input readOnly value={result.location_res} name="oid_location" type="text"
                                        className="form-control" placeholder="oid location" /></div>
                                    <div className="col-md-4"><label style={{ color: "black", fontSize: 15 }} className="labels">Description</label><input readOnly value={result.description_res} name="oid_description" type="text"
                                        className="form-control" placeholder="oid description" /></div>
                                </div>

                            ) : null}
                            {
                                paramsList.length !== 0 ?
                                    // <LineChart></LineChart> : null
                                    // <ApexChart /> : null
                                    // ReactDOM.render(React.createElement(ApexChart), domContainer) : null
                                    // <Line data={data_} /> : null
                                    // <Line data={data_} options={options_} /> : null
                                    <IotChart /> : null

                                // null : null
                            }

                            {/* {
                                paramsList.length !== 0 ?
                                    (

                                        paramsList.map((param) => (
                                            // <ResponsiveContainer width="100%" height={200}>
                                            //     <LineChart
                                            //         width={500}
                                            //         height={200}
                                            //         data={data_}
                                            //         margin={{
                                            //             top: 10,
                                            //             right: 30,
                                            //             left: 0,
                                            //             bottom: 0,
                                            //         }}
                                            //     >
                                            //         <CartesianGrid strokeDasharray="3 3" />
                                            //         <XAxis dataKey="name" />
                                            //         <YAxis />
                                            //         <Tooltip />
                                            //         <Line connectNulls type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                            //     </LineChart>
                                            // </ResponsiveContainer>
                                            <div style={{ width: 500 }}>
                                                <Line data={config.data} options={config.options} />
                                            </div>
                                        )
                                        )
                                    )
                                    : null
                            } */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};


Monitoring.propTypes = {

};


export default Monitoring;