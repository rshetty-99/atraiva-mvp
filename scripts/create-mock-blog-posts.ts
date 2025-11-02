// Script to create 5 mock blog posts for testing category filtering and search
// Uses Firebase Admin SDK to write directly to Firestore

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Initialize Firebase Admin
if (getApps().length === 0) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  initializeApp({
    credential: cert(serviceAccount as any),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const db = getFirestore();
const storage = getStorage();

// Helper function to get user ID by email (will use placeholder if not found)
async function getUserIdByEmail(email: string): Promise<string> {
  // For mock data, we'll use a placeholder user ID
  // In production, you'd query Clerk or users collection
  return `user_${email.replace(/[@.]/g, "_")}`;
}

// Helper function to upload image to Firebase Storage and get URL
async function uploadImageToStorage(
  localPath: string,
  destinationPath: string
): Promise<string> {
  try {
    const bucket = storage.bucket();
    if (!bucket) {
      throw new Error("Storage bucket not available");
    }

    const file = bucket.file(`blog/${destinationPath}`);

    // Check if file already exists
    const [exists] = await file.exists();
    if (exists) {
      // Get existing file URL
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      return url;
    }

    // Upload file
    await bucket.upload(localPath, {
      destination: `blog/${destinationPath}`,
      public: true,
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000",
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/blog/${destinationPath}`;
    return publicUrl;
  } catch (error) {
    // Re-throw to allow caller to handle fallback
    throw error;
  }
}

// Mock blog posts data
const mockPosts = [
  {
    title:
      "AI-Powered Threat Detection: Revolutionizing Cybersecurity in 2025",
    slug: "ai-powered-threat-detection-2025",
    excerpt:
      "Discover how artificial intelligence is transforming threat detection and response capabilities, enabling organizations to identify and mitigate security threats faster than ever before.",
    category: "AI Security",
    tags: ["AI Security", "Threat Detection", "Machine Learning", "Cybersecurity"],
    featuredImage: "blog-thumbnail-8.jpg",
    content: `<div>
      <h2>Introduction to AI in Cybersecurity</h2>
      <p>Artificial intelligence has become a game-changer in the cybersecurity landscape, enabling organizations to detect and respond to threats at unprecedented speeds. This article explores the latest advancements in AI-powered threat detection.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Real-time Detection:</strong> AI systems can analyze millions of events per second</li>
        <li><strong>Behavioral Analysis:</strong> Identify anomalies that traditional signature-based systems miss</li>
        <li><strong>Automated Response:</strong> Instant mitigation of detected threats</li>
      </ul>
      
      <h3>Machine Learning Models</h3>
      <p>Modern AI security platforms leverage deep learning and neural networks to understand attack patterns and predict future threats before they materialize.</p>
      
      <h3>Implementation Best Practices</h3>
      <ol>
        <li>Start with high-value assets and critical systems</li>
        <li>Ensure sufficient training data for accuracy</li>
        <li>Continuously refine models based on feedback</li>
        <li>Combine AI with human expertise for best results</li>
      </ol>
    </div>`,
  },
  {
    title: "Ransomware Defense Strategies: Protecting Your Enterprise Network",
    slug: "ransomware-defense-strategies-enterprise",
    excerpt:
      "Learn proven defense strategies and incident response protocols to protect your enterprise from devastating ransomware attacks that can cripple business operations.",
    category: "Ransomware",
    tags: ["Ransomware", "Incident Response", "Enterprise Security", "Backup"],
    featuredImage: "blog-thumbnail-5.jpg",
    content: `<div>
      <h2>The Ransomware Threat Landscape</h2>
      <p>Ransomware attacks have evolved significantly, targeting enterprises with sophisticated techniques and demanding increasingly larger ransoms. Understanding the threat is the first step to effective defense.</p>
      
      <h3>Common Attack Vectors</h3>
      <ul>
        <li><strong>Phishing Emails:</strong> Most common entry point for ransomware</li>
        <li><strong>Remote Desktop Protocol (RDP):</strong> Weak credentials expose networks</li>
        <li><strong>Software Vulnerabilities:</strong> Unpatched systems are prime targets</li>
        <li><strong>Supply Chain Attacks:</strong> Compromised third-party software</li>
      </ul>
      
      <h3>Defense Strategies</h3>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h4>Critical Controls:</h4>
        <ol>
          <li>Regular backups with offline storage</li>
          <li>Network segmentation to limit spread</li>
          <li>Endpoint detection and response (EDR) solutions</li>
          <li>Employee security awareness training</li>
          <li>Patch management processes</li>
        </ol>
      </div>
      
      <h3>Incident Response Planning</h3>
      <p>Having a well-documented incident response plan is crucial. Practice tabletop exercises regularly and ensure all stakeholders understand their roles during an attack.</p>
    </div>`,
  },
  {
    title:
      "Cloud Security Best Practices: Securing Multi-Cloud Environments",
    slug: "cloud-security-multi-cloud-environments",
    excerpt:
      "Navigate the complexities of securing data across multiple cloud platforms with essential security practices that protect sensitive information in today's distributed architectures.",
    category: "Cloud Protection",
    tags: ["Cloud Protection", "Multi-Cloud", "Data Security", "AWS", "Azure"],
    featuredImage: "blog-thumbnail-4.jpg",
    content: `<div>
      <h2>Multi-Cloud Security Challenges</h2>
      <p>Organizations are increasingly adopting multi-cloud strategies to avoid vendor lock-in and optimize costs. However, managing security across multiple platforms presents unique challenges.</p>
      
      <h3>Key Security Considerations</h3>
      <ul>
        <li><strong>Identity and Access Management:</strong> Centralized IAM across all clouds</li>
        <li><strong>Data Encryption:</strong> End-to-end encryption for data in transit and at rest</li>
        <li><strong>Network Security:</strong> Virtual private clouds and secure connectivity</li>
        <li><strong>Compliance:</strong> Meeting regulatory requirements across jurisdictions</li>
      </ul>
      
      <h3>Best Practices</h3>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <h4>Implementation Checklist:</h4>
        <ul>
          <li>Implement cloud security posture management (CSPM) tools</li>
          <li>Use cloud access security brokers (CASB) for visibility</li>
          <li>Enable logging and monitoring across all cloud platforms</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Establish clear data governance policies</li>
        </ul>
      </div>
      
      <h3>Vendor-Specific Considerations</h3>
      <p>Each cloud provider has unique security features and configurations. Understand the shared responsibility model and leverage native security tools effectively.</p>
    </div>`,
  },
  {
    title:
      "Incident Response Planning: A Comprehensive Guide for Security Teams",
    slug: "incident-response-planning-comprehensive-guide",
    excerpt:
      "Build an effective incident response plan that minimizes damage and ensures business continuity during security incidents with this step-by-step guide.",
    category: "Incident Response",
    tags: ["Incident Response", "Planning", "Security Operations", "Crisis Management"],
    featuredImage: "blog-thumbnail-2.jpg",
    content: `<div>
      <h2>The Importance of Incident Response Planning</h2>
      <p>A well-executed incident response plan can mean the difference between a minor security event and a catastrophic breach. This guide provides a framework for building your team's response capabilities.</p>
      
      <h3>Incident Response Lifecycle</h3>
      <ol>
        <li><strong>Preparation:</strong> Build capabilities, tools, and procedures</li>
        <li><strong>Detection and Analysis:</strong> Identify and assess security incidents</li>
        <li><strong>Containment:</strong> Prevent further damage and isolate affected systems</li>
        <li><strong>Eradication:</strong> Remove threats and vulnerabilities</li>
        <li><strong>Recovery:</strong> Restore systems to normal operations</li>
        <li><strong>Post-Incident Activity:</strong> Lessons learned and improvements</li>
      </ol>
      
      <h3>Building Your IR Team</h3>
      <p>Assemble a cross-functional team including:</p>
      <ul>
        <li>Security operations center (SOC) analysts</li>
        <li>Network engineers</li>
        <li>Legal and compliance representatives</li>
        <li>Communications/public relations</li>
        <li>Executive leadership</li>
      </ul>
      
      <h3>Tools and Technologies</h3>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
        <h4>Essential Tools:</h4>
        <ul>
          <li>Security information and event management (SIEM) systems</li>
          <li>Endpoint detection and response (EDR) platforms</li>
          <li>Forensic analysis tools</li>
          <li>Incident management and ticketing systems</li>
          <li>Communication and collaboration platforms</li>
        </ul>
      </div>
      
      <h3>Testing and Drills</h3>
      <p>Regular tabletop exercises and simulated incidents help ensure your team is prepared when real threats emerge. Schedule quarterly drills covering different attack scenarios.</p>
    </div>`,
  },
  {
    title:
      "Zero Trust Architecture: Implementation Strategies for Modern Organizations",
    slug: "zero-trust-architecture-implementation",
    excerpt:
      "Implement a zero trust security model in your organization with practical steps, real-world examples, and proven strategies for protecting your digital assets.",
    category: "Zero Trust",
    tags: ["Zero Trust", "Security", "Architecture", "Network Security", "Identity"],
    featuredImage: "blog-thumbnail-6.jpg",
    content: `<div>
      <h2>Understanding Zero Trust</h2>
      <p>Zero Trust is a security model that assumes no implicit trust based on network location. Every access request must be verified, regardless of where it originates.</p>
      
      <h3>Core Principles</h3>
      <ul>
        <li><strong>Verify Explicitly:</strong> Authenticate and authorize based on all available data points</li>
        <li><strong>Use Least Privilege Access:</strong> Limit user access with Just-In-Time and Just-Enough-Access</li>
        <li><strong>Assume Breach:</strong> Minimize blast radius and segment access</li>
      </ul>
      
      <h3>Implementation Phases</h3>
      <ol>
        <li><strong>Identity:</strong> Strong authentication and identity management</li>
        <li><strong>Devices:</strong> Device inventory and compliance checking</li>
        <li><strong>Networks:</strong> Micro-segmentation and network isolation</li>
        <li><strong>Applications:</strong> Application-level controls and monitoring</li>
        <li><strong>Data:</strong> Data classification and encryption</li>
      </ol>
      
      <h3>Technologies and Solutions</h3>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
        <h4>Key Technologies:</h4>
        <ul>
          <li>Identity providers (IdP) with multi-factor authentication</li>
          <li>Software-defined perimeters (SDP)</li>
          <li>Network access control (NAC) solutions</li>
          <li>Cloud access security brokers (CASB)</li>
          <li>Privileged access management (PAM) systems</li>
        </ul>
      </div>
      
      <h3>Best Practices</h3>
      <p>Start with high-value assets and critical systems. Gradually expand coverage while maintaining user experience. Regular audits and compliance checks ensure ongoing effectiveness.</p>
      
      <h3>Common Challenges</h3>
      <p>Implementing Zero Trust can be complex. Common challenges include legacy system integration, user experience concerns, and organizational change management. Address these proactively for successful deployment.</p>
    </div>`,
  },
  {
    title: "GDPR Compliance Guide: Essential Steps for Data Protection in 2025",
    slug: "gdpr-compliance-essential-steps-2025",
    excerpt:
      "Navigate the complexities of GDPR compliance with this comprehensive guide covering essential requirements, best practices, and common pitfalls for organizations handling EU personal data.",
    category: "Compliance",
    tags: ["GDPR", "Compliance", "Data Protection", "Privacy", "EU Regulations"],
    featuredImage: "blog-thumbnail-7.jpg",
    content: `<div>
      <h2>Understanding GDPR Requirements</h2>
      <p>The General Data Protection Regulation (GDPR) has fundamentally changed how organizations handle personal data. Compliance is not optional—it's a legal requirement with significant penalties for violations.</p>
      
      <h3>Key GDPR Principles</h3>
      <ul>
        <li><strong>Lawfulness, Fairness, and Transparency:</strong> Process data legally and transparently</li>
        <li><strong>Purpose Limitation:</strong> Collect data only for specified purposes</li>
        <li><strong>Data Minimization:</strong> Collect only necessary data</li>
        <li><strong>Accuracy:</strong> Keep data accurate and up-to-date</li>
        <li><strong>Storage Limitation:</strong> Retain data only as long as necessary</li>
        <li><strong>Integrity and Confidentiality:</strong> Protect data with appropriate security</li>
        <li><strong>Accountability:</strong> Demonstrate compliance</li>
      </ul>
      
      <h3>Essential Compliance Steps</h3>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h4>Compliance Checklist:</h4>
        <ol>
          <li>Conduct a data protection impact assessment (DPIA)</li>
          <li>Appoint a Data Protection Officer (DPO) if required</li>
          <li>Implement privacy by design and default</li>
          <li>Establish clear consent mechanisms</li>
          <li>Create data processing agreements with third parties</li>
          <li>Develop breach notification procedures</li>
          <li>Document all data processing activities</li>
          <li>Train staff on GDPR requirements</li>
        </ol>
      </div>
      
      <h3>Rights of Data Subjects</h3>
      <p>GDPR grants individuals several rights that organizations must honor:</p>
      <ul>
        <li>Right to access their personal data</li>
        <li>Right to rectification of inaccurate data</li>
        <li>Right to erasure ("right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Rights related to automated decision-making</li>
      </ul>
      
      <h3>Penalties for Non-Compliance</h3>
      <p>GDPR violations can result in fines up to €20 million or 4% of global annual revenue, whichever is higher. Understanding these risks emphasizes the importance of compliance.</p>
    </div>`,
  },
  {
    title: "Proactive Threat Hunting: Advanced Techniques for Security Operations",
    slug: "proactive-threat-hunting-advanced-techniques",
    excerpt:
      "Master the art of threat hunting with advanced techniques and methodologies that enable security teams to proactively identify and neutralize threats before they cause damage.",
    category: "Threat Hunting",
    tags: ["Threat Hunting", "SOC", "Security Operations", "Proactive Security", "Detection"],
    featuredImage: "blog-thumbnail-1.jpg",
    content: `<div>
      <h2>What is Threat Hunting?</h2>
      <p>Threat hunting is a proactive cybersecurity practice that involves actively searching for threats that may have evaded automated detection systems. Unlike reactive security measures, threat hunting assumes adversaries are already in the network.</p>
      
      <h3>Threat Hunting vs. Traditional Security</h3>
      <p>Traditional security relies on alerts and known indicators. Threat hunting actively searches for unknown threats using hypothesis-driven investigations and behavioral analytics.</p>
      
      <h3>Threat Hunting Methodologies</h3>
      <ol>
        <li><strong>Hypothesis-Driven Hunting:</strong> Start with a hypothesis about potential threats</li>
        <li><strong>Intelligence-Driven Hunting:</strong> Use threat intelligence to guide searches</li>
        <li><strong>Data-Driven Hunting:</strong> Analyze large datasets for anomalies</li>
        <li><strong>Entity-Driven Hunting:</strong> Focus on specific entities (users, hosts, networks)</li>
      </ol>
      
      <h3>Key Tools and Technologies</h3>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <h4>Essential Tools:</h4>
        <ul>
          <li>Security Information and Event Management (SIEM) platforms</li>
          <li>Endpoint Detection and Response (EDR) solutions</li>
          <li>Network Traffic Analysis (NTA) tools</li>
          <li>Threat Intelligence Platforms (TIP)</li>
          <li>Analytics and visualization tools</li>
          <li>Digital forensics platforms</li>
        </ul>
      </div>
      
      <h3>Common Attack Patterns to Hunt</h3>
      <ul>
        <li><strong>Living off the Land:</strong> Attackers using legitimate tools</li>
        <li><strong>Privilege Escalation:</strong> Unusual privilege changes</li>
        <li><strong>Lateral Movement:</strong> Suspicious network connections</li>
        <li><strong>Data Exfiltration:</strong> Unusual data transfer patterns</li>
        <li><strong>Persistence Mechanisms:</strong> Scheduled tasks, registry modifications</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>Effective threat hunting requires:</p>
      <ul>
        <li>Regular, scheduled hunts (weekly minimum)</li>
        <li>Well-documented processes and playbooks</li>
        <li>Collaboration between analysts and threat intelligence teams</li>
        <li>Continuous refinement based on findings</li>
        <li>Integration with incident response procedures</li>
      </ul>
    </div>`,
  },
  {
    title: "Cybersecurity Trends 2025: What Security Leaders Need to Know",
    slug: "cybersecurity-trends-2025-leaders-guide",
    excerpt:
      "Stay ahead of emerging threats and industry trends with insights into the cybersecurity landscape for 2025, including new attack vectors, evolving regulations, and cutting-edge defense strategies.",
    category: "Trends",
    tags: ["Trends", "Future Tech", "Cybersecurity", "Industry Insights", "2025"],
    featuredImage: "blog-thumbnail-3.jpg",
    content: `<div>
      <h2>The Evolving Threat Landscape</h2>
      <p>As we move into 2025, the cybersecurity landscape continues to evolve rapidly. Understanding emerging trends is crucial for security leaders to prepare their organizations effectively.</p>
      
      <h3>Emerging Threat Vectors</h3>
      <ul>
        <li><strong>AI-Powered Attacks:</strong> Adversaries using AI to create more sophisticated phishing and malware</li>
        <li><strong>Supply Chain Attacks:</strong> Increasing targeting of third-party software and services</li>
        <li><strong>Cloud-Native Threats:</strong> New attack surfaces in cloud environments</li>
        <li><strong>IoT Vulnerabilities:</strong> Expanding attack surface from connected devices</li>
        <li><strong>Quantum Computing Risks:</strong> Preparing for post-quantum cryptography</li>
      </ul>
      
      <h3>Regulatory Changes</h3>
      <p>2025 brings new compliance requirements:</p>
      <ul>
        <li>Enhanced data protection regulations globally</li>
        <li>Industry-specific cybersecurity mandates</li>
        <li>Strengthened breach notification timelines</li>
        <li>Increased penalties for non-compliance</li>
        <li>Cross-border data transfer restrictions</li>
      </ul>
      
      <h3>Technology Trends</h3>
      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
        <h4>Key Technologies to Watch:</h4>
        <ul>
          <li><strong>AI Security Platforms:</strong> Advanced threat detection and response</li>
          <li><strong>Extended Detection and Response (XDR):</strong> Unified security visibility</li>
          <li><strong>Secure Access Service Edge (SASE):</strong> Network and security convergence</li>
          <li><strong>Zero Trust Architecture:</strong> Becoming the standard security model</li>
          <li><strong>Security Automation:</strong> AI-driven incident response</li>
          <li><strong>Post-Quantum Cryptography:</strong> Preparing for quantum threats</li>
        </ul>
      </div>
      
      <h3>Skills and Workforce Trends</h3>
      <p>The cybersecurity talent gap continues to widen. Organizations are:</p>
      <ul>
        <li>Investing in automation to augment human capabilities</li>
        <li>Focusing on upskilling existing staff</li>
        <li>Implementing security-as-code practices</li>
        <li>Partnering with managed security service providers</li>
      </ul>
      
      <h3>Strategic Recommendations</h3>
      <ol>
        <li>Invest in AI and automation capabilities</li>
        <li>Adopt a zero trust security model</li>
        <li>Enhance supply chain security practices</li>
        <li>Strengthen cloud security posture</li>
        <li>Develop quantum-resistant encryption strategies</li>
        <li>Build robust incident response capabilities</li>
      </ol>
    </div>`,
  },
  {
    title: "Data Protection Strategies: Safeguarding Sensitive Information",
    slug: "data-protection-strategies-safeguarding-information",
    excerpt:
      "Learn comprehensive data protection strategies to safeguard sensitive information across all stages of the data lifecycle, from collection to disposal.",
    category: "Data Protection",
    tags: ["Data Protection", "Privacy", "Encryption", "Data Security", "Compliance"],
    featuredImage: "blog-thumbnail-4.jpg",
    content: `<div>
      <h2>The Importance of Data Protection</h2>
      <p>In an era of increasing data breaches and stringent regulations, protecting sensitive information is not just a compliance requirement—it's essential for business continuity and customer trust.</p>
      
      <h3>Types of Sensitive Data</h3>
      <ul>
        <li><strong>Personally Identifiable Information (PII):</strong> Names, SSNs, addresses</li>
        <li><strong>Protected Health Information (PHI):</strong> Medical records, health data</li>
        <li><strong>Financial Information:</strong> Credit cards, bank accounts, tax data</li>
        <li><strong>Intellectual Property:</strong> Trade secrets, patents, proprietary information</li>
        <li><strong>Authentication Credentials:</strong> Passwords, tokens, biometric data</li>
      </ul>
      
      <h3>Data Protection Principles</h3>
      <ol>
        <li><strong>Data Classification:</strong> Categorize data by sensitivity level</li>
        <li><strong>Encryption:</strong> Encrypt data at rest and in transit</li>
        <li><strong>Access Controls:</strong> Implement least privilege access</li>
        <li><strong>Data Loss Prevention (DLP):</strong> Monitor and prevent unauthorized data movement</li>
        <li><strong>Backup and Recovery:</strong> Regular backups with tested recovery procedures</li>
        <li><strong>Data Retention Policies:</strong> Define how long to keep data</li>
        <li><strong>Secure Disposal:</strong> Properly destroy data when no longer needed</li>
      </ol>
      
      <h3>Encryption Best Practices</h3>
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
        <h4>Encryption Checklist:</h4>
        <ul>
          <li>Use AES-256 for data at rest</li>
          <li>Implement TLS 1.3 for data in transit</li>
          <li>Encrypt database fields containing sensitive data</li>
          <li>Use encrypted backup systems</li>
          <li>Manage encryption keys securely</li>
          <li>Implement key rotation policies</li>
          <li>Use hardware security modules (HSM) for key storage</li>
        </ul>
      </div>
      
      <h3>Data Loss Prevention (DLP)</h3>
      <p>DLP solutions help prevent unauthorized data access, transfer, or exfiltration:</p>
      <ul>
        <li>Monitor data in use, in motion, and at rest</li>
        <li>Create policies based on data classification</li>
        <li>Block or alert on policy violations</li>
        <li>Provide visibility into data usage patterns</li>
      </ul>
      
      <h3>Incident Response for Data Breaches</h3>
      <p>When a data breach occurs:</p>
      <ol>
        <li>Immediately contain the breach</li>
        <li>Assess the scope and impact</li>
        <li>Notify relevant authorities per regulations</li>
        <li>Inform affected individuals</li>
        <li>Document everything for legal and compliance purposes</li>
        <li>Implement remediation measures</li>
        <li>Conduct post-incident review</li>
      </ol>
    </div>`,
  },
  {
    title: "Identity and Access Management: Modern Solutions for Secure Authentication",
    slug: "identity-access-management-modern-solutions",
    excerpt:
      "Explore modern identity and access management (IAM) solutions that provide secure authentication, authorization, and access control for today's distributed workforce and cloud environments.",
    category: "Identity & Access Management",
    tags: ["IAM", "Authentication", "Access Control", "SSO", "MFA", "Identity"],
    featuredImage: "blog-thumbnail-6.jpg",
    content: `<div>
      <h2>What is Identity and Access Management?</h2>
      <p>Identity and Access Management (IAM) encompasses the policies, processes, and technologies used to manage digital identities and control access to resources. It's fundamental to zero trust security.</p>
      
      <h3>Core IAM Components</h3>
      <ul>
        <li><strong>Identity Provisioning:</strong> Creating and managing user accounts</li>
        <li><strong>Authentication:</strong> Verifying user identity</li>
        <li><strong>Authorization:</strong> Determining what resources users can access</li>
        <li><strong>Single Sign-On (SSO):</strong> One login for multiple applications</li>
        <li><strong>Multi-Factor Authentication (MFA):</strong> Multiple verification methods</li>
        <li><strong>Privileged Access Management (PAM):</strong> Secure administrative access</li>
        <li><strong>Identity Governance:</strong> Policies and compliance management</li>
      </ul>
      
      <h3>Authentication Methods</h3>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h4>Modern Authentication Options:</h4>
        <ul>
          <li><strong>Passwords:</strong> Still common, but increasingly supplemented</li>
          <li><strong>Biometrics:</strong> Fingerprint, face, voice recognition</li>
          <li><strong>Hardware Tokens:</strong> Physical devices generating codes</li>
          <li><strong>Software Tokens:</strong> Mobile apps for authentication</li>
          <li><strong>Certificate-Based:</strong> Digital certificates for device/user authentication</li>
          <li><strong>Passwordless:</strong> WebAuthn, FIDO2 standards</li>
          <li><strong>Behavioral Biometrics:</strong> Typing patterns, mouse movements</li>
        </ul>
      </div>
      
      <h3>Single Sign-On (SSO) Benefits</h3>
      <p>SSO provides:</p>
      <ul>
        <li>Improved user experience with one login</li>
        <li>Reduced password fatigue and support tickets</li>
        <li>Centralized access control</li>
        <li>Better security through centralized management</li>
        <li>Easier onboarding and offboarding</li>
      </ul>
      
      <h3>Multi-Factor Authentication (MFA)</h3>
      <p>MFA requires multiple verification factors:</p>
      <ol>
        <li><strong>Something You Know:</strong> Password, PIN</li>
        <li><strong>Something You Have:</strong> Smartphone, hardware token</li>
        <li><strong>Something You Are:</strong> Biometric data</li>
      </ol>
      <p>MFA significantly reduces the risk of unauthorized access, even if passwords are compromised.</p>
      
      <h3>IAM Best Practices</h3>
      <ul>
        <li>Implement least privilege access</li>
        <li>Regular access reviews and certifications</li>
        <li>Automated provisioning and deprovisioning</li>
        <li>Monitor for suspicious access patterns</li>
        <li>Use adaptive authentication based on risk</li>
        <li>Integrate with HR systems for lifecycle management</li>
        <li>Maintain audit logs for compliance</li>
      </ul>
      
      <h3>Cloud IAM Considerations</h3>
      <p>For cloud environments:</p>
      <ul>
        <li>Use cloud-native IAM services (AWS IAM, Azure AD, GCP IAM)</li>
        <li>Implement cross-cloud identity federation</li>
        <li>Manage service accounts securely</li>
        <li>Regularly review and rotate API keys</li>
        <li>Implement just-in-time access for privileged operations</li>
      </ul>
    </div>`,
  },
];

async function createMockBlogPosts() {
  try {
    console.log("🚀 Starting mock blog post creation...\n");

    // Get user ID for rshetty@atraiva.ai
    const userEmail = "rshetty@atraiva.ai";
    const authorId = await getUserIdByEmail(userEmail);
    console.log(`📧 Using author ID: ${authorId} (${userEmail})\n`);

    const postsCollection = db.collection("posts");
    const publicImagesPath = path.resolve(
      __dirname,
      "../public/images/website/resources"
    );

    for (let i = 0; i < mockPosts.length; i++) {
      const postData = mockPosts[i];
      console.log(`📝 Creating post ${i + 1}/${mockPosts.length}: ${postData.title}`);

      // Handle featured image - use local path (images are in public folder)
      const imageFileName = postData.featuredImage;
      const localImagePath = path.join(publicImagesPath, imageFileName);
      let featuredImageUrl = `/images/website/resources/${imageFileName}`;
      
      // Optionally upload to Firebase Storage if image exists
      if (fs.existsSync(localImagePath)) {
        try {
          // Try to upload to Storage for better performance and CDN benefits
          const storageUrl = await uploadImageToStorage(
            localImagePath,
            `${postData.slug}-${imageFileName}`
          );
          featuredImageUrl = storageUrl;
          console.log(`  ✓ Image uploaded to Storage: ${storageUrl}`);
        } catch (error) {
          // Fallback to local path if upload fails
          console.warn(`  ⚠️  Using local image path (upload skipped): ${featuredImageUrl}`);
        }
      } else {
        console.warn(`  ⚠️  Image not found: ${localImagePath}, using placeholder`);
        featuredImageUrl = `/images/website/resources/blog-thumbnail-1.jpg`;
      }

      // Calculate content metrics
      const htmlContent = postData.content;
      const wordCount = htmlContent.split(/\s+/).length;
      const charCount = htmlContent.length;
      const readTimeMinutes = Math.ceil(wordCount / 200);

      // Create post document
      const postDoc = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: {
          type: "html",
          html: postData.content,
        },
        featuredImage: featuredImageUrl,
        tags: postData.tags,
        category: postData.category,
        authorId: authorId,
        status: "published" as const,
        createdAt: Timestamp.fromDate(
          new Date(Date.now() - (mockPosts.length - i) * 24 * 60 * 60 * 1000)
        ), // Stagger dates
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.fromDate(
          new Date(Date.now() - (mockPosts.length - i) * 24 * 60 * 60 * 1000)
        ),
        scheduledFor: null,
        wordCount,
        charCount,
        readTimeMinutes,
        imageCount: (htmlContent.match(/<img/g) || []).length,
        codeBlockCount: 0,
        tableCount: 0,
        toc: null,
        seo: {
          title: postData.title,
          description: postData.excerpt,
          keywords: postData.tags,
        },
        canonicalUrl: null,
        ogImage: featuredImageUrl,
        twitterCard: "summary_large_image" as const,
        noindex: false,
        seriesId: null,
        seriesOrder: null,
        relatedPostIds: [],
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 50),
        reactions: {},
        commentCount: 0,
        lastCommentAt: null,
        language: "en-US",
        feedIncluded: true,
        sitemapPriority: 0.8,
        rev: `rev_${Date.now()}_${i}`,
        renderedHtmlRev: null,
      };

      // Insert into Firestore
      const docRef = await postsCollection.add(postDoc);
      console.log(`  ✅ Created with ID: ${docRef.id}`);
      console.log(`  📂 Category: ${postData.category}`);
      console.log(`  🏷️  Tags: ${postData.tags.join(", ")}\n`);
    }

    console.log("✨ Successfully created all mock blog posts!");
    console.log("\n📊 Summary:");
    console.log(`   - Total posts: ${mockPosts.length}`);
    console.log(`   - Categories: ${[...new Set(mockPosts.map((p) => p.category))].join(", ")}`);
    console.log(`   - Total tags: ${[...new Set(mockPosts.flatMap((p) => p.tags))].length} unique tags`);
  } catch (error) {
    console.error("❌ Error creating mock blog posts:", error);
    process.exit(1);
  }
}

// Run the script
createMockBlogPosts()
  .then(() => {
    console.log("\n🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });

