"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string | string[];
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  columns?: 1 | 2;
  showAll?: boolean;
}

export function FAQ({
  items,
  title = "Frequently Asked Questions",
  description,
  columns = 1,
  showAll = true,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(showAll ? 0 : null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return (
        <div className="space-y-4">
          {answer.map((paragraph, idx) => (
            <p key={idx} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
    return (
      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {answer}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* FAQ Items */}
        <div
          className={`grid gap-4 ${
            columns === 2 ? "md:grid-cols-2 md:gap-6" : ""
          }`}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-foreground pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-2">
                        {formatAnswer(item.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

