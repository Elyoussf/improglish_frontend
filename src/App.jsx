import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Phone,
  Clock,
  Send,
  Globe,
  CheckCircle,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Languages,
  BadgeCheck,
  Search,
  Flag,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   DATA & TRANSLATIONS (kept as-is except minor copy tweaks)
   ────────────────────────────────────────────────────────── */

const NEW_PACKS_DATA = [
  {
    id: 'TOP',
    name: "Top Pack",
    total_price: 2000,
    total_hours: 24,
    price_per_hour: 83,
    benefits: [
      { fr: "Meilleur tarif horaire (83 MAD/h)", en: "Lowest hourly rate (83 MAD/h)", es: "La tarifa horaria más baja (83 MAD/h)", ar: "أدنى سعر للساعة (83 درهم/ساعة)" },
      { fr: "Accès à tous les modules avancés", en: "Access to all advanced modules", es: "Acceso a todos los módulos avanzados", ar: "الوصول إلى جميع الوحدات المتقدمة" },
    ],
    consumption_options: [
      { id: '2h_3m', text_fr: "2h / semaine (3 mois)", text_en: "2h / week (3 months)", text_es: "2h / semana (3 meses)", text_ar: "2 ساعة / أسبوع (3 أشهر)" },
      { id: '3h_2m', text_fr: "3h / semaine (2 mois)", text_en: "3h / week (2 months)", text_es: "3h / week (2 months)", text_ar: "3 ساعة / أسبوع (2 شهر)" },
      { id: '6h_1m', text_fr: "6h / semaine (1 mois)", text_en: "6h / week (1 month)", text_es: "6h / semana (1 mes)", text_ar: "6 ساعة / أسبوع (1 شهر)" },
    ],
  },
  {
    id: 'ADVANCED',
    name: "Advanced Pack",
    total_price: 1700,
    total_hours: 20,
    price_per_hour: 85,
    benefits: [
      { fr: "20 heures de cours intensifs", en: "20 hours of intensive classes", es: "20 horas de clases intensivas", ar: "20 ساعة من الدروس المكثفة" },
      { fr: "Suivi personnalisé de progression", en: "Personalized progress tracking", es: "Seguimiento de progreso personalizado", ar: "تتبع شخصي للتقدم" },
    ],
    consumption_options: [
      { id: '2h_2_5m', text_fr: "2h / semaine (2.5 mois)", text_en: "2h / week (2.5 months)", text_es: "2h / semana (2.5 meses)", text_ar: "2 ساعة / أسبوع (2.5 شهر)" },
      { id: '5h_1m', text_fr: "5h / semaine (1 mois)", text_en: "5h / week (1 month)", text_es: "5h / semana (1 mes)", text_ar: "5 ساعة / أسبوع (1 شهر)" },
    ],
  },
  {
    id: 'PREMIUM',
    name: "Premium Pack",
    total_price: 1400,
    total_hours: 16,
    price_per_hour: 87.5,
    benefits: [
      { fr: "16 heures flexibles de cours", en: "16 flexible hours of classes", es: "16 horas flexibles de clases", ar: "16 ساعة مرنة من الدروس" },
      { fr: "Ciblé pour améliorer la fluidité", en: "Targeted to improve fluency", es: "Dirigido a mejorar la fluidez", ar: "مخصص لتحسين الطلاقة" },
    ],
    consumption_options: [
      { id: '2h_2m', text_fr: "2h / semaine (2 mois)", text_en: "2h / week (2 months)", text_es: "2h / semana (2 meses)", text_ar: "2 ساعة / أسبوع (2 شهر)" },
      { id: '4h_1m', text_fr: "4h / semaine (1 mois)", text_en: "4h / week (1 month)", text_es: "4h / semana (1 mes)", text_ar: "4 ساعة / أسبوع (1 شهر)" },
    ],
  },
  {
    id: 'STANDARD',
    name: "Standard Plan",
    total_price: 1100,
    total_hours: 12,
    price_per_hour: 91,
    benefits: [
      { fr: "12 heures pour un bon départ", en: "12 hours for a strong start", es: "12 horas para un buen comienzo", ar: "12 ساعة لبداية قوية" },
      { fr: "Recommandé pour les débutants", en: "Recommended for beginners", es: "Recomendado para principiantes", ar: "موصى به للمبتدئين" },
    ],
    consumption_options: [
      { id: '1h_3m', text_fr: "1h / semaine (3 mois)", text_en: "1h / week (3 months)", text_es: "1h / semana (3 meses)", text_ar: "1 ساعة / أسبوع (3 أشهر)" },
      { id: '3h_1m', text_fr: "3h / semaine (1 mois)", text_en: "3h / week (1 month)", text_es: "3h / semana (1 mes)", text_ar: "3 ساعة / أسبوع (1 شهر)" },
    ],
  },
  {
    id: 'BASIC',
    name: "Basic Plan",
    total_price: 800,
    total_hours: 8,
    price_per_hour: 100,
    benefits: [
      { fr: "8 heures d'introduction", en: "8 hours of introduction", es: "8 horas de introducción", ar: "8 ساعات من المقدمة" },
      { fr: "Idéal pour évaluer votre niveau", en: "Ideal for assessing your level", es: "Ideal para evaluar tu nivel", ar: "مثالي لتقييم مستواك" },
    ],
    consumption_options: [
      { id: '1h_2m', text_fr: "1h / semaine (2 mois)", text_en: "1h / week (2 months)", text_es: "1h / semana (2 meses)", text_ar: "1 ساعة / أسبوع (2 شهر)" },
      { id: '2h_1m', text_fr: "2h / semaine (1 mois)", text_en: "2h / week (1 month)", text_es: "2h / semana (1 mes)", text_ar: "2 ساعة / أسبوع (1 شهر)" },
    ],
  },
];

