export function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+[]{}|;:,.<>?';

  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  // Гарантированно добавляем хотя бы один символ из каждой категории
  const getRandom = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  const password = [
    getRandom(uppercase),
    getRandom(special),
    getRandom(lowercase),
    getRandom(numbers),
  ];

  // Добавляем оставшиеся символы случайным образом
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password.push(getRandom(allChars));
  }

  // Перемешиваем, чтобы порядок был случайным
  return password.sort(() => 0.5 - Math.random()).join('');
}
