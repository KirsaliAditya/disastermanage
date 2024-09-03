import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Navbar/Navbar';
import Home from './Home/Home';
import About from './About/About';
import Services from './Services/Services';
import News from './News/News';
import Contact from './Contact/Contact';
import NgoLogin from './Ngo-Login/Ngo-Login';
import NgoSignup from './Ngo-Signup/Ngo-Signup';
import AdminLogin from './Admin-Login/Admin-Login';
import ChatIcon from './ChatBotIcon/ChatBotIcon';
import Footer from './Footer/Footer';

function App() {
  return (
    <Router>
      <div className="page-container">
        <header className="App-header">
          <NavBar />
        </header>
        <div className="content-wrap">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services/*" element={<Services />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ngo-signup" element={<NgoSignup />} />
              <Route path="/ngo-login" element={<NgoLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </main>
        </div>
        <ChatIcon />
        <footer>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
