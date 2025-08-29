export const resourcesData = {
  visa: {
    title: "Visa & Immigration",
    description: "Complete guide for visa applications, work permits, and residence permits",
    icon: "FiFileText",
    resources: [
      {
        id: "blue-card",
        title: "EU Blue Card for IT Professionals",
        description: "Fast-track residence permit for highly skilled professionals. Minimum salary requirement: €48,300 (2025) or €43,759 for shortage occupations.",
        content: {
          requirements: [
            "University degree or 3+ years IT experience",
            "Job offer with minimum salary threshold",
            "Employment contract for at least 6 months",
            "Health insurance coverage"
          ],
          benefits: [
            "Permanent residence after 21-27 months",
            "Family reunification rights",
            "Travel freely within EU",
            "Path to German citizenship"
          ],
          process: "Apply at VFS Global India → Get visa → Register in Germany → Convert to Blue Card at Ausländerbehörde",
          timeline: "4-12 weeks processing",
          links: [
            { title: "Make it in Germany", url: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" },
            { title: "VFS Global India", url: "https://visa.vfsglobal.com/one-pager/germany/india/" }
          ]
        }
      },
      {
        id: "work-visa",
        title: "Standard Work Visa",
        description: "Regular employment visa for professionals. Minimum salary: €43,470 (2025), or €53,130 for first-time workers over 45.",
        content: {
          requirements: [
            "Recognized qualification",
            "Concrete job offer",
            "Proof of accommodation",
            "Health insurance"
          ],
          documents: [
            "Passport with 6+ months validity",
            "Employment contract",
            "University degree certificates",
            "CV and cover letter",
            "Proof of accommodation"
          ],
          timeline: "4-12 weeks",
          tips: "Book VFS appointment early, get documents apostilled, prepare for interview"
        }
      },
      {
        id: "family-reunion",
        title: "Family Reunification Visa",
        description: "Bring your spouse and children to Germany. Available for Blue Card and work permit holders.",
        content: {
          eligibility: [
            "Valid residence permit holder",
            "Sufficient living space",
            "Adequate income to support family",
            "Health insurance for all family members"
          ],
          documents: [
            "Marriage certificate (apostilled)",
            "Birth certificates for children",
            "Proof of accommodation",
            "Income statements"
          ],
          benefits: "Spouse can work without restrictions, children get free education"
        }
      },
      {
        id: "permanent-residence",
        title: "Settlement Permit (Niederlassungserlaubnis)",
        description: "Permanent residence after 5 years (or 21 months with Blue Card and B1 German).",
        content: {
          requirements: [
            "5 years of residence (21-27 months for Blue Card)",
            "60 months of pension contributions",
            "German language B1 level",
            "Secure livelihood",
            "No criminal record"
          ],
          benefits: [
            "Unlimited work permit",
            "No renewal required",
            "Access to all social benefits",
            "Path to citizenship after 8 years"
          ]
        }
      }
    ]
  },
  housing: {
    title: "Housing & Accommodation",
    description: "Find your perfect home in Frankfurt - from temporary to permanent housing",
    icon: "FiHome",
    resources: [
      {
        id: "rental-basics",
        title: "Frankfurt Rental Market Overview",
        description: "Average rent: €1,253/month for 1BR city center, €931/month outside. Highly competitive market.",
        content: {
          avgPrices: {
            "1BR City Center": "€1,200-1,500",
            "1BR Outside": "€900-1,100",
            "2BR City Center": "€1,800-2,200",
            "WG Room": "€500-800"
          },
          popularAreas: [
            "Westend - Upscale, central, expensive",
            "Bornheim - Trendy, good restaurants, mid-range",
            "Sachsenhausen - Nightlife, young professionals",
            "Nordend - Quiet, families, good value",
            "Bockenheim - Students, affordable, multicultural"
          ],
          indianCommunityAreas: [
            "Bad Homburg - Large Indian community",
            "Eschborn - Tech companies, families",
            "Niederrad - Affordable, good connections"
          ]
        }
      },
      {
        id: "documents-required",
        title: "Rental Application Documents",
        description: "Essential paperwork for securing an apartment in Frankfurt's competitive market.",
        content: {
          mandatory: [
            "SCHUFA credit report (get at meineschufa.de)",
            "Last 3 salary slips",
            "Employment contract",
            "Copy of passport/ID",
            "Mietschuldenfreiheitsbescheinigung (previous landlord reference)"
          ],
          helpful: [
            "Bank statements (3 months)",
            "Letter of recommendation",
            "Guarantor declaration (Bürgschaft)",
            "Proof of savings"
          ],
          tips: [
            "Prepare a tenant application folder (Bewerbermappe)",
            "Include a cover letter in German",
            "Dress professionally for viewings",
            "Respond to listings within hours"
          ]
        }
      },
      {
        id: "temporary-housing",
        title: "Temporary Accommodation Options",
        description: "Short-term solutions while searching for permanent housing.",
        content: {
          options: [
            {
              type: "Serviced Apartments",
              providers: ["Wunderflats", "Homelike", "Housing Anywhere"],
              cost: "€1,500-2,500/month",
              pros: "No SCHUFA needed, fully furnished, flexible"
            },
            {
              type: "WG (Shared Flat)",
              platforms: ["WG-Gesucht", "Studenten-WG"],
              cost: "€500-800/month",
              pros: "Affordable, social, easier to get"
            },
            {
              type: "Airbnb/Booking",
              cost: "€60-150/night",
              duration: "Good for first 2-4 weeks"
            }
          ],
          indianHostels: [
            "Contact Indian community groups for temporary stays",
            "Check with Indian restaurants/shops for leads"
          ]
        }
      },
      {
        id: "anmeldung-process",
        title: "Anmeldung (Address Registration)",
        description: "Mandatory registration within 14 days of moving. Required for everything in Germany.",
        content: {
          required: [
            "Completed Anmeldung form",
            "Passport/ID",
            "Rental contract or Wohnungsgeberbestätigung",
            "Marriage/birth certificates (if applicable)"
          ],
          locations: [
            "Bürgeramt Frankfurt (multiple locations)",
            "Book appointment online at frankfurt.de",
            "Walk-ins possible but expect long waits"
          ],
          importance: [
            "Required for bank account",
            "Needed for health insurance",
            "Essential for work permit",
            "Must have for tax ID"
          ],
          tip: "Book appointment before arriving in Germany"
        }
      }
    ]
  },
  jobs: {
    title: "Jobs & Career",
    description: "Navigate Frankfurt's thriving job market, especially in IT and finance",
    icon: "FiBriefcase",
    resources: [
      {
        id: "job-market",
        title: "Frankfurt Job Market for Indians",
        description: "Frankfurt's IT sector growing 12% in 2025. Major hub for finance, tech, and consulting.",
        content: {
          topSectors: [
            "Banking & Finance (Deutsche Bank, Commerzbank, ECB)",
            "IT & Software (SAP, Accenture, IBM)",
            "Consulting (Big 4, McKinsey, BCG)",
            "Pharma & Healthcare (Sanofi, Fresenius)",
            "Aviation (Lufthansa, Fraport)"
          ],
          inDemandSkills: [
            "Cloud Architecture (AWS, Azure)",
            "Data Science & AI/ML",
            "Cybersecurity",
            "DevOps & Automation",
            "SAP Development",
            "Full-stack Development"
          ],
          salaryRanges: {
            "Junior Developer": "€45,000-55,000",
            "Senior Developer": "€65,000-85,000",
            "Tech Lead": "€75,000-95,000",
            "Solution Architect": "€85,000-120,000",
            "Data Scientist": "€60,000-90,000"
          }
        }
      },
      {
        id: "job-search",
        title: "Job Search Platforms & Strategies",
        description: "Best platforms and approaches for finding jobs in Frankfurt.",
        content: {
          jobPortals: [
            "LinkedIn - Most effective for networking",
            "Xing - German LinkedIn, very important",
            "StepStone - Leading German job portal",
            "Indeed Germany - International listings",
            "Glassdoor - Company reviews and salaries",
            "Jobs.de - Local opportunities"
          ],
          indianRecruiters: [
            "Indian recruitment agencies in Frankfurt",
            "Tech Mahindra Germany",
            "Infosys Frankfurt",
            "TCS Deutschland",
            "Wipro Germany"
          ],
          networkingTips: [
            "Join Frankfurt Tech Meetups",
            "Attend Indian Professional Network events",
            "Connect with Indians on LinkedIn/Xing",
            "Join 'Frankfurt Indians' Facebook groups"
          ]
        }
      },
      {
        id: "german-cv",
        title: "German CV & Application Standards",
        description: "German applications differ significantly from Indian standards. Follow local conventions.",
        content: {
          cvStructure: [
            "Professional photo (optional but common)",
            "Personal details (name, address, phone)",
            "Professional summary (2-3 lines)",
            "Work experience (reverse chronological)",
            "Education",
            "Skills (languages, technical)",
            "Hobbies/interests (brief)"
          ],
          applicationFolder: [
            "Cover letter (Anschreiben) - 1 page",
            "CV (Lebenslauf) - 2 pages max",
            "Certificates (Zeugnisse) - degrees, courses",
            "References (Arbeitszeugnisse)"
          ],
          tips: [
            "Tailor each application",
            "Use formal German if possible",
            "Highlight German language skills",
            "Include all certificates"
          ]
        }
      },
      {
        id: "work-culture",
        title: "German Work Culture & Etiquette",
        description: "Understanding German workplace culture for successful integration.",
        content: {
          keyAspects: [
            "Punctuality is critical - arrive 5 min early",
            "Direct communication style",
            "Work-life balance respected",
            "Hierarchy and titles important",
            "Planning and structure valued"
          ],
          workingHours: [
            "Standard: 35-40 hours/week",
            "Flexible hours (Gleitzeit) common",
            "30 days vacation standard",
            "Sick leave with doctor's note"
          ],
          officeEtiquette: [
            "Shake hands on arrival/departure",
            "Use formal Sie until invited to Du",
            "Respect quiet hours",
            "Participate in coffee breaks"
          ]
        }
      }
    ]
  },
  education: {
    title: "Education & Schools",
    description: "German education system, schools, and learning opportunities",
    icon: "FiBook",
    resources: [
      {
        id: "school-system",
        title: "German School System Overview",
        description: "Free public education from age 6. Different tracks after primary school.",
        content: {
          structure: [
            "Kindergarten (3-6 years) - Optional",
            "Grundschule (6-10 years) - Primary",
            "Gymnasium (10-18) - University track",
            "Realschule (10-16) - Vocational track",
            "Hauptschule (10-15) - Basic vocational"
          ],
          international: [
            "Frankfurt International School",
            "Metropolitan School Frankfurt",
            "Strothoff International School",
            "European School Frankfurt"
          ],
          indianOptions: [
            "Indian curriculum not widely available",
            "Weekend Hindi/Sanskrit classes available",
            "Indian cultural programs through associations"
          ]
        }
      },
      {
        id: "german-language",
        title: "Learning German",
        description: "Essential for integration. Free/subsidized courses available through integration programs.",
        content: {
          levels: [
            "A1-A2: Basic communication",
            "B1: Required for permanent residence",
            "B2: Professional proficiency",
            "C1-C2: Fluent/Native level"
          ],
          schools: [
            "Volkshochschule (VHS) - Affordable public courses",
            "Goethe Institut - Premium quality",
            "Berlitz Frankfurt",
            "Sprachcaffe Language School"
          ],
          integrationCourse: [
            "600 hours German + 100 hours orientation",
            "Subsidized for visa holders",
            "Cost: €1.95/hour (or free if eligible)",
            "Certificate helps with residence permit"
          ],
          onlineResources: [
            "Deutsche Welle Learn German",
            "Babbel/Duolingo apps",
            "YouTube channels",
            "Language exchange meetups"
          ]
        }
      },
      {
        id: "higher-education",
        title: "Universities & Higher Education",
        description: "Excellent universities with low/no tuition fees. Popular for Indian students.",
        content: {
          universities: [
            "Goethe University Frankfurt - Largest, comprehensive",
            "Frankfurt School of Finance - Business focus",
            "University of Applied Sciences - Practical programs",
            "TU Darmstadt (nearby) - Engineering excellence"
          ],
          popularPrograms: [
            "MBA programs (English-taught)",
            "Computer Science & IT",
            "Finance & Banking",
            "Engineering",
            "Data Science"
          ],
          costs: [
            "Public universities: €300-500/semester",
            "Private universities: €5,000-30,000/year",
            "Living costs: €800-1,200/month",
            "Student visa requirement: €11,208 blocked account"
          ]
        }
      }
    ]
  },
  healthcare: {
    title: "Healthcare & Insurance",
    description: "Understanding Germany's healthcare system and insurance requirements",
    icon: "FiHeart",
    resources: [
      {
        id: "health-insurance",
        title: "Mandatory Health Insurance",
        description: "Health insurance is legally required for all residents. Choose between public and private.",
        content: {
          public: [
            "Cost: ~15% of gross salary (employer pays half)",
            "Covers entire family",
            "No pre-existing condition exclusions",
            "Popular: TK, AOK, DAK, Barmer"
          ],
          private: [
            "For high earners (>€69,300/year)",
            "Individual premiums",
            "Better services, shorter waits",
            "Difficult to switch back to public"
          ],
          forNewcomers: [
            "Start with travel insurance (first 3 months)",
            "Register with public insurance ASAP",
            "Employer usually helps with enrollment",
            "EU Blue Card holders get immediate coverage"
          ]
        }
      },
      {
        id: "medical-system",
        title: "Accessing Medical Care",
        description: "How to find doctors and navigate the German healthcare system.",
        content: {
          findingDoctors: [
            "Hausarzt (GP) - Your first point of contact",
            "Use Jameda.de to find English-speaking doctors",
            "Ask Indian community for recommendations",
            "Appointments needed (no walk-ins usually)"
          ],
          indianDoctors: [
            "Several Indian doctors in Frankfurt",
            "Check Consulate website for list",
            "Indian Doctors Association Germany"
          ],
          emergency: [
            "Emergency: Call 112",
            "Urgent care: 116 117",
            "Hospital ER for serious issues",
            "Pharmacy emergency service available"
          ]
        }
      }
    ]
  },
  banking: {
    title: "Banking & Finance",
    description: "Open bank accounts, understand taxes, and manage finances",
    icon: "FiCreditCard",
    resources: [
      {
        id: "bank-accounts",
        title: "Opening a Bank Account",
        description: "Essential for salary, rent, and daily transactions. Required for most services.",
        content: {
          requirements: [
            "Passport",
            "Anmeldung (address registration)",
            "Employment contract or proof of income",
            "Sometimes: SCHUFA report"
          ],
          recommendedBanks: [
            "Deutsche Bank - Wide network, English service",
            "Commerzbank - Good for internationals",
            "Sparkasse - Local, extensive ATM network",
            "N26 - Digital bank, English app",
            "DKB - Online, free account"
          ],
          indianBanks: [
            "State Bank of India Frankfurt",
            "ICICI Bank - Corporate banking only",
            "For remittances: Wise, Remitly, Western Union"
          ]
        }
      },
      {
        id: "taxes",
        title: "German Tax System",
        description: "Progressive tax system. Important to understand for financial planning.",
        content: {
          taxClasses: [
            "Class I: Single/divorced",
            "Class III/V: Married (one earner)",
            "Class IV: Married (both earning)",
            "Indians usually start with Class I"
          ],
          deductions: [
            "Income tax: 14-45%",
            "Solidarity surcharge: 5.5% of tax",
            "Church tax: 8-9% (optional)",
            "Social security: ~20% (pension, unemployment)"
          ],
          taxReturn: [
            "File annually by July 31",
            "Can claim many deductions",
            "Use ELSTER online portal",
            "Consider tax advisor (Steuerberater)"
          ]
        }
      }
    ]
  },
  local: {
    title: "Local Services",
    description: "Indian shops, restaurants, and community services in Frankfurt",
    icon: "FiMapPin",
    resources: [
      {
        id: "indian-groceries",
        title: "Indian Grocery Stores",
        description: "Find all your Indian cooking essentials and comfort foods.",
        content: {
          stores: [
            {
              name: "Asia Supermarkt",
              address: "Moselstraße 25",
              speciality: "Wide variety, fresh vegetables"
            },
            {
              name: "Indian Store Frankfurt",
              address: "Kaiserstraße 67",
              speciality: "Spices, frozen items, sweets"
            },
            {
              name: "Patel Cash & Carry",
              address: "Hanauer Landstraße",
              speciality: "Bulk buying, good prices"
            }
          ],
          onlineDelivery: [
            "Indiangrocery.de",
            "Spicelands.de",
            "Asian-food.de"
          ]
        }
      },
      {
        id: "indian-restaurants",
        title: "Indian Restaurants",
        description: "From street food to fine dining - taste of home in Frankfurt.",
        content: {
          popular: [
            "Saravanaa Bhavan - Authentic South Indian",
            "Indian Palace - North Indian fine dining",
            "Masala House - Modern Indian fusion",
            "Delhi Tandoori - Traditional tandoor",
            "Mumbai Lounge - Street food specialties"
          ],
          areas: [
            "Kaiserstraße - Multiple Indian restaurants",
            "Bahnhofsviertel - Diverse Indian options",
            "Sachsenhausen - Upscale Indian dining"
          ]
        }
      },
      {
        id: "community-services",
        title: "Indian Community Services",
        description: "Religious, cultural, and social services for the Indian community.",
        content: {
          religious: [
            "Hindu Temple Frankfurt (in planning)",
            "Gurdwara Frankfurt - Sikh temple",
            "ISKCON Frankfurt - Krishna consciousness",
            "Prayer groups in community centers"
          ],
          cultural: [
            "Indian Cultural Association Frankfurt",
            "Bollywood dance classes",
            "Yoga and meditation centers",
            "Indian music and arts schools"
          ],
          professional: [
            "Indian Professionals Network",
            "Women's groups",
            "Student associations",
            "Sports clubs (cricket, badminton)"
          ]
        }
      }
    ]
  },
  emergency: {
    title: "Emergency Contacts",
    description: "Important numbers and services for emergencies",
    icon: "FiAlertCircle",
    resources: [
      {
        id: "emergency-numbers",
        title: "Emergency Numbers",
        description: "Save these numbers in your phone immediately upon arrival.",
        content: {
          critical: [
            "112 - Medical emergency/Fire",
            "110 - Police",
            "116 117 - Medical on-call service",
            "0800 111 0 111 - Crisis helpline"
          ],
          consulate: [
            "Indian Consulate Frankfurt: +49 69 153 00 50",
            "Emergency (after hours): +49 162 282 4524",
            "Email: cons.frankfurt@mea.gov.in"
          ],
          utilities: [
            "Gas leak: 0800 2 888 112",
            "Power outage: Check provider",
            "Water emergency: 069 213 23232"
          ]
        }
      }
    ]
  }
};

export const quickTips = [
  {
    category: "arrival",
    title: "First Week Checklist",
    items: [
      "Register address (Anmeldung) within 14 days",
      "Open bank account",
      "Get SIM card (Aldi Talk, Vodafone, O2)",
      "Apply for tax ID at Finanzamt",
      "Register for health insurance"
    ]
  },
  {
    category: "daily",
    title: "Daily Life Tips",
    items: [
      "Shops closed on Sundays (plan ahead)",
      "Carry cash - many places don't accept cards",
      "Punctuality is very important",
      "Recycling is mandatory and strict",
      "Quiet hours: 10 PM - 6 AM, all day Sunday"
    ]
  },
  {
    category: "integration",
    title: "Integration Tips",
    items: [
      "Learn basic German phrases immediately",
      "Join Indian WhatsApp/Facebook groups",
      "Attend community events and festivals",
      "Network actively for job opportunities",
      "Understand and respect local customs"
    ]
  }
];

export const importantLinks = [
  {
    title: "Indian Consulate Frankfurt",
    url: "https://cgifrankfurt.gov.in/",
    description: "Official consular services, passport, OCI"
  },
  {
    title: "Frankfurt City Portal",
    url: "https://frankfurt.de",
    description: "Official city services and information"
  },
  {
    title: "Welcome Center Frankfurt",
    url: "https://www.frankfurt-main.ihk.de/international/welcome-center",
    description: "Support for international professionals"
  },
  {
    title: "Make it in Germany",
    url: "https://www.make-it-in-germany.com",
    description: "Official portal for qualified professionals"
  },
  {
    title: "Frankfurt Public Transport",
    url: "https://www.rmv.de",
    description: "RMV - Local transport information"
  }
];