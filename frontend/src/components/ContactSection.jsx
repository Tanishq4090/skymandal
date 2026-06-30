import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/data/site";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ContactSection = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);

    const onChange = (e) => {
        setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill name, email and message.");
            return;
        }
        setSending(true);
        try {
            const res = await axios.post(`${API}/contact`, form);
            if (res.data?.status === "success") {
                toast.success("Message sent — Jai SKYM 🙏");
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            } else if (res.data?.status === "stored") {
                toast.success(
                    "Message received. We'll get back to you soon.",
                    { description: res.data?.warning }
                );
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                toast.success("Message received.");
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            }
        } catch (err) {
            const detail = err?.response?.data?.detail || err?.message || "Please try again.";
            toast.error("Could not send", { description: String(detail) });
        } finally {
            setSending(false);
        }
    };

    return (
        <section
            id="contact"
            data-testid="contact-section"
            className="section-pad bg-ivory-100 relative"
        >
            <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <p className="overline">Get in touch</p>
                    <h2 className="mt-3 text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
                        Write to us
                        <span className="block font-gujarati text-2xl sm:text-3xl text-brand-700 mt-2">
                            અમારો સંપર્ક કરો
                        </span>
                    </h2>
                    <p className="mt-6 text-ink-500 max-w-md leading-relaxed">
                        Whether you wish to join a campaign, support a cause, or share
                        an event with the community — we'd love to hear from you.
                    </p>

                    <ul className="mt-10 space-y-5">
                        <li className="flex items-start gap-4">
                            <span className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                                <Mail className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-ink-400">Email</p>
                                <a
                                    href={`mailto:${BRAND.email}`}
                                    data-testid="contact-info-email"
                                    className="text-ink-900 hover:text-brand-700 transition-colors"
                                >
                                    {BRAND.email}
                                </a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                                <MapPin className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-ink-400">Location</p>
                                <p className="text-ink-900">{BRAND.location}</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <span className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                                <Phone className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-ink-400">Instagram</p>
                                <a
                                    href={BRAND.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-ink-900 hover:text-brand-700 transition-colors"
                                >
                                    @surat_kshtriya_yuvak_mandal
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <form
                        onSubmit={onSubmit}
                        data-testid="contact-form"
                        className="bg-white border border-line rounded-2xl p-8 md:p-10 shadow-[0_28px_80px_-50px_rgba(168,26,17,0.4)]"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name" className="text-ink-700">
                                    Full name *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    data-testid="contact-input-name"
                                    value={form.name}
                                    onChange={onChange}
                                    placeholder="Your name"
                                    required
                                    className="h-12"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-ink-700">
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    data-testid="contact-input-email"
                                    value={form.email}
                                    onChange={onChange}
                                    placeholder="you@example.com"
                                    required
                                    className="h-12"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone" className="text-ink-700">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    data-testid="contact-input-phone"
                                    value={form.phone}
                                    onChange={onChange}
                                    placeholder="+91 ..."
                                    className="h-12"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="subject" className="text-ink-700">
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    data-testid="contact-input-subject"
                                    value={form.subject}
                                    onChange={onChange}
                                    placeholder="How can we help?"
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-2">
                            <Label htmlFor="message" className="text-ink-700">
                                Message *
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                data-testid="contact-input-message"
                                value={form.message}
                                onChange={onChange}
                                rows={6}
                                placeholder="Write your message here..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending}
                            data-testid="contact-submit-button"
                            className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-xs text-ink-400">
                            By submitting, you agree to be contacted by SKYM at the
                            email/phone provided.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};
