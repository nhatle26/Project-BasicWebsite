const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// === Cấu hình Gmail (dùng mật khẩu ứng dụng) ===
// Vào https://myaccount.google.com/apppasswords để tạo nếu bạn dùng Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com", // 👉 thay bằng email của bạn
    pass: "YOUR_APP_PASSWORD",    // 👉 thay bằng mật khẩu ứng dụng
  },
});

// === API gửi email ===
app.post("/send-email", async (req, res) => {
  const { email, fullname } = req.body;

  if (!email || !fullname) {
    return res.status(400).json({ error: "Thiếu email hoặc fullname" });
  }

  try {
    await transporter.sendMail({
      from: `"Hệ thống của bạn" <YOUR_EMAIL@gmail.com>`,
      to: email,
      subject: "Chào mừng bạn đến với hệ thống!",
      html: `
        <div style="font-family:Arial,sans-serif; line-height:1.6">
          <h2>Xin chào ${fullname} 👋</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản của chúng tôi.</p>
          <p>Chúc bạn có trải nghiệm tuyệt vời!</p>
          <hr/>
          <small>Email này được gửi tự động, vui lòng không trả lời.</small>
        </div>
      `,
    });

    console.log(`✅ Email chào mừng đã gửi tới ${email}`);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({ error: "Không thể gửi email" });
  }
});

// === Khởi động server ===
app.listen(3001, () => console.log("✅ Email server chạy tại http://localhost:3001"));
