
const mongoose = require('mongoose');

const userContentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: [
        {
            type: { type: String, enum: ['link', 'image', 'text'], required: true },
            value: { type: String, required: true },
        },
    ],
    shareableLink: { type: String, unique: true },
});

const UserContent = mongoose.model('UserContent', userContentSchema);

app.post('/api/user/content', async (req, res) => {
    const { userId, content } = req.body;

    const shareableLink = `http://localhost:3000/${userId}`;

    try {
        const newUserContent = new UserContent({
            userId,
            content,
            shareableLink,
        });

        await newUserContent.save();
        res.json({ shareableLink });
    } catch (err) {
        res.status(500).send('Error saving content');
    }
});

// API endpoint to fetch user content by userId (or shareable link)
app.get('/api/user/content/:userId', async (req, res) => {
    try {
        const userContent = await UserContent.findOne({ userId: req.params.userId });

        if (!userContent) {
            return res.status(404).send('User content not found');
        }

        res.json(userContent);
    } catch (err) {
        res.status(500).send('Error fetching content');
    }
});
