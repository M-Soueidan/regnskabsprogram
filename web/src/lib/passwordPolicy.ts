/** Krav til kunde-adgangskode ved oprettelse (synk med UI-tekst). */
export function validateSignupPassword(password: string): string | null {
  if (password.length < 8) {
    return 'Adgangskoden skal være mindst 8 tegn.'
  }
  if (!/[a-zæøå]/.test(password)) {
    return 'Brug mindst ét lille bogstav (a–z eller æ, ø, å).'
  }
  if (!/[A-ZÆØÅ]/.test(password)) {
    return 'Brug mindst ét stort bogstav (A–Z eller Æ, Ø, Å).'
  }
  if (!/[0-9]/.test(password)) {
    return 'Brug mindst ét tal (0–9).'
  }
  // Symbol: alt der ikke kun er bogstav/tal (inkl. ! # - osv.)
  if (!/[^A-Za-z0-9æøåÆØÅ]/.test(password)) {
    return 'Brug mindst ét symbol (fx ! ? # - @).'
  }
  return null
}
