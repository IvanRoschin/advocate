export interface BaseEmailLayoutProps {
  title?: string;
  content: string;
  footer?: string;
}

export function baseEmailLayout({
  title,
  content,
  footer,
}: BaseEmailLayoutProps) {
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
      ${title ? `<h2 style="margin-top:0;">${title}</h2>` : ''}

      ${content}

      ${
        footer
          ? `
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
        ${footer}
      `
          : ''
      }
    </div>
  </div>
  `;
}
