interface LeadClientTemplateProps {
  name?: string;
}

export function leadClientTemplate({ name }: LeadClientTemplateProps) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background:#f9fafb;
    padding:24px;
    color:#111827;
  ">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:12px;
      padding:24px;
      box-shadow:0 10px 25px rgba(0,0,0,.05);
    ">
      <h2 style="margin-top:0;">Дякуємо${name ? `, ${name}` : ''} 👋</h2>

      <p style="font-size:15px; line-height:1.6;">
        Ми отримали вашу заявку та вже працюємо над нею.
      </p>

      <p style="font-size:15px; line-height:1.6;">
        Найближчим часом я звʼяжусь з вами, щоб уточнити деталі.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

      <p style="font-size:13px; color:#6b7280;">
        З повагою,<br/>
        <strong>Адвокат Іван Рощин</strong><br/>
        <span style="color:#9ca3af;">Юридична допомога</span>
      </p>
    </div>
  </div>
  `;
}
