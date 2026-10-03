/* ============================================================================
 * 💌  PERSONALIZE YOUR WEBSITE HERE
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit. Change the values, save, done.
 *
 * Tip: you can also set the names straight from the link, no rebuild needed:
 *      https://your-site.com/?to=Sarah&from=Ali
 * ========================================================================== */

export const dateConfig = {
  // Her name. Used gently: on the opening letter, the "invoice" and the ticket.
  // Leave it as "Her Name" (or empty) and the site just says "you" instead.
  girlfriendName: 'Her Name',

  // Your name. Used to sign the final screen ("— Ali").
  // Leave it as "Your Name" (or empty) and the signature is hidden.
  senderName: 'Your Name',

  // First screen: "Hey Sarah… <defaultMessage>"
  defaultMessage: 'I have a very important question.',

  // The very last line of the story.
  finalMessage: "Can't wait to see you. ❤️",

  // ── Photo on the question screen ──────────────────────────────────────────
  // Drop your photo in /public/images/ with this exact name (or change the path).
  // If the file is missing, a cute illustrated puppy shows instead.
  photo: 'images/date-photo.jpg',
  photoAlt: 'A photo of us',
  photoCaption: 'this could be us 🥹',

  // ── Music (optional) ──────────────────────────────────────────────────────
  // Put an .mp3 in /public/music/ with this name. Nothing autoplays: a small ♪
  // button appears in the corner. If the file doesn't exist, the button hides.
  music: 'music/our-song.mp3',
  musicLabel: 'play our song',

  // ── The "payment" prank (it's fake, nothing is ever charged) ──────────────
  prankPrice: 499,
  currency: '$',

  // ── Replies ───────────────────────────────────────────────────────────────
  // Optional: your WhatsApp number, international format, digits only
  // (e.g. '923001234567'). If set, the last screen gets a button that opens
  // WhatsApp with her answers already typed out for you.
  whatsappNumber: '',

  // ── Choices ───────────────────────────────────────────────────────────────
  // Times she can pick (24h "HH:MM"). Past times are hidden automatically if she picks today.
  timeSlots: ['12:00', '13:30', '15:00', '17:00', '18:00', '19:00', '20:00', '21:00'],

  // How many days ahead she can pick a date.
  maxDaysAhead: 180,

  // The food cards. Edit, reorder, or swap emojis freely (keep 4–6 for the nicest grid).
  foods: [
    { id: 'pizza', emoji: '🍕', label: 'Pizza', note: 'cheesy, like this website', reaction: 'extra cheese, obviously.' },
    { id: 'sushi', emoji: '🍣', label: 'Sushi', note: 'fancy era', reaction: 'my chopstick skills are about to be tested 🥢' },
    { id: 'burgers', emoji: '🍔', label: 'Burgers', note: 'messy & happy', reaction: "I'll bring the napkins. you bring the cute." },
    { id: 'pasta', emoji: '🍝', label: 'Pasta', note: 'candlelit vibes', reaction: 'very romantic of you 🕯️' },
    { id: 'tacos', emoji: '🌮', label: 'Tacos', note: 'a little spicy 🌶️', reaction: "taco 'bout perfect." },
    { id: 'ramen', emoji: '🍜', label: 'Ramen', note: 'cozy noodle date', reaction: 'slurping is allowed. I checked.' },
  ],
}
