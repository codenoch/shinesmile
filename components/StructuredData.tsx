import { servicesGrid, doctors, faqs } from '@/app/data';

export default function StructuredData() {
  const baseUrl = process.env.APP_URL || 'https://shinesmile.dental';

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'ShineSmile Dental Care',
    image: 'https://shinesmile.dental/logo.png', // Placeholder
    '@id': `${baseUrl}/#dentist`,
    url: baseUrl,
    telephone: '+919625654137',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Dental Street, HSR Layout',
      addressLocality: 'Bangalore',
      addressRegion: 'KA',
      postalCode: '560102',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9141,
      longitude: 77.6412,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://facebook.com/shinesmile',
      'https://instagram.com/shinesmile',
      'https://linkedin.com/company/shinesmile',
      'https://youtube.com/shinesmile',
    ],
  };

  const servicesSchema = servicesGrid.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc,
    provider: {
      '@type': 'Dentist',
      name: 'ShineSmile Dental Care',
    },
  }));

  const doctorsSchema = doctors.map((doctor) => ({
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: doctor.name,
    jobTitle: doctor.role,
    image: doctor.img,
    affiliation: {
      '@type': 'Dentist',
      name: 'ShineSmile Dental Care',
    },
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
