import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
    gu: {
        brandName: "સુરત ક્ષત્રિય યુવક મંડળ",
        brandTagline: "સહકાર · સંગઠન · સિદ્ધિ",
        brandEst: "સ્થાપના ૧૯૬૧ · સુરત",
        navOrder: "સાલમ પાક ઓર્ડર",
        navAbout: "મંડળ વિશે",
        navHelp: "મદદ / સંપર્ક",
        langSwitch: "English",
        heroBadge: "શુદ્ધ દેશી ગાયના ઘી નો સાલમ પાક",
        heroTitle: "સુરત ક્ષત્રિય યુવક મંડળ",
        heroSubtitle: "પરંપરાગત પૌષ્ટિક શિયાળુ વસાણું — તાજો સાલમ પાક",
        heroDesc: "સલામ પંજા, શુદ્ધ ઘી, માવો, મગજતરી અને ૩૨ ગુણકારી આયુર્વેદિક ઔષધિઓથી ભરપૂર. શિયાળામાં સ્વાસ્થ્ય અને શક્તિ માટે શ્રેષ્ઠ.",
        selectWeight: "વજન પસંદ કરો:",
        weight500g: "૫૦૦ ગ્રામ (500g)",
        weight1kg: "૧ કિલો (1 kg)",
        price500g: "₹૪૨૦",
        price1kg: "₹૮૪૦",
        quantityLabel: "કેટલા બોક્સ જોઈએ છે? (જથ્થો):",
        paymentOptionTitle: "૧ કિલો માટે ચૂકવણીનો વિકલ્પ:",
        payFullTitle: "પૂરી રકમ હમણાં ચૂકવો (Full Online)",
        payFullSub: "₹૮૪૦ પૂરા ઓનલાઇન ચૂકવો. વાડી પર કોઈ રકમ બાકી રહેશે નહીં.",
        payAdvanceTitle: "₹૫૦૦ એડવાન્સ બુકિંગ (Advance Booking)",
        payAdvanceSub: "હમણાં ₹૫૦૦ ચૂકવો. બાકીના ₹૩૪૦ બોક્સ લેતી વખતે વાડી પર રોકડા ચૂકવવા.",
        summaryItem: "પસંદ કરેલ:",
        summaryQty: "બોક્સ:",
        summaryPayNow: "હમણાં ચૂકવવાપાત્ર રકમ:",
        summaryPayAtVadi: "વાડી પર લેતી વખતે બાકી રકમ:",
        formHeading: "ઓર્ડર આપનારની વિગત",
        formSub: "ફક્ત ૨ વિગતો દાખલ કરો જેથી ઓર્ડર તૈયાર થાય ત્યારે તમને જાણ કરી શકીએ.",
        nameLabel: "તમારું પૂરું નામ *",
        namePlaceholder: "દા.ત. રમેશભાઈ કાછીયાવાલા",
        phoneLabel: "મોબાઈલ / WhatsApp નંબર *",
        phonePlaceholder: "૧૦ અંકનો મોબાઈલ નંબર",
        phoneHelp: "સાલમ પાક તૈયાર થશે એટલે આ નંબર પર WhatsApp / SMS મેસેજ આવશે.",
        notesLabel: "ખાસ નોંધ (વૈકલ્પિક)",
        notesPlaceholder: "કોઈ ખાસ સૂચના હોય તો લખો",
        pickupBoxTitle: "ઓર્ડર ક્યાંથી અને ક્યારે મેળવવો?",
        pickupPoint: "સંગ્રહ સ્થાન:",
        pickupPointAddress: "સુરત ક્ષત્રિય સમાજ વાડી, સુરત (રૂબરૂ લેવા આવવું)",
        pickupTimeline: "તૈયાર થવાનો સમય:",
        pickupTimelineDesc: "ઓર્ડર કર્યા પછી ૪ થી ૫ દિવસમાં તાજો બને એટલે.",
        pickupAlert: "જાણ કેવી રીતે થશે:",
        pickupAlertDesc: "બોક્સ પેક થતાં જ તમારા મોબાઈલ પર WhatsApp મેસેજ આવશે.",
        btnPayNow: "હમણાં ઓર્ડર કન્ફર્મ કરો અને ચૂકવો",
        btnProcessing: "પેમેન્ટ વિન્ડો ખૂલી રહી છે...",
        secureNotice: "Google Pay, PhonePe, Paytm, UPI અથવા Card દ્વારા ૧૦૦% સુરક્ષિત ચૂકવણી",
        helplineTitle: "ઓર્ડર કરવામાં કોઈ તકલીફ છે? અમે મદદ કરીશું!",
        helplineDesc: "જો તમને ઓનલાઇન ઓર્ડર કરવામાં મુશ્કેલી પડતી હોય તો અમારા વોટ્સએપ પર મેસેજ કરો અથવા સીધો ફોન કરો:",
        btnCall: "સીધો ફોન કરો",
        btnWhatsApp: "WhatsApp પર વાત કરો",
        receiptConfirmed: "ઓર્ડર સફળ થયો છે! (Order Confirmed)",
        receiptSubtitle: "તમારો સાલમ પાક સમાજ વાડી ખાતે તૈયાર કરવામાં આવી રહ્યો છે.",
        tokenTitle: "તમારો પિકઅપ ટોકન નંબર:",
        tokenInstruction: "સમાજ વાડી પર આ ટોકન નંબર બતાવીને તમારો સાલમ પાક મેળવી લેવો.",
        paidAmount: "ચૂકવેલ રકમ:",
        dueAmount: "વાડી પર આપવાની બાકી રકમ:",
        btnPrint: "પાવતી સાચવો / પ્રિન્ટ કરો",
        btnNewOrder: "બીજો નવો ઓર્ડર કરો",
        aboutPageTitle: "સુરત ક્ષત્રિય યુવક મંડળ વિશે",
        aboutPageTagline: "સ્થાપના ૧૯૬૧ · સમાજ માટે — સમાજ સાથે",
        aboutStoryHeading: "અમારો પરિચય અને ઇતિહાસ",
        aboutSevaHeading: "મંડળની મુખ્ય સેવા પ્રવૃત્તિઓ",
        aboutMembersHeading: "સંચાલન સમિતિ અને હોદ્દેદારો",
        aboutBackBtn: "← સાલમ પાક ઓર્ડર પેજ પર પાછા જાઓ",
        contactHeading: "સંપર્ક અને સરનામું",
    },
    en: {
        brandName: "Surat Kshtriya Yuvak Mandal",
        brandTagline: "Sahkar · Sangathan · Siddhi",
        brandEst: "Est. 1961 · Surat",
        navOrder: "Order Salampak",
        navAbout: "About Mandal",
        navHelp: "Help / Contact",
        langSwitch: "ગુજરાતી",
        heroBadge: "Pure Desi Cow Ghee Salampak",
        heroTitle: "Surat Kshtriya Yuvak Mandal",
        heroSubtitle: "Authentic Winter Herbal Delicacy — Fresh Salampak",
        heroDesc: "Rich in authentic Salam Panja, pure cow ghee, slow-cooked mawa, melon seeds, and 32 revitalizing Ayurvedic herbs. Perfect for winter vitality.",
        selectWeight: "Choose Size / Weight:",
        weight500g: "500 Grams (500g)",
        weight1kg: "1 Kilogram (1 kg)",
        price500g: "₹420",
        price1kg: "₹840",
        quantityLabel: "How many boxes? (Quantity):",
        paymentOptionTitle: "Payment Option for 1 kg:",
        payFullTitle: "Pay Full Amount Online (₹840)",
        payFullSub: "Pay full ₹840 online now. Zero balance due at pickup.",
        payAdvanceTitle: "₹500 Advance Token Booking",
        payAdvanceSub: "Pay ₹500 advance now. Pay remaining ₹340 in cash at Vadi pickup.",
        summaryItem: "Selected:",
        summaryQty: "Quantity:",
        summaryPayNow: "Amount Payable Online Now:",
        summaryPayAtVadi: "Balance Due at Vadi Pickup:",
        formHeading: "Customer Details",
        formSub: "Only 2 details needed so we can update you once your batch is packed.",
        nameLabel: "Your Full Name *",
        namePlaceholder: "e.g. Rameshchandra Kachiwala",
        phoneLabel: "Mobile / WhatsApp Number *",
        phonePlaceholder: "10-digit mobile number",
        phoneHelp: "You will receive a WhatsApp/SMS alert on this number when order is ready.",
        notesLabel: "Special Notes (Optional)",
        notesPlaceholder: "Any instructions for collection",
        pickupBoxTitle: "Pickup Location & Collection Details",
        pickupPoint: "Collection Counter:",
        pickupPointAddress: "Surat Kshtriya Samaj Community Vadi, Surat (Self-pickup)",
        pickupTimeline: "Preparation Window:",
        pickupTimelineDesc: "Ready in 4 to 5 working days (slow-cooked fresh).",
        pickupAlert: "Ready Alert:",
        pickupAlertDesc: "Automated WhatsApp message once packed and ready at the Vadi.",
        btnPayNow: "Pay & Confirm Order Now",
        btnProcessing: "Opening Secure Payment...",
        secureNotice: "100% Secure payment via Google Pay, PhonePe, Paytm, UPI or Cards",
        helplineTitle: "Need help ordering? We are here for you!",
        helplineDesc: "If you face any issue ordering online, message us on WhatsApp or call our team directly:",
        btnCall: "Call Helpline",
        btnWhatsApp: "Chat on WhatsApp",
        receiptConfirmed: "Order Confirmed Successfully!",
        receiptSubtitle: "Your fresh Salampak batch is being prepared at the Community Vadi.",
        tokenTitle: "Your Pickup Token ID:",
        tokenInstruction: "Present this Token ID at the Community Vadi counter to collect your box.",
        paidAmount: "Paid Online:",
        dueAmount: "Balance Due at Vadi:",
        btnPrint: "Print / Save Receipt",
        btnNewOrder: "Place Another Order",
        aboutPageTitle: "About Surat Kshtriya Yuvak Mandal",
        aboutPageTagline: "Est. 1961 · In Service of Community",
        aboutStoryHeading: "Our Heritage & Story",
        aboutSevaHeading: "Key Community Seva Initiatives",
        aboutMembersHeading: "Managing Committee & Office Bearers",
        aboutBackBtn: "← Back to Salampak Order Page",
        contactHeading: "Contact & Location",
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem("skym_lang") || "gu";
    });

    useEffect(() => {
        localStorage.setItem("skym_lang", lang);
    }, [lang]);

    const toggleLang = () => {
        setLang((prev) => (prev === "gu" ? "en" : "gu"));
    };

    const t = translations[lang] || translations.gu;

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
};
