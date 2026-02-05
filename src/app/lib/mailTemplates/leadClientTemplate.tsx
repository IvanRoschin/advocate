interface LeadClientTemplateProps {
  name?: string;
}

export function leadClientTemplate({ name }: LeadClientTemplateProps) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background: #f9fafb;
    padding: 24px;
    color: #111827;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    ">
      <h2 style="margin-top:0;">Дякуємо${name ? `, ${name}` : ''} 👋</h2>

      <p style="font-size: 15px; line-height: 1.6;">
        Ми отримали вашу заявку та вже працюємо над нею.
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        Найближчим часом я звʼяжусь з вами, щоб уточнити деталі.
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        Інформація та документи з даного листа можуть містити адвокатську таємницю, що охороняється законом, та призначені для використання виключно особою, якій вони адресовані.
        Якщо ви не зазначений адресат, прошу невідкладно повідомити про це відправника та негайно видалити всі отримані документи без їх збереження, копіювання або розголошення.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

      <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
        З повагою,<br/>
        <strong>Адвокат Іван Рощин</strong><br/>
        <span style="color:#9ca3af;">Юридична допомога</span><br/>
        <br/>
        <a href="tel:+380951983729" style="color:#3b82f6; text-decoration:none;">+38 095 198 37 29</a><br/>
        <a href="tel:+380961983729" style="color:#3b82f6; text-decoration:none;">+38 096 198 37 29</a><br/>
        <a href="https://www.roschin.com.ua" style="color:#3b82f6; text-decoration:none;">www.roschin.com.ua</a>
      </p>
    </div>
  </div>
  `;
}
