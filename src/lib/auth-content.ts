export type AuthVariant =
  | 'signup'
  | 'admin-signup'
  | 'otp'
  | 'login'
  | 'verify-otp'
  | 'forgot-password'
  | 'reset-password';

export const AUTH_CONTENT: Record<AuthVariant, {
  imageUrl: string;
  verse: string;
  reference: string;
}> = {
  signup: {
    imageUrl: '/auth/form.webp',
    verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. Then you will call upon me and come and pray to me, and I will hear you. You will seek me and find me, when you seek me with all your heart.",
    reference: 'Jeremiah 29:11–13',
  },
  'admin-signup': {
    imageUrl: '/auth/form.webp',
    verse: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope. Then you will call upon me and come and pray to me, and I will hear you. You will seek me and find me, when you seek me with all your heart.",
    reference: 'Jeremiah 29:11–13',
  },
  otp: {
    imageUrl: '/auth/code.webp',
    verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: 'Philippians 4:6-7',
  },
  login: {
    imageUrl: '/auth/login/login.webp',
    verse: "Let us then with confidence draw near to the throne of grace, that we may receive mercy and find grace to help in time of need.",
    reference: 'Hebrews 4:16',
  },
  'verify-otp': {
    imageUrl: '/auth/login/code.webp',
    verse: "The steadfast love of the Lord never ceases; His mercies never come to an end; they are new every morning; great is Your faithfulness. 'The Lord is my portion,' says my soul, 'therefore I will hope in Him.",
    reference: 'Lamentations 3:22-24',
  },
  'forgot-password': {
    imageUrl: '/auth/login/forgot-pw.webp',
    verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: 'Philippians 4:6-7',
  },
  'reset-password': {
    imageUrl: '/auth/login/reset.webp',
    verse: "I will give you a new heart and put a new spirit within you; I will remove from you your heart of stone and give you a heart of flesh. And I will put My Spirit in you and move you to follow My decrees and be careful to keep My laws.",
    reference: 'Ezekiel 36:26-27',
  },
};
