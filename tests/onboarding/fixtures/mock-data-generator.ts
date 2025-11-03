/**
 * Mock Data Generator for Onboarding Tests
 * Generates test data for 5 enterprises and 20 users (4 per enterprise)
 */

import { Timestamp } from "firebase/firestore";

export type EnterpriseCategory =
  | "healthcare"
  | "financial"
  | "retail"
  | "technology"
  | "education";
export type UserRole = "super_admin" | "platform_admin" | "org_admin" | "user";

export interface MockEnterprise {
  id: string;
  name: string;
  category: EnterpriseCategory;
  domain: string;
  industry: string;
  size: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  phone: string;
  website: string;
  taxId: string;
  createdAt: Timestamp;
  status: "active" | "pending" | "suspended";
}

export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enterpriseId: string;
  enterpriseName: string;
  phone: string;
  department: string;
  title: string;
  password: string; // For test purposes only
  createdAt: Timestamp;
  status: "active" | "pending" | "invited";
}

/**
 * Enterprise templates with realistic data
 */
const enterpriseTemplates = [
  {
    category: "healthcare" as EnterpriseCategory,
    name: "MediCare Health Systems",
    domain: "medicare-health.com",
    industry: "Healthcare",
    size: "1000-5000",
    country: "United States",
    state: "California",
    city: "San Francisco",
    address: "123 Medical Plaza Dr",
    zipCode: "94102",
    phone: "+1-415-555-0100",
    website: "https://medicare-health.com",
    taxId: "EIN-12-3456789",
  },
  {
    category: "financial" as EnterpriseCategory,
    name: "SecureBank Financial Group",
    domain: "securebank.com",
    industry: "Financial Services",
    size: "5000-10000",
    country: "United States",
    state: "New York",
    city: "New York",
    address: "456 Wall Street",
    zipCode: "10005",
    phone: "+1-212-555-0200",
    website: "https://securebank.com",
    taxId: "EIN-23-4567890",
  },
  {
    category: "retail" as EnterpriseCategory,
    name: "RetailMart Corporation",
    domain: "retailmart.com",
    industry: "Retail",
    size: "500-1000",
    country: "United States",
    state: "Texas",
    city: "Houston",
    address: "789 Commerce Blvd",
    zipCode: "77002",
    phone: "+1-713-555-0300",
    website: "https://retailmart.com",
    taxId: "EIN-34-5678901",
  },
  {
    category: "technology" as EnterpriseCategory,
    name: "TechInnovate Solutions",
    domain: "techinnovate.io",
    industry: "Technology",
    size: "100-500",
    country: "United States",
    state: "Washington",
    city: "Seattle",
    address: "321 Innovation Way",
    zipCode: "98101",
    phone: "+1-206-555-0400",
    website: "https://techinnovate.io",
    taxId: "EIN-45-6789012",
  },
  {
    category: "education" as EnterpriseCategory,
    name: "Global Education Institute",
    domain: "globaledu.edu",
    industry: "Education",
    size: "1000-5000",
    country: "United States",
    state: "Massachusetts",
    city: "Boston",
    address: "555 University Ave",
    zipCode: "02115",
    phone: "+1-617-555-0500",
    website: "https://globaledu.edu",
    taxId: "EIN-56-7890123",
  },
];

/**
 * User role templates with department and title combinations
 */
const userRoleTemplates: Record<
  UserRole,
  { departments: string[]; titles: string[] }
> = {
  super_admin: {
    departments: ["Executive", "Administration"],
    titles: ["Chief Executive Officer", "Chief Technology Officer"],
  },
  platform_admin: {
    departments: ["IT", "Operations"],
    titles: ["IT Director", "Operations Manager"],
  },
  org_admin: {
    departments: ["Compliance", "Security"],
    titles: ["Compliance Manager", "Security Director"],
  },
  user: {
    departments: ["Operations", "Support", "Sales", "Marketing"],
    titles: ["Analyst", "Specialist", "Coordinator", "Associate"],
  },
};

