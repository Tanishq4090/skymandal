import { Crown, Users } from "lucide-react";
import { MEMBERS, BRAND } from "@/data/site";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const initials = (name) => {
    const parts = name.replace(/^Shri\s+/i, "").split(/\s+/);
    return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
};

const PageHeader = () => (
    <section data-testid="members-hero" className="border-b border-line">
        <div className="container-page py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
                <p className="overline">The Committee</p>
                <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.98]">
                    Our
                    <span className="text-brand-700"> Members.</span>
                </h1>
                <p className="mt-5 font-gujarati text-2xl text-brand-700">
                    અમારા સભ્યો
                </p>
                <p className="mt-6 max-w-2xl text-ink-500 text-lg leading-relaxed">
                    The faces who carry the mandal forward — leading initiatives,
                    organising events, and quietly serving the samaj every single day.
                </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
                <div className="inline-flex items-center gap-5 bg-white border border-line rounded-2xl px-6 py-5">
                    <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                        <Users className="h-6 w-6 text-brand-700" />
                    </div>
                    <div className="leading-tight">
                        <p className="font-serif text-3xl text-ink-900">
                            {MEMBERS.length}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-ink-500">
                            Committee Members
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const CoreCommittee = () => {
    const core = MEMBERS.filter((m) => m.core);
    return (
        <section data-testid="members-core" className="section-pad">
            <div className="container-page">
                <div className="flex items-center gap-3 mb-10">
                    <Crown className="h-5 w-5 text-brand-700" />
                    <p className="overline">Office Bearers · પદાધિકારી</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {core.map((m) => (
                        <article
                            key={m.role}
                            data-testid={`member-card-${m.role.toLowerCase().replace(/\s+/g, "-")}`}
                            className="group relative rounded-2xl border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(168,26,17,0.4)]"
                        >
                            <div className="flex items-start gap-5">
                                <div className="h-16 w-16 shrink-0 rounded-full bg-brand-50 flex items-center justify-center font-serif text-2xl text-brand-700 border border-brand-100">
                                    {initials(m.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="overline text-brand-700">{m.role}</p>
                                    <p className="font-gujarati text-sm text-ink-700 mt-0.5">
                                        {m.roleGu}
                                    </p>
                                    <h3 className="mt-3 font-serif text-2xl text-ink-900 leading-snug">
                                        {m.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-600/20 to-transparent" />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

const MComittee = () => {
    const mc = MEMBERS.filter((m) => !m.core);
    return (
        <section
            data-testid="members-committee"
            className="section-pad bg-ivory-100 border-y border-line"
        >
            <div className="container-page">
                <div className="flex items-center gap-3 mb-10">
                    <Users className="h-5 w-5 text-brand-700" />
                    <p className="overline">Managing Committee · સંચાલન સમિતિ</p>
                </div>

                <div className="rounded-2xl border border-line bg-white overflow-hidden">
                    <Table data-testid="members-table">
                        <TableHeader>
                            <TableRow className="bg-ivory-50 hover:bg-ivory-50">
                                <TableHead className="w-16 py-5 text-ink-500 uppercase text-xs tracking-widest">
                                    #
                                </TableHead>
                                <TableHead className="py-5 text-ink-500 uppercase text-xs tracking-widest">
                                    Name
                                </TableHead>
                                <TableHead className="py-5 text-ink-500 uppercase text-xs tracking-widest hidden sm:table-cell">
                                    Role
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mc.map((m, idx) => (
                                <TableRow
                                    key={m.name}
                                    data-testid={`member-row-${idx + 1}`}
                                    className="hover:bg-brand-50/40 transition-colors"
                                >
                                    <TableCell className="py-5 font-serif text-brand-700 text-lg">
                                        {String(idx + 1).padStart(2, "0")}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-sm font-medium text-brand-700">
                                                {initials(m.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-ink-900">
                                                    {m.name}
                                                </p>
                                                <p className="text-xs text-ink-400 sm:hidden">
                                                    {m.role}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 hidden sm:table-cell">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
                                            {m.role}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="mt-8 text-center text-sm text-ink-500">
                    Every name above represents a promise to the samaj.{" "}
                    <span className="font-gujarati text-brand-700">સહકાર · સિદ્ધિ</span>
                </p>
            </div>
        </section>
    );
};

const Cta = () => (
    <section data-testid="members-cta" className="section-pad">
        <div className="container-page">
            <div className="bg-white border border-line rounded-3xl p-10 md:p-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                    <p className="overline">Want to contribute?</p>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-ink-900">
                        Volunteer with the mandal.
                    </h2>
                    <p className="mt-2 font-gujarati text-lg text-brand-700">
                        સેવા માટે જોડાઓ.
                    </p>
                    <p className="mt-4 text-ink-500 max-w-2xl leading-relaxed">
                        Whether you can spare an hour a month or a weekend at a camp —
                        every helping hand strengthens the samaj.
                    </p>
                </div>
                <div className="md:col-span-4 flex md:justify-end">
                    <a
                        href={`mailto:${BRAND.email}`}
                        data-testid="members-volunteer-cta"
                        className="btn-primary"
                    >
                        Write to us
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default function Members() {
    return (
        <div data-testid="members-page">
            <PageHeader />
            <CoreCommittee />
            <MComittee />
            <Cta />
        </div>
    );
}
