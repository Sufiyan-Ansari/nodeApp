// var express = require('express')
// const requestIp = require('request-ip');
// var app = express();
// var port = 3000;
// const now = new Date();
// const redis = require('redis');
// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// //app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }))

// app.get('/',(req,res)=>{
// res.render('index', { title: 'Home Page', message: 'Welcome Sufiyan Ansari !' });
// run();


// })

// //save input 
// app.post('/save', async (req, res) => {
//     const username = req.body.username;
    
//     if (username) {
//         try {
//             await client.set('username', username);
//             res.render('success', { username });
//         } catch (err) {
//             console.error(err);
//             res.send('Error saving to Redis');
//         }
//     } else {
//         res.send('Username is required');
//     }
// });

// app.get('/view', async (req, res) => {
//     try {
//         const username = await client.get('username');
//         res.send(`Saved Username: ${username}`);
//     } catch (err) {
//         console.error(err);
//         res.send('Error fetching from Redis');
//     }
// });




// const client = redis.createClient({
//   url: 'redis://redis:6379',
//   socket: {
//     reconnectStrategy: retries => {
//       if (retries > 5) {
//         return new Error('Too many retries to connect to Redis');
//       }
//       return 1000 * retries; // wait longer each retry
//     }
//   }
// });


// async function run() {
//   try {
//     await client.connect(); // Connect to Redis

//     console.log('Connected to Redis ');

//     // Set a key-value pair
//     await client.set('user:1000', JSON.stringify({ name: 'John Doe', age: 30 }));

//     // Get the value
//     const value = await client.get('user:1000');
//     console.log('Retrieved from Redis:', JSON.parse(value));

//     await client.quit(); // Close the connection
//   } catch (err) {
//     console.error('Redis error:', err);
//   }
// }



// //app.get('/',(req,res)=>{
// //    console.log("This is get call")
//    // res.send("THis is testing call "+now.toLocaleString())
// //    const clientIp = requestIp.getClientIp(req);
// //    res.send(`Your IP Address is: ${clientIp}`);
// //})
// app.listen(port,()=>{
//     console.log(`Server running at http://localhost:${port}`);
// })

const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

// Redis client setup
const client = redis.createClient({
    url: 'redis://redis:6379'
});
client.connect().catch(console.error);

// Middleware
app.use(express.urlencoded({ extended: true })); // This replaces body-parser
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// app.post('/save', async (req, res) => {
//     const username = req.body.username;
//     console.log(req.body.username);

//     if (username) {
//         try {
//             await client.set('username', username);
//             res.render('success', { username });
//         } catch (err) {
//             console.error(err);
//             res.send('Error saving to Redis');
//         }
//     } else {
//         res.send('Username is required');
//     }
// });

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
