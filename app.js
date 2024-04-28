const express = require('express');
const app = express();
const fetch = require('node-fetch');
const loading = require('express-loading');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(loading());

app.get('/', (req, res) => {
    res.render('index', { results: [], message: '' });
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.json({ error: 'Missing search term.' });
    }

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                res.json({ error: 'No results found.' });
            } else {
                res.json({ results: data.results });
            }
        })
        .catch(error => {
            res.json({ error: 'Error fetching data from iTunes.' });
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