/**
 * First and last names for generating user data
 */
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Christopher",
  "Karen",
  "Daniel",
  "Nancy",
  "Matthew",
  "Lisa",
  "Anthony",
  "Betty",
  "Mark",
  "Margaret",
  "Donald",
  "Sandra",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
];

/**
 * Generate a unique enterprise ID
 */
function generateEnterpriseId(category: string, index: number): string {
  return `ent_${category.substring(0, 4)}_${Date.now()}_${index}`;
}

/**
 * Generate a unique user ID
 */
function generateUserId(
  firstName: string,
  lastName: string,
  index: number
): string {
  return `usr_${firstName.toLowerCase()}_${lastName.toLowerCase()}_${index}`;
}

/**
 * Generate mock enterprises
 */
export function generateMockEnterprises(): MockEnterprise[] {
  return enterpriseTemplates.map((template, index) => ({
    id: generateEnterpriseId(template.category, index),
    ...template,
    createdAt: Timestamp.now(),
    status: "active",
  }));
}

/**
 * Generate mock users for all enterprises
 */
export function generateMockUsers(enterprises: MockEnterprise[]): MockUser[] {
  const users: MockUser[] = [];
  const roles: UserRole[] = [
    "super_admin",
    "platform_admin",
    "org_admin",
    "user",
  ];

  enterprises.forEach((enterprise, entIndex) => {
    roles.forEach((role, roleIndex) => {
      const userIndex = entIndex * 4 + roleIndex;
      const firstName = firstNames[userIndex % firstNames.length];
      const lastName = lastNames[userIndex % lastNames.length];
      const roleTemplate = userRoleTemplates[role];

      const department =
        roleTemplate.departments[
          Math.floor(Math.random() * roleTemplate.departments.length)
        ];
      const title =
        roleTemplate.titles[
          Math.floor(Math.random() * roleTemplate.titles.length)
        ];

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${
        enterprise.domain
      }`;

      users.push({
        id: generateUserId(firstName, lastName, userIndex),
        email,
        firstName,
        lastName,
        role,
        enterpriseId: enterprise.id,
        enterpriseName: enterprise.name,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-555-${String(
          userIndex
        ).padStart(4, "0")}`,
        department,
        title,
        password: `Test@${role}123!`, // Strong password for testing
        createdAt: Timestamp.now(),
        status: "active",
      });
    });
  });

  return users;
}

/**
 * Generate all mock data
 */
export function generateAllMockData() {
  const enterprises = generateMockEnterprises();
  const users = generateMockUsers(enterprises);

  return {
    enterprises,
    users,
    summary: {
      totalEnterprises: enterprises.length,
      totalUsers: users.length,
      usersByRole: {
        super_admin: users.filter((u) => u.role === "super_admin").length,
        platform_admin: users.filter((u) => u.role === "platform_admin").length,
        org_admin: users.filter((u) => u.role === "org_admin").length,
        user: users.filter((u) => u.role === "user").length,
      },
      enterprisesByCategory: enterprises.reduce((acc, ent) => {
        acc[ent.category] = (acc[ent.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
  };
}

/**
 * Export mock data to JSON file for inspection
 */
export function exportMockDataToJSON() {
  const data = generateAllMockData();
  return JSON.stringify(data, null, 2);
}

/**
 * Get a specific enterprise by category
 */
export function getEnterpriseByCategory(
  category: EnterpriseCategory
): MockEnterprise {
  const enterprises = generateMockEnterprises();
  const enterprise = enterprises.find((e) => e.category === category);
  if (!enterprise) {
    throw new Error(`No enterprise found for category: ${category}`);
  }
  return enterprise;
}

/**
 * Get users for a specific enterprise
 */
export function getUsersForEnterprise(enterpriseId: string): MockUser[] {
  const enterprises = generateMockEnterprises();
  const users = generateMockUsers(enterprises);
  return users.filter((u) => u.enterpriseId === enterpriseId);
}
