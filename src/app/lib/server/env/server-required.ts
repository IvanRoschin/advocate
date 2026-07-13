function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }

  return value;
}

export function getGoogleEnv() {
  return {
    clientId: required(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID'),
    clientSecret: required(
      process.env.GOOGLE_CLIENT_SECRET,
      'GOOGLE_CLIENT_SECRET'
    ),
  };
}
