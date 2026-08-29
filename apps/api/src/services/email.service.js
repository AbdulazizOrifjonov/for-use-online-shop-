import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmailOTP(to, code) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n================================`);
    console.log(`📧 [EMAIL MOCK] To: ${to}`);
    console.log(`🔑 [EMAIL MOCK] Code: ${code}`);
    console.log(`================================\n`);
    return;
  }

  const mailOptions = {
    from: `"Professional Tools" <${process.env.SMTP_USER}>`,
    to,
    subject: "Ro'yxatdan o'tish uchun tasdiqlash kodi",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0088cc; text-align: center;">Tasdiqlash Kodi</h2>
        <p>Siz (yoki kimdir) ushbu email orqali ro'yxatdan o'tishga urindi.</p>
        <p>Tasdiqlash kodingiz:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 4px; color: #333;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px;">Bu kod 10 daqiqa davomida amal qiladi. Agar siz ro'yxatdan o'tishga urinmagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP sent to ${to}`);
  } catch (error) {
    console.error('[Email Error]', error);
    throw new Error('Email yuborishda xatolik yuz berdi.');
  }
}
