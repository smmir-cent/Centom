import React from 'react';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';

import Navbar from './profile-pages/navbar';
import Profile from './profile-pages/profile';

import Home from './main-pages';

import Login from './auth-pages/login';
import Logout from './auth-pages/logout';
import useToken from './auth-pages/useToken'
import SignUp from './auth-pages/signup';

import QuickScan from './main-pages/quick-scan';
import NetDiscovery from './main-pages/net-discovery';
import NetConfig from './main-pages/net-config';
import Monitoring from './main-pages/monitoring';
import Stream from './main-pages/stream';

function App() {
  const { token, removeToken, setToken, getToken } = useToken();

  return (
    <Router>
      <div>
        <section className="hero is-primary is-fullheight">
          <Navbar getToken={getToken} />
          <div className="hero-body">
            <div className="container has-text-centered">
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/home' element={<Home />} />
                <Route exact path='/profile' element={<Profile getToken={getToken} />} />
                <Route exact path='/logout' element={<Logout getToken={getToken} removeToken={removeToken} />} />
                <Route exact path="/login" element={<Login token={token} setToken={setToken} />}></Route>
                <Route exact path='/sign-up' element={<SignUp />} />
                <Route exact path='/quick-scan' element={<QuickScan getToken={getToken} />} />
                <Route exact path='/net-discovery' element={<NetDiscovery getToken={getToken} />} />
                <Route exact path='/net-config' element={<NetConfig getToken={getToken} />} />
                <Route exact path='/monitoring' element={<Monitoring getToken={getToken} />} />
                <Route exact path='/stream' element={<Stream getToken={getToken} />} />

              </Routes>
            </div>
          </div>
        </section>
      </div>
    </Router>
  );
}


export default App;