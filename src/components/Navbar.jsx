import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, Globe } from "lucide-react";
import { BRAND } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { lang, toggleLang, t } = useLanguage();

    return (
        <header
            data-testid="site-header"
            className="sticky top-0 z-50 w-full bg-white border-b border-line shadow-sm"
        >
            <div className="container-page flex items-center justify-between h-20">
                {/* Brand Logo & Name */}
                <Link
                    to="/"
                    data-testid="brand-link"
                    className="flex items-center gap-3.5 group"
                >
                    <img
                        src={BRAND.logoUrl}
                        alt="SKYM Logo"
                        className="h-12 w-auto object-contain"
                    />
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-base sm:text-lg text-brand-700">
                            {lang === "gu" ? BRAND.nameGujarati : BRAND.name}
                        </span>
                        <span className="text-xs sm:text-sm text-ink-500 font-medium">
                            {lang === "gu" ? "સુરત ક્ષત્રિય યુવક મંડળ · સ્થાપના ૧૯૬૧" : "Serving Surat Khatri Community · Est. 1961"}
                        </span>
                    </div>
                </Link>

                {/* Desktop 2-Page Nav + Lang Switcher + Helpline */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isActive
                                        ? "bg-brand-50 text-brand-700 shadow-sm"
                                        : "text-ink-700 hover:text-brand-700 hover:bg-ivory-50"
                                }`
                            }
                        >
                            {t.navOrder}
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isActive
                                        ? "bg-brand-50 text-brand-700 shadow-sm"
                                        : "text-ink-700 hover:text-brand-700 hover:bg-ivory-50"
                                }`
                            }
                        >
                            {t.navAbout}
                        </NavLink>
                    </nav>

                    {/* Language Switcher Pill */}
                    <button
                        type="button"
                        onClick={toggleLang}
                        data-testid="lang-toggle-btn"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-ivory-100 hover:bg-ivory-200 text-xs font-bold text-ink-900 transition-colors shadow-sm"
                        title="Change Language / ભાષા બદલો"
                    >
                        <Globe className="h-3.5 w-3.5 text-brand-700" />
                        <span>{t.langSwitch}</span>
                    </button>

                    {/* Direct Call / Helpline button */}
                    <a
                        href={`tel:${BRAND.helplinePhone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                        title="Call for help"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{lang === "gu" ? "મદદ માટે ફોન" : "Help: Call Us"}</span>
                    </a>
                </div>

                {/* Mobile Right Controls: Lang Switch + Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleLang}
                        className="px-2.5 py-1.5 rounded-full border border-line bg-ivory-100 text-xs font-bold text-ink-900"
                    >
                        {t.langSwitch}
                    </button>

                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-lg text-ink-700 hover:bg-ivory-100"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {open && (
                <div className="md:hidden border-t border-line bg-white px-6 py-6 space-y-4 shadow-xl">
                    <NavLink
                        to="/"
                        end
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-xl text-base font-bold ${
                                isActive ? "bg-brand-50 text-brand-700" : "text-ink-900"
                            }`
                        }
                    >
                        {t.navOrder}
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-xl text-base font-bold ${
                                isActive ? "bg-brand-50 text-brand-700" : "text-ink-900"
                            }`
                        }
                    >
                        {t.navAbout}
                    </NavLink>

                    <div className="pt-2 border-t border-line flex flex-col gap-2">
                        <a
                            href={`tel:${BRAND.helplinePhone}`}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow"
                        >
                            <Phone className="h-4 w-4" />
                            <span>{lang === "gu" ? "મદદ માટે ફોન કરો (Call Help)" : "Call Helpline"}</span>
                        </a>
                        <a
                            href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
                                lang === "gu"
                                    ? "સાલમ પાક ઓર્ડર કરવા માટે મદદ જોઈએ છે."
                                    : "Hello, I need help ordering Salampak."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 text-emerald-800 border border-emerald-300 text-sm font-bold"
                        >
                            <span>WhatsApp Helpline</span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};