const DAYS_DATA = [
  { fr: "Lun", en: "Mon", es: "Lun", ar: "إث" },
  { fr: "Mar", en: "Tue", es: "Mar", ar: "ثل" },
  { fr: "Mer", en: "Wed", es: "Mié", ar: "أر" },
  { fr: "Jeu", en: "Thu", es: "Thu", ar: "خم" },
  { fr: "Ven", en: "Fri", es: "Vie", ar: "جم" },
  { fr: "Sam", en: "Sat", es: "Sáb", ar: "سب" },
  { fr: "Dim", en: "Sun", es: "Dom", ar: "أح" },
];

const FULL_DAYS_DATA = [
  { fr: "Lundi", en: "Monday", es: "Lunes", ar: "الاثنين" },
  { fr: "Mardi", en: "Tuesday", es: "Tuesday", ar: "الثلاثاء" },
  { fr: "Mercredi", en: "Wednesday", es: "Wednesday", ar: "الأربعاء" },
  { fr: "Jeudi", en: "Thursday", es: "Thursday", ar: "الخميس" },
  { fr: "Vendredi", en: "Friday", es: "Friday", ar: "الجمعة" },
  { fr: "Samedi", en: "Saturday", es: "Saturday", ar: "السبت" },
  { fr: "Dimanche", en: "Sunday", es: "Sunday", ar: "الأحد" }
];

