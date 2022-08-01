import React from 'react';
import Navbar from './components/navbar';
import Profile from './components/profile';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Home from './pages';
import Login from './pages/login';

import useToken from './components/useToken'
import Header from './components/header';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <Router>
      <div>
        <section className="hero is-primary is-fullheight">
          <Navbar />
          <div className="hero-body">
            <div className="container has-text-centered">
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/home' element={<Home />} />
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path='/logout' element={<Header />} />
                <Route exact path="/login" element={<Login token={token} setToken={setToken} />}></Route>
              </Routes>
            </div>
          </div>
        </section>
      </div>
    </Router>
  );
}


export default App;