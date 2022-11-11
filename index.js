const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

function grabGeoLocation(ip='1.1.1.1') {
    axios.get(`http://ipapi.co/${ip}/json`)
        .then(res => {
            const { city, region, country_code, org, asn, postal, hostname} = res.data;
            const ipInfo = `${ip}\n${city}, ${region}, ${country_code}\n${org}\n${asn}\n${postal}\n----------------------`;
            fs.writeFile('./ip.txt', ipInfo, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            console.log(ipInfo);
        });
}


const fs = require('fs');

app.use(cors());
app.get('/set', (req, res) => {
    const ip = req.query.ip;
    grabGeoLocation(ip);
    res.send('ok');
});
app.get('/reset', (req, res) => {
    fs.writeFile('./ip.txt', 'Waiting on /set...', (err) => {
        if (err) throw err;
        console.log('The file has been reset!');
    });
    res.send('ok');
});

app.get('/display', (req, res) => {
    fs.readFile('./ip.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const lines = data.split('\n');
        const html = lines.map(line => `<p>${line}</p>`).join('');
        res.send(`<html>
        <head>
            <style>
                p {
                    font-family: Impact, Charcoal, sans-serif;
                }
            </style>
        </head>
        <body>${html}</body><script>
        setTimeout(() => {
            window.location.reload();
        }, 250);
        </script></html>`);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
