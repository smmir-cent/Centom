import React from 'react';
import PropTypes from 'prop-types';
import Graph from "react-graph-vis";


const Network = (props) => {
    const options = {
        layout: {
            hierarchical: true
        },
        edges: {
            color: "#000000"
        },
        height: "500px"
    };
    const events = {
        select: function (event) {
            var { nodes, edges } = event;
        }
    };
    return (
        <div>
            <Graph
                graph={props.data}
                options={options}
                events={events}
                getNetwork={network => {
                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
            />
        </div>
    );
};


Network.propTypes = {

};


export default Network;
