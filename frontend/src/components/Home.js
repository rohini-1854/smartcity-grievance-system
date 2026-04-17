import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // add this
import Header from './Header';
import TileCard from './TileCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // ✅ define navigate inside the component
  const userEmail = localStorage.getItem("userEmail"); // logged-in email
  const services = [
    {
      title: 'Submit Grievance',
      image: 'https://cdn-icons-png.flaticon.com/512/1011/1011812.png'
,
      link: '/register-complaint',
    },
    {
      title: 'Track Complaint',
      image: 'https://cdn-icons-png.flaticon.com/512/4201/4201973.png',
      link: '/track',
    },

    {
      title: 'View History',
      image: 'https://cdn-icons-png.flaticon.com/512/3208/3208723.png',
      link: '/view-history',
    },
    {
      title: 'Send Feedback',
      image: 'https://cdn-icons-png.flaticon.com/512/1019/1019607.png',
      link: '/message',
    },    
  ];
  const handleServiceClick = (link) => {
    if (link === "/grievance" && !userEmail) {
      alert("❌ Please login first to submit a complaint!");
      navigate("/auth?mode=user&redirect=/grievance");
    } else {
      navigate(link);
    }
  };
  return (
    <div className="home-container">
      <Header />

      <div className="main-content">
        <div className="gov-banner">
          <img src="/corp.png" alt="Government Logo" className="gov-image" />
        </div>
         <div className="welcome-msg">
          {userEmail ? (
            <p>Welcome, <strong>{userEmail}</strong>!</p>
          ) : (
            <p style={{ color: 'red' }}>
              ⚠️ Please <Link to="/auth?mode=user&redirect=/grievance">login</Link> to submit a complaint.
            </p>
          )}
        </div>

        <h2 className="section-title">How can we help you?</h2>
     
        <div className="grid">
          {services.map((card, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(card.link)}
              style={{ cursor: "pointer" }}
            >  
              <TileCard key={index} title={card.title} image={card.image} link={card.link} />
            </div>
          ))}
            
        </div>
         
        <div className="news-section">
          <h2 className="section-title">Latest News</h2>
          <ul className="news-list">
            <li>🛣️ Road repair work in Ward 12 will start from July 25.</li>
            <li>💡 Streetlight upgrade completed in Gandhi Nagar area.</li>
            <li>🚰 Temporary water supply disruption in Zone 3 on July 22.</li>
            <li>🧹 Clean City Drive scheduled this weekend. Join the mission!</li>
          </ul>
        </div>
      </div>

      <div className="footer-section">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Us</h4>
            <p>Email:support@nellai.gov.in</p>
            <p>Phone: +91 12345 67890</p>
          </div>

          {/* <div className="private-links">
            <Link to="/auth?role=worker">Worker Login</Link>
            <Link to="/auth?role=admin">Admin Login</Link>
          </div> */}
        </div>
      </div>


      <footer className="copy-rights">
        <div className="cp-center">
          © 2025 Greater Nellai Corporation. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
