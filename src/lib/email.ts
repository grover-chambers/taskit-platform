import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_KEY = process.env.GMAIL_APP_KEY || '';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'taskit075@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_KEY },
});

function baseHtml(body: string, preview: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${preview}</title></head>
<body style="margin:0;padding:0;background:#0a0a18;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a18;min-height:100%">
<tr><td align="center" style="padding:32px 16px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="text-align:center;padding-bottom:24px">
<h1 style="margin:0;font-size:24px;font-weight:800;color:#D4A017;letter-spacing:-0.5px">TaskIt</h1>
<p style="margin:4px 0 0;font-size:11px;color:#6b7280;letter-spacing:1px;text-transform:uppercase">Nairobi's Fastest Errand Platform</p>
</td></tr>
<tr><td style="background:#12121f;border:1px solid #1f1f35;border-radius:16px;padding:32px 24px">
${body}
</td></tr>
<tr><td style="text-align:center;padding:24px 0 0">
<p style="margin:0;font-size:11px;color:#4b5563">&copy; ${new Date().getFullYear()} TaskIt. Nairobi, Kenya.</p>
<p style="margin:4px 0 0;font-size:10px;color:#374151">You're receiving this because you have a TaskIt account.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function generateResetToken(email: string): string {
  return jwt.sign({ email, purpose: 'password_reset' }, NEXTAUTH_SECRET, { expiresIn: '1h' });
}

