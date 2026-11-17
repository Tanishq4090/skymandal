import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Instagram } from "lucide-react";
import { BRAND } from "@/data/site";

const NAV = [
    { to: "/", label: "Home", labelGu: "મુખ્ય" },
    { to: "/about", label: "About Us", labelGu: "અમારા વિશે" },
    { to: "/members", label: "Members", labelGu: "સભ્યો" },
    { to: "/salampak", label: "Shop Salampak", labelGu: "સાલમ પાક" },
];

export const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header
            data-testid="site-header"
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? "bg-ivory-50/85 backdrop-blur-xl border-b border-line"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="container-page flex items-center justify-between h-20">
                <Link
                    to="/"
                    data-testid="brand-link"
                    className="flex items-center gap-3 group"
                >
                    <img
                        src={BRAND.logoUrl}
                        alt="SKYM Logo"
                        className="h-12 w-auto object-contain transition-transform duration-500 group-hover:rotate-[-3deg]"
                    />
                    <div className="hidden sm:flex flex-col leading-tight">
                        <span className="font-gujarati text-[15px] text-brand-700">
                            {BRAND.nameGujarati}
                        </span>
                        <span className="font-serif text-[15px] text-ink-900 -mt-0.5">
                            Surat Kshtriya Yuvak Mandal
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
                            className={({ isActive }) =>
                                `relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    isActive
                                        ? "text-brand-700"
                                        : "text-ink-700 hover:text-brand-700"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span>{n.label}</span>
                                    <span
                                        className={`absolute left-4 right-4 -bottom-0.5 h-px bg-brand-600 transition-all duration-300 ${
                                            isActive ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <a
                        href={BRAND.instagram}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="nav-instagram"
                        className="text-ink-500 hover:text-brand-700 transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                    <Link
                        to="/#contact"
                        data-testid="nav-contact-cta"
                        className="btn-primary !py-2.5 !px-5"
                    >
                        Contact Us
                    </Link>
                </div>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    data-testid="nav-mobile-toggle"
                    className="md:hidden p-2 rounded-md text-ink-900"
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-line bg-ivory-50">
                    <div className="container-page py-4 flex flex-col gap-1">
                        {NAV.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                data-testid={`nav-mobile-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-2 py-3 rounded-md ${
                                        isActive
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-ink-900 hover:bg-ivory-100"
                                    }`
                                }
                            >
                                <span className="font-medium">{n.label}</span>
                                <span className="font-gujarati text-sm text-brand-600">
                                    {n.labelGu}
                                </span>
                            </NavLink>
                        ))}
                        <Link
                            to="/#contact"
                            data-testid="nav-mobile-contact-cta"
                            className="btn-primary mt-3"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};