const LANGUAGES = {
  fr: {
    brand: "improglish", contact_btn: "Contactez-nous", hero_title: "Prêt(e) à booster ton niveau de langue ?", hero_sub: "Des packs flexibles, adaptés à ton rythme 🤍",
    packs_title: "1. Choisissez votre Pack",
    pack_price_per_hour: (price) => `${price} MAD/h`,
    pack_total_price: (price) => `${price} MAD`,
    pack_total_label: (hours) => `${hours}h pour`,
    pack_hourly_label: "Coût horaire :",
    pack_select_option: "Choisissez votre rythme de consommation :",
    pack_choose_btn: "Choisir ce Pack",
    pack_selected_btn: "Pack Sélectionné",
    pack_more_info: "Plus de détails",
    pack_scroll_tip: "Découvrez tous nos plans ci-dessous.",
    section_profile: "2. Votre Profil et Contact", section_availability: "3. Vos Disponibilités (Heures/Jours)",
    name_label: "Nom complet",
    phone_label: "Numéro de téléphone",
    phone_placeholder: "Entrez votre numéro",
    study_lang_label: "Langue à étudier (choix)",
    age_label: "Votre âge", age_placeholder: "Ex: 25", age_error: "Veuillez entrer un âge raisonnable (entre 10 et 99 ans).",
    message_label: "Vos objectifs (Optionnel)", message_placeholder: "Parlez-nous de vos objectifs et de votre niveau actuel.",
    submit_btn: "Envoyer ma demande",
    error_phone: "Numéro invalide.",
    error_pack: "Veuillez sélectionner un Pack.",
    error_pack_option: "Veuillez sélectionner un rythme de consommation pour votre pack.",
    error_study_lang: "Veuillez choisir la langue à étudier.",
    success_msg: "Merci ! Votre demande a bien été envoyée. On vous contacte très vite.", error_msg: "Oups ! Une erreur est survenue lors de l'envoi de la demande.",
    footer_text: "Tous droits réservés.", availability_tip: "Cliquez sur une heure pour ajouter ou retirer un créneau.",
    no_slot_selected: "Veuillez choisir au moins un créneau de disponibilité.",
    days_short: DAYS_DATA.map(d => d.fr), days_long: FULL_DAYS_DATA.map(d => d.fr),
    time_slots_title: (day) => `Créneaux disponibles pour ${day}`,
    mobile_tip: "Sélectionnez un jour pour voir les créneaux",
    country_search_placeholder: "Rechercher un pays ou indicatif…",
  },
  en: {
    brand: "improglish", contact_btn: "Contact Us", hero_title: "Ready to boost your language skills?", hero_sub: "Flexible packages at your pace 🤍",
    packs_title: "1. Choose Your Package",
    pack_price_per_hour: (price) => `${price} MAD/h`,
    pack_total_price: (price) => `${price} MAD`,
    pack_total_label: (hours) => `${hours}h for`,
    pack_hourly_label: "Cost per hour:",
    pack_select_option: "Choose your consumption rhythm:",
    pack_choose_btn: "Choose Plan",
    pack_selected_btn: "Plan Selected",
    pack_more_info: "More Details",
    pack_scroll_tip: "Discover all our plans below.",
    section_profile: "2. Your Profile and Contact", section_availability: "3. Your Availability (Time Slots)",
    name_label: "Full Name",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your number",
    study_lang_label: "Language to Study (choice)",
    age_label: "Your Age", age_placeholder: "Ex: 25", age_error: "Please enter a reasonable age (between 10 and 99 years old).",
    message_label: "Your Goals (Optional)", message_placeholder: "Tell us about your goals and current level.",
    submit_btn: "Send my request",
    error_phone: "Invalid phone number.",
    error_pack: "Please select a Package.",
    error_pack_option: "Please select a consumption rhythm for your pack.",
    error_study_lang: "Please choose the language to study.",
    success_msg: "Thanks! Your request has been sent. We'll contact you very soon.", error_msg: "Oops! An error occurred while sending the request.",
    footer_text: "All rights reserved.", availability_tip: "Click on a time slot to add or remove it.",
    no_slot_selected: "Please choose at least one availability slot.",
    days_short: DAYS_DATA.map(d => d.en), days_long: FULL_DAYS_DATA.map(d => d.en),
    time_slots_title: (day) => `Available slots for ${day}`,
    mobile_tip: "Select a day to view slots",
    country_search_placeholder: "Search country or code…",
  },
  es: {
    brand: "improglish", contact_btn: "Contáctanos", hero_title: "¿Listo para impulsar tus habilidades lingüísticas?", hero_sub: "Paquetes flexibles, adaptados a tu ritmo 🤍",
    packs_title: "1. Elige tu Paquete",
    pack_price_per_hour: (price) => `${price} MAD/h`,
    pack_total_price: (price) => `${price} MAD`,
    pack_total_label: (hours) => `${hours}h por`,
    pack_hourly_label: "Costo por hora:",
    pack_select_option: "Elige tu ritmo de consumo:",
    pack_choose_btn: "Elegir Plan",
    pack_selected_btn: "Plan Seleccionado",
    pack_more_info: "Más detalles",
    pack_scroll_tip: "Descubre todos nuestros planes a continuación.",
    section_profile: "2. Tu Perfil y Contacto", section_availability: "3. Tu Disponibilidad (Horarios/Días)",
    name_label: "Nombre completo",
    phone_label: "Número de teléfono",
    phone_placeholder: "Ingresa tu número",
    study_lang_label: "Idioma a estudiar (elección)",
    age_label: "Tu edad", age_placeholder: "Ej: 25", age_error: "Por favor, introduce una edad razonable (entre 10 y 99 años).",
    message_label: "Tus Objetivos (Opcional)", message_placeholder: "Cuéntanos sobre tus objetivos y tu nivel actual.",
    submit_btn: "Enviar mi solicitud",
    error_phone: "Número inválido.",
    error_pack: "Por favor, selecciona un Paquete.",
    error_pack_option: "Por favor, selecciona un ritmo de consumo para tu paquete.",
    error_study_lang: "Por favor, elige el idioma a estudiar.",
    success_msg: "¡Gracias! Tu solicitud ha sido enviada. Te contactaremos muy pronto.", error_msg: "¡Ups! Ocurrió un error al enviar la solicitud.",
    footer_text: "Todos los derechos reservados.", availability_tip: "Haz clic en una hora para agregar o eliminar un espacio.",
    no_slot_selected: "Por favor, elige al menos un espacio de disponibilidad.",
    days_short: DAYS_DATA.map(d => d.es), days_long: FULL_DAYS_DATA.map(d => d.es),
    time_slots_title: (day) => `Espacios disponibles para ${day}`,
    mobile_tip: "Selecciona un día para ver los espacios",
    country_search_placeholder: "Buscar país o código…",
  },
  ar: {
    brand: "improglish", contact_btn: "اتصل بنا", hero_title: "هل أنت مستعد لتعزيز مهاراتك اللغوية؟", hero_sub: "باقات مرنة، تناسب إيقاعك 🤍",
    packs_title: "1. اختر باقتك",
    pack_price_per_hour: (price) => `${price} درهم/ساعة`,
    pack_total_price: (price) => `${price} درهم`,
    pack_total_label: (hours) => `${hours} ساعة مقابل`,
    pack_hourly_label: "تكلفة الساعة:",
    pack_select_option: "اختر وتيرة الاستهلاك الخاصة بك:",
    pack_choose_btn: "اختر هذه الباقة",
    pack_selected_btn: "تم اختيار الباقة",
    pack_more_info: "المزيد من التفاصيل",
    pack_scroll_tip: "اكتشف جميع خططنا أدناه.",
    section_profile: "2. ملفك الشخصي وجهة الاتصال", section_availability: "3. أوقات فراغك (الساعات/الأيام)",
    name_label: "الاسم الكامل",
    phone_label: "رقم الهاتف",
    phone_placeholder: "أدخل رقمك",
    study_lang_label: "اللغة المراد دراستها (اختيار)",
    age_label: "عمرك", age_placeholder: "مثال: 25", age_error: "يرجى إدخال عمر معقول (بين 10 و 99 سنة).",
    message_label: "أهدافك (اختياري)", message_placeholder: "أخبرنا عن أهدافك ومستواك الحالي.",
    submit_btn: "إرسال طلبي",
    error_phone: "رقم هاتف غير صالح.",
    error_pack: "يرجى اختيار باقة.",
    error_pack_option: "يرجى تحديد وتيرة استهلاك لباقة.",
    error_study_lang: "يرجى اختيار اللغة المراد دراستها.",
    success_msg: "شكراً لك! لقد تم إرسال طلبك بنجاح. سنتصل بك قريباً جداً.", error_msg: "عذراً! حدث خطأ أثناء إرسال الطلب.",
    footer_text: "جميع الحقوق محفوظة.", availability_tip: "انقر على ساعة لإضافة أو إزالة فترة زمنية.",
    no_slot_selected: "يرجى اختيار فترة زمنية واحدة على الأقل للتوافر.",
    days_short: DAYS_DATA.map(d => d.ar), days_long: FULL_DAYS_DATA.map(d => d.ar),
    time_slots_title: (day) => `الأوقات المتاحة ليوم ${day}`,
    mobile_tip: "اختر يوماً لعرض الأوقات",
    country_search_placeholder: "ابحث عن بلد أو رمز…",
  },
};

