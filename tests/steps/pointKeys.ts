/** Point titles as a visitor reads them in the panel, mapped to the site's POI keys. */
const POINT_KEYS: Record<string, string> = {
  "Blaise Moses": "me",
  "Buy Me a Coffee": "coffee",
  "B.S. Computer Science": "degree",
  Experience: "whiteboard",
  GitHub: "octocat",
  "My Family's Business": "car",
  "Vibecoding & Agentic Things": "claude",
  Blog: "notebook",
  LinkedIn: "linkedin",
  X: "x",
  YouTube: "youtube",
  "Record Collecting": "turntable",
  Guitar: "guitar",
  Reading: "books",
  Lifting: "weights",
  "Retro Hardware & Video Games": "gameboy",
};

/** Translate a point title into its POI key; throws on a title the site does not have. */
export function pointKey(title: string): string {
  const key = POINT_KEYS[title];
  if (!key) throw new Error(`unknown point title "${title}"`);
  return key;
}
