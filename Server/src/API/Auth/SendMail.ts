import nodemailer from "nodemailer";

const SendMail = async ({ from = "ERP - SPEC", to, title, body }: any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: from,
            to: to,
            subject: title,
            html: body,
        });

        console.log(info);

        return info;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default SendMail;