const getDayKey = (dayIndex) => FULL_DAYS_DATA[dayIndex].en;

/* ──────────────────────────────────────────────────────────
   HELPERS & VALIDATION
   ────────────────────────────────────────────────────────── */

const API_URL = "https://impressed-myrilla-improglish-32946bdb.koyeb.app/api/contact";
// const API_URL = "https://render.com/docs/web-services"

const validateAge = (age) => {
  const num = parseInt(age, 10);
  return num >= 10 && num <= 99;
};

const formatTime = (hour) => {
  const padded = String(hour).padStart(2, '0');
  return `${padded}:00 - ${String(hour + 1).padStart(2, '0')}:00`;
};

// Time slots 8:00–22:00
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 8);

/* ──────────────────────────────────────────────────────────
   COUNTRY DATA + NORMALIZATION
   ────────────────────────────────────────────────────────── */

// Minimal curated list with flags, dial codes, and ISO codes. Includes Morocco by default.
const COUNTRIES = [
  { name: "Morocco", code: "MA", dialCode: "212", flag: "🇲🇦" },
  { name: "France", code: "FR", dialCode: "33", flag: "🇫🇷" },
  { name: "Spain", code: "ES", dialCode: "34", flag: "🇪🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "44", flag: "🇬🇧" },
  { name: "United States", code: "US", dialCode: "1", flag: "🇺🇸" },
  { name: "Algeria", code: "DZ", dialCode: "213", flag: "🇩🇿" },
  { name: "Tunisia", code: "TN", dialCode: "216", flag: "🇹🇳" },
  { name: "Germany", code: "DE", dialCode: "49", flag: "🇩🇪" },
  { name: "Italy", code: "IT", dialCode: "39", flag: "🇮🇹" },
];

function normalizeToWhatsAppNumber({ countryDial, rawInput }) {
  // Accept inputs like: 06..., 2126..., +2126..., 002126..., 6...
  let digits = (rawInput || "").replace(/[^\d+]/g, "");
  // Strip leading +
  if (digits.startsWith("+")) digits = digits.slice(1);
  // Replace leading 00 with international
  if (digits.startsWith("00")) digits = digits.slice(2);

  // If it starts with the country code, drop it once
  if (digits.startsWith(countryDial)) {
    digits = digits.slice(countryDial.length);
  }
  // Drop a single leading zero (national trunk prefix) if present
  if (digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "");
  }

  const finalNumber = countryDial + digits; // e.g. 2126xxxxxxx

  // Basic length sanity: WhatsApp supports up to 15 digits total
  if (finalNumber.length < 8 || finalNumber.length > 15) return null;

  return finalNumber;
}

/* ──────────────────────────────────────────────────────────
   Tiny Toast
   ────────────────────────────────────────────────────────── */
