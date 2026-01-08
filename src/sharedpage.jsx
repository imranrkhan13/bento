// src/SharedPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SharedPage({ match }) {
    const { userId } = match.params;  // Grab userId from the URL
    const [content, setContent] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/user/content/${userId}`)
            .then(response => {
                setContent(response.data.content);
            })
            .catch(error => {
                console.error("Error fetching user content", error);
            });
    }, [userId]);

    return (
        <div>
            <h1>{userId}'s Content</h1>
            <div className="content-cards">
                {content.map((item, index) => (
                    <div key={index} className="card">
                        {item.type === 'link' && <a href={item.value} target="_blank" rel="noopener noreferrer">{item.value}</a>}
                        {item.type === 'image' && <img src={item.value} alt="user-uploaded" />}
                        {item.type === 'text' && <p>{item.value}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SharedPage;
