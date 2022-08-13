import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bulma.min.css';
import './quick-scan.css';
import '../profile-pages/profile.css';
import './loading.css';

const NetConfig = (props) => {
    const [networks, setNetworks] = useState([])
    const [ips, setIps] = useState([])
    const [selectedNet, setSelectedNet] = useState('');
    const [selectedIP, setSelectedIP] = useState('');
    // const availableState = data.countries.find((c) => c.name === selectedCountry);
    const [config, setConfig] = useState([{
        ip: "",
        network: "",
        username: "",
        password: "",
        engineId: "",
    }])
    function handleChange(event) {
        const { value, name } = event.target
        setConfig(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }
    useEffect(() => {
        getOptions()
        // console.log(networks)
    }, []);
    let handleSubmit = (event) => {
        event.preventDefault();
    }
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
    const handleNetChange = event => {

        let req_net = event.target.selectedOptions[0].value
        if (req_net.length === 0) {
            alert('choose a network')
            setSelectedNet('');
        } else {
            setSelectedNet(req_net);

        }
    };
    const handleIpChange = event => {

        let req_ip = event.target.selectedOptions[0].value
        if (req_ip.length === 0) {
            alert('choose a network')
            setSelectedIP('');
        } else {
            setSelectedIP(req_ip);

        }
    };
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
        console.log(selectedNet);
        if (selectedNet.length !== 0) {
            axios({
                method: "GET",
                url: "/get-ip-info",
                headers: {
                    Authorization: props.getToken()
                },
                params: {
                    ip: selectedIP
                }
            }).then((response) => {
                console.log(response.data);
            })

        }
    }, [selectedNet]);



    function createSelectIps() {
        let items = [];
        for (let i = 0; i < ips.length; i++) {
            items.push(<option key={i} value={ips[i]}>{ips[i]}</option>);
        }
        return items;

    }
    return (
        <div>
            <div className="container mt-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit} id="regForm">
                            <h1 style={{ color: "black" }} id="register">Network Configuration</h1>

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
                                        <select value={selectedNet} id="" className=" form-select" onChange={handleIpChange} >
                                            <option value="">Choose a IP</option>
                                            {createSelectIps()}
                                        </select>
                                    </div>) : null
                            }




                            <div className="row mt-2">
                                <div className="col-md-6"><label style={{ color: "black" }} className="labels">IP</label><input onChange={handleChange} type="text"
                                    className="form-control" readOnly placeholder="IP" value={config.ip} /></div>
                                <div className="col-md-6"><label style={{ color: "black" }} className="labels">Network</label><input onChange={handleChange} type="text"
                                    className="form-control" value={config.network} readOnly placeholder="network" /></div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"><label style={{ color: "black" }} className="labels">Username</label><input onChange={handleChange} type="text"
                                    className="form-control" placeholder="username" value={config.ip} /></div>
                                <div className="col-md-6"><label style={{ color: "black" }} className="labels">Password</label><input onChange={handleChange} type="text"
                                    className="form-control" value={config.network} placeholder="password" /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label style={{ color: "black" }} className="labels">Engine ID</label><input onChange={handleChange} type="text"
                                    className="form-control" placeholder="enginID" value={config.mobile_number} /></div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div >
    );
};


NetConfig.propTypes = {

};


export default NetConfig;
