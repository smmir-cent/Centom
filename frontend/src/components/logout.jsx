import axios from "axios";

function Logout(props) {

    function logMeOut() {
        axios({
            method: "POST",
            url: "/logout",
        })
            .then((response) => {
                props.token()
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    return (
        <header className="App-header">
            <button onClick={logMeOut}>
                Logout
            </button>
        </header>
    )
}

export default Logout;