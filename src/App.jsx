import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Phone,
  Clock,
  Send,
  Globe,
  CheckCircle,
  Calendar,
  User,
  Zap,
  ChevronLeft,
  ChevronRight,
  Euro,
} from "lucide-react";


/* ──────────────────────────────────────────────────────────
   DATA & TRANSLATIONS
   ────────────────────────────────────────────────────────── */

// Helper to calculate total price for a standardized 8-hour pack for display purposes
const getTotalPrice = (hourlyRate) => (hourlyRate * 8).toFixed(0);

// Updated packs data with consumption options moved into the main object for display
const NEW_PACKS_DATA = [
  {
    id: 'TOP',
    name: "Top pack",
    price_per_hour: 83,
    consumption_options: [
      { id: '2h_3m', text_fr: "2h / semaine (3 mois)", text_en: "2h / week (3 months)", text_es: "2h / semana (3 meses)", text_ar: "2 ساعة / أسبوع (3 أشهر)" },
      { id: '3h_2m', text_fr: "3h / semaine (2 mois)", text_en: "3h / week (2 months)", text_es: "3h / semana (2 meses)", text_ar: "3 ساعة / أسبوع (2 شهر)" }
    ],
  },
  {
    id: 'PREMIUM',
    name: "Premium pack",
    price_per_hour: 87.5,
    consumption_options: [
      { id: '2h_2m', text_fr: "2h / semaine (2 mois)", text_en: "2h / week (2 months)", text_es: "2h / semana (2 meses)", text_ar: "2 ساعة / أسبوع (2 شهر)" },
      { id: '1h_4m', text_fr: "1h / semaine (4 mois)", text_en: "1h / week (4 months)", text_es: "1h / semana (4 meses)", text_ar: "1 ساعة / أسبوع (4 أشهر)" }
    ],
  },
  {
    id: 'ADVANCED',
    name: "Advanced pack",
    price_per_hour: 85,
    consumption_options: [
      { id: '2h_2_5m', text_fr: "2h / semaine (2.5 mois)", text_en: "2h / week (2.5 months)", text_es: "2h / semana (2.5 meses)", text_ar: "2 ساعة / أسبوع (2.5 شهر)" },
      { id: '4h_1m', text_fr: "4h / semaine (1 mois)", text_en: "4h / week (1 month)", text_es: "4h / semana (1 mes)", text_ar: "4 ساعة / أسبوع (1 شهر)" }
    ],
  },
  {
    id: 'STANDARD',
    name: "Standard plan",
    price_per_hour: 91,
    consumption_options: [
      { id: '1h_3m', text_fr: "1h / semaine (3 mois)", text_en: "1h / week (3 months)", text_es: "1h / semana (3 meses)", text_ar: "1 ساعة / أسبوع (3 أشهر)" }
    ],
  },
  {
    id: 'BASIC',
    name: "Basic plan",
    price_per_hour: 100,
    consumption_options: [
      { id: '1h_2m', text_fr: "1h / semaine (2 mois)", text_en: "1h / week (2 months)", text_es: "1h / semana (2 months)", text_ar: "1 ساعة / أسبوع (2 شهر)" }
    ],
  },
];

