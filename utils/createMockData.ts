import { Location, Resource } from "@/types/global";
import { faker } from "@faker-js/faker";
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

// Define the types and associated services
const TYPES = ["hospital", "entertainment", "support"] as const;
type LocationType = (typeof TYPES)[number];

// Map each type to a specific list of services
const SERVICES: Record<LocationType, string[]> = {
  hospital: [
    "Hormone therapy",
    "Gender-affirming surgeries",
    "Mental health support",
    "Primary care",
  ],
  entertainment: ["Nightlife", "Live shows", "Dance parties", "Social events"],
  support: [
    "Support groups",
    "Counseling",
    "Legal assistance",
    "Housing resources",
  ],
};

// Sample working hours for weekdays and weekends
const WORKING_HOURS = [
  { day: "Monday-Friday", open: "08:00", close: "20:00" },
  { day: "Saturday", open: "10:00", close: "18:00" },
  { day: "Sunday", open: "Closed", close: "Closed" },
];

// Generate the mock data with added `type`, `services`, `contact`, and `workingHours` fields
export const createLocationListMockData = (count: number = 50): Location[] => {
  return [
    {
      id: "ams",
      name: "Hospital Sainte-Anne",
      type: "hospital",
      description:
        "Hospital Sainte-Anne offers comprehensive healthcare services for transgender individuals, including hormone therapy, gender-affirming surgeries, mental health support, and primary care.",
      address: "North Holland, Netherlands",
      services: SERVICES["hospital"],
      photos: [
        "https://www.infocusclinical.com/wp-content/uploads/2020/02/summer-amsterdam-FP.jpg",
        "https://images.theconversation.com/files/162459/original/image-20170325-12162-1tfrmbb.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=200&fit=clip",
        "https://www.kevinandamanda.com/wp-content/uploads/2014/09/amsterdam-2014-03.jpg",
        "https://specials-images.forbesimg.com/imageserve/5de4a1db755ebf0006fbea42/960x0.jpg?cropX1=0&cropX2=2121&cropY1=0&cropY2=1414",
      ],
      contact: {
        phone: "+31 20 555 5555",
        email: "info@sainteanne.nl",
        address: "123 Healthcare Lane, North Holland, Netherlands",
      },
      workingHours: WORKING_HOURS,
    },
    ...new Array(count).fill(0).map((_, index) => {
      // Randomly select a type
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      // Get services based on the selected type, fallback to an empty array if needed
      const services = SERVICES[type] || [];

      return {
        id: faker.database.mongodbObjectId(),
        name: `${faker.location.city()} ${type}`,
        type,
        description: faker.company.buzzPhrase(),
        address: `${faker.location.state()}, ${faker.location.country()}`,
        services,
        photos: Array(5)
          .fill(0)
          .map((__, _index) =>
            faker.image.urlPicsumPhotos({
              width: SCREEN_WIDTH + index + _index,
            })
          ),
        contact: {
          phone: faker.phone.number({ style: "international" }),
          email: faker.internet.email(),
          address: faker.location.streetAddress(),
        },
        workingHours: WORKING_HOURS,
      };
    }),
  ];
};

export const resources: Resource[] = [
  {
    id: "1",
    title: "Understanding Hormone Therapy",
    type: "article",
    category: "health",
    description:
      "An in-depth article about hormone therapy and what to expect.",
    content:
      "Hormone therapy can be an essential part of the transition process. In this article, we'll cover the basics of HRT, including physical and emotional effects, timelines, and important considerations to discuss with your doctor...",
    author: "Dr. Alex Monroe",
    datePublished: "2023-04-12",
    tags: ["hormone therapy", "transition", "health"],
  },
  {
    id: "2",
    title: "Starting Your Journey: A Guide to Transitioning",
    type: "guide",
    category: "transition",
    description:
      "A comprehensive guide that provides steps to start your transitioning journey, from finding support to medical options.",
    steps: [
      "Research gender-affirming care providers in your area.",
      "Schedule a consultation with a specialist.",
      "Consider social transitioning options, such as changing pronouns and attire.",
      "Begin hormone therapy if desired and under a doctor’s guidance.",
      "Explore mental health resources for ongoing support.",
    ],
    author: "Jamie Lee",
    datePublished: "2022-09-10",
    tags: ["transitioning", "guide", "support"],
  },
  {
    id: "3",
    title: "Mental Health Resources for Trans Individuals",
    type: "article",
    category: "health",
    description:
      "This article highlights available mental health resources for transgender individuals, covering therapy options, support groups, and emergency services.",
    content:
      "Navigating mental health as a trans individual comes with unique challenges. In this article, we'll discuss therapy options specifically tailored to transgender individuals, as well as support groups and resources that can provide immediate assistance...",
    author: "Dr. Riley Thompson",
    datePublished: "2023-01-15",
    tags: ["mental health", "support", "transgender resources"],
  },
  {
    id: "4",
    title: "Community Building and Finding Support",
    type: "video",
    category: "community",
    description:
      "This video explores the importance of finding a supportive community and building connections with other transgender individuals.",
    url: "https://example.com/community-support-video",
    author: "Trans Support Network",
    datePublished: "2023-05-01",
    tags: ["community", "support", "connection"],
  },
  {
    id: "5",
    title: "Legal Rights for Transgender Individuals",
    type: "guide",
    category: "legal",
    description:
      "A step-by-step guide on understanding and asserting your legal rights as a transgender individual.",
    steps: [
      "Research name change laws in your state or country.",
      "Understand your rights in the workplace regarding gender identity.",
      "Familiarize yourself with anti-discrimination protections.",
      "Learn about healthcare rights for trans individuals.",
      "Consider consulting with a legal professional if you encounter discrimination.",
    ],
    author: "Alicia Harper, Esq.",
    datePublished: "2023-03-22",
    tags: ["legal", "rights", "guide"],
  },
  {
    id: "6",
    title: "Transition Stories: Finding Strength in Adversity",
    type: "video",
    category: "community",
    description:
      "A documentary-style video where transgender individuals share their transition journeys, highlighting resilience and the power of community.",
    url: "https://example.com/transition-stories-video",
    author: "LGBTQ Media Productions",
    datePublished: "2022-11-18",
    tags: ["transition stories", "community", "resilience"],
  },
  {
    id: "7",
    title: "Physical and Emotional Changes During Transition",
    type: "article",
    category: "transition",
    description:
      "An article discussing the physical and emotional changes that may occur during a medical transition, and how to manage them.",
    content:
      "Transitioning can bring about a range of physical and emotional changes. From initial physical shifts to emotional adjustments, this article provides insights on what to expect and how to manage these changes...",
    author: "Dr. Sarah Linton",
    datePublished: "2023-06-30",
    tags: ["transition", "health", "emotional well-being"],
  },
];
