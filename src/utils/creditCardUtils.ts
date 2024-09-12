import visaLogo from '../assets/images/visa.png';
import mastercardLogo from '../assets/images/mastercard.png';
import amexLogo from '../assets/images/amex.png';

export function detectCreditCardType(cardNumber: string): string {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return getCreditCardLogo(type);
    }
  }

  return '';
}

const getCreditCardLogo = (cardType: string) => {
  switch (cardType) {
    case 'visa':
      return visaLogo;
    case 'mastercard':
      return mastercardLogo;
    case 'amex':
      return amexLogo;
    default:
      return '';
  }
}