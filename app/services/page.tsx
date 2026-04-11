'use client';

import { motion } from 'motion/react';
import { Leaf, Activity, Smile, Shield, Sparkles, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const services = [
  {
    category: "General & Preventive",
    categoryAm: "አጠቃላይ እና መከላከል",
    icon: <Shield className="w-6 h-6 text-brand-primary" />,
    description: "Foundational care to maintain optimal oral health and prevent future issues.",
    descriptionAm: "ለተሻለ የአፍ ጤና እና የወደፊት ችግሮችን ለመከላከል መሠረታዊ እንክብካቤ።",
    items: [
      { en: "Oral Examination", am: "የአፍ ምርመራ" },
      { en: "General Dentistry", am: "አጠቃላይ የጥርስ ሕክምና" },
      { en: "Scaling & Cleaning", am: "የጥርስ ጽዳት" },
      { en: "Pediatric Dentistry", am: "የሕፃናት የጥርስ ሕክምና" },
      { en: "Modern X-Ray Service", am: "ዘመናዊ የራጅ አገልግሎት" },
      { en: "Laboratory Service", am: "የላቦራቶሪ አገልግሎት" },
    ]
  },
  {
    category: "Restorative & Endodontics",
    categoryAm: "ጥገና እና የውስጥ ሕክምና",
    icon: <Activity className="w-6 h-6 text-brand-primary" />,
    description: "Advanced treatments to restore the function and integrity of your teeth.",
    descriptionAm: "የጥርስዎትን ተግባር እና ጥንካሬ ለመመለስ የላቀ ሕክምናዎች።",
    items: [
      { en: "Fillings", am: "የጥርስ መሙላት" },
      { en: "Crowns & Bridges", am: "ዘውድ እና ድልድይ" },
      { en: "Root Canal Treatment", am: "የስር ቦይ ሕክምና" },
      { en: "Endodontics", am: "የጥርስ ውስጥ ሕክምና" },
      { en: "Prosthodontics", am: "ሰው ሠራሽ ጥርስ" },
      { en: "Implant Service", am: "የጥርስ ንቅለ ተከላ" },
    ]
  },
  {
    category: "Cosmetic & Orthodontics",
    categoryAm: "ውበት እና ማስተካከል",
    icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
    description: "Aesthetic enhancements and alignment for a confident, radiant smile.",
    descriptionAm: "በራስ የመተማመን ስሜት ያለው ብሩህ ፈገግታ ለማግኘት የውበት ማሻሻያዎች።",
    items: [
      { en: "Teeth Whitening", am: "ጥርስን ነጭ ማድረግ" },
      { en: "Invisible Brace", am: "የማይታይ የጥርስ ማስተካከያ" },
      { en: "Orthodontics", am: "የጥርስ ማስተካከል" },
      { en: "Cosmetic Treatment", am: "የውበት ሕክምና" },
      { en: "Veneers", am: "ቪኒየሮች" },
    ]
  },
  {
    category: "Oral Surgery & Periodontics",
    categoryAm: "ቀዶ ሕክምና እና የድድ ሕክምና",
    icon: <Stethoscope className="w-6 h-6 text-brand-primary" />,
    description: "Specialized surgical procedures and gum care for complex dental needs.",
    descriptionAm: "ለተወሳሰቡ የጥርስ ችግሮች ልዩ የቀዶ ሕክምና ሂደቶች እና የድድ እንክብካቤ።",
    items: [
      { en: "Extraction", am: "ጥርስ መንቀል" },
      { en: "Periodontics", am: "የድድ ሕክምና" },
      { en: "Trauma/Splinting", am: "የአደጋ/ስፕሊንቲንግ" },
      { en: "Jaw Fracture Treatment", am: "የመንጋጋ ስብራት ሕክምና" },
    ]
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={STAGGER}
          className="max-w-3xl"
        >
          <motion.div 
            variants={FADE_UP} 
            className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4"
            data-en="OUR EXPERTISE"
            data-am="የእኛ ብቃት"
          >
            OUR EXPERTISE
          </motion.div>
          
          <motion.h1 
            variants={FADE_UP}
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-4 text-brand-text"
            data-allow-html="true"
            data-en='Comprehensive <br /> <span class="text-brand-primary italic font-medium">Specialty Care</span>'
            data-am='ሁሉን አቀፍ <br /> <span class="text-brand-primary italic font-medium">ስፔሻሊቲ ሕክምና</span>'
          >
            Comprehensive <br />
            <span className="text-brand-primary italic font-medium">Specialty Care</span>
          </motion.h1>
          
          <motion.p 
            variants={FADE_UP}
            className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed font-light max-w-xl"
            data-en="From routine preventive care to advanced surgical procedures, our clinic offers a full spectrum of dental services designed to restore and enhance your natural smile."
            data-am="ከመደበኛ የመከላከያ እንክብካቤ እስከ ከፍተኛ የቀዶ ሕክምና ሂደቶች፣ የጥርስ ሕክምና ማዕከላችን የተፈጥሮ ፈገግታዎን ለመመለስ እና ለማሻሻል የተነደፉ ሙሉ የጥርስ ሕክምና አገልግሎቶችን ይሰጣል።"
          >
            From routine preventive care to advanced surgical procedures, our clinic offers a full spectrum of dental services designed to restore and enhance your natural smile.
          </motion.p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((category, idx) => (
            <motion.div 
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-brand-surface p-8 md:p-10 rounded-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  {category.icon}
                </div>
                <h2 
                  className="font-serif text-2xl text-brand-text"
                  data-en={category.category}
                  data-am={category.categoryAm}
                >
                  {category.category}
                </h2>
              </div>
              
              <p 
                className="text-gray-500 text-sm font-light leading-relaxed mb-8"
                data-en={category.description}
                data-am={category.descriptionAm}
              >
                {category.description}
              </p>

              <ul className="space-y-4">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <p 
                        className="text-brand-text font-medium text-sm"
                        data-en={item.en}
                        data-am={item.am}
                      >
                        {item.en}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white p-12 md:p-20 rounded-sm text-center relative overflow-hidden border border-gray-100 shadow-sm"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 
              className="font-serif text-3xl md:text-5xl text-brand-text mb-6"
              data-en="Ready to transform your smile?"
              data-am="ፈገግታዎትን ለመለወጥ ዝግጁ ነዎት?"
            >
              Ready to transform your smile?
            </h2>
            <p 
              className="text-gray-500 text-lg font-light mb-10"
              data-en="Schedule a consultation with our specialists to discuss your personalized treatment plan."
              data-am="የእርስዎን ግላዊ የሕክምና ዕቅድ ለመወያየት ከባለሙያዎቻችን ጋር ቀጠሮ ይያዙ።"
            >
              Schedule a consultation with our specialists to discuss your personalized treatment plan.
            </p>
            <Link 
              href="/booking"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
              data-en="Book Your Appointment"
              data-am="ቀጠሮ ይያዙ"
            >
              Book Your Appointment
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
