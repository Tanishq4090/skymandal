import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, GraduationCap, Stethoscope, Users, Calendar } from "lucide-react";
import { BRAND, CAMPAIGNS, VALUES } from "@/data/site";
import { ContactSection } from "@/components/ContactSection";

const StatItem = ({ value, label, labelGu }) => (
    <div className="flex flex-col">
        <span className="font-serif text-4xl md:text-5xl text-brand-700">{value}</span>
        <span className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-500">
            {label}
        </span>
        <span className="font-gujarati text-sm text-ink-700 mt-0.5">{labelGu}</span>
    </div>
);

const Hero = () => (
    <section data-testid="home-hero" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-ivory-50" />
            <div className="absolute -top-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-brand-50 blur-3xl opacity-70" />
            <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-saffron/10 blur-3xl" />
        </div>

        <div className="container-page pt-16 md:pt-24 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-line text-xs tracking-wider text-brand-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SAHKAR · SIDDHI · સહકાર · સિદ્ધિ</span>
                </div>

                <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-ink-900">
                    Serving the
                    <span className="block text-brand-700">Khatri community</span>
                    <span className="block text-ink-900">of Surat.</span>
                </h1>

                <p className="mt-6 font-gujarati text-2xl text-brand-700">
                    {BRAND.nameGujarati}
                </p>

                <p className="mt-6 max-w-xl text-ink-500 text-lg leading-relaxed">
                    A youth-led mandal carrying forward generations of seva — blood
                    drives, scholarships, festivals, samuh lagna and outreach for
                    every family of our samaj.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                        href="#campaigns"
                        data-testid="hero-explore-cta"
                        className="btn-primary"
                    >
                        Our Campaigns
                        <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                        to="/about"
                        data-testid="hero-about-cta"
                        className="btn-ghost"
                    >
                        About the Mandal
                    </Link>
                </div>

                <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
                    <StatItem value="60+" label="Years of Service" labelGu="વર્ષ સેવા" />
                    <StatItem value="17" label="Committee Members" labelGu="સભ્યો" />
                    <StatItem value="∞" label="Families Served" labelGu="પરિવારો" />
                </div>
            </div>

            <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-line shadow-[0_50px_120px_-60px_rgba(168,26,17,0.6)]">
                    <img
                        src="https://images.unsplash.com/photo-1774438024558-9dec44f55382?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBjb21tdW5pdHklMjBmZXN0aXZhbHxlbnwwfHx8fDE3ODI4MDczNDV8MA&ixlib=rb-4.1.0&q=85"
                        alt="Community gathering"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="font-gujarati text-lg">નમામિ માં જ્યોતિર્ગામય</p>
                        <p className="mt-1 font-serif text-2xl">{BRAND.mantra}</p>
                    </div>
                </div>
                <div className="hidden lg:flex absolute -bottom-8 -left-10 bg-white border border-line rounded-2xl p-5 w-64 shadow-xl">
                    <img
                        src={BRAND.logoUrl}
                        alt="SKYM"
                        className="h-12 w-12 object-contain"
                    />
                    <div className="ml-3 leading-tight">
                        <p className="font-gujarati text-sm text-brand-700">સ્થાપના</p>
                        <p className="font-serif text-lg text-ink-900">Est. since 1961</p>
                        <p className="text-xs text-ink-500">Surat · Gujarat</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const CampaignCard = ({ c }) => (
    <article
        data-testid={`campaign-card-${c.key}`}
        className={`relative ${c.span || ""} ${c.height || "h-80"} group rounded-2xl overflow-hidden border border-line transition-all duration-500 hover:-translate-y-1`}
    >
        <img
            src={c.image}
            alt={c.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative h-full flex flex-col justify-end p-7 text-white">
            <p className="font-gujarati text-sm text-saffron drop-shadow">
                {c.titleGu}
            </p>
            <h3 className="mt-1 font-serif text-2xl sm:text-3xl leading-tight">
                {c.title}
            </h3>
            <p className="mt-2 text-sm text-white/85 max-w-md">{c.blurb}</p>
        </div>
    </article>
);

const Campaigns = () => (
    <section id="campaigns" data-testid="campaigns-section" className="section-pad">
        <div className="container-page">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <p className="overline">Our Work</p>
                    <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1.05]">
                        Campaigns of the
                        <span className="block text-brand-700">Mandal</span>
                    </h2>
                    <p className="mt-4 font-gujarati text-xl text-ink-700">
                        સમાજ માટે — સમાજ સાથે
                    </p>
                </div>
                <p className="md:max-w-sm text-ink-500 leading-relaxed">
                    Year after year, the youth of our samaj take up causes large and
                    small — every effort a tribute to those who came before us.
                </p>
            </div>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {CAMPAIGNS.map((c) => (
                    <CampaignCard key={c.key} c={c} />
                ))}
            </div>
        </div>
    </section>
);

const ValuesBlock = () => {
    const icons = [Heart, GraduationCap, Users, Stethoscope];
    return (
        <section data-testid="values-section" className="section-pad bg-ivory-100 border-y border-line">
            <div className="container-page">
                <div className="max-w-3xl">
                    <p className="overline">What we stand for</p>
                    <h2 className="mt-3 text-4xl sm:text-5xl text-ink-900">
                        Four words.
                        <span className="block text-brand-700">A lifetime of seva.</span>
                    </h2>
                </div>
                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VALUES.map((v, i) => {
                        const Icon = icons[i % icons.length];
                        return (
                            <div
                                key={v.title}
                                data-testid={`value-${v.title.toLowerCase()}`}
                                className="card-soft"
                            >
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 mb-5">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-serif text-3xl text-ink-900">
                                    {v.title}
                                </h3>
                                <p className="font-gujarati text-xl text-brand-700 mt-1">
                                    {v.titleGu}
                                </p>
                                <p className="mt-4 text-sm text-ink-500 leading-relaxed">
                                    {v.blurb}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const EventsCallout = () => (
    <section data-testid="events-callout" className="section-pad">
        <div className="container-page">
            <div className="relative overflow-hidden rounded-3xl bg-brand-700 text-white p-10 md:p-16">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-saffron/30 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs uppercase tracking-widest">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Upcoming initiative</span>
                        </div>
                        <h2 className="mt-5 text-4xl sm:text-5xl font-serif leading-tight">
                            Join hands with the youth of Surat.
                        </h2>
                        <p className="mt-3 font-gujarati text-xl text-saffron">
                            સમાજ માટે, એક પગલું આગળ.
                        </p>
                        <p className="mt-5 max-w-2xl text-white/85 leading-relaxed">
                            From scholarship distribution to blood camps and senior
                            seva — there is always room for one more pair of hands.
                            Reach out to participate, support, or partner with us.
                        </p>
                    </div>
                    <div className="md:col-span-4 flex md:justify-end">
                        <a
                            href="#contact"
                            data-testid="events-cta"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-brand-700 px-7 py-4 font-medium hover:bg-ivory-100 transition-colors"
                        >
                            Get Involved
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function Home() {
    return (
        <div data-testid="home-page">
            <Hero />
            <Campaigns />
            <ValuesBlock />
            <EventsCallout />
            <ContactSection />
        </div>
    );
}
