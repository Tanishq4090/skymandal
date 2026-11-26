import { Link } from "react-router-dom";
import { ArrowLeft, Users, Heart, MapPin, Mail, Phone, Calendar } from "lucide-react";
import { BRAND, MEMBERS, CAMPAIGNS, VALUES } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
    const { lang, t } = useLanguage();

    return (
        <div data-testid="about-page" className="animate-fade-up pb-20">
            {/* Top Bar with Back Button */}
            <section className="bg-ivory-100 border-b border-line py-8">
                <div className="container-page">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-line text-brand-700 hover:bg-brand-50 text-sm font-bold shadow-sm transition-all mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t.aboutBackBtn}</span>
                    </Link>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 leading-tight">
                        {lang === "gu" ? BRAND.nameGujarati : BRAND.name}
                    </h1>
                    <p className="text-base sm:text-xl text-brand-700 font-bold mt-2">
                        {lang === "gu" ? "સુરત ક્ષત્રિય સમાજ સેવા · સ્થાપના ૧૯૬૧ થી" : "Serving the Khatri Community of Surat since 1961"}
                    </p>
                </div>
            </section>

            {/* MANDAL HISTORY / STORY */}
            <section className="container-page mt-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-line shadow-sm space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 pb-3 border-b border-line">
                            {t.aboutStoryHeading}
                        </h2>
                        <p className="text-base sm:text-lg text-ink-700 leading-relaxed font-medium">
                            {lang === "gu"
                                ? "સુરત ક્ષત્રિય યુવક મંડળ એ સુરતના ખત્રી સમાજના યુવાનોનું સંગઠન છે, જે ૧૯૬૧ થી સમાજના દરેક પરિવારની પડખે ઊભું રહ્યું છે. સમાજના વડીલોના આશીર્વાદ અને યુવાઓના સાથ-સહકારથી મંડળ શિક્ષણ, આરોગ્ય અને સામાજિક કલ્યાણના અસંખ્ય કાર્યો કરી રહ્યું છે."
                                : "Surat Kshtriya Yuvak Mandal is the youth-led social organisation of the Surat Khatri community, serving continuously since 1961. Guided by elders and powered by youth, the mandal undertakes diverse community initiatives spanning education, healthcare, and welfare."}
                        </p>
                        <p className="text-base sm:text-lg text-ink-700 leading-relaxed font-medium">
                            {lang === "gu"
                                ? "દર વર્ષે શિયાળામાં તૈયાર કરવામાં આવતો શુદ્ધ દેશી ઘી નો સાલમ પાક સમાજના પરિવારોના સ્વાસ્થ્ય માટે પરંપરાગત આયુર્વેદિક સામગ્રી સાથે બનાવવામાં આવે છે. આ સેવા પ્રવૃત્તિમાંથી પ્રાપ્ત થતી આવક સીધી જ સમાજના જરૂરિયાતમંદ વિદ્યાર્થીઓની સ્કોલરશિપ અને મેડિકલ સહાયમાં વપરાય છે."
                                : "Every winter, authentic Salampak is prepared in pure desi cow ghee with traditional herbs for family vitality. Surplus proceeds directly fund student education scholarships and medical camps."}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            {VALUES.map((v) => (
                                <div key={v.title} className="p-4 rounded-2xl bg-ivory-50 border border-line">
                                    <h3 className="font-extrabold text-lg text-brand-700">
                                        {v.titleGu} ({v.title})
                                    </h3>
                                    <p className="text-xs text-ink-600 mt-1">{v.blurb}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MANAGING COMMITTEE & OFFICE BEARERS */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-line shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-line">
                            <Users className="h-7 w-7 text-brand-700 shrink-0" />
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                                {t.aboutMembersHeading}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MEMBERS.map((m, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        m.core
                                            ? "bg-brand-50/50 border-brand-200"
                                            : "bg-ivory-50 border-line"
                                    }`}
                                >
                                    <span className="text-xs uppercase font-extrabold text-brand-700 block">
                                        {lang === "gu" ? m.roleGu : m.role}
                                    </span>
                                    <span className="text-sm font-bold text-ink-900 block mt-1">
                                        {m.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEVA CAMPAIGNS */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-line shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-line">
                            <Heart className="h-7 w-7 text-brand-700 shrink-0" />
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                                {t.aboutSevaHeading}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CAMPAIGNS.map((c) => (
                                <div key={c.key} className="rounded-2xl border border-line overflow-hidden bg-ivory-50 flex flex-col">
                                    <div className="h-44 w-full relative overflow-hidden">
                                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-lg text-ink-900">
                                                {lang === "gu" ? c.titleGu : c.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-ink-600 mt-1 leading-relaxed">
                                                {c.blurb}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LOCATION & HELPLINE CONTACT */}
                    <div className="bg-brand-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            {t.contactHeading}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <span className="text-xs uppercase text-saffron font-bold block">
                                    {lang === "gu" ? "વાડી અને સંગ્રહ કેન્દ્ર" : "Community Vadi Location"}
                                </span>
                                <p className="text-sm font-semibold flex items-start gap-2">
                                    <MapPin className="h-5 w-5 text-saffron shrink-0 mt-0.5" />
                                    <span>{lang === "gu" ? BRAND.pickupLocationGu : BRAND.pickupLocation}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs uppercase text-saffron font-bold block">
                                    {lang === "gu" ? "સહાયતા હેલ્પલાઇન" : "Direct Helpline & Email"}
                                </span>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-saffron shrink-0" />
                                    <a href={`tel:${BRAND.helplinePhone}`} className="hover:underline">
                                        {BRAND.helplinePhone}
                                    </a>
                                </p>
                                <p className="text-sm font-semibold flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-saffron shrink-0" />
                                    <span>{BRAND.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/20 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-saffron hover:bg-saffron-hover text-ink-900 font-extrabold text-base shadow-lg transition-all"
                            >
                                <span>{lang === "gu" ? "સાલમ પાક ઓનલાઇન ઓર્ડર કરો →" : "Order Salampak Online Now →"}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
