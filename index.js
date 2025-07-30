const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

const client = redis.createClient({
    url: 'redis://redis:6379'
});
client.connect().catch(console.error);

app.use(express.urlencoded({ extended: true })); // This replaces body-parser
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.post('/save', async (req, res) => {
    const username = req.body.username;

    if (!username) {
        return res.send('Username is required');
    }

    try {
        await client.rPush('userList', username);  // Save to Redis List
        res.render('success', { username });
    } catch (err) {
        console.error('Error saving to Redis:', err);
        res.send('Error saving to Redis');
    }
});



app.get('/view', async (req, res) => {
    try {
        const username = await client.get('username');
        res.send(`Saved Username: ${username}`);
    } catch (err) {
        console.error(err);
        res.send('Error fetching from Redis');
    }
});


app.get('/users', async (req, res) => {
    try {
        const users = await client.lRange('userList', 0, -1);  // Get full list
        console.log(users);
        res.render('users', { users });
    } catch (err) {
        console.error('Error fetching from Redis:', err);
        res.send('Error fetching users');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
