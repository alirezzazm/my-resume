import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  let savedToDb = false;
  let emailSent = false;
  let emailError: string | null = null;

  try {
    const { name, email, subject, message } = await req.json();

    // ─── Validation ───
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // ─── 1) همیشه اول در DB ذخیره کن ───
    // اگه DB در دسترس نباشه، این یک ارور می‌اندازه و کاربر می‌فهمه.
    try {
      await prisma.contactMessage.create({
        data: { name, email, subject, message },
      });
      savedToDb = true;
    } catch (dbErr) {
      console.error('[contact] DB save failed:', dbErr);
      // اگه DB ذخیره نشد، حتما به کاربر بگو
      return NextResponse.json(
        { error: 'پیام شما ذخیره نشد، دوباره تلاش کنید.' },
        { status: 500 }
      );
    }

    // ─── 2) تلاش برای ارسال ایمیل ───
    // اگه fail شد مهم نیست — پیام در DB ذخیره شده.
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const to = process.env.CONTACT_EMAIL || user;

    if (!host || !user || !pass) {
      console.warn('[contact] SMTP not configured. Message saved to DB only.');
    } else {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user, pass },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${user}>`,
          to,
          replyTo: email,
          subject: `[Portfolio] ${subject}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">📬 New Portfolio Contact</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
              <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb;" />
              <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb;" />
              <p style="color:#94a3b8; font-size:12px;">این پیام خودکار از سایت پرتفولیوی شما ارسال شده. در پنل ادمین در /admin/messages قابل مشاهده است.</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailErr: any) {
        emailError = mailErr?.message || 'Email send failed';
        console.error('[contact] Email send failed (DB save was successful):', emailError);
      }
    }

    // ─── 3) موفقیت — حتی اگه ایمیل نرسیده ───
    return NextResponse.json({
      ok: true,
      savedToDb,
      emailSent,
      ...(emailError ? { emailWarning: 'پیام شما با موفقیت ذخیره شد، اما ارسال ایمیل ناموفق بود. به‌زودی بررسی می‌شود.' } : {}),
    });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { error: savedToDb ? 'پیام ذخیره شد ولی خطایی رخ داد.' : 'Server error' },
      { status: savedToDb ? 200 : 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
