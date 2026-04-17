// src/components/TileCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TileCard.css';

const TileCard = ({ title, image, link }) => {
  const navigate = useNavigate();

  return (
    <div className="tile-card" onClick={() => navigate(link)}>
      <img src={image} alt={title} className="tile-image" />
      <h3>{title}</h3>
    </div>
  );
};

export default TileCard;
