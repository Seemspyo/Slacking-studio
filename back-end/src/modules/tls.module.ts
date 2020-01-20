import { readFileSync } from 'fs';
import path from 'path';
import tls from 'tls';


export const
PASSPHRASE = process.env.KEY_FILE_PASSPHRASE,
KEY_FILE_DIR = process.env.KEY_FILE_DIR,
privateKey = readFileSync(path.resolve(__dirname, `${ KEY_FILE_DIR }private.pem`)),
publicKey = readFileSync(path.resolve(__dirname, `${ KEY_FILE_DIR }public.pem`));

export const getCert = (domain: string) => {
    const CERT_DIR = `${ process.env.CERT_DIR }${ domain }/`;

    return {
        key: readFileSync(`${ CERT_DIR }/privkey.pem`, 'utf8'),
        cert: readFileSync(`${ CERT_DIR }/cert.pem`, 'utf8'),
        ca: readFileSync(`${ CERT_DIR }/chain.pem`, 'utf8')
    }
}

const secureContexts = {
    'eunsatio.io': tls.createSecureContext(getCert('eunsatio.io')),
    'blog.eunsatio.io': tls.createSecureContext(getCert('blog.eunsatio.io')),
    'playground.eunsatio.io': tls.createSecureContext(getCert('playground.eunsatio.io'))
}

export const credentials = {
    SNICallback: (domain: string, callback: any) => {
        callback(null, secureContexts[domain]);
    },
    ...getCert('eunsatio.io')
}