interface LeadAdminTemplateProps {
  name?: string;
  email: string;
  phone?: string;
}

export function leadAdminTemplate({
  name,
  email,
  phone,
}: LeadAdminTemplateProps) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background:#0f172a;
    padding:24px;
    color:#e5e7eb;
  ">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#020617;
      border-radius:12px;
      padding:24px;
      border:1px solid #1e293b;
    ">
      <h2 style="margin-top:0; color:#38bdf8;">
        🚨 Новий лід
      </h2>

      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0; color:#94a3b8;">Імʼя:</td>
          <td style="padding:8px 0;"><strong>${name || '—'}</strong></td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#94a3b8;">Email:</td>
          <td style="padding:8px 0;">
            <a href="mailto:${email}" style="color:#38bdf8;">
              ${email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#94a3b8;">Телефон:</td>
          <td style="padding:8px 0;">
            <a href="tel:${phone}" style="color:#38bdf8;">
              ${phone || '—'}
            </a>
          </td>
        </tr>
      </table>

      <hr style="border:none; border-top:1px solid #1e293b; margin:24px 0;" />

      <p style="font-size:13px; color:#64748b;">
        Дата: ${new Date().toLocaleString('uk-UA')}
      </p>
    </div>
  </div>
  `;
}
