"use client";

import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Steve Teppler",
    role: "CEO",
    image: "/images/website/steve-teppler-13540b.png",
    bio: "Atraiva is the brainchild of Steven Teppler, a nationally recognized authority in cybersecurity law, data privacy, and AI governance. As a veteran litigator, Cybersecurity Counsel for law firms and enterprises alike, Steven founded Atraiva to minimize the major time and resource suck that accompanies clients' cyber compliance obligations.",
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    name: "Deepti Shetty",
    role: "CTO",
    image: "/images/website/deepti-shetty-1bdcee.png",
    bio: "Deepti Shetty, an Google Technical Lead and an AI expert with more than 3 decades of experience developing enterprise grade products for various domains leads the technology section of the Atraiva product",
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    name: "Paritosh",
    role: "Product Owner",
    image: "/images/website/paritosh-product-4b89c8.png",
    bio: "A seasoned product development professional with over a decade of product development experience and extensive data structure knowledge works on the product roadmap for Atraiva.",
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    name: "Alex Sadusky",
    role: "Strategic Advisor",
    image: "/images/website/alex-sadusky-7b4fe0.png",
    bio: "Alex has spent multiple decades in middle-market investment banking, venture capital, private equity, and management consulting with McKinsey & Company and corporate business development with Goodrich Corporation. Alex has also deep understanding of the dental industry vertical and payment processing for small and medium businesses. Alex provides strategic advice to Atraiva.ai",
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    name: "Nagraj Mudradi",
    role: "Strategic Advisor",
    image: "/images/website/nagraj-strategic-1f8a7f.png",
    bio: "An entrepreneur with over 3 decades of enterprise SaaS product development experience in various industry verticals provides strategic advice on product architecture and go to market strategies.",
    social: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
];

export function TeamSection() {
  return (
    <section id="team" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1800px] mx-auto w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold font-['Encode_Sans_Semi_Expanded'] leading-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-4xl mx-auto">
            Our leadership team combines decades of experience in cybersecurity,
            legal compliance, and enterprise technology to deliver unparalleled
            expertise.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* First Row - Cards 1,2,3 - Same height within this row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 items-stretch">
            {teamMembers.slice(0, 3).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full"
              >
                <TeamMemberCard member={member} isFirstRow={true} />
              </motion.div>
            ))}
          </div>

          {/* Second Row - Cards 4,5,6 - Same height within this row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8 items-stretch">
            {teamMembers.slice(3, 6).map((member, index) => (
              <motion.div
                key={index + 3}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full"
              >
                <TeamMemberCard member={member} isFirstRow={false} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({
  member,
  isFirstRow = false,
}: {
  member: (typeof teamMembers)[0];
  isFirstRow?: boolean;
}) {
  return (
    <BackgroundGradient className="rounded-[22px] w-full p-1 bg-white dark:bg-zinc-900 h-[580px] sm:h-[600px] md:h-[620px] lg:h-[600px] xl:h-[580px]">
      <CardSpotlight
        className="bg-slate-900/90 backdrop-blur-md border border-white/[0.08] p-6 sm:p-8 md:p-10 text-center group hover:shadow-2xl transition-all duration-500 flex flex-col h-[560px] sm:h-[580px] md:h-[600px] lg:h-[580px] xl:h-[560px]"
        radius={300}
        color="#3b82f6"
      >
        <div className="flex flex-col h-full">
          {/* Profile Image - Centered */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition duration-500 group-hover:duration-200 animate-pulse"></div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-800 border-2 border-white/[0.1]">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Social Media Icons - Centered below photo */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="flex gap-3 sm:gap-4">
              <motion.a
                href={member.social.linkedin}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/[0.1] backdrop-blur-md rounded-full flex items-center justify-center border border-white/[0.2] hover:bg-white/[0.2] hover:border-blue-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                  fill="currentColor"
                />
              </motion.a>

              <motion.a
                href={member.social.twitter}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/[0.1] backdrop-blur-md rounded-full flex items-center justify-center border border-white/[0.2] hover:bg-white/[0.2] hover:border-sky-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter
                  className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 group-hover:text-sky-300 transition-colors duration-300"
                  fill="currentColor"
                />
              </motion.a>

              <motion.a
                href={member.social.instagram}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/[0.1] backdrop-blur-md rounded-full flex items-center justify-center border border-white/[0.2] hover:bg-white/[0.2] hover:border-pink-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram
                  className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 group-hover:text-pink-300 transition-colors duration-300"
                  fill="currentColor"
                />
              </motion.a>
            </div>
          </div>

          {/* Member Info - Fixed Height Section */}
          <div className="flex flex-col flex-grow">
            <div className="space-y-2 mb-3">
              <h3 className="text-lg sm:text-xl font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-500">
                {member.name}
              </h3>
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                <p className="text-blue-300 dark:text-blue-300 text-xs sm:text-sm font-bold uppercase tracking-wide">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.2] to-transparent mb-3"></div>

            {/* Bio Section - Content with equal height */}
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-300 dark:text-gray-300 text-sm sm:text-[15px] leading-relaxed text-center group-hover:text-white transition-colors duration-300">
                {member.bio}
              </p>
            </div>
          </div>
        </div>
      </CardSpotlight>
    </BackgroundGradient>
  );
}
