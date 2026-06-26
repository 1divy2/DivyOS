// Single source of truth for personal info. Swap values without touching UI.
export const identity = {
  name: "Divy Dadheech",
  handle: "1divy2",
  role: "Software Engineer · ML Enthusiast",
  location: "Udaipur, Rajasthan, India",
  email: "dadheech120404@gmail.com",
  links: {
    github: "https://github.com/1divy2",
    linkedin: "https://linkedin.com/in/divydadheech", // Assuming standard format
    twitter: "https://twitter.com/1divy2",
    website: "https://github.com/1divy2",
  },
  bio: "Computer Science Engineering student at VIT-AP. Passionate about Machine Learning, Full-Stack Development, and building DivyOS.",
  bootString: "DivyOS 1.0 — built by Divy. press any key to enter.",
} as const;
