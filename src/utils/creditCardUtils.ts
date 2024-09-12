export function detectCreditCardType(cardNumber: string): string {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }

  return '';
}