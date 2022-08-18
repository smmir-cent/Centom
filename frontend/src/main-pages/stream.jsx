// import './App.css';
import { useEffect, useState } from 'react'

const Stream = () => {
    const [data, setData] = useState('Initializing...')

    useEffect(() => {

        const sse = new EventSource('http://localhost:5000/stream')

        function handleStream(e) {
            console.log(e.data)
            setData(e.data)
        }

        sse.onmessage = e => { handleStream(e) }

        // sse.onerror = e => {
        //     //GOTCHA - can close stream and 'stall'
        //     sse.close()
        // }

        // return () => {
        //     sse.close()

        // }
    }, [])
    return (
        <div className="App">
            The last streamed item was: {data}
        </div>
    );
};


Stream.propTypes = {

};


export default Stream;