function Toast({ open, type = "info", children, onClose, isRTL }) {
  if (!open) return null;
  const color =
    type === "success" ? "bg-green-600" :
    type === "error" ? "bg-red-600" : "bg-gray-800";
  return (
    <div className={`fixed bottom-4 inset-x-0 px-4 z-50 sm:flex sm:justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`text-white ${color} rounded-xl shadow-md px-4 py-3 text-sm sm:text-base w-full sm:w-auto`}>
        <div className="flex items-start gap-3">
          <div className="mt-1 size-2.5 rounded-full bg-white/90 shrink-0"></div>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>{children}</div>
          <button onClick={onClose} className="ml-2 text-white/90 hover:text-white shrink-0" aria-label="Close toast">×</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Schedule Picker (unchanged)
   ────────────────────────────────────────────────────────── */
const SchedulePicker = ({ T, language, availability, setAvailability, isRTL }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const toggleSlot = useCallback((dayIndex, hour) => {
    const dayKey = getDayKey(dayIndex);
    setAvailability(prev => {
      const current = prev[dayKey] || [];
      return current.includes(hour)
        ? { ...prev, [dayKey]: current.filter(h => h !== hour) }
        : { ...prev, [dayKey]: [...current, hour].sort((a, b) => a - b) };
    });
  }, [setAvailability]);

  const renderMobileView = () => {
    const currentDayKey = getDayKey(selectedDayIndex);
    const slots = availability[currentDayKey] || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-lg font-semibold text-indigo-600">
          <button
            type="button"
            onClick={() => setSelectedDayIndex(prev => (prev > 0 ? prev - 1 : T.days_long.length - 1))}
            className={`p-2 rounded-full hover:bg-indigo-50 transition ${isRTL ? 'transform rotate-180' : ''}`}
            aria-label="Previous day">
            <ChevronDown className="size-5 text-blue-600 transform rotate-90" />
          </button>
          <div className="min-w-[100px] text-center text-blue-800">
            {T.days_long[selectedDayIndex]}
          </div>
          <button
            type="button"
            onClick={() => setSelectedDayIndex(prev => (prev < T.days_long.length - 1 ? prev + 1 : 0))}
            className={`p-2 rounded-full hover:bg-indigo-50 transition ${isRTL ? 'transform rotate-180' : ''}`}
            aria-label="Next day">
            <ChevronDown className="size-5 text-blue-600 transform -rotate-90" />
          </button>
        </div>

        <p className={`text-sm text-gray-500 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {T.time_slots_title(T.days_long[selectedDayIndex])}
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TIME_SLOTS.map((hour) => {
            const isSelected = slots.includes(hour);
            return (
              <button
                key={hour}
                type="button"
                onClick={() => toggleSlot(selectedDayIndex, hour)}
                className={`flex justify-center items-center py-2.5 px-3 rounded-xl border transition-all duration-150 text-sm font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md hover:bg-blue-700'
                    : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50'
                }`}>
                {isSelected && <CheckCircle className={`size-4 ${isRTL ? 'ml-2' : 'mr-2'} shrink-0`} />}
                {formatTime(hour)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="grid gap-x-1.5 gap-y-2" style={{ gridTemplateColumns: `auto repeat(${T.days_short.length}, 1fr)` }}>
          <div className="invisible">Time</div>
          {T.days_short.map((day) => (
            <div key={day} className="text-center font-semibold text-base text-blue-600">{day}</div>
          ))}

          {TIME_SLOTS.map((hour) => (
            <React.Fragment key={hour}>
              <div className={`py-2.5 px-2 text-xs font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {formatTime(hour)}
              </div>
              {T.days_long.map((_, dayIndex) => {
                const dayKey = getDayKey(dayIndex);
                const isSelected = (availability[dayKey] || []).includes(hour);
                return (
                  <button
                    key={`${dayKey}-${hour}`}
                    type="button"
                    onClick={() => toggleSlot(dayIndex, hour)}
                    className={`h-full w-full rounded-lg border-2 text-xs font-medium transition-all duration-150 py-2.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md hover:bg-blue-700'
                        : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50'
                    }`}
                    aria-label={`Toggle availability for ${dayKey} at ${formatTime(hour)}`}>
                    {isSelected && <CheckCircle className="size-4 mx-auto" />}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2">
      <p className={`mb-4 text-sm text-gray-500 ${isRTL ? 'ml-auto text-right' : 'text-left'}`}>
        <Calendar className={`inline size-4 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} />
        <span className="hidden sm:inline">{T.availability_tip}</span>
        <span className="sm:hidden">{T.mobile_tip}</span>
      </p>
      <div className="sm:hidden">{renderMobileView()}</div>
      <div className="hidden sm:block">{renderDesktopView()}</div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   UI Language Switcher (unchanged)
   ────────────────────────────────────────────────────────── */
const LanguageSelector = ({ language, setLanguage }) => {
  const languages = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'ar', flag: '🇲🇦', name: 'العربية' },
  ];
  return (
    <div className="inline-flex rounded-xl p-1 bg-gray-100 shadow-lg border border-gray-300">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`text-sm py-2 px-3 rounded-lg font-medium transition-all ${
            language === lang.code
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-transparent text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}>
          <span className="text-lg">{lang.flag}</span>
          <span className="hidden sm:inline ml-2">{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   CountryPicker + PhoneInput
   ────────────────────────────────────────────────────────── */
function CountryPicker({ T, countries, selected, onSelect, isRTL }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }, [countries, query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`h-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300 ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'} transition`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-lg">{selected.flag}</span>
          <span className="text-sm font-medium truncate hidden sm:inline">{selected.name}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-72 max-h-64 overflow-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="size-4 text-gray-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={T.country_search_placeholder}
              className="w-full text-sm outline-none"
            />
          </div>
          <ul>
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onSelect(c); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-sm">{c.name}</span>
                  </span>
                  <span className="text-xs text-gray-600">+{c.dialCode}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-gray-500">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   APP
   ────────────────────────────────────────────────────────── */
const App = () => {
  const [language, setLanguage] = useState("fr");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    message: "",
    studyLang: "", // 'en' | 'fr' | 'ara' | 'spanish'
    pack: null,
    packOption: null,
  });

  // Country + local phone states
  const [country, setCountry] = useState(COUNTRIES[0]); // Morocco default
  const [localPhone, setLocalPhone] = useState("");

  const [availability, setAvailability] = useState({});
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", msg: "" });
  const [expandedPacks, setExpandedPacks] = useState({});

  const T = LANGUAGES[language];
  const isRTL = language === "ar";

  const selectedPack = useMemo(
    () => NEW_PACKS_DATA.find(p => p.id === formData.pack) || null,
    [formData.pack]
  );

  const isAvailabilityValid = useMemo(
    () => Object.values(availability).some(slots => slots.length > 0),
    [availability]
  );

  const isPackSelectionValid = useMemo(
    () => selectedPack !== null && formData.packOption !== null,
    [selectedPack, formData.packOption]
  );

  const isAgeValid = useMemo(
    () => formData.age === "" || validateAge(formData.age),
    [formData.age]
  );

  const isStudyLangValid = useMemo(
    () => !!formData.studyLang,
    [formData.studyLang]
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    return () => document.documentElement.removeAttribute("dir");
  }, [isRTL]);

  const showToast = (type, msg) => {
    setToast({ open: true, type, msg });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 4000);
  };

  const togglePackExpansion = (packId) => {
    setExpandedPacks(prev => ({ ...prev, [packId]: !prev[packId] }));
  };

  const handlePackSelect = (packId) => {
    const pack = NEW_PACKS_DATA.find(p => p.id === packId);
    setFormData((p) => ({
      ...p,
      pack: packId,
      packOption: pack?.consumption_options[0]?.id ?? null
    }));
    const section = document.getElementById('pack-selection');
    if (section) {
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nameInput = document.getElementById('name');
    nameInput?.focus();
  }, 100);
}
  };

  const handlePackOptionSelect = (optionId) => {
    setFormData((p) => ({ ...p, packOption: optionId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Study Language: choice input values required by user: en, fr, ara, spanish
  const STUDY_OPTIONS = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "ara", label: "Arabic" },
    { value: "spanish", label: "Spanish" },
  ];

  const selectedPackOptionText = useMemo(() => {
    if (!selectedPack) return 'N/A';
    const option = selectedPack.consumption_options.find(opt => opt.id === formData.packOption);
    const langKey = language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';
    return option ? option[`text_${langKey}`] : 'N/A (Option not selected)';
  }, [selectedPack, formData.packOption, language]);

  const formattedAvailability = useMemo(() => {
    const days = Object.entries(availability)
      .filter(([, slots]) => slots.length > 0)
      .map(([day, slots]) => `${day}: ${[...slots].sort((a,b)=>a-b).map(formatTime).join(' | ')}`);
    return days.join(' || ') || 'None selected';
  }, [availability]);

  // Phone validation based on normalization result
  const normalizedWhatsAppDigits = useMemo(() => {
    const normalized = normalizeToWhatsAppNumber({ countryDial: country.dialCode, rawInput: localPhone });
    return normalized; // e.g., "2126XXXXXXXX"
  }, [country, localPhone]);

  const isPhoneValid = useMemo(() => !!normalizedWhatsAppDigits, [normalizedWhatsAppDigits]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAge = parseInt(formData.age, 10);
    const isValid = (
      isPhoneValid &&
      formData.name.trim() !== "" &&
      validateAge(parsedAge) &&
      isPackSelectionValid &&
      isAvailabilityValid &&
      isStudyLangValid
    );

    if (!isValid) {
      setFormStatus("error");
      if (!isPhoneValid) {
        showToast("error", T.error_phone);
      } else if (!isPackSelectionValid) {
        if (selectedPack && !formData.packOption) showToast("error", T.error_pack_option);
        else showToast("error", T.error_pack);
      } else if (!isAvailabilityValid) {
        showToast("error", T.no_slot_selected);
      } else if (!isStudyLangValid) {
        showToast("error", T.error_study_lang);
      } else {
        showToast("error", T.error_msg);
      }
      return;
    }

    setLoading(true);
    try {
      const whatsappLink = `https://wa.me/${normalizedWhatsAppDigits}`;

      const payload = {
        name: formData.name.trim(),
        phone: whatsappLink, // send as wa.me/COUNTRYCODE+number
        age: parsedAge,
        language: language.toUpperCase(), // UI language
        study_language: formData.studyLang, // en | fr | ara | spanish
        pack_name: selectedPack.name,
        pack_total_price: `${selectedPack.total_price} MAD`,
        pack_total_hours: `${selectedPack.total_hours} hours`,
        pack_price_per_hour: `${selectedPack.price_per_hour} MAD/h`,
        pack_option_selected: selectedPackOptionText,
        availability_summary: formattedAvailability,
        message: formData.message.trim() || "N/A",
      };

      const discordMessage = `
**✨ NEW CONTACT REQUEST (Improglish) ✨**

**👤 CLIENT INFO**
> **Name:** ${payload.name}
> **Age:** ${payload.age}
> **Study Language:** ${payload.study_language}
> **WhatsApp:** ${payload.phone}
> **UI Lang:** ${payload.language}

**💰 SELECTED PACK**
> **Name:** ${payload.pack_name}
> **Total Price:** ${payload.pack_total_price}
> **Total Hours:** ${payload.pack_total_hours}
> **Hourly:** ${payload.pack_price_per_hour}
> **Consumption:** ${payload.pack_option_selected}

**🗓️ AVAILABILITY**
${payload.availability_summary.split(' || ').map(line => `> ${line}`).join('\n')}

**📝 MESSAGE**
> ${payload.message.replace(/\n/g, '\n> ')}
`.trim();
      const body = { discord_message: discordMessage }
      console.log(body)
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret": "super-long-random-string",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setFormStatus("success");
      showToast("success", T.success_msg);
      // Reset
      setFormData({
        name: "",
        age: "",
        message: "",
        studyLang: "",
        pack: null,
        packOption: null,
      });
      setAvailability({});
      setExpandedPacks({});
      setLocalPhone("");
      setCountry(COUNTRIES[0]); // back to Morocco
    } catch (err) {
      console.error("Submission Error:", err);
      setFormStatus("error");
      showToast("error", T.error_msg);
    } finally {
      setLoading(false);
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  const isSubmitDisabled = loading ||
    !isPhoneValid ||
    formData.name.trim() === "" ||
    !isAgeValid ||
    !isPackSelectionValid ||
    !isAvailabilityValid ||
    !isStudyLangValid;

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-800 antialiased ${isRTL ? "font-[system-ui] rtl" : "ltr"} w-full overflow-x-hidden`}>
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-blue-50/50" />
      <header className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 border-b border-gray-200 shadow-sm w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between w-full">
          <a href="#" className="flex items-center gap-2 min-w-0">
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-blue-400 bg-blue-50 grid place-items-center shrink-0 text-xl font-bold text-blue-600">
              <img src="logo.jpeg" alt="logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight truncate text-blue-800">
              {T.brand}
            </span>
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white font-medium shadow-lg shadow-blue-300/50 hover:bg-blue-700 transition active:scale-[0.99] border border-blue-500"
            >
              {T.contact_btn}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 w-full">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 sm:p-10 shadow-xl shadow-blue-50 w-full max-w-full">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-blue-800">
            {T.hero_title}
          </h1>
          <p className={`mt-3 sm:mt-4 text-base sm:text-xl text-gray-600 max-w-3xl ${isRTL ? "text-right ml-auto" : ""}`}>
            {T.hero_sub}
          </p>
        </section>

        <section id="contact" className="mt-12 sm:mt-16 w-full">
          <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-5 sm:p-10 shadow-2xl shadow-gray-100 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-blue-700">
              {T.contact_btn}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-10 w-full max-w-full overflow-visible">
              {/* SECTION 1: PACKS */}
              <div id="pack-selection" className="w-full max-w-full">
                <h3 className={`text-2xl font-semibold mb-6 pb-2 border-b border-gray-300 text-blue-700 ${isRTL ? 'text-right' : ''}`}>
                  {T.packs_title}
                </h3>
                <p className="text-sm text-blue-600 font-medium text-center mb-6">{T.pack_scroll_tip}</p>

                <div className="space-y-4 w-full max-w-full">
                  {NEW_PACKS_DATA.map((pack) => {
                    const selected = formData.pack === pack.id;
                    const isExpanded = expandedPacks[pack.id];
                    const langKey = language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';

                    return (
                      <div
                        key={pack.id}
                        className={`w-full max-w-full p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
                          selected ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100" : "border-gray-200 bg-white hover:border-blue-200"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <p className={`text-xl sm:text-2xl font-extrabold mb-1 ${selected ? "text-blue-800" : "text-gray-700"}`}>
                              {pack.name}
                            </p>
                            <ul className="text-sm space-y-1 text-gray-600 mt-2">
                              {pack.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center">
                                  <BadgeCheck className="size-4 mr-2 text-green-500" />
                                  <span className="text-sm">{benefit[langKey]}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 leading-none">
                              {T.pack_total_price(pack.total_price)}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                              {T.pack_total_label(pack.total_hours)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handlePackSelect(pack.id)}
                            className={`w-full text-center py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                              selected ? "bg-green-500 text-white hover:bg-green-600" : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {selected ? (<><CheckCircle className="size-5 inline-block mr-2" /> {T.pack_selected_btn}</>) : T.pack_choose_btn}
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePackExpansion(pack.id)}
                            className={`w-full flex justify-center items-center py-2 px-3 text-sm rounded-xl transition-all duration-200 ${
                              isExpanded ? "bg-gray-200 text-gray-700" : "bg-white text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {T.pack_more_info}
                            {isExpanded ? <ChevronUp className="size-4 ml-2" /> : <ChevronDown className="size-4 ml-2" />}
                          </button>

                          <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 pt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="min-h-0 space-y-3">
                              <p className="text-sm font-semibold text-blue-700">
                                <Clock className="inline size-4 mr-2 text-blue-500" />
                                {T.pack_select_option}
                              </p>

                              {pack.consumption_options.map(option => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handlePackOptionSelect(option.id); }}
                                  className={`w-full text-sm py-2 px-3 rounded-xl border transition-all duration-150 ${
                                    selected && formData.packOption === option.id
                                      ? "border-green-600 bg-green-100 text-green-800 font-semibold ring-1 ring-green-500"
                                      : "border-gray-300 bg-white hover:bg-blue-50 text-gray-700"
                                  }`}>
                                  {option[`text_${langKey}`]}
                                  {selected && formData.packOption === option.id && <CheckCircle className="size-4 inline ml-2 text-green-600" />}
                                </button>
                              ))}

                              {selected && !formData.packOption && formStatus === 'error' && (
                                <p className="mt-2 text-xs text-red-600 text-center">{T.error_pack_option}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!selectedPack && formStatus === 'error' && (
                  <p className="mt-4 text-sm text-red-600 text-center">{T.error_pack}</p>
                )}
              </div>

              {/* SECTION 2: PROFILE & CONTACT */}
              <div id="profile-section" className="w-full max-w-full">
                <h3 className={`text-2xl font-semibold mb-6 pb-2 border-b border-gray-300 text-blue-700 ${isRTL ? 'text-right' : ''}`}>
                  {T.section_profile}
                </h3>

                <div className="grid sm:grid-cols-2 gap-5 w-full max-w-full">
                  {/* Name */}
                  <div className="w-full max-w-full">
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
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
                      className={`w-full max-w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition placeholder:text-gray-400 ${isRTL ? "text-right" : ""}`}
                    />
                  </div>

                  {/* Age */}
                  <div className="w-full max-w-full">
                    <label htmlFor="age" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                      {T.age_label}
                    </label>
                    <div className="flex rounded-xl overflow-visible border border-gray-300 w-full max-w-full">
                      <span className={`inline-flex items-center px-3 bg-gray-200 text-gray-500 ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'}`}>
                        <User className="size-4" />
                      </span>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="10"
                        max="99"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        placeholder={T.age_placeholder}
                        className={`flex-1 min-w-0 w-full px-4 py-2.5 bg-white text-gray-900 outline-none placeholder:text-gray-400 ${isRTL ? "text-right rounded-l-xl" : "rounded-r-xl"} ${!isAgeValid && formData.age !== "" ? "ring-2 ring-red-500 border-red-500" : ""}`}
                      />
                    </div>
                    {!isAgeValid && formData.age !== "" && (
                      <p className={`mt-2 text-xs text-red-600 ${isRTL ? "text-right" : ""}`}>{T.age_error}</p>
                    )}
                  </div>

                  {/* Study Language - CHOICE INPUT */}
                  <div className="sm:col-span-2 w-full max-w-full">
                    <label htmlFor="studyLang" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                      {T.study_lang_label}
                    </label>
                    <div className="flex border border-gray-300 rounded-xl bg-white w-full max-w-full">
                      <span className={`inline-flex items-center px-3 bg-gray-200 text-gray-500 ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'}`}>
                        <Languages className="size-4" />
                      </span>
                      <select
                        id="studyLang"
                        name="studyLang"
                        value={formData.studyLang}
                        onChange={handleChange}
                        required
                        className={`flex-1 min-w-0 w-full px-4 py-2.5 bg-white text-gray-900 outline-none appearance-none ${isRTL ? "text-right border-r-0 rounded-l-xl" : "rounded-r-xl border-l-0"}`}
                      >
                        <option value="" disabled>—</option>
                        {[
                          { value: "en", label: "English" },
                          { value: "fr", label: "French" },
                          { value: "ara", label: "Arabic" },
                          { value: "spanish", label: "Spanish" },
                        ].map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className="inline-flex items-center px-3 text-gray-500 pointer-events-none">
                        <ChevronDown className="size-4" />
                      </span>
                    </div>
                    {!isStudyLangValid && formStatus === 'error' && (
                      <p className={`mt-2 text-xs text-red-600 ${isRTL ? "text-right" : ""}`}>{T.error_study_lang}</p>
                    )}
                  </div>

                  {/* Phone: COUNTRY PICKER + LOCAL NUMBER */}
                  <div className="sm:col-span-2 w-full max-w-full">
                    <label className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                      {T.phone_label}
                    </label>
                    {/* Important: allow dropdown to escape, keep width locked */}
                    <div className="flex border border-gray-300 rounded-xl w-full max-w-full overflow-visible">
                      <CountryPicker
                        T={T}
                        countries={COUNTRIES}
                        selected={country}
                        onSelect={setCountry}
                        isRTL={isRTL}
                      />
                      <div className="flex-1 flex items-center min-w-0">
                        <span className="inline-flex items-center px-3 bg-gray-50 text-gray-600 border-l border-gray-200">
                          +{country.dialCode}
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={localPhone}
                          onChange={(e) => setLocalPhone(e.target.value)}
                          required
                          placeholder={T.phone_placeholder}
                          className={`flex-1 min-w-0 w-full px-4 py-2.5 bg-white text-gray-900 outline-none placeholder:text-gray-400 ${isRTL ? "text-right rounded-l-xl" : "rounded-r-xl"} ${!isPhoneValid && localPhone !== "" ? "ring-2 ring-red-500 border-red-500" : ""}`}
                        />
                      </div>
                    </div>
                    {!isPhoneValid && localPhone !== "" && (
                      <p className={`mt-2 text-xs text-red-600 ${isRTL ? "text-right" : ""}`}>{T.error_phone}</p>
                    )}
                    {isPhoneValid && normalizedWhatsAppDigits && (
                      <p className="mt-2 text-xs text-green-700">seems good!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: AVAILABILITY */}
              <div className="w-full max-w-full">
                <h3 className={`text-2xl font-semibold mb-6 pb-2 border-b border-gray-300 text-blue-700 ${isRTL ? 'text-right' : ''}`}>
                  {T.section_availability}
                </h3>
                <SchedulePicker
                  T={T}
                  language={language}
                  availability={availability}
                  setAvailability={setAvailability}
                  isRTL={isRTL}
                />
                {!isAvailabilityValid && formStatus === 'error' && (
                  <p className="mt-4 text-sm text-red-600 text-center">{T.no_slot_selected}</p>
                )}
              </div>

              {/* MESSAGE (optional) */}
              <div className="w-full max-w-full">
                <label htmlFor="message" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                  {T.message_label}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={T.message_placeholder}
                  className={`w-full max-w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition placeholder:text-gray-400 ${isRTL ? "text-right" : ""}`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-blue-600 text-white font-semibold shadow-lg shadow-blue-300/50 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] border border-blue-500"
              >
                {loading ? (
                  <>
                    <span className="inline-block size-5 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    {T.submit_btn}
                  </>
                )}
              </button>

              {formStatus === "success" && (
                <div className="rounded-xl border border-green-500/40 bg-green-50 text-green-700 px-4 py-3 text-center mt-5">
                  {T.success_msg}
                </div>
              )}
              {formStatus === "error" && (
                <div className="rounded-xl border border-red-500/40 bg-red-50 text-red-700 px-4 py-3 text-center mt-5">
                  {T.error_msg}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Mobile CTA */}
      <a
        href="#contact"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm sm:hidden inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-blue-600 text-white font-semibold shadow-2xl shadow-blue-500/50 hover:bg-blue-700 transition z-10"
      >
        <Send className="size-5" />
        {T.contact_btn}
      </a>

      <footer className="mt-10 sm:mt-12 border-t border-gray-200 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} {T.brand}. {T.footer_text}
        </div>
      </footer>

      <Toast
        open={toast.open}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        isRTL={isRTL}
      >
        {toast.msg}
      </Toast>
    </div>
  );
};

export default App;
