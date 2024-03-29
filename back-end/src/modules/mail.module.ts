/** Core Modules */
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

/** Custom Modules */
import { LogModule } from './log.module';


export class MailModule {

    public from: string;
    private smtpTransport: Mail;
    private logger: LogModule = new LogModule('./log/mail.log');

    constructor(from: string) {
        this.from = from;
        this.smtpTransport = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_USER_ID,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: process.env.GOOGLE_ACCESS_TOKEN,
                expires: 3600
            }
        });
    }

    public async send(to: string, title: string, html: string): Promise<void> {
        const mailOptions: Mail.Options = {
            from: this.from,
            to,
            subject: title,
            html
        }

        try {
            await this.smtpTransport.sendMail(mailOptions);

            this.logger.write(`send mail to ${ to }\n`);
        } catch (error) {
            this.logger.write(`fail to send mail to ${ to }\nerror: ${ JSON.stringify(error) }\n`);
        }
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
                        <td style="padding:20px;">This is an autosended e-mail to validate ownership of your Email address <a style="color:#fa8000;" href="mailto:${ email }">${ email }</a></td>
                    </tr>
                    <tr>
                        <td style="padding:0px 20px">To activate your account, click the link below.</td>
                    </tr>
                    <tr>
                        <td style="padding:80px 20px;" align="center"><a style="padding:12px 40px;background-color:#087190;color:#ffffff;text-decoration:none;" href="${ link }" target="_blank">Verify</a></td>
                    </tr>
                    <tr>
                        <td style="padding:0px 20px;">If you haven't signed up <a href="${ siteLink }">${ siteName }</a>, please <a href="mailto:eunsatio@eunsatio.io">send me an Email back to me.</a>.</td>
                    </tr>
                    <tr>
                        <td style="padding:20px 20px 60px;">It's so good to have you.</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 20px;font-size:0.96rem;background-color:#087190;box-shadow:0 0 10px rgba(0,0,0,.4);color:#199fc6;" align="right"><p style="font-weight:500;display:inline-block;color:#ffffff;">SeemsPyo</p> from <a style="color:#ffffff;" href="${ siteLink }">${ siteName }</a></td>
                    </tr>
                </table>
    
            </td></tr></table>
        </body>
    </html>`;
}