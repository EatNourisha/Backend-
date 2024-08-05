import httpStatus from 'http-status';
import config from './index';
import Mailjet from 'node-mailjet';

const mailjetClient = new Mailjet({
 apiKey: config.MAILJET_API_KEY,
 apiSecret: config.MAILJET_API_SECRET
});

interface EmailResponse {
  message: string;
  code: number;
  success: boolean;
}

const mailJetSendMail = async (html: string, subject: string, recipientEmails: string[]): Promise<EmailResponse> => {
  try {
    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'hello@eatnourisha.com',
            Name: 'Nourisha',
          },
          To: recipientEmails.map((email) => ({
            Email: email,
          })),
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    const result = await request;
    console.log(result.body);
    return {
      message: 'Mailjet sent message',
      code: httpStatus.OK,
      success: true,
    };
  } catch (err: any) {
    console.error(err.statusCode);
    return {
      success: false,
      message: 'Email not sent',
      code: httpStatus.BAD_GATEWAY,
    };
  }
};


export { mailJetSendMail };
