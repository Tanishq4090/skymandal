import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { BRAND } from "@/data/site";

export const Footer = () => {
    return (
        <footer
            data-testid="site-footer"
            className="bg-ink-900 text-ivory-100 relative grain mt-24"
        >
            <div className="container-page py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-full bg-ivory-50 flex items-center justify-center p-1">
                            <img
                                src={BRAND.logoUrl}
                                alt="SKYM"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="leading-tight">
                            <p className="font-gujarati text-base text-ivory-100">
                                {BRAND.nameGujarati}
                            </p>
                            <p className="font-serif text-lg">{BRAND.name}</p>
                        </div>
                    </div>
                    <p className="mt-6 text-ivory-100/70 max-w-md text-sm leading-relaxed">
                        A youth-led community organisation of the Khatri samaj of Surat —
                        committed to seva, sanskar, and the upliftment of every family
                        we call our own.
                    </p>
                    <p className="mt-4 font-gujarati text-sm text-saffron">
                        {BRAND.mantraGujarati} · {BRAND.mantra}
                    </p>
                </div>

                <div className="md:col-span-3">
                    <p className="overline text-saffron mb-4">Explore</p>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link to="/" data-testid="footer-link-home" className="hover:text-saffron transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" data-testid="footer-link-about" className="hover:text-saffron transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/members" data-testid="footer-link-members" className="hover:text-saffron transition-colors">
                                Members
                            </Link>
                        </li>
                        <li>
                            <Link to="/#contact" data-testid="footer-link-contact" className="hover:text-saffron transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="md:col-span-4">
                    <p className="overline text-saffron mb-4">Reach Us</p>
                    <ul className="space-y-3 text-sm text-ivory-100/85">
                        <li className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 mt-0.5 text-saffron" />
                            <span>{BRAND.location}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="h-4 w-4 mt-0.5 text-saffron" />
                            <a
                                href={`mailto:${BRAND.email}`}
                                data-testid="footer-email"
                                className="hover:text-saffron transition-colors"
                            >
                                {BRAND.email}
                            </a>
                        </li>
                        <li className="flex items-start gap-3">
                            <Instagram className="h-4 w-4 mt-0.5 text-saffron" />
                            <a
                                href={BRAND.instagram}
                                target="_blank"
                                rel="noreferrer"
                                data-testid="footer-instagram"
                                className="inline-flex items-center gap-1 hover:text-saffron transition-colors"
                            >
                                @surat_kshtriya_yuvak_mandal
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory-100/60">
                    <p>
                        © {new Date().getFullYear()} Surat Kshtriya Yuvak Mandal. All
                        rights reserved.
                    </p>
                    <p className="font-gujarati">
                        સહકાર · સિદ્ધિ
                    </p>
                </div>
            </div>
        </footer>
    );
};