export function verifyResetToken(token: string): { email: string } | null {
  try {
    const payload = jwt.verify(token, NEXTAUTH_SECRET) as any;
    if (payload.purpose !== 'password_reset') return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function generateEmailVerifyToken(email: string): string {
  return jwt.sign({ email, purpose: 'email_verify' }, NEXTAUTH_SECRET, { expiresIn: '24h' });
}

export function verifyEmailVerifyToken(token: string): { email: string } | null {
  try {
    const payload = jwt.verify(token, NEXTAUTH_SECRET) as any;
    if (payload.purpose !== 'email_verify') return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  const roleLabel = role === 'RIDER' ? 'Rider' : role === 'VENDOR' ? 'Vendor' : 'Customer';
  const roleColor = role === 'RIDER' ? '#3b82f6' : role === 'VENDOR' ? '#8b5cf6' : '#D4A017';
  const ctaLink = role === 'RIDER' ? `${APP_URL}/rider/verify` : role === 'ADMIN' ? `${APP_URL}/admin` : `${APP_URL}/dashboard`;
  const ctaLabel = role === 'RIDER' ? 'Complete Verification' : 'Go to Dashboard';

  const body = `
<div style="text-align:center;margin-bottom:24px">
<div style="width:56px;height:56px;border-radius:50%;background:${roleColor}20;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
<span style="font-size:24px">${role === 'RIDER' ? '🛵' : role === 'VENDOR' ? '🏪' : '📦'}</span>
</div>
<h2 style="margin:0 0 8px;font-size:20px;color:#fff;font-weight:700">Welcome, ${name}!</h2>
<p style="margin:0;font-size:14px;color:#9ca3af">Your ${roleLabel} account is ready</p>
</div>
<div style="background:#0a0a18;border-radius:12px;padding:16px;margin-bottom:24px">
<p style="margin:0 0 8px;font-size:13px;color:#d1d5db">Here's what you can do:</p>
<ul style="margin:0;padding-left:20px;font-size:13px;color:#9ca3af;line-height:1.8">
${role === 'RIDER' ? '<li>Upload documents for KYC verification</li><li>Go online to start receiving delivery jobs</li><li>Track earnings in your wallet</li>' : '<li>Create and track errands</li><li>Get real-time delivery updates with OTP</li><li>Reach support via WhatsApp</li>'}
</ul>
</div>
<div style="text-align:center">
<a href="${ctaLink}" style="display:inline-block;background:#D4A017;color:#0a0a18;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none">${ctaLabel}</a>
</div>`;

  await transporter.sendMail({
    from: `"TaskIt" <${GMAIL_USER}>`,
    to,
    subject: `Welcome to TaskIt, ${name}!`,
    html: baseHtml(body, `Welcome to TaskIt, ${name}!`),
  });
}

export async function sendPasswordResetEmail(to: string, name: string) {
  const token = generateResetToken(to);
  const resetLink = `${APP_URL}/auth/reset-password?token=${token}`;

  const body = `
<div style="text-align:center;margin-bottom:24px">
<div style="width:56px;height:56px;border-radius:50%;background:#D4A01720;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
<span style="font-size:24px">🔑</span>
</div>
<h2 style="margin:0 0 8px;font-size:20px;color:#fff;font-weight:700">Reset Your Password</h2>
<p style="margin:0;font-size:14px;color:#9ca3af">Hi ${name}, click below to set a new password</p>
</div>
<div style="text-align:center;margin-bottom:24px">
<a href="${resetLink}" style="display:inline-block;background:#D4A017;color:#0a0a18;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none">Reset Password</a>
</div>
<div style="background:#0a0a18;border-radius:12px;padding:16px;margin-bottom:16px">
<p style="margin:0 0 8px;font-size:13px;color:#d1d5db">⚠️ This link expires in <strong style="color:#D4A017">1 hour</strong></p>
<p style="margin:0;font-size:12px;color:#6b7280">If you didn't request this, you can safely ignore this email — your password won't change.</p>
</div>
<p style="margin:0;font-size:12px;color:#6b7280;text-align:center">Or copy this link: <a href="${resetLink}" style="color:#D4A017;word-break:break-all">${resetLink}</a></p>`;

  await transporter.sendMail({
    from: `"TaskIt" <${GMAIL_USER}>`,
    to,
    subject: 'Reset your TaskIt password',
    html: baseHtml(body, 'Reset your TaskIt password'),
  });
}

export async function sendKycStatusEmail(to: string, name: string, status: 'APPROVED' | 'REJECTED') {
  const isApproved = status === 'APPROVED';
  const icon = isApproved ? '✅' : '❌';
  const color = isApproved ? '#22c55e' : '#ef4444';

  const body = `
<div style="text-align:center;margin-bottom:24px">
<div style="width:56px;height:56px;border-radius:50%;background:${color}20;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
<span style="font-size:24px">${icon}</span>
</div>
<h2 style="margin:0 0 8px;font-size:20px;color:#fff;font-weight:700">${isApproved ? 'Verification Approved!' : 'Document Rejected'}</h2>
<p style="margin:0;font-size:14px;color:#9ca3af">Hi ${name},</p>
</div>
<div style="background:#0a0a18;border-radius:12px;padding:16px;margin-bottom:24px">
<p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6">
${isApproved
    ? 'All your documents have been approved! You can now go online and start receiving delivery jobs.'
    : 'One or more of your documents were rejected. Please re-upload clear, valid documents to get verified.'}
</p>
</div>
<div style="text-align:center">
<a href="${APP_URL}/rider/verify" style="display:inline-block;background:${isApproved ? '#D4A017' : '#ef4444'};color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none">${isApproved ? 'Start Riding' : 'Re-upload Documents'}</a>
</div>`;

  await transporter.sendMail({
    from: `"TaskIt" <${GMAIL_USER}>`,
    to,
    subject: isApproved ? 'TaskIt Verification Approved!' : 'TaskIt Document Update Needed',
    html: baseHtml(body, isApproved ? 'Verification Approved!' : 'Document Rejected'),
  });
}

export async function sendSupportAlertEmail(ticketId: string, subject: string, priority: string, customerName: string, body: string) {
  const adminLink = `${APP_URL}/admin/support`;

  const html = `
<div style="margin-bottom:24px">
<div style="display:inline-block;background:${priority === 'HIGH' || priority === 'URGENT' ? '#ef4444' : '#D4A017'};color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;margin-bottom:12px">${priority} PRIORITY</div>
<h2 style="margin:0 0 8px;font-size:18px;color:#fff;font-weight:700">${subject}</h2>
<p style="margin:0;font-size:13px;color:#9ca3af">From: ${customerName} · Ticket #${ticketId.slice(-7).toUpperCase()}</p>
</div>
<div style="background:#0a0a18;border-radius:12px;padding:16px;margin-bottom:24px">
<p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6">${body}</p>
</div>
<div style="text-align:center">
<a href="${adminLink}" style="display:inline-block;background:#D4A017;color:#0a0a18;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none">Open Support Center</a>
</div>`;

  await transporter.sendMail({
    from: `"TaskIt Support" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `[TaskIt] ${priority} — ${subject}`,
    html: baseHtml(html, `Support ticket: ${subject}`),
  });
}

export async function sendVerificationEmail(to: string, name: string) {
  const token = generateEmailVerifyToken(to);
  const verifyLink = `${APP_URL}/auth/verify-email?token=${token}`;

  const body = `
<div style="text-align:center;margin-bottom:24px">
<div style="width:56px;height:56px;border-radius:50%;background:#D4A01720;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
<span style="font-size:24px">✉️</span>
</div>
<h2 style="margin:0 0 8px;font-size:20px;color:#fff;font-weight:700">Verify Your Email</h2>
<p style="margin:0;font-size:14px;color:#9ca3af">Hi ${name}, confirm your email to activate your account</p>
</div>
<div style="text-align:center;margin-bottom:24px">
<a href="${verifyLink}" style="display:inline-block;background:#D4A017;color:#0a0a18;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none">Verify Email</a>
</div>
<div style="background:#0a0a18;border-radius:12px;padding:16px">
<p style="margin:0;font-size:12px;color:#6b7280">This link expires in <strong style="color:#D4A017">24 hours</strong>. If you didn't create this account, you can safely ignore this email.</p>
</div>`;

  await transporter.sendMail({
    from: `"TaskIt" <${GMAIL_USER}>`,
    to,
    subject: 'Verify your TaskIt email',
    html: baseHtml(body, 'Verify your TaskIt email'),
  });
}
