import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
    const { lang, t } = useLanguage();

    return (
        <footer
            data-testid="site-footer"
            className="bg-ink-900 text-ivory-100 relative mt-20 border-t border-line"
        >
            <div className="container-page py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={BRAND.logoUrl}
                            alt="SKYM"
                            className="h-10 w-10 object-contain bg-white rounded-full p-1"
                        />
                        <span className="font-bold text-lg text-white">
                            {lang === "gu" ? BRAND.nameGujarati : BRAND.name}
                        </span>
                    </div>
                    <p className="text-ivory-100/75 text-sm max-w-md">
                        {lang === "gu"
                            ? "સુરત ક્ષત્રિય સમાજના પરિવારો માટે સેવા અને સંસ્કારનું પ્રતીક. સ્થાપના ૧૯૬૧ થી કાર્યરત."
                            : "Serving the Khatri community of Surat since 1961 with seva, scholarships, and health camps."}
                    </p>
                    <p className="text-xs text-saffron font-bold">
                        {BRAND.taglineGujarati} · {BRAND.tagline}
                    </p>
                </div>

                <div className="md:col-span-3 space-y-2 text-sm">
                    <p className="text-xs uppercase tracking-wider text-saffron font-bold">
                        {lang === "gu" ? "મુખ્ય પેજ" : "Quick Links"}
                    </p>
                    <ul className="space-y-1.5 font-medium">
                        <li>
                            <Link to="/" className="hover:text-saffron transition-colors">
                                {t.navOrder}
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-saffron transition-colors">
                                {t.navAbout}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-3 space-y-2 text-sm">
                    <p className="text-xs uppercase tracking-wider text-saffron font-bold">
                        {lang === "gu" ? "સંપર્ક અને વાડી સરનામું" : "Contact & Vadi Location"}
                    </p>
                    <p className="text-xs text-ivory-100/80 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
                        <span>{lang === "gu" ? BRAND.pickupLocationGu : BRAND.pickupLocation}</span>
                    </p>
                    <p className="text-xs text-ivory-100/80 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-saffron shrink-0" />
                        <a href={`tel:${BRAND.helplinePhone}`} className="hover:underline font-bold text-white">
                            {BRAND.helplinePhone}
                        </a>
                    </p>
                    <p className="text-xs text-ivory-100/80 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-saffron shrink-0" />
                        <span>{BRAND.email}</span>
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10 py-4 text-center text-xs text-ivory-100/50">
                © {new Date().getFullYear()} {BRAND.name} · All rights reserved.
            </div>
        </footer>
    );
};
