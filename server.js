const express = require('express');
const request = require('request');
const path = require('path');
const app = express();

const clientId = '864d3d4eff15490da44bce6db933b253';
const clientSecret = 'ba582e774ba34939a795e1b26917086e';
const redirectUri = 'http://localhost:3000';


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'spotify', 'index.html'));

    const code = req.query.code || null;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + new Buffer(`${clientId}:${clientSecret}`).toString('base64')
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.redirect(`/index.html#access_token=${access_token}`);
        } else {
            res.redirect('/index.html');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
