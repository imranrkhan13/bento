
import{ useState } from 'react';
import axios from 'axios';

function App() {
    const [userId, setUserId] = useState('user123');
    const [content, setContent] = useState([]);
    const [newContent, setNewContent] = useState({ type: '', value: '' });
    const [shareableLink, setShareableLink] = useState('');

    const handleAddContent = (e) => {
        e.preventDefault();
        const updatedContent = [...content, newContent];
        setContent(updatedContent);

        axios.post('http://localhost:5173/api/user/content', { userId, content: updatedContent })
            .then(response => {
                setShareableLink(response.data.shareableLink);
                setNewContent({ type: '', value: '' });
            })
            .catch(error => {
                console.error("Error saving content", error);
            });
        setNewContent({ type: '', value: '' })
    };




    return (
        <div className="App">
            <h1>My Dashboard</h1>
            <form onSubmit={handleAddContent}>
                <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="text">Text</option>
                </select>

                <input
                    type="text"
                    placeholder="Enter content (URL or text)"
                    value={newContent.value}
                    onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                    required
                />

                <button type="submit">Add Content</button>
            </form>

            <div className="content-cards">
                {content.map((item, index) => (
                    <div key={index} className="card">
                        {item.type === 'link' && <a href={item.value} target="_blank" rel="noopener noreferrer">{item.value}</a>}
                        {item.type === 'image' && <img src={item.value} alt="user-uploaded" />}
                        {item.type === 'text' && <p>{item.value}</p>}
                    </div>
                ))}
            </div>

            {shareableLink && (
                <div>
                    <h2>Share your page:</h2>
                    <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                        {shareableLink}
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;
