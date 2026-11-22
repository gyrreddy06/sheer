import en from './en.json';

// Structure ready for Tamil, Kannada, Malayalam (fallbacks gracefully to en keys while keeping structure)
export const ta = { ...en, app: { ...en.app, tagline: "தனிப்பட்ட கண்காணிப்பு, எளிய உடல்நல குறிப்புகள், மருத்துவ அறிக்கை" } };
export const kn = { ...en, app: { ...en.app, tagline: "ಖಾಸಗಿ ಟ್ರ್ಯಾಕಿಂಗ್, ಸರಳ ಆರೋಗ್ಯ ಒಳನೋಟಗಳು, ವೈದ್ಯರ ವರದಿಗಳು" } };
export const ml = { ...en, app: { ...en.app, tagline: "സ്വകാര്യ ട്രാക്കിംഗ്, ലളിതമായ ആരോഗ്യ ഉൾക്കാഴ്ചകൾ, ഡോക്ടർ റിപ്പോർട്ടുകൾ" } };
