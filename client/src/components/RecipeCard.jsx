import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <div style={cardStyle}>
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={imageStyle}
                />
            )}
            <h3 style={titleStyle}>{recipe.title}</h3>
            <p style={descStyle}>{recipe.description}</p>
            <p style={metaStyle}>
                By{' '}
                {recipe.createdBy?.username ? (
                    <Link to={`/user/${recipe.createdBy.username}`} style={linkStyle}>
                        {recipe.createdBy.username}
                    </Link>
                ) : (
                    <span style={{ color: '#999' }}>Unknown</span>
                )}{' '}
                • {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
            <Link to={`/recipes/${recipe._id}`} style={buttonStyle}>
                View Recipe
            </Link>
        </div>
    );
};

const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
};

const imageStyle = {
    height: '180px',
    width: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '12px'
};

const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
};

const descStyle = {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '12px',
    flexGrow: 1
};

const metaStyle = {
    fontSize: '0.75rem',
    color: '#777',
    marginBottom: '12px'
};

const linkStyle = {
    color: '#007BFF',
    textDecoration: 'underline'
};

const buttonStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    textDecoration: 'none',
    textAlign: 'center'
};

export default RecipeCard;
