import blue from './art/av-blue.webp';
import violet from './art/av-violet.webp';
import green from './art/av-green.webp';
import orange from './art/av-orange.webp';
import yellow from './art/av-yellow.webp';
import pink from './art/av-pink.webp';
import teal from './art/av-teal.webp';
import indigo from './art/av-indigo.webp';

/** The eight tones, in the order the tone pick indexes them. Do not reorder: it would change every person's colour. */
export const tones = ['blue', 'violet', 'green', 'orange', 'yellow', 'pink', 'teal', 'indigo'] as const;
export type AvatarTone = (typeof tones)[number];

export const toneArt: Record<AvatarTone, string> = { blue, violet, green, orange, yellow, pink, teal, indigo };

/** Same person, same colour on every screen: sum the character codes of the user ID, take it mod 8. Never pick by name or at random. */
export function toneFor(userId: string | undefined): AvatarTone {
  if (!userId) return 'blue';
  let sum = 0;
  for (let i = 0; i < userId.length; i++) sum += userId.charCodeAt(i);
  return tones[sum % tones.length] as AvatarTone;
}