const DAYS_DATA = [
  { fr: "Lun", en: "Mon", es: "Lun", ar: "إث" },
  { fr: "Mar", en: "Tue", es: "Mar", ar: "ثل" },
  { fr: "Mer", en: "Wed", es: "Mié", ar: "أر" },
  { fr: "Jeu", en: "Thu", es: "Jue", ar: "خم" },
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
    pack_price_per_hour: (price) => `${price} MAD/h`, // Smaller text: Hourly rate
    pack_total_price: (price) => `${price} MAD`,       // Bigger text: Total price (8h example)
    pack_total_label: "Ex. 8h pour", // Label before the total price
    pack_select_option: "Choisissez votre rythme de consommation :",
    section_profile: "2. Votre Profil et Contact", section_availability: "3. Vos Disponibilités (Heures/Jours)",
    name_label: "Nom complet", phone_label: "Numéro de téléphone", phone_placeholder: "+212 6 XX XX XX XX (avec indicatif)",
    age_label: "Votre âge", age_placeholder: "Ex: 25", age_error: "Veuillez entrer un âge raisonnable (entre 10 et 99 ans).",
    message_label: "Vos objectifs (Optionnel)", message_placeholder: "Parlez-nous de vos objectifs et de votre niveau actuel.",
    submit_btn: "Envoyer ma demande",
    error_phone: "Numéro invalide. Utiliser le format international (ex: +212...).", error_pack_option: "Veuillez sélectionner un rythme de consommation pour votre pack.",
    success_msg: "Merci ! Votre demande a bien été envoyée. On vous contacte très vite.", error_msg: "Oups ! Une erreur est survenue lors de l'envoi de la demande.",
    footer_text: "Tous droits réservés.", availability_tip: "Cliquez sur une heure pour ajouter ou retirer un créneau.",
    no_slot_selected: "Veuillez choisir au moins un créneau de disponibilité.",
    days_short: DAYS_DATA.map(d => d.fr), days_long: FULL_DAYS_DATA.map(d => d.fr),
    time_slots_title: (day) => `Créneaux disponibles pour ${day}`,
    mobile_tip: "Sélectionnez un jour pour voir les créneaux",
  },
  en: {
    brand: "improglish", contact_btn: "Contact Us", hero_title: "Ready to boost your language skills?", hero_sub: "Flexible packages at your pace 🤍",
    packs_title: "1. Choose Your Package", 
    pack_price_per_hour: (price) => `${price} MAD/h`, // Smaller text: Hourly rate
    pack_total_price: (price) => `${price} MAD`,       // Bigger text: Total price (8h example)
    pack_total_label: "E.g. 8h for",
    pack_select_option: "Choose your consumption rhythm:",
    section_profile: "2. Your Profile and Contact", section_availability: "3. Your Availability (Time Slots)",
    name_label: "Full Name", phone_label: "Phone Number", phone_placeholder: "+212 6 XX XX XX XX (with country code)",
    age_label: "Your Age", age_placeholder: "Ex: 25", age_error: "Please enter a reasonable age (between 10 and 99 years old).",
    message_label: "Your Goals (Optional)", message_placeholder: "Tell us about your goals and current level.",
    submit_btn: "Send my request",
    error_phone: "Invalid phone number. Use international format (e.g., +212...).", error_pack_option: "Please select a consumption rhythm for your pack.",
    success_msg: "Thanks! Your request has been sent. We'll contact you very soon.", error_msg: "Oops! An error occurred while sending the request.",
    footer_text: "All rights reserved.", availability_tip: "Click on a time slot to add or remove it.",
    no_slot_selected: "Please choose at least one availability slot.",
    days_short: DAYS_DATA.map(d => d.en), days_long: FULL_DAYS_DATA.map(d => d.en),
    time_slots_title: (day) => `Available slots for ${day}`,
    mobile_tip: "Select a day to view slots",
  },
  es: {
    brand: "improglish", contact_btn: "Contáctanos", hero_title: "¿Listo para impulsar tus habilidades lingüísticas?", hero_sub: "Paquetes flexibles, adaptados a tu ritmo 🤍",
    packs_title: "1. Elige tu Paquete", 
    pack_price_per_hour: (price) => `${price} MAD/h`,
    pack_total_price: (price) => `${price} MAD`,
    pack_total_label: "Ej. 8h por",
    pack_select_option: "Elige tu ritmo de consumo:",
    section_profile: "2. Tu Perfil y Contacto", section_availability: "3. Tu Disponibilidad (Horarios/Días)",
    name_label: "Nombre completo", phone_label: "Número de teléfono", phone_placeholder: "+212 6 XX XX XX XX (con código de país)",
    age_label: "Tu edad", age_placeholder: "Ej: 25", age_error: "Por favor, introduce una edad razonable (entre 10 y 99 años).",
    message_label: "Tus Objetivos (Opcional)", message_placeholder: "Cuéntanos sobre tus objetivos y tu nivel actual.",
    submit_btn: "Enviar mi solicitud",
    error_phone: "Número inválido. Utiliza el formato internacional (ej: +212...).", error_pack_option: "Por favor, selecciona un ritmo de consumo para tu paquete.",
    success_msg: "¡Gracias! Tu solicitud ha sido enviada. Te contactaremos muy pronto.", error_msg: "¡Ups! Ocurrió un error al enviar la solicitud.",
    footer_text: "Todos los derechos reservados.", availability_tip: "Haz clic en una hora para agregar o eliminar un espacio.",
    no_slot_selected: "Por favor, elige al menos un espacio de disponibilidad.",
    days_short: DAYS_DATA.map(d => d.es), days_long: FULL_DAYS_DATA.map(d => d.es),
    time_slots_title: (day) => `Espacios disponibles para ${day}`,
    mobile_tip: "Selecciona un día para ver los espacios",
  },
  ar: {
    brand: "improglish", contact_btn: "اتصل بنا", hero_title: "هل أنت مستعد لتعزيز مهاراتك اللغوية؟", hero_sub: "باقات مرنة، تناسب إيقاعك 🤍",
    packs_title: "1. اختر باقتك", 
    pack_price_per_hour: (price) => `${price} درهم/ساعة`,
    pack_total_price: (price) => `${price} درهم`,
    pack_total_label: "مثال 8 ساعات مقابل",
    pack_select_option: "اختر وتيرة الاستهلاك الخاصة بك:",
    section_profile: "2. ملفك الشخصي وجهة الاتصال", section_availability: "3. أوقات فراغك (الساعات/الأيام)",
    name_label: "الاسم الكامل", phone_label: "رقم الهاتف", phone_placeholder: "+212 6 XX XX XX XX (مع رمز البلد)",
    age_label: "عمرك", age_placeholder: "مثال: 25", age_error: "يرجى إدخال عمر معقول (بين 10 و 99 سنة).",
    message_label: "أهدافك (اختياري)", message_placeholder: "أخبرنا عن أهدافك ومستواك الحالي.",
    submit_btn: "إرسال طلبي",
    error_phone: "رقم هاتف غير صالح. استخدم التنسيق الدولي (مثال: +212...).", error_pack_option: "يرجى تحديد وتيرة استهلاك لباقة.",
    success_msg: "شكراً لك! لقد تم إرسال طلبك بنجاح. سنتصل بك قريباً جداً.", error_msg: "عذراً! حدث خطأ أثناء إرسال الطلب.",
    footer_text: "جميع الحقوق محفوظة.", availability_tip: "انقر على ساعة لإضافة أو إزالة فترة زمنية.",
    no_slot_selected: "يرجى اختيار فترة زمنية واحدة على الأقل للتوافر.",
    days_short: DAYS_DATA.map(d => d.ar), days_long: FULL_DAYS_DATA.map(d => d.ar),
    time_slots_title: (day) => `الأوقات المتاحة ليوم ${day}`,
    mobile_tip: "اختر يوماً لعرض الأوقات",
  },
};

