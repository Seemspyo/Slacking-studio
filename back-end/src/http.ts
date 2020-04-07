/** Core Modules */
import express from 'express';


process.title = 'eunsatio-http';

const
PORT = process.env.HTTP_PORT,
http = express();

http.get('*', (req, res) => {
    res.redirect(`https://${ req.hostname }${ req.url }`);
});

const service = http.listen(PORT, () => console.log(`HTTP Service running on port ${ PORT }`));

process
.on('SIGINT', () => process.exit())
.on('exit', () => {
    service.close();
    console.log(`HTTP service has removed from port ${ PORT }`);
});