import crypto from 'crypto';


export class CipherModule {

    private readonly padding = crypto.constants.RSA_PKCS1_PADDING;

    constructor(
        private privateKey: Buffer,
        private publicKey: Buffer,
        private passphrase: string
    ) {}

    public publicEncrypt(value: string): string {
        const { publicKey, passphrase, padding } = this;

        return crypto.publicEncrypt({
            key: publicKey,
            passphrase,
            padding
        }, Buffer.from(value, 'utf8')).toString('base64');
    }

    public privateDecrypt(value: string): string {
        const { privateKey, passphrase, padding } = this;

        const buffer = (crypto as any).privateDecrypt({
            key: privateKey,
            passphrase,
            padding
        }, Buffer.from(value, 'base64'));

        return buffer.toString('utf8').replace(/\n/g, '');
    }

}