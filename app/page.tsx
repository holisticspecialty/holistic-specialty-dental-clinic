'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Phone, MapPin, ArrowRight, Clock, Leaf, Activity, Smile, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

export default function Home() {


  return (
    <main className="min-h-screen">

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-screen flex items-center w-full overflow-hidden">
        {/* Faded Background Image */}
        <div className="absolute top-[72px] right-0 bottom-0 w-full lg:w-[60%] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/Hero.jpg')] bg-cover bg-center opacity-30 [mask-image:linear-gradient(to_right,transparent_0%,black_100%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_60%)]" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-2xl">
          <motion.div initial="hidden" animate="show" variants={STAGGER}>
            <motion.div 
              variants={FADE_UP} 
              className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold tracking-widest uppercase mb-4"
              data-en="GENERAL DENTAL CARE"
              data-am="አጠቃላይ የጥርስ ሕክምና"
            >
              GENERAL DENTAL CARE
            </motion.div>
            
            <motion.h1 
              variants={FADE_UP}
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-4 text-brand-text"
              data-allow-html="true"
              data-en='Modern Care <br /> <span class="text-brand-primary italic font-medium">Brighter Smiles</span>'
              data-am='ዘመናዊ እንክብካቤ <br /> <span class="text-brand-primary italic font-medium">ደማቅ ፈገግታ</span>'
            >
              Modern Care <br />
              <span className="text-brand-primary italic font-medium">Brighter Smiles</span>
            </motion.h1>
            
            <motion.p 
              variants={FADE_UP}
              className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed font-light max-w-xl"
              data-en="Discover the intersection of high-end clinical expertise and holistic health in Addis Ababa. Our practice prioritizes your biological integrity, ensuring every treatment supports your overall physiological well-being."
              data-am="በአዲስ አበባ ከፍተኛ የሕክምና ብቃትንና ሁሉን አቀፍ ጤናን ያግኙ። የእኛ ፋሲሊቲ ለባዮሎጂያዊ ደህንነትዎ ቅድሚያ ይሰጣል፣ ይህም እያንዳንዱ ሕክምና ለአጠቃላይ የሰውነት ጤናዎ ድጋፍ እንደሚሆን ያረጋግጣል።"
            >
              Discover the intersection of high-end clinical expertise and holistic health in Addis Ababa. Our practice prioritizes your biological integrity, ensuring every treatment supports your overall physiological well-being.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4 items-center mb-8">
              <Link 
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-brand-text text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                data-en="Our Biological Services"
                data-am="የባዮሎጂያዊ አገልግሎቶቻችን"
              >
                Our Biological Services
              </Link>
            </motion.div>

            <motion.div variants={FADE_UP} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-bg bg-gray-200 overflow-hidden">
                    <Image src={`https://picsum.photos/seed/smile${i}/100/100`} alt="Happy patient at Holistic Specialty Dental Clinic" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-[#6B4C1E] mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span 
                  className="text-sm text-slate-500 font-medium"
                  data-en="5100+ patients treated"
                  data-am="5100+ ታካሚዎች ታክመዋል"
                >
                  5100+ patients treated
                </span>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT / PHILOSOPHY SECTION */}
      <section id="about" className="py-24 lg:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={FADE_UP}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/About.jpg')] bg-cover bg-center" />
            </div>
            {/* Quote Card */}
            <div className="absolute -bottom-8 -right-4 md:-right-12 bg-white p-6 md:p-8 shadow-xl shadow-black/5 max-w-xs border border-gray-50">
              <p 
                className="font-serif italic text-brand-accent text-lg md:text-xl mb-4"
                data-en='&quot;Trusted Care for Your Smile&quot;'
                data-am='&quot;ለፈገግታዎ የታመነ እንክብካቤ&quot;'
              >
                &quot;Trusted Care for Your Smile&quot;
              </p>
              <p 
                className="text-xs text-gray-500"
                data-en="— Holistic"
                data-am="— ሆሊስቲክ"
              >
                — Holistic
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="lg:pl-8 mt-12 lg:mt-0"
          >
            <motion.div 
              variants={FADE_UP} 
              className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-4"
              data-en="OUR PHILOSOPHY"
              data-am="የእኛ ፍልስፍና"
            >
              OUR PHILOSOPHY
            </motion.div>
            <motion.h2 
              variants={FADE_UP} 
              className="font-serif text-4xl md:text-5xl mb-8 leading-tight text-brand-text"
              data-en="Redefining the Standard of Oral Healthcare."
              data-am="የአፍ ጤና አጠባበቅ ደረጃን ዳግም መወሰን።"
            >
              Redefining the Standard of Oral Healthcare.
            </motion.h2>
            <motion.div variants={FADE_UP} className="space-y-6 text-gray-500 font-light leading-relaxed">
              <p 
                data-en="At Holistic Specialty Dental Clinic, we operate on the fundamental principle that oral health is inextricably linked to systemic vitality. As a premier destination for dental excellence in Addis Ababa, we offer more than just corrective procedures; we provide comprehensive wellness solutions."
                data-am="በ ሆሊስቲክ ስፔሻሊቲ የጥርስ ሕክምና ክሊኒክ የአፍ ጤና ከአጠቃላይ የሰውነት ጤና ጋር በእጅጉ የተቆራኘ ነው በሚል መሠረታዊ መርህ እንሠራለን። በአዲስ አበባ ከፍተኛ የጥርስ ሕክምና ማዕከል እንደመሆናችን መጠን ችግሮችን ከማስተካከል ባለፈ አጠቃላይ የጤና መፍትሄዎችን እናቀርባለን።"
              >
                At Holistic Specialty Dental Clinic, we operate on the fundamental principle that oral health is inextricably linked to systemic vitality. As a premier destination for dental excellence in Addis Ababa, we offer more than just corrective procedures; we provide comprehensive wellness solutions.
              </p>
              <p 
                data-en="With a distinguished record of serving over 5,100 patients across our first two years, our clinicians employ advanced diagnostic technology in a tranquil environment designed for clinical serenity."
                data-am="ባለፉት ሁለት ዓመታት ከ 5,100 በላይ ታካሚዎችን በማከም፣ የሐኪሞቻችን በላቀ የቴክኖሎጂ አጠቃቀምና በረጋ መንፈስ የሕክምና አገልግሎት ይሰጣሉ።"
              >
                With a distinguished record of serving over 5,100 patients across our first two years, our clinicians employ advanced diagnostic technology in a tranquil environment designed for clinical serenity.
              </p>
              <p 
                data-en="Your biology is unique, and your treatment protocol should reflect that. We meticulously tailor every intervention, utilizing biocompatible materials and minimally invasive techniques to preserve your natural anatomy while achieving superlative aesthetic results."
                data-am="ባዮሎጂዎ ልዩ ነው፣ እና የሕክምና ፕሮቶኮልዎ ያንን ማንጸባረቅ አለበት። የተፈጥሮን የሰውነት አካል ለመጠበቅ እና እጅግ በጣም ጥሩ የሆኑ ውበት ውጤቶችን ለማግኘት ባዮ-ተኳሃኝ ቁሳቁሶችን እና በትንሹ የሰውነት ንክኪ የሚያደርጉ ቴክኒኮችን በመጠቀም እያንዳንዱን ጣልቃገብነት በጥንቃቄ እናስተካክላለን።"
              >
                Your biology is unique, and your treatment protocol should reflect that. We meticulously tailor every intervention, utilizing biocompatible materials and minimally invasive techniques to preserve your natural anatomy while achieving superlative aesthetic results.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="mt-8">
              <Link 
                href="/booking"
                className="inline-flex items-center text-brand-primary text-sm font-medium group"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 lg:py-32 px-6 md:px-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="mb-16"
          >
            <motion.h2 
              variants={FADE_UP} 
              className="font-serif text-4xl md:text-5xl text-brand-text mb-4"
              data-en="Clinical Expertise"
              data-am="የሕክምና ብቃት"
            >
              Clinical Expertise
            </motion.h2>
            <motion.p 
              variants={FADE_UP} 
              className="text-gray-500 text-lg font-light"
              data-en="Everything your smile needs — all under one roof in Addis Ababa."
              data-am="ለፈገግታዎ የሚያስፈልገው ነገር በሙሉ - በአዲስ አበባ በአንድ ጣራ ስር።"
            >
              Everything your smile needs — all under one roof in Addis Ababa.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={STAGGER}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <motion.div variants={FADE_UP} className="bg-brand-surface p-10 rounded-sm hover:shadow-lg transition-shadow duration-300">
              <Leaf className="w-8 h-8 text-brand-primary mb-8 stroke-[1.5]" />
              <h3 
                className="font-serif text-2xl text-brand-text mb-4"
                data-en="Diagnostic & Preventive"
                data-am="ምርመራ እና መከላከል"
              >
                Diagnostic & Preventive
              </h3>
              <p 
                className="text-gray-500 text-sm font-light leading-relaxed mb-8"
                data-en="Comprehensive diagnostics, ultrasonic prophylaxis, and biocompatible restorations. We prioritize proactive interceptive care to safeguard your long-term vitality."
                data-am="አጠቃላይ ምርመራዎች፣ የአልትራሶኒክ የጥርስ ጽዳት እና ባዮ-ተኳሃኝ ጥገናዎች። የረጅም ጊዜ ጤናዎን ለመጠበቅ ቅድመ ጥንቃቄ ሕክምናን እናስቀድማለን።"
              >
                Comprehensive diagnostics, ultrasonic prophylaxis, and biocompatible restorations. We prioritize proactive interceptive care to safeguard your long-term vitality.
              </p>
              <Link 
                href="/booking" 
                className="text-brand-primary text-sm font-medium flex items-center group"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div variants={FADE_UP} className="bg-brand-surface p-10 rounded-sm hover:shadow-lg transition-shadow duration-300">
              <Smile className="w-8 h-8 text-brand-primary mb-8 stroke-[1.5]" />
              <h3 
                className="font-serif text-2xl text-brand-text mb-4"
                data-en="Esthetic & Orthodontic"
                data-am="ውበት እና ማስተካከል"
              >
                Esthetic & Orthodontic
              </h3>
              <p 
                className="text-gray-500 text-sm font-light leading-relaxed mb-8"
                data-en="Artisanal veneers, sophisticated whitening protocols, and advanced orthodontic alignment that respects your facial architecture."
                data-am="ጥበባዊ የጥርስ ሽፋኖች፣ የተራቀቁ የጥርስ ነጭ ማድረጊያ ፕሮቶኮሎች እና የፊትዎን ቅርጽ የሚያከብር የላቀ የጥርስ ማቀን (ኦርቶዶንቲክስ)።"
              >
                Artisanal veneers, sophisticated whitening protocols, and advanced orthodontic alignment that respects your facial architecture.
              </p>
              <Link 
                href="/booking" 
                className="text-brand-primary text-sm font-medium flex items-center group"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={FADE_UP} className="bg-brand-surface p-10 rounded-sm hover:shadow-lg transition-shadow duration-300">
              <Activity className="w-8 h-8 text-brand-primary mb-8 stroke-[1.5]" />
              <h3 
                className="font-serif text-2xl text-brand-text mb-4"
                data-en="Restorative & Surgical"
                data-am="ጥገና እና ቀዶ ጥገና"
              >
                Restorative & Surgical
              </h3>
              <p 
                className="text-gray-500 text-sm font-light leading-relaxed mb-8"
                data-en="Endodontic microsurgery, precision implantology, and periodontal regenerative therapy designed to restore functional and aesthetic harmony."
                data-am="የስር ቦይ ቀዶ ሕክምና፣ ትክክለኛ የጥርስ ንቅለ ተከላ እና የድድ ሕክምና - የተግባራዊ እና የውበት ስምምነትን ለመመለስ የተቀየሱ ናቸው።"
              >
                Endodontic microsurgery, precision implantology, and periodontal regenerative therapy designed to restore functional and aesthetic harmony.
              </p>
              <Link 
                href="/booking" 
                className="text-brand-primary text-sm font-medium flex items-center group"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRANSFORMATIONS & CASE STUDIES */}
      <section id="transformations" className="py-24 lg:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="w-full"
          >
            <motion.div variants={FADE_UP} className="text-center mb-12">
              <h2 
                className="font-serif text-3xl md:text-4xl text-brand-text mb-4"
                data-en="Clinical Transformations"
                data-am="ሕክምናዊ ለውጦች"
              >
                Clinical Transformations
              </h2>
              <p 
                className="text-gray-500 font-light text-base leading-relaxed max-w-2xl mx-auto"
                data-en="Documented clinical outcomes showcasing the intersection of esthetic precision and biological health. Every case below was treated right here in Addis Ababa."
                data-am="የውበት ጥራት እና የባዮሎጂካል ጤና መገጣጠምን የሚያሳዩ በሰነድ የተደገፉ የሕክምና ውጤቶች። በታች የተጠቀሱት በሙሉ እዚህ አዲስ አበባ ውስጥ የታከሙ ናቸው።"
              >
                Documented clinical outcomes showcasing the intersection of esthetic precision and biological health. Every case below was treated right here in Addis Ababa.
              </p>
            </motion.div>

            <motion.div variants={FADE_UP} className="grid grid-cols-2 gap-4 mb-16 max-w-4xl mx-auto">
              <div className="relative rounded-sm overflow-hidden bg-gray-50">
                <Image src="/Before.png?v=2" alt="Patient teeth before holistic dental treatment" width={800} height={800} className="w-full h-auto" />
                <div 
                  className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded"
                  data-en="Before"
                  data-am="በፊት"
                >
                  Before
                </div>
              </div>
              <div className="relative rounded-sm overflow-hidden bg-gray-50">
                <Image src="/After.png?v=2" alt="Patient teeth after cosmetic dental restoration at Holistic Specialty" width={800} height={800} className="w-full h-auto" />
                <div 
                  className="absolute bottom-2 right-2 bg-brand-primary/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded"
                  data-en="After"
                  data-am="በኋላ"
                >
                  After
                </div>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-start mb-3">
                  <h4 
                    className="text-lg font-medium text-brand-text"
                    data-en="Full Maxillary Rehabilitation"
                    data-am="ሙሉ የአፍ ጥገና"
                  >
                    Full Maxillary Rehabilitation
                  </h4>
                  <span 
                    className="bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    data-en="Biological"
                    data-am="ባዮሎጂያዊ"
                  >
                    Biological
                  </span>
                </div>
                <p 
                  className="text-gray-500 font-light text-sm leading-relaxed"
                  data-en="An exhaustive restorative protocol utilizing biocompatible crowns and veneers to address extensive attrition and chromatic imbalances."
                  data-am="ከፍተኛ የጥርስ መሸርሸርን እና የቀለም አለመመጣጠንን ለመፍታት ባዮ-ተኳሃኝ ዘውዶችን እና ሽፋኖችን (veneers) በመጠቀም የተደረገ አጠቃላይ የጥገና ሂደት።"
                >
                  An exhaustive restorative protocol utilizing biocompatible crowns and veneers to address extensive attrition and chromatic imbalances.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-start mb-3">
                  <h4 
                    className="text-lg font-medium text-brand-text"
                    data-en="Non-Invasive Orthodontics"
                    data-am="ቀዶ ጥገና የሌለው የጥርስ ማቀን"
                  >
                    Non-Invasive Orthodontics
                  </h4>
                  <span 
                    className="bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    data-en="Orthodontics"
                    data-am="ኦርቶዶንቲክስ"
                  >
                    Orthodontics
                  </span>
                </div>
                <p 
                  className="text-gray-500 font-light text-sm leading-relaxed"
                  data-en="Complex malocclusion corrected via clear aligner therapy focusing on arch development and functional alignment."
                  data-am="የመንጋጋ እና የጥርስ አለመገጣጠም ችግርን ግልጽ በሆኑ የአሰላለፍ ማስተካከያዎች (clear aligners) በመጠቀም የተገኘ ውጤት።"
                >
                  Complex malocclusion corrected via clear aligner therapy focusing on arch development and functional alignment.
                </p>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="text-center mt-12">
              <Link 
                href="/booking"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
                data-en="Book your appointment"
                data-am="ቀጠሮ ይያዙ"
              >
                Book your appointment <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* MAP SECTION */}
      <section className="w-full h-[65vh] min-h-[500px] relative bg-brand-bg flex items-center justify-center">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.407986708688!2d38.8502567!3d9.0104432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9b00741a2227%3A0x88afef00fef09c8b!2sHolistic%20speciality%20dental%20clinic%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1712475600000!5m2!1sen!2set" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        />
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 lg:py-32 px-6 md:px-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={STAGGER}
            className="flex flex-col items-center text-center"
          >
            <motion.h2 
              variants={FADE_UP} 
              className="font-serif text-4xl md:text-5xl mb-6 text-brand-text leading-tight max-w-3xl"
              data-en="Your Journey Toward Systemic Health Begins with a Conversation."
              data-am="የሙሉ ጤና ጉዞዎ በሚደረግ ውይይት ይጀምራል።"
            >
              Your Journey Toward Systemic Health Begins with a Conversation.
            </motion.h2>
            <motion.p 
              variants={FADE_UP} 
              className="text-gray-500 font-light text-lg mb-16 max-w-2xl"
              data-en="Our clinical team is prepared to facilitate your transition to biological dental care. Secure your initial evaluation today and join the 5,100+ patients who entrust their smiles to Holistic Specialty Dental Clinic."
              data-am="የሕክምና ቡድናችን ወደ ባዮሎጂያዊ የጥርስ ሕክምና የሚያደርጉትን ሽግግር ለማገዝ ዝግጁ ነው። የመጀመሪያ ደረጃ ግምገማዎን ዛሬውኑ ያረጋግጡ እና ፈገግታቸውን ለሆሊስቲክ ስፔሻሊቲ የጥርስ ሕክምና ክሊኒክ አደራ ከሰጡ 5,100 በላይ ታካሚዎች ጋር ይቀላቀሉ።"
            >
              Our clinical team is prepared to facilitate your transition to biological dental care. Secure your initial evaluation today and join the 5,100+ patients who entrust their smiles to Holistic Specialty Dental Clinic.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={STAGGER}
            className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16"
          >
            <motion.div variants={FADE_UP} className="flex flex-col items-center text-center p-8 bg-white rounded-sm shadow-sm border border-gray-50">
              <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center mb-6">
                <MapPin className="w-5 h-5 text-brand-primary" />
              </div>
              <h4 
                className="text-xs font-bold tracking-widest uppercase text-brand-text mb-3"
                data-en="LOCATION"
                data-am="አድራሻ"
              >
                LOCATION
              </h4>
              <p 
                className="text-gray-500 font-light text-sm leading-relaxed"
                data-allow-html="true"
                data-en="Soreti Building – 2nd Floor, Summit<br />Addis Ababa, Ethiopia"
                data-am="ሶሬቲ ህንፃ – 2ኛ ፎቅ፣ ሰሚት<br />አዲስ አበባ፣ ኢትዮጵያ"
              >
                Soreti Building – 2nd Floor, Summit<br />
                Addis Ababa, Ethiopia
              </p>
            </motion.div>
            
            <motion.div variants={FADE_UP} className="flex flex-col items-center text-center p-8 bg-white rounded-sm shadow-sm border border-gray-50">
              <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center mb-6">
                <Phone className="w-5 h-5 text-brand-primary" />
              </div>
              <h4 
                className="text-xs font-bold tracking-widest uppercase text-brand-text mb-3"
                data-en="COMMUNICATION"
                data-am="መገናኛ"
              >
                COMMUNICATION
              </h4>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                +251 92 222 0646<br />
                +251 93 201 1004
              </p>
            </motion.div>
 
            <motion.div variants={FADE_UP} className="flex flex-col items-center text-center p-8 bg-white rounded-sm shadow-sm border border-gray-50">
              <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center mb-6">
                <Clock className="w-5 h-5 text-brand-primary" />
              </div>
              <h4 
                className="text-xs font-bold tracking-widest uppercase text-brand-text mb-3"
                data-en="CLINICAL HOURS"
                data-am="የሥራ ሰዓት"
              >
                CLINICAL HOURS
              </h4>
              <p 
                className="text-gray-500 font-light text-sm leading-relaxed"
                data-en="Mon – Sat: 8:00 AM – 6:00 PM Sunday: Closed"
                data-am="ከሰኞ - ቅዳሜ፡ ከጠዋቱ 2፡00 - ከሰዓት 12፡00 እሁድ፡ ዝግ ነው"
              >
                Mon – Sat: 8:00 AM – 6:00 PM<br />
                Sunday: Closed
              </p>
            </motion.div>
          </motion.div>
 
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={FADE_UP} 
            className="flex justify-center"
          >
            <Link 
              href="/booking"
              className="px-8 py-3.5 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
              data-en="Book your appointment"
              data-am="ቀጠሮ ይያዙ"
            >
              Book your appointment
            </Link>
          </motion.div>
 
        </div>
      </section>
    </main>
  );
}
