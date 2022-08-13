import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


const NetConfig = (props) => {
    const [networks, setNetworks] = useState([])
    useEffect(() => {
        getOptions()
        console.log(networks)
    }, []);

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
    return (
        <div>
            <fieldset className="form-group">
                <label for="profileName">Name: </label>
                <input type="text" className="form-control" name="mysettings.general.name" placeholder="Name" id="general.ame" />
            </fieldset>
            <fieldset className="form-group">
                <label for="profileColor">Color-Theme: </label>
                <select id="profileColor" className="form-control" >
                    {
                        networks.map((item, i) =>
                            <option key={i} value={item.name}>{item.name}</option>
                        )}
                </select>
            </fieldset>
        </div>
    );
};


NetConfig.propTypes = {

};


export default NetConfig;
