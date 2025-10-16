import React, { useState, useMemo, useEffect } from "react";
import {
  Phone,
  BookOpen,
  Clock,
  CheckCircle,
  Send,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   TRANSLATIONS
   ────────────────────────────────────────────────────────── */
const LANGUAGES = {
  fr: {
    brand: "improglish",
    contact_btn: "Contactez-nous",
    hero_title: "Prêt(e) à booster ton niveau de langue ?",
    hero_sub: "Des packs flexibles, adaptés à ton rythme 🤍",
    discover_packs_btn: "Découvrir les Packs",
    packs_title: "Choisis ton rythme idéal",
    pack_hours: (hours) => `${hours}h de cours`,
    pack_weekly: (weekly) => `Soit ${weekly}h / semaine`,
    features_title: "Inclus dans chaque pack",
    f1: "Cours individuels en français, anglais ou espagnol.",
    f2: "100% personnalisés selon ton niveau et objectifs.",
    f3: "Progression rapide grâce à l’accompagnement individuel.",
    f4: "Horaires flexibles selon ton agenda.",
    f5: "Focus sur la pratique et la confiance à l’oral.",
    contact_title: "On démarre ?",
    contact_sub:
      "Laisse-nous tes coordonnées et on te recontacte sous 24h.",
    name_label: "Nom complet",
    phone_label: "Numéro de téléphone",
    phone_placeholder: "+212 6 XX XX XX XX (avec indicatif)",
    pack_label: "Pack choisi",
    pack_option: (hours, weekly, price) =>
      `${hours}h (${weekly}h/semaine) • ${price} dh`,
    message_label: "Ton message (Optionnel)",
    message_placeholder:
      "Parle-nous de tes objectifs et de tes disponibilités.",
    submit_btn: "Envoyer ma demande",
    error_phone:
      "Numéro invalide. Utilise le format international (ex: +212...).",
    success_msg:
      "Merci ! Ton message a bien été envoyé. On te répond très vite.",
    error_msg:
      "Oups ! Vérifie le nom et le format du numéro de téléphone.",
    footer_text: "Tous droits réservés.",
  },
  en: {
    brand: "improglish",
    contact_btn: "Contact Us",
    hero_title: "Ready to boost your language skills?",
    hero_sub: "Flexible packages at your pace 🤍",
    discover_packs_btn: "Discover Packages",
    packs_title: "Choose your ideal pace",
    pack_hours: (hours) => `${hours}h of classes`,
    pack_weekly: (weekly) => `That's ${weekly}h / week`,
    features_title: "Included in every package",
    f1: "1-to-1 lessons in French, English, or Spanish.",
    f2: "100% tailored to your level and goals.",
    f3: "Faster progress with individual coaching.",
    f4: "Flexible schedules to fit your time.",
    f5: "Focus on practice and speaking confidence.",
    contact_title: "Shall we start?",
    contact_sub:
      "Leave your details and we’ll get back to you within 24h.",
    name_label: "Full Name",
    phone_label: "Phone Number",
    phone_placeholder: "+212 6 XX XX XX XX (with country code)",
    pack_label: "Chosen Package",
    pack_option: (hours, weekly, price) =>
      `${hours}h (${weekly}h/week) • ${price} dh`,
    message_label: "Your Message (Optional)",
    message_placeholder: "Tell us about goals and availability.",
    submit_btn: "Send my request",
    error_phone:
      "Invalid phone number. Use international format (e.g., +212...).",
    success_msg:
      "Thanks! Your message is sent. We’ll contact you very soon.",
    error_msg: "Oops! Check your name and phone number format.",
    footer_text: "All rights reserved.",
  },
  es: {
    brand: "improglish",
    contact_btn: "Contáctanos",
    hero_title: "¿Listo para mejorar tu idioma?",
    hero_sub: "Paquetes flexibles a tu ritmo 🤍",
    discover_packs_btn: "Descubrir Paquetes",
    packs_title: "Elige tu ritmo ideal",
    pack_hours: (hours) => `${hours}h de clases`,
    pack_weekly: (weekly) => `Eso es ${weekly}h / semana`,
    features_title: "Incluido en cada paquete",
    f1: "Clases 1-a-1 en francés, inglés o español.",
    f2: "100% personalizadas a tu nivel y objetivos.",
    f3: "Progreso rápido con acompañamiento individual.",
    f4: "Horarios flexibles que se adaptan a ti.",
    f5: "Enfoque en práctica y confianza oral.",
    contact_title: "¿Empezamos?",
    contact_sub:
      "Déjanos tus datos y te contactamos en menos de 24h.",
    name_label: "Nombre completo",
    phone_label: "Número de teléfono",
    phone_placeholder: "+212 6 XX XX XX XX (con código país)",
    pack_label: "Paquete elegido",
    pack_option: (hours, weekly, price) =>
      `${hours}h (${weekly}h/semana) • ${price} dh`,
    message_label: "Tu mensaje (Opcional)",
    message_placeholder:
      "Cuéntanos tus objetivos y disponibilidad.",
    submit_btn: "Enviar solicitud",
    error_phone:
      "Número inválido. Usa formato internacional (ej: +212...).",
    success_msg:
      "¡Gracias! Tu mensaje fue enviado. Te contactamos pronto.",
    error_msg:
      "¡Vaya! Revisa el nombre y el formato del teléfono.",
    footer_text: "Todos los derechos reservados.",
  },
  ar: {
    brand: "improglish",
    contact_btn: "تواصل معنا",
    hero_title: "جاهز لتعزيز مهاراتك اللغوية؟",
    hero_sub: "باقات مرنة تناسب وتيرتك 🤍",
    discover_packs_btn: "اكتشف الباقات",
    packs_title: "اختر وتيرتك المثالية",
    pack_hours: (hours) => `${hours} ساعة`,
    pack_weekly: (weekly) => `بمعدل ${weekly} ساعة/أسبوع`,
    features_title: "ماذا يتضمن كل باقة",
    f1: "دروس فردية بالفرنسية أو الإنجليزية أو الإسبانية.",
    f2: "مخصصة 100% بحسب مستواك وأهدافك.",
    f3: "تقدم سريع بفضل المتابعة الفردية.",
    f4: "مواعيد مرنة تناسب جدولك.",
    f5: "تركيز على الممارسة والثقة في التحدث.",
    contact_title: "نبدأ؟",
    contact_sub:
      "اترك بياناتك وسنتواصل معك خلال 24 ساعة.",
    name_label: "الاسم الكامل",
    phone_label: "رقم الهاتف",
    phone_placeholder: "+212 6 XX XX XX XX (مع رمز الدولة)",
    pack_label: "الباقة المختارة",
    pack_option: (hours, weekly, price) =>
      `${hours} ساعة (${weekly} ساعة/أسبوع) • ${price} درهم`,
    message_label: "رسالتك (اختياري)",
    message_placeholder: "أخبرنا عن أهدافك وتوافرك.",
    submit_btn: "إرسال",
    error_phone:
      "رقم غير صالح. استخدم التنسيق الدولي (مثال: +212...).",
    success_msg:
      "شكرًا! تم إرسال رسالتك. سنتواصل معك قريبًا.",
    error_msg:
      "حدث خطأ. تحقق من الاسم وصيغة رقم الهاتف.",
    footer_text: "جميع الحقوق محفوظة.",
  },
};

/* ──────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────── */
const PACKS_DATA = [
  { hours: 8, price: 700, weekly: 2 },
  { hours: 12, price: 1000, weekly: 3 },
  { hours: 16, price: 1400, weekly: 4 },
  { hours: 20, price: 1800, weekly: 5 },
  { hours: 24, price: 2200, weekly: 6 },
];

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */
const validatePhoneNumber = (number) =>
  /^\+\d{7,15}$/.test(number.replace(/\s/g, ""));
  

/* ──────────────────────────────────────────────────────────
   APP
   ────────────────────────────────────────────────────────── */
const App = () => {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [language, setLanguage] = useState("fr");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    pack: PACKS_DATA[0].hours,
  });
  const [formStatus, setFormStatus] = useState(null);

  const T = LANGUAGES[language];
  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    return () => document.documentElement.removeAttribute("dir");
  }, [isRTL]);

  const toggleDarkMode = () => setDarkMode((v) => !v);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePackSelect = (hours) =>
    setFormData((p) => ({ ...p, pack: hours }));

  const handlePhoneChange = (e) => {
    let value = e.target.value.trim();
    if (value && !value.startsWith("+")) {
      value = "+" + value.replace(/[^\d\s]/g, "");
    } else {
      value = value.replace(/[^\d\s+]/g, "");
    }
    setFormData((p) => ({ ...p, phone: value }));
  };

  const isPhoneValid = useMemo(
    () => formData.phone === "" || validatePhoneNumber(formData.phone),
    [formData.phone]
  );

 const handleSubmit = async (e) => {
  
  e.preventDefault();
  if (!isPhoneValid || formData.name.trim() === "") {
    setFormStatus("error");
    return;
  }
  try {
    // If backend runs on same domain behind a reverse proxy, use relative path:
    // const API_URL = "/api/contact";
    const API_URL = "https://impressed-myrilla-improglish-32946bdb.koyeb.app/api/contact"; // dev
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Must match FORM_SECRET on the server
        "x-secret": "super-long-random-string",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        pack: formData.pack,
        message: formData.message || "",
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setFormStatus("success");
    
    setFormData((p) => ({ ...p, name: "", phone: "", message: "" }));
  } catch (err) {
    console.error(err);
    setFormStatus("error");
  } finally {
    setTimeout(() => setFormStatus(null), 5000);
  }
};


  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 antialiased ${isRTL ? "font-[system-ui]" : ""}`}>
      {/* Top Gradient Accent */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/15 to-transparent dark:from-indigo-400/10" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 grid place-items-center text-white font-bold">
              i
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              {T.brand}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language */}
            <div className="relative">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="appearance-none bg-transparent text-sm px-3 py-2 pr-8 rounded-lg border border-gray-300/70 dark:border-gray-700 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
              <Globe className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center size-10 rounded-lg border border-gray-300/70 dark:border-gray-700 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition"
            >
              {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-indigo-600 text-white font-medium shadow-sm hover:shadow transition active:scale-[0.99]"
            >
              {T.contact_btn}
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-12 shadow-sm">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            {T.hero_title}
          </h1>
          <p
            className={`mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl ${
              isRTL ? "text-right ml-auto" : ""
            }`}
          >
            {T.hero_sub}
          </p>

          <div className="mt-8">
            <a
              href="#packs"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition will-change-transform hover:scale-[1.01]"
            >
              {T.discover_packs_btn}
            </a>
          </div>
        </section>

        {/* PACKS + FEATURES */}
        <section id="packs" className="mt-12 sm:mt-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            {T.packs_title}
          </h2>

          <div className="mt-8 grid lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Pricing cards */}
            <div className="space-y-4">
              {PACKS_DATA.map((pack) => {
                const selected = formData.pack === pack.hours;
                return (
                  <button
                    key={pack.hours}
                    type="button"
                    onClick={() => handlePackSelect(pack.hours)}
                    className={`w-full text-left rounded-2xl border p-5 transition shadow-sm hover:shadow ${
                      selected
                        ? "border-indigo-600/70 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-400 ring-2 ring-indigo-500/30"
                        : "border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-400/60"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse justify-between" : "justify-between"
                      }`}
                    >
                      <p className="text-xl font-semibold">
                        <Clock
                          className={`inline size-5 ${
                            isRTL ? "ml-2" : "mr-2"
                          } text-indigo-500`}
                        />
                        {T.pack_hours(pack.hours)}
                      </p>
                      <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
                        {pack.price} dh
                      </p>
                    </div>
                    <p
                      className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${
                        isRTL ? "text-right" : ""
                      }`}
                    >
                      {T.pack_weekly(pack.weekly)}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Features */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
              <h3
                className={`text-2xl font-semibold mb-5 flex items-center ${
                  isRTL ? "flex-row-reverse justify-end" : ""
                }`}
              >
                <BookOpen
                  className={`size-6 text-indigo-600 ${
                    isRTL ? "ml-3" : "mr-3"
                  }`}
                />
                {T.features_title}
              </h3>
              <ul className="space-y-4 text-base sm:text-lg">
                {[T.f1, T.f2, T.f3, T.f4, T.f5].map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <CheckCircle
                      className={`size-6 text-green-500 ${
                        isRTL ? "ml-3" : "mr-3"
                      } mt-1 shrink-0`}
                    />
                    <p
                      className={`${isRTL ? "text-right" : ""}`}
                      dangerouslySetInnerHTML={{
                        __html: feature.replace(
                          "100%",
                          `<strong class="font-semibold text-gray-900 dark:text-gray-100">100%</strong>`
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-14 sm:mt-20">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-sm">
            <h2 className="text-3xl sm:text-4xl font-bold text-center">
              {T.contact_title}
            </h2>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
              {T.contact_sub}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-1 ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {T.name_label}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={T.name_label}
                  className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition ${
                    isRTL ? "text-right" : ""
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium mb-1 ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {T.phone_label}
                </label>
                <div className={`flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700`}>
                  <span className="inline-flex items-center px-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <Phone className="size-4" />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder={T.phone_placeholder}
                    className={`flex-1 min-w-0 px-4 py-2.5 bg-white dark:bg-gray-900 outline-none ${
                      isRTL ? "text-right" : ""
                    } ${!isPhoneValid ? "ring-2 ring-red-500" : ""}`}
                  />
                </div>
                {!isPhoneValid && (
                  <p
                    className={`mt-2 text-sm text-red-600 dark:text-red-400 ${
                      isRTL ? "text-right" : ""
                    }`}
                  >
                    {T.error_phone}
                  </p>
                )}
              </div>

              {/* Pack */}
              <div>
                <label
                  htmlFor="pack"
                  className={`block text-sm font-medium mb-1 ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {T.pack_label}
                </label>
                <select
                  id="pack"
                  name="pack"
                  value={formData.pack}
                  onChange={handleChange}
                  className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {PACKS_DATA.map((p) => (
                    <option key={p.hours} value={p.hours}>
                      {T.pack_option(p.hours, p.weekly, p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium mb-1 ${
                    isRTL ? "text-right" : ""
                  }`}
                >
                  {T.message_label}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={T.message_placeholder}
                  className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition ${
                    isRTL ? "text-right" : ""
                  }`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isPhoneValid || formData.name.trim() === ""}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="size-5" />
                {T.submit_btn}
              </button>

              {/* Status */}
              {formStatus === "success" && (
                <div className="rounded-xl border border-green-500/40 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-4 py-3 text-center">
                  {T.success_msg}
                </div>
              )}
              {formStatus === "error" && (
                <div className="rounded-xl border border-red-500/40 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 py-3 text-center">
                  {T.error_msg}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-gray-200/70 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {T.brand}. {T.footer_text}
        </div>
      </footer>
    </div>
  );
};

export default App;
