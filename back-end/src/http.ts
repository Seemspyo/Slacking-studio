/** Core Modules */
import express from 'express';


process.title = 'eunsatio-http';

const
PORT = 80,
http = express();

http.get('*', (req, res) => {
    res.redirect(`https://${ req.hostname }${ req.url }`);
});

http.listen(PORT, () => console.log(`HTTP Service running on port ${ PORT }`));