// Helper to get day name for the availability key (always using English long name)
const getDayKey = (dayIndex) => FULL_DAYS_DATA[dayIndex].en;

/* ──────────────────────────────────────────────────────────
   HELPERS & VALIDATION
   ────────────────────────────────────────────────────────── */
// The API URL should be updated if the user provides a different one for their server
const API_URL = "https://impressed-myrilla-improglish-32946bdb.koyeb.app/api/contact"; 

const validatePhoneNumber = (number) =>
  /^\+\d{7,15}$/.test(number.replace(/\s/g, ""));

const validateAge = (age) => {
  const num = parseInt(age, 10);
  return num >= 10 && num <= 99;
};

const formatTime = (hour) => {
  const padded = String(hour).padStart(2, '0');
  return `${padded}:00 - ${String(hour + 1).padStart(2, '0')}:00`;
};

// Timeslots for a whole day (e.g., 8:00 to 22:00)
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 8); // 8, 9, ..., 21


/* ──────────────────────────────────────────────────────────
   Tiny Toast component (no libs)
   ────────────────────────────────────────────────────────── */
function Toast({ open, type = "info", children, onClose, isRTL }) {
  if (!open) return null;
  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-800";
  return (
    <div className={`fixed bottom-4 inset-x-0 px-4 z-50 sm:flex sm:justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`text-white ${color} rounded-xl shadow-md px-4 py-3 text-sm sm:text-base w-full sm:w-auto`}>
        <div className="flex items-start gap-3">
          <div className="mt-1 size-2.5 rounded-full bg-white/90 shrink-0"></div>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>{children}</div>
          <button
            onClick={onClose}
            className="ml-2 text-white/90 hover:text-white shrink-0"
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Availability / Date Picker Component (Responsive Redesign)
   ────────────────────────────────────────────────────────── */
const SchedulePicker = ({ T, language, availability, setAvailability, isRTL }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Monday

  const toggleSlot = useCallback((dayIndex, hour) => {
    const dayKey = getDayKey(dayIndex); 
    setAvailability(prev => {
      const currentSlots = prev[dayKey] || [];
      
      if (currentSlots.includes(hour)) {
        return {
          ...prev,
          [dayKey]: currentSlots.filter(h => h !== hour)
        };
      } else {
        return {
          ...prev,
          [dayKey]: [...currentSlots, hour].sort((a, b) => a - b)
        };
      }
    });
  }, [setAvailability]);

  // Mobile View: Shows slots for the selected day only
  const renderMobileView = () => {
    const currentDayKey = getDayKey(selectedDayIndex);
    const slots = availability[currentDayKey] || [];
    
    return (
      <div className="space-y-4">
        {/* Day Selector (Horizontal Scroll) */}
        <div className="flex items-center justify-between text-lg font-semibold text-indigo-600">
            <button
                type="button"
                onClick={() => setSelectedDayIndex(prev => (prev > 0 ? prev - 1 : T.days_long.length - 1))}
                className={`p-2 rounded-full hover:bg-indigo-50 transition ${isRTL ? 'transform rotate-180' : ''}`}
                aria-label="Previous day"
            >
                <ChevronLeft className="size-5 text-blue-600" />
            </button>
            <div className="min-w-[100px] text-center text-blue-800">
                {T.days_long[selectedDayIndex]}
            </div>
            <button
                type="button"
                onClick={() => setSelectedDayIndex(prev => (prev < T.days_long.length - 1 ? prev + 1 : 0))}
                className={`p-2 rounded-full hover:bg-indigo-50 transition ${isRTL ? 'transform rotate-180' : ''}`}
                aria-label="Next day"
            >
                <ChevronRight className="size-5 text-blue-600" />
            </button>
        </div>

        <p className={`text-sm text-gray-500 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {T.time_slots_title(T.days_long[selectedDayIndex])}
        </p>

        {/* Time Slots List */}
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
                }`}
              >
                {isSelected && <CheckCircle className={`size-4 ${isRTL ? 'ml-2' : 'mr-2'} shrink-0`} />}
                {formatTime(hour)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Desktop View: Classic Calendar Grid
  const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="grid gap-x-1.5 gap-y-2" style={{
          gridTemplateColumns: `auto repeat(${T.days_short.length}, 1fr)`
        }}>
          {/* Header Row (Time column + Day names) */}
          <div className="invisible">Time</div>
          {T.days_short.map((day, dayIndex) => (
            <div key={day} className="text-center font-semibold text-base text-blue-600">
              {day}
            </div>
          ))}

          {/* Time Slots Rows */}
          {TIME_SLOTS.map((hour, hourIndex) => (
            <React.Fragment key={hour}>
              {/* Time Label (first column) */}
              <div className={`py-2.5 px-2 text-xs font-medium text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {formatTime(hour)}
              </div>
              
              {/* Slot Buttons for each day */}
              {T.days_long.map((day, dayIndex) => {
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
                    aria-label={`Toggle availability for ${dayKey} at ${formatTime(hour)}`}
                  >
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
      {/* Shared Tip */}
      <p className={`mb-4 text-sm text-gray-500 ${isRTL ? 'ml-auto text-right' : 'text-left'}`}>
        <Calendar className={`inline size-4 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-600`} />
        <span className="hidden sm:inline">{T.availability_tip}</span>
        <span className="sm:hidden">{T.mobile_tip}</span>
      </p>

      {/* Mobile view (sm:hidden) */}
      <div className="sm:hidden">
        {renderMobileView()}
      </div>

      {/* Desktop view (hidden sm:block) */}
      <div className="hidden sm:block">
        {renderDesktopView()}
      </div>
    </div>
  );
};


/* ──────────────────────────────────────────────────────────
   Language Selector Component (Improved UX)
   ────────────────────────────────────────────────────────── */
const LanguageSelector = ({ language, setLanguage, isRTL }) => {
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
                    }`}
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="hidden sm:inline ml-2">{lang.name}</span>
                </button>
            ))}
        </div>
    );
};


/* ──────────────────────────────────────────────────────────
   APP
   ────────────────────────────────────────────────────────── */
const App = () => {
  const [language, setLanguage] = useState("fr");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "", 
    message: "",
    pack: NEW_PACKS_DATA[0].id,
    packOption: NEW_PACKS_DATA[0].consumption_options[0].id, // Use the first option by default
  });
  const [availability, setAvailability] = useState({}); 
  const [formStatus, setFormStatus] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", msg: "" });

  const T = LANGUAGES[language];
  const isRTL = language === "ar";
  
  // Get currently selected pack object
  const selectedPack = NEW_PACKS_DATA.find(p => p.id === formData.pack);
  
  // Ref for horizontal scrolling
  const packsContainerRef = useRef(null);

  // Determine if any slot is selected
  const isAvailabilityValid = useMemo(() => {
    return Object.values(availability).some(slots => slots.length > 0);
  }, [availability]);


  // Effect to handle RTL and enforce light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    // Scroll the selected pack into view on mount/language change/pack change
    if (packsContainerRef.current) {
        const selectedCard = packsContainerRef.current.querySelector(`.pack-card-${formData.pack}`);
        if (selectedCard) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
    return () => document.documentElement.removeAttribute("dir");
  }, [isRTL, formData.pack]);


  // Helper function for carousel scrolling
  const scrollPacks = (direction) => {
    if (packsContainerRef.current) {
      // Calculate scroll distance based on card width plus gap (16px for gap-4)
      const cardWidth = packsContainerRef.current.querySelector('.shrink-0').offsetWidth + 16;
      packsContainerRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };


  const handleLanguageChange = (code) => setLanguage(code);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePackSelect = (packId) => {
    const pack = NEW_PACKS_DATA.find(p => p.id === packId);
    setFormData((p) => ({ 
      ...p, 
      pack: packId,
      // Select the first option of the new pack by default
      packOption: pack.consumption_options[0].id 
    }));
  };

  const handlePackOptionSelect = (optionId) => {
    setFormData((p) => ({ ...p, packOption: optionId }));
  };

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
  
  const isAgeValid = useMemo(
    () => formData.age === "" || validateAge(formData.age),
    [formData.age]
  );

  const showToast = (type, msg) => {
    setToast({ open: true, type, msg });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 4000);
  };
  
  // Find the text for the selected pack option
  const selectedPackOptionText = useMemo(() => {
    const pack = NEW_PACKS_DATA.find(p => p.id === formData.pack);
    if (!pack) return 'N/A';
    const option = pack.consumption_options.find(opt => opt.id === formData.packOption);
    const langKey = language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';
    return option ? option[`text_${langKey}`] : 'N/A';
  }, [formData.pack, formData.packOption, language]);
  
  // Combine availability data into a readable string for the payload
  const formattedAvailability = useMemo(() => {
    const availableDays = Object.entries(availability)
      .filter(([, slots]) => slots.length > 0)
      .map(([day, slots]) => {
        const sortedSlots = slots.sort((a, b) => a - b);
        const timeRanges = sortedSlots.map(formatTime);
        return `${day}: ${timeRanges.join(' | ')}`;
      });
    return availableDays.join(' || ');
  }, [availability]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- START: SERVER VALIDATION FIXES ---
    // 1. Strict Cleaning/Parsing
    const cleanedPhone = formData.phone.replace(/[^\d+]/g, '').trim();
    const parsedAge = parseInt(formData.age, 10);
    
    // 2. Client-side Validation Checks
    if (!validatePhoneNumber(cleanedPhone)) {
      setFormStatus("error");
      showToast("error", T.error_phone);
      return;
    }
    
    if (formData.name.trim() === "" || !validateAge(parsedAge) || !formData.packOption || !isAvailabilityValid) {
      setFormStatus("error");
      showToast("error", T.error_msg); 
      return;
    }
    // --- END: SERVER VALIDATION FIXES ---


    setLoading(true);
    try {
      
      // Structure the data for the API payload (Ensuring phone is clean and age is a number)
      const payload = {
        name: formData.name.trim(),
        phone: cleanedPhone, // CLEANED phone number
        age: parsedAge,       // PARSED age as integer
        language: language.toUpperCase(),
        pack_name: selectedPack.name,
        pack_price_per_hour: `${selectedPack.price_per_hour} MAD/h`,
        pack_option_selected: selectedPackOptionText,
        availability_summary: formattedAvailability,
        message: formData.message.trim() || "N/A",
      };
      
      // DISCORD MESSAGE FORMATTING (as a simple string for the backend to handle)
      const discordMessage = `
        **✨ NOUVELLE DEMANDE DE CONTACT (Improglish) ✨**
        
        **👤 CLIENT INFO**
        > **Nom:** ${payload.name}
        > **Âge:** ${payload.age} ans
        > **Téléphone:** ${payload.phone}
        > **Langue UI:** ${payload.language}

        **💰 PACK CHOISI**
        > **Nom du Pack:** ${payload.pack_name}
        > **Prix Horaire:** ${payload.pack_price_per_hour}
        > **Option Choisi:** ${payload.pack_option_selected}

        **🗓️ DISPONIBILITÉS (HEURES LOCALES)**
        ${payload.availability_summary.split(' || ').map(line => `> ${line}`).join('\n')}

        **📝 OBJECTIFS/MESSAGE**
        > ${payload.message.replace(/\n/g, '\n> ')}
      `.trim();
      
      // Sending the structured data and the formatted message
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret": "super-long-random-string",
        },
        body: JSON.stringify({ 
          ...payload,
          discord_message: discordMessage 
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setFormStatus("success");
      showToast("success", T.success_msg);
      // Reset form fields after successful submission
      setFormData({
        name: "",
        phone: "",
        age: "",
        message: "",
        pack: NEW_PACKS_DATA[0].id,
        packOption: NEW_PACKS_DATA[0].consumption_options[0].id,
      });
      setAvailability({});
      
    } catch (err) {
      console.error("Submission Error:", err);
      setFormStatus("error");
      showToast("error", T.error_msg);
    } finally {
      setLoading(false);
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  return (
    // Aesthetic Change: Light Mode background and dark/blue text
    <div className={`min-h-screen bg-gray-50 text-gray-800 antialiased ${isRTL ? "font-[system-ui] rtl" : "ltr"}`}>
      {/* Top Gradient Accent - Adjusted for light mode */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-blue-50/50" />

      {/* NAVBAR - Adjusted for light mode */}
      <header className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">
          <a href="logo.jpeg" className="flex items-center gap-2 min-w-0">
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-blue-400 bg-blue-50 grid place-items-center shrink-0 text-xl font-bold text-blue-600">
              <img src="logo.jpeg" alt="" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight truncate text-blue-800">
              {T.brand}
            </span>
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <LanguageSelector language={language} setLanguage={handleLanguageChange} isRTL={isRTL} />

            {/* CTA (Hidden on mobile, uses fixed button instead) */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white font-medium shadow-lg shadow-blue-300/50 hover:bg-blue-700 transition active:scale-[0.99] border border-blue-500"
            >
              {T.contact_btn}
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* HERO - Adjusted for light mode */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 sm:p-10 shadow-xl shadow-blue-50">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-blue-800">
            {T.hero_title}
          </h1>
          <p
            className={`mt-3 sm:mt-4 text-base sm:text-xl text-gray-600 max-w-3xl ${
              isRTL ? "text-right ml-auto" : ""
            }`}
          >
            {T.hero_sub}
          </p>
        </section>
        
        {/* CONTACT FORM (Unified Section) */}
        <section id="contact" className="mt-12 sm:mt-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-5 sm:p-10 shadow-2xl shadow-gray-100">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-blue-700">
              {T.contact_btn}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* SECTION 1: PACK SELECTION (Horizontal Sliding Carousel) */}
              <div>
                <h3 className={`text-2xl font-semibold mb-6 pb-2 border-b border-gray-300 text-blue-700 ${isRTL ? 'text-right' : ''}`}>
                  {T.packs_title}
                </h3>
                
                <div className="relative">
                    {/* Carousel Controls - NOW VISIBLE ON MOBILE */}
                    <button
                        type="button"
                        onClick={() => scrollPacks('left')}
                        // Removed 'hidden sm:block' - adjusted padding and icon size for mobile fit
                        className={`absolute top-1/2 -mt-[120px] ${isRTL ? 'right-0' : '-left-2'} z-10 p-1 rounded-full bg-white/90 shadow-lg border border-gray-300 backdrop-blur-sm hover:bg-white transition`}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="size-5 sm:size-6 text-blue-600" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollPacks('right')}
                        // Removed 'hidden sm:block' - adjusted padding and icon size for mobile fit
                        className={`absolute top-1/2 -mt-[120px] ${isRTL ? '-left-2' : 'right-0'} z-10 p-1 rounded-full bg-white/90 shadow-lg border border-gray-300 backdrop-blur-sm hover:bg-white transition`}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="size-5 sm:size-6 text-blue-600" />
                    </button>
                    
                    {/* Horizontal Sliding Container */}
                    <div 
                      ref={packsContainerRef}
                      className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-2 -mx-2 transition-transform duration-300 ease-in-out scrollbar-hide"
                      // Custom scrollbar hiding (for desktop)
                      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
                    >
                      {NEW_PACKS_DATA.map((pack) => {
                        const selected = formData.pack === pack.id;
                        const totalPrice = getTotalPrice(pack.price_per_hour);
                        const langKey = language === 'fr' ? 'fr' : language === 'es' ? 'es' : language === 'ar' ? 'ar' : 'en';


                        return (
                          <div 
                            key={pack.id} 
                            // Set fixed width and snap properties for sliding
                            className={`pack-card-${pack.id} w-[80vw] max-w-[320px] shrink-0 snap-center p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl ${
                              selected
                                ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100 transform scale-[1.03]" // slight zoom on selection
                                : "border-gray-200 bg-white hover:border-blue-200"
                            }`}
                            onClick={() => handlePackSelect(pack.id)}
                          >
                            <div className="text-center">
                              <p className={`text-xl font-bold ${selected ? "text-blue-800" : "text-gray-700"} mb-1`}>
                                {pack.name}
                              </p>
                              
                              {/* BIGGER: Total Price */}
                              <div className="flex items-end justify-center my-3">
                                
                                <p className="text-5xl font-extrabold text-blue-600 leading-none">
                                  {T.pack_total_price(totalPrice)}
                                </p>
                              </div>

                              {/* SMALLER: Consumption Details - Hourly Rate */}
                              <p className="text-sm text-gray-500 font-medium">
                                {T.pack_total_label} <span className="font-semibold">{T.pack_total_price(totalPrice)}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Soit {T.pack_price_per_hour(pack.price_per_hour)}
                              </p>

                              <div className="mt-5 pt-4 border-t border-gray-200">
                                <p className={`text-sm font-semibold mb-3 ${selected ? 'text-blue-700' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <Clock className={`inline size-4 ${isRTL ? 'ml-2' : 'mr-2'} text-blue-500`} />
                                    {T.pack_select_option}
                                </p>
                                {/* Consumption Options List */}
                                <div className="space-y-2">
                                    {pack.consumption_options.map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handlePackOptionSelect(option.id); }}
                                            className={`w-full text-sm py-2 px-3 rounded-xl border transition-all duration-150 ${
                                                selected && formData.packOption === option.id
                                                    ? "border-green-600 bg-green-50 text-green-800 font-semibold ring-1 ring-green-500"
                                                    : selected
                                                    ? "border-blue-300 bg-white hover:bg-blue-100 text-gray-700"
                                                    : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                                            } ${isRTL ? 'text-right' : 'text-left'}`}
                                        >
                                            {option[`text_${langKey}`]}
                                            {selected && formData.packOption === option.id && <CheckCircle className={`size-4 inline ${isRTL ? 'mr-2' : 'ml-2'} text-green-600`} />}
                                        </button>
                                    ))}
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>
              </div>

              {/* SECTION 2: PROFILE & CONTACT */}
              <div>
                <h3 className={`text-2xl font-semibold mb-6 pb-2 border-b border-gray-300 text-blue-700 ${isRTL ? 'text-right' : ''}`}>
                  {T.section_profile}
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
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
                      className={`w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition placeholder:text-gray-400 ${isRTL ? "text-right" : ""}`}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label htmlFor="age" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                      {T.age_label}
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-300">
                      <span className="inline-flex items-center px-3 bg-gray-200 text-gray-500">
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
                        className={`flex-1 min-w-0 px-4 py-2.5 bg-white text-gray-900 outline-none placeholder:text-gray-400 ${isRTL ? "text-right" : ""} ${!isAgeValid && formData.age !== "" ? "ring-2 ring-red-500 border-red-500" : ""}`}
                      />
                    </div>
                    {!isAgeValid && formData.age !== "" && (
                      <p className={`mt-2 text-xs text-red-600 ${isRTL ? "text-right" : ""}`}>
                        {T.age_error}
                      </p>
                    )}
                  </div>
                  
                  {/* Phone (full width on small screens) */}
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isRTL ? "text-right" : ""}`}>
                      {T.phone_label}
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-300">
                      <span className="inline-flex items-center px-3 bg-gray-200 text-gray-500">
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
                        className={`flex-1 min-w-0 px-4 py-2.5 bg-white text-gray-900 outline-none placeholder:text-gray-400 ${isRTL ? "text-right" : ""} ${!isPhoneValid && formData.phone !== "" ? "ring-2 ring-red-500 border-red-500" : ""}`}
                      />
                    </div>
                    {!isPhoneValid && formData.phone !== "" && (
                      <p className={`mt-2 text-xs text-red-600 ${isRTL ? "text-right" : ""}`}>
                        {T.error_phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: AVAILABILITY */}
              <div>
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
                  <p className={`mt-4 text-sm text-red-600 text-center`}>
                    {T.no_slot_selected}
                  </p>
                )}
              </div>

              {/* MESSAGE (GOALS) */}
              <div>
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
                  className={`w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition placeholder:text-gray-400 ${isRTL ? "text-right" : ""}`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isPhoneValid || formData.name.trim() === "" || !isAgeValid || !formData.packOption || !isAvailabilityValid}
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

              {/* Status */}
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

      {/* Fixed Mobile CTA Button */}
      <a 
        href="#contact" 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm sm:hidden inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-blue-600 text-white font-semibold shadow-2xl shadow-blue-500/50 hover:bg-blue-700 transition z-10"
      >
        <Send className="size-5" />
        {T.contact_btn}
      </a>


      {/* FOOTER - Adjusted for light mode */}
      <footer className="mt-10 sm:mt-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} {T.brand}. {T.footer_text}
        </div>
      </footer>

      {/* Toast */}
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
