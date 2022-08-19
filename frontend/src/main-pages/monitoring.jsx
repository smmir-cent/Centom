import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';
import axios from 'axios';
import './loading.css';
import { fetchEventSource } from "@microsoft/fetch-event-source";

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
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    const [info, setInfo] = useState(initialInfo);
    const [data, setData] = useState('Initializing...')
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
        getOptions()
    }, []);
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
    useEffect(() => {
        // console.log('before EventSource')
        // const sse = new EventSource('http://localhost:5000/monitoring');
        // function handleStream(e) {
        //     console.log(e.data)
        //     setData(e.data)
        // }

        // sse.onmessage = e => { handleStream(e) }

        // // sse.onerror = e => {
        // //     //GOTCHA - can close stream and 'stall'
        // //     sse.close()
        // // }

        // // return () => {
        // //     sse.close()

        // // }

        // console.log("***********************")
        // console.log("***********************")
        // console.log("***********************")

        // const fetchData = async () => {
        //     await fetchEventSource('http://localhost:5000/monitoring', {
        //         method: "GET",
        //         headers: {
        //             Accept: "text/event-stream",
        //             Authorization: props.getToken()
        //         },
        //         params: {
        //             ip: selectedIP,
        //             network: selectedNet,
        //             name: info.oid_name,
        //             location: info.oid_location,
        //             description: info.oid_description
        //         },
        //         onopen(res) {
        //             if (res.ok && res.status === 200) {
        //                 console.log("Connection made ", res);
        //             } else if (
        //                 res.status >= 400 &&
        //                 res.status < 500 &&
        //                 res.status !== 429
        //             ) {
        //                 console.log("Client side error ", res);
        //             }
        //         },
        //         onmessage(event) {
        //             console.log(event.data);
        //             const parsedData = JSON.parse(event.data);
        //             setData((data) => [...data, parsedData]);
        //         },
        //         onclose() {
        //             console.log("Connection closed by the server");
        //         },
        //         onerror(err) {
        //             console.log("There was an error from server", err);
        //         },
        //     });
        // };
        // fetchData();














    }, [loading]);
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
        // axios({
        //     method: "GET",
        //     url: "/monitoring",
        //     headers: {
        //         Authorization: props.getToken()
        //     },
        //     params: {
        //         ip: selectedIP,
        //         network: selectedNet,
        //         name: info.oid_name,
        //         location: info.oid_location,
        //         description: info.oid_description
        //     }
        // }).then((response) => {
        //     setLoading(false)
        //     console.log(response.data.specs);
        //     setResult(response.data.specs)
        // })

        const fetchData = async () => {
            // console.log("***********************")
            // console.log("***********************")
            // console.log("***********************")
            await fetchEventSource('/monitoring', {
                method: "POST",
                headers: {
                    Accept: "text/event-stream",
                    Authorization: props.getToken()
                },
                body: JSON.stringify({
                    ip: selectedIP,
                    network: selectedNet,
                    name: info.oid_name,
                    location: info.oid_location,
                    description: info.oid_description
                }),
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        // console.log("name : ", res.name_res);
                        // console.log("location : ", res.location_res);
                        // console.log("desc : ", res.description_res);
                        // console.log("#########################################");
                        // console.log(res.data);
                        // // // let res_obj = JSON.parse(res.data);
                        // // console.log(typeof (res.data));

                        // console.log("#########################################");

                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Client side error ", res);
                    }
                },
                onmessage(event) {
                    console.log("#########################################");
                    // console.log(event.data);
                    const parsedData = JSON.parse(event.data);
                    console.log(parsedData)
                    if (parsedData.name_res !== undefined || parsedData.location_res !== undefined || parsedData.description_res !== undefined) {
                        setResult(parsedData)
                        console.log(parsedData.name_res);
                        console.log(parsedData.location_res);
                        console.log(parsedData.description_res);
                    }
                    console.log("#########################################");

                },
                onclose() {
                    console.log("Connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from server", err);
                }
            });
        };
        fetchData();
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

                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className="App">
        //     The last streamed item was: {data}
        // </div>
    );
};


Monitoring.propTypes = {

};


export default Monitoring;
