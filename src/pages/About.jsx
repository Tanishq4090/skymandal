import { Quote, Compass, HeartHandshake, Flame } from "lucide-react";
import { BRAND, VALUES } from "@/data/site";

const PageHeader = () => (
    <section
        data-testid="about-hero"
        className="relative overflow-hidden border-b border-line"
    >
        <div className="container-page py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
                <p className="overline">About the Mandal</p>
                <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.98]">
                    A samaj's
                    <span className="block text-brand-700">youthful pulse.</span>
                </h1>
                <p className="mt-5 font-gujarati text-2xl text-brand-700">
                    અમારા વિશે
                </p>
                <p className="mt-6 max-w-2xl text-ink-500 text-lg leading-relaxed">
                    {BRAND.name} is the youth wing of the Khatri community of Surat —
                    born of a simple belief that the strength of a samaj lives in the
                    hands of its young.
                </p>
            </div>
            <div className="lg:col-span-5">
                <div className="relative aspect-square rounded-3xl overflow-hidden border border-line">
                    <img
                        src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50cyUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3ODI4MDczNDR8MA&ixlib=rb-4.1.0&q=85"
                        alt="Community"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-xl p-4 border border-line">
                        <p className="font-gujarati text-sm text-brand-700">
                            {BRAND.mantraGujarati}
                        </p>
                        <p className="font-serif text-lg text-ink-900">
                            {BRAND.mantra}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Story = () => (
    <section data-testid="about-story" className="section-pad">
        <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
                <p className="overline">Our story</p>
                <h2 className="mt-3 text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
                    Rooted in
                    <span className="block text-brand-700">heritage.</span>
                </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-ink-700 leading-relaxed text-lg">
                <p>
                    For decades, the Khatri community of Surat has been a tapestry of
                    artisans, traders, scholars and elders — held together by shared
                    rituals, kitchens, and the temple courtyards of our home city.
                </p>
                <p>
                    Surat Kshtriya Yuvak Mandal was founded by a generation that
                    believed the next one should not only inherit traditions, but
                    actively shape them. From small neighbourhood gatherings to large
                    community-wide initiatives, the mandal has grown into a steady
                    voice for the samaj.
                </p>
                <p>
                    Today, our work spans blood donation drives, scholarships for
                    deserving students, medical camps for the elderly, samuh lagna,
                    festival celebrations, and quiet acts of relief that rarely make
                    it to the headlines — but always make it to the right family.
                </p>
            </div>
        </div>
    </section>
);

const MissionVision = () => (
    <section
        data-testid="about-mission"
        className="section-pad bg-ivory-100 border-y border-line"
    >
        <div className="container-page grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="card-soft">
                <Compass className="h-7 w-7 text-brand-700" />
                <p className="overline mt-5">Mission</p>
                <h3 className="mt-2 font-serif text-3xl text-ink-900">
                    To serve every Khatri family with dignity, dedication and care.
                </h3>
                <p className="mt-3 font-gujarati text-lg text-brand-700">
                    દરેક પરિવાર સુધી — સન્માન અને સેવા સાથે.
                </p>
                <p className="mt-5 text-ink-500 leading-relaxed">
                    Through education, healthcare, cultural events and community
                    welfare, we strive to make the bonds of our samaj stronger with
                    each passing year.
                </p>
            </article>
            <article className="card-soft">
                <Flame className="h-7 w-7 text-brand-700" />
                <p className="overline mt-5">Vision</p>
                <h3 className="mt-2 font-serif text-3xl text-ink-900">
                    A community where no one walks alone — in joy or in hardship.
                </h3>
                <p className="mt-3 font-gujarati text-lg text-brand-700">
                    જ્યાં દરેક પગલે સહકાર હોય.
                </p>
                <p className="mt-5 text-ink-500 leading-relaxed">
                    Build a future where the Khatri samaj of Surat stands as a beacon
                    of cooperation, compassion and contribution to the city we call
                    home.
                </p>
            </article>
        </div>
    </section>
);

const Values = () => (
    <section data-testid="about-values" className="section-pad">
        <div className="container-page">
            <div className="max-w-2xl">
                <p className="overline">Core values</p>
                <h2 className="mt-3 text-4xl sm:text-5xl text-ink-900">
                    The three pillars
                    <span className="block text-brand-700">we live by.</span>
                </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                {VALUES.map((v, idx) => (
                    <div
                        key={v.title}
                        data-testid={`about-value-${v.title.toLowerCase()}`}
                        className="flex gap-6 border-t border-line pt-8"
                    >
                        <span className="font-serif text-5xl text-brand-700/70 w-12 shrink-0">
                            0{idx + 1}
                        </span>
                        <div>
                            <h3 className="font-serif text-3xl text-ink-900">
                                {v.title}
                                <span className="font-gujarati text-xl text-brand-700 ml-3">
                                    {v.titleGu}
                                </span>
                            </h3>
                            <p className="mt-3 text-ink-500 leading-relaxed">
                                {v.blurb}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Quotation = () => (
    <section data-testid="about-quote" className="pb-24">
        <div className="container-page">
            <div className="relative bg-brand-700 text-white rounded-3xl p-10 md:p-16 overflow-hidden">
                <Quote className="h-14 w-14 text-saffron opacity-80" />
                <p className="mt-6 font-serif text-3xl md:text-4xl leading-snug max-w-3xl">
                    "Where the youth of a samaj lead with service, the whole community
                    walks together."
                </p>
                <p className="mt-4 font-gujarati text-xl text-saffron">
                    જ્યાં યુવાઓ સેવા કરે — ત્યાં સમાજ આગળ વધે.
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-white/80">
                    Surat Kshtriya Yuvak Mandal · સહકાર · સંગઠન · સિદ્ધિ
                </p>
            </div>
        </div>
    </section>
);

export default function About() {
    return (
        <div data-testid="about-page">
            <PageHeader />
            <Story />
            <MissionVision />
            <Values />
            <Quotation />
        </div>
    );
}
