export const genders = [
  "Transgender",
  "Non-binary",
  "Intersex",
  "Genderfluid",
  "Cisgender",
  "Other (specify)",
  "Prefer not to answer",
];

export const drugs = [
  {
    name: "Estradiol",
    type: "pill",
    times: [
      { taken: false, time: "08:00 AM" },
      { taken: false, time: "08:00 PM" },
    ],
    notes: ["Take with or without food."],
  },
  {
    name: "Spironolactone",
    type: "pill",
    times: [
      { taken: false, time: "09:00 AM" },
      { taken: false, time: "09:00 PM" },
    ],
    notes: ["Take with food to avoid stomach upset."],
  },
  {
    name: "Testosterone",
    type: "injection",
    times: [{ taken: false, time: "10:00 AM" }],
    notes: ["Administer as directed by your healthcare provider."],
  },
  {
    name: "Progesterone",
    type: "pill",
    times: [
      { taken: false, time: "07:00 AM" },
      { taken: false, time: "07:00 PM" },
    ],
    notes: ["Take at bedtime to reduce drowsiness."],
  },
  {
    name: "Finasteride",
    type: "pill",
    times: [{ taken: false, time: "06:00 AM" }],
    notes: ["Take at the same time each day."],
  },
];
