import React from 'react';
import { FAQ } from '@/components/website/FAQ';
import { allFAQs } from '@/lib/data/faq-data';

export default function DocsPublicFAQ() {
  return (
    <div className="p-8">
      <FAQ
        items={allFAQs}
        title="Frequently Asked Questions"
        description="Find answers to common questions about Atraiva's breach determination platform"
        columns={1}
        showAll={true}
      />
    </div>
  );
}

export const metadata = {
  title: 'FAQ - Atraiva Documentation',
  description: 'Frequently asked questions about Atraiva',
};

