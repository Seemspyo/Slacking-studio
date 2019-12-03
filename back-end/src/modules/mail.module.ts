/** Core Modules */
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

/** Privates */
import { googleAuth } from '../privates/blog.private';


export class MailModule {

    public from: string;
    private smtpTransport: Mail;

    constructor(from: string) {
        this.from = from;
        this.smtpTransport = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: googleAuth as any
        });
    }

    public async send(to: string, title: string, html: string): Promise<void> {
        const mailOptions: Mail.Options = {
            from: this.from,
            to,
            subject: title,
            html
        }

        await this.smtpTransport.sendMail(mailOptions);
        this.smtpTransport.close();
    }

}

export const getVerifyMailTemplate = (
    email: string,
    nickname: string,
    link: string,
    siteName: string = 'Slacking studio',
    siteLink: string = 'https://eunsatio.io'): string => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Verify Your Email address</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700&display=swap" rel="stylesheet">
        </head>
        <body style="background-color:#199fc6;padding:0;border:0;margin:0;font-family:'Ubuntu',sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgColor="#199fc6"><tr><td align="center">
    
                <table border="0" cellpadding="0" cellspacing="0" width="600" bgColor="#ffffff" style="overflow:hidden;">
                    <tr>
                        <td style="padding:20px;font-size:1.6rem;font-weight:600;word-break:keep-all;background-color:#087190;color:#ffffff;box-shadow:0 0 10px rgba(0,0,0,.4)">Verify your Email address</td>
                    </tr>
                    <tr>
                        <td style="padding:40px 20px 0;font-size:1.1rem;font-weight:600;word-break:keep-all;">Hi, ${ nickname }.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px;">This is an authsended e-mail to validate ownership of your Email address <a style="color:#fa8000;" href="mailto:${ email }">${ email }</a></td>
                    </tr>
                    <tr>
                        <td style="padding:0px 20px">To activate your account, please click the link below.</td>
                    </tr>
                    <tr>
                        <td style="padding:80px 20px;" align="center"><a style="padding:12px 40px;background-color:#087190;color:#ffffff;text-decoration:none;" href="${ link }" target="_blank">Verify</a></td>
                    </tr>
                    <tr>
                        <td style="padding:0px 20px;">If you haven't signed up <a href="${ siteLink }">${ siteName }</a>, please <a href="mailto:eunsatio@eunsatio.io">send me an Email</a>.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px 20px 60px;">It's good to have you with us.</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 20px;font-size:0.96rem;background-color:#087190;box-shadow:0 0 10px rgba(0,0,0,.4);color:#199fc6;" align="right"><p style="font-weight:500;display:inline-block;color:#ffffff;">SeemsPyo</p> from <a style="color:#ffffff;" href="${ siteLink }">${ siteName }</a></td>
                    </tr>
                </table>
    
            </td></tr></table>
        </body>
    </html>`;
}