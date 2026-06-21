import { env } from './env/serverEnv';

export async function sendTelegramMessage(message: string) {
  const token = env.telegram.botToken;
  const chatId = env.telegram.chatId;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}
