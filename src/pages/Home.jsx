import { useState } from "react";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    ShieldCheck,
    Clock,
    MapPin,
    MessageSquare,
    Phone,
    Printer,
    RefreshCw,
    ArrowRight,
    Info
} from "lucide-react";
import { toast } from "sonner";
import { BRAND } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
    const { lang, t } = useLanguage();

    // 0: 500g (₹420), 1: 1kg (₹840)
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // For 1kg: "advance" (₹500 online + ₹340 at Vadi) or "full" (₹840 online)
    const [paymentPlan1kg, setPaymentPlan1kg] = useState("advance");

    const [orderForm, setOrderForm] = useState({
        name: "",
        phone: "",
        notes: ""
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    // Pricing calculation
    const is1kg = selectedVariantIdx === 1;

    // What needs to be paid online right now
    const unitOnlinePayable = is1kg
        ? (paymentPlan1kg === "advance" ? 500 : 840)
        : 420;

    const totalOnlinePayable = unitOnlinePayable * quantity;

    // What remains to be paid at Vadi on collection
    const unitDueAtVadi = is1kg && paymentPlan1kg === "advance" ? 340 : 0;
    const totalDueAtVadi = unitDueAtVadi * quantity;

    // Dynamic Step numbers based on language
    const step1 = lang === "gu" ? "૧." : "1.";
    const step2 = lang === "gu" ? "૨." : "2.";
    const step3 = lang === "gu" ? "૩." : "3.";

    // Estimated ready date: 4 to 5 days from today
    const getEstimatedDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString(lang === "gu" ? "gu-IN" : "en-IN", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!orderForm.name.trim() || !orderForm.phone.trim()) {
            toast.error(
                lang === "gu"
                    ? "કૃપા કરીને તમારું નામ અને મોબાઈલ નંબર દાખલ કરો."
                    : "Please enter your Name and Mobile number."
            );
            return;
        }

        // Basic Indian phone validation (10 digits)
        const cleanPhone = orderForm.phone.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            toast.error(
                lang === "gu"
                    ? "કૃપા કરીને સાચો ૧૦ અંકનો મોબાઈલ નંબર લખો."
                    : "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        setIsProcessing(true);

        const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_U4kaJ6frz6imma";

        if (!window.Razorpay) {
            setIsProcessing(false);
            toast.error(
                lang === "gu"
                    ? "પેમેન્ટ સિસ્ટમ લોડ થઈ રહી છે, કૃપા કરીને ૧ સેકન્ડ પછી ફરી ક્લિક કરો."
                    : "Razorpay SDK is not loaded. Please refresh or retry."
            );
            return;
        }

        try {
            const orderNotes = {
                customer_name: orderForm.name,
                customer_phone: orderForm.phone,
                item: "Salampak Classic",
                weight: is1kg ? "1 kg" : "500g",
                quantity: `${quantity} Box`,
                payment_plan: is1kg ? (paymentPlan1kg === "advance" ? "Advance Booking" : "Full Payment") : "Full Payment",
                paid_online: `Rs. ${totalOnlinePayable}`,
                due_at_vadi: totalDueAtVadi > 0 ? `Rs. ${totalDueAtVadi}` : "Rs. 0",
                pickup_location: "Community Vadi, Surat",
                customer_notes: orderForm.notes || "None"
            };

            // STEP 1: Call Backend to Create Order
            const createRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalOnlinePayable * 100, // paise
                    currency: "INR",
                    receipt: `skym_rcpt_${Date.now()}`,
                    notes: orderNotes
                })
            });

            const orderData = await createRes.json();

            if (!createRes.ok || !orderData.order_id) {
                throw new Error(orderData.error || "Failed to initialize payment on server");
            }

            // STEP 2: Open Razorpay Modal
            const variantText = is1kg
                ? `1 kg (${paymentPlan1kg === "advance" ? "Advance Booking ₹500" : "Full Payment ₹840"})`
                : "500g (Full Payment ₹420)";

            const options = {
                key: orderData.key_id || razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: BRAND.nameGujarati,
                description: `સાલમ પાક ${variantText} × ${quantity} બોક્સ`,
                image: BRAND.logoUrl,
                order_id: orderData.order_id,
                prefill: {
                    name: orderForm.name,
                    contact: orderForm.phone,
                    email: ""
                },
                notes: orderNotes,
                theme: {
                    color: "#8B150E"
                },
                handler: async function (response) {
                    // STEP 3: Verify Signature on Backend
                    try {
                        setIsProcessing(true);
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (!verifyRes.ok || !verifyData.success) {
                            throw new Error(verifyData.message || "Payment verification failed");
                        }

                        // Success! Complete Order
                        completeOrder(response.razorpay_payment_id, response.razorpay_order_id);
                    } catch (verifyError) {
                        setIsProcessing(false);
                        console.error("Verification error:", verifyError);
                        toast.error(
                            lang === "gu"
                                ? "પેમેન્ટ ચકાસણીમાં ભૂલ આવી: " + verifyError.message
                                : "Payment Verification Failed: " + verifyError.message
                        );
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.info(
                            lang === "gu"
                                ? "પેમેન્ટ રદ કરવામાં આવ્યું. તમે ગમે ત્યારે ફરી પ્રયાસ કરી શકો છો."
                                : "Payment cancelled. You can retry whenever ready."
                        );
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (failResp) {
                setIsProcessing(false);
                const desc = failResp?.error?.description || "Payment declined";
                toast.error(
                    lang === "gu"
                        ? `પેમેન્ટ નિષ્ફળ: ${desc}`
                        : `Payment Failed: ${desc}`
                );
            });

            rzp.open();
        } catch (err) {
            setIsProcessing(false);
            console.error("Error creating order:", err);
            toast.error(
                lang === "gu"
                    ? `ઓર્ડર શરૂ કરવામાં ક્ષતિ: ${err.message}`
                    : `Order Error: ${err.message}`
            );
        }
    };

    const completeOrder = (paymentId, orderId) => {
        setIsProcessing(false);
        const tokenDisplay = `SKYM-VADI-${Math.floor(1000 + Math.random() * 9000)}`;

        const orderData = {
            orderId: tokenDisplay,
            razorpayOrderId: orderId,
            paymentId,
            name: orderForm.name,
            phone: orderForm.phone,
            notes: orderForm.notes,
            weight: is1kg ? "૧ કિલો (1 kg)" : "૫૦૦ ગ્રામ (500g)",
            weightEn: is1kg ? "1 kg" : "500g",
            quantity: quantity,
            plan: is1kg ? paymentPlan1kg : "full",
            paidOnline: totalOnlinePayable,
            dueAtVadi: totalDueAtVadi,
            pickupLocation: BRAND.pickupLocation,
            pickupLocationGu: BRAND.pickupLocationGu,
            estimatedReadyDate: getEstimatedDate(),
            orderDate: new Date().toLocaleDateString(lang === "gu" ? "gu-IN" : "en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        setConfirmedOrder(orderData);
        toast.success(
            lang === "gu"
                ? "ઓર્ડર સફળ થયો છે! ટોકન સાચવી લો."
                : "Order Confirmed! Please save your token."
        );

        setTimeout(() => {
            const el = document.getElementById("order-receipt-modal");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
    };

    const resetOrder = () => {
        setConfirmedOrder(null);
        setOrderForm({ name: "", phone: "", notes: "" });
        setQuantity(1);
        setSelectedVariantIdx(0);
        setPaymentPlan1kg("advance");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div data-testid="home-page" className="animate-fade-up pb-12 sm:pb-16">
            {/* HERO POSTER BANNER - OPTIMIZED FOR PHONES */}
            <section className="bg-ivory-100 border-b border-line pt-3 sm:pt-6 pb-4 sm:pb-6">
                <div className="container-page px-3 sm:px-6">
                    {/* Responsive Banner Card: 16/10 on mobile so the food is fully visible */}
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-brand-800/15 shadow-md aspect-[16/10] sm:aspect-[2.35/1] min-h-[210px] max-h-[440px]">
                        <img
                            src="/images/salampak-hero.jpg"
                            alt="Surat Kshtriya Yuvak Mandal Salampak"
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Smooth bottom gradient so photo stays clear */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-8 text-white">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase text-saffron w-fit mb-1 sm:mb-2 border border-saffron/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />
                                <span>{t.heroBadge}</span>
                            </span>
                            <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold leading-snug sm:leading-tight text-white drop-shadow-sm">
                                {t.heroSubtitle}
                            </h1>
                            <p className="text-xs sm:text-lg text-saffron mt-0.5 sm:mt-1 font-bold">
                                {t.heroTitle} ({t.brandEst})
                            </p>
                        </div>
                    </div>

                    {/* VADI PICKUP THREE KEY NOTICES - COMPACT & CLEAN ON MOBILE */}
                    <div className="mt-3 sm:mt-5 bg-white rounded-2xl border border-line shadow-sm p-3.5 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 md:divide-x divide-line">
                            {/* Collection point */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-ink-500 block leading-none mb-1">
                                        {t.pickupPoint}
                                    </span>
                                    <span className="text-xs sm:text-sm font-extrabold text-brand-800 block truncate sm:whitespace-normal">
                                        {lang === "gu" ? BRAND.pickupLocationGu : BRAND.pickupLocation}
                                    </span>
                                </div>
                            </div>

                            {/* Preparation window */}
                            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4 border-t md:border-t-0 border-line/70">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-ink-500 block leading-none mb-1">
                                        {t.pickupTimeline}
                                    </span>
                                    <span className="text-xs sm:text-sm font-extrabold text-ink-900 block truncate sm:whitespace-normal">
                                        {t.pickupTimelineDesc}
                                    </span>
                                </div>
                            </div>

                            {/* Alert */}
                            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pl-4 border-t md:border-t-0 border-line/70">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-ink-500 block leading-none mb-1">
                                        {t.pickupAlert}
                                    </span>
                                    <span className="text-xs sm:text-sm font-extrabold text-ink-900 block truncate sm:whitespace-normal">
                                        {t.pickupAlertDesc}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN ORDER SECTION */}
            <section className="container-page px-3 sm:px-6 mt-4 sm:mt-8">
                <div className="max-w-3xl mx-auto">
                    {!confirmedOrder ? (
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-line shadow-lg p-4 sm:p-8">
                            {/* Step 1: Select Weight (Side by Side on mobile for instant visibility) */}
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-2xl font-bold text-ink-900 mb-1">
                                    {step1} {t.selectWeight}
                                </h2>
                                <p className="text-xs text-ink-500 mb-3">
                                    {lang === "gu"
                                        ? "તમને જેટલું વજન જોઈએ તે બોક્સ પસંદ કરો:"
                                        : "Click the size you want to order:"}
                                </p>

                                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                                    {/* 500g Card */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedVariantIdx(0);
                                        }}
                                        className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                                            selectedVariantIdx === 0
                                                ? "border-brand-700 bg-brand-50/70 shadow-sm ring-1 ring-brand-700"
                                                : "border-line bg-ivory-50/60 hover:bg-white text-ink-700"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-sm sm:text-lg font-extrabold text-ink-900 leading-tight">
                                                {t.weight500g}
                                            </span>
                                            {selectedVariantIdx === 0 && (
                                                <CheckCircle2 className="h-5 w-5 text-brand-700 shrink-0" />
                                            )}
                                        </div>
                                        <div className="mt-2.5">
                                            <span className="text-2xl sm:text-3xl font-extrabold text-brand-700 block">
                                                {t.price500g}
                                            </span>
                                            <span className="text-[11px] sm:text-xs text-ink-500 block font-medium mt-0.5">
                                                {lang === "gu" ? "પૂરું પેમેન્ટ" : "Full payment"}
                                            </span>
                                        </div>
                                    </button>

                                    {/* 1 kg Card */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedVariantIdx(1)}
                                        className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                                            selectedVariantIdx === 1
                                                ? "border-brand-700 bg-brand-50/70 shadow-sm ring-1 ring-brand-700"
                                                : "border-line bg-ivory-50/60 hover:bg-white text-ink-700"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-sm sm:text-lg font-extrabold text-ink-900 leading-tight">
                                                {t.weight1kg}
                                            </span>
                                            {selectedVariantIdx === 1 && (
                                                <CheckCircle2 className="h-5 w-5 text-brand-700 shrink-0" />
                                            )}
                                        </div>
                                        <div className="mt-2.5">
                                            <span className="text-2xl sm:text-3xl font-extrabold text-brand-700 block">
                                                {t.price1kg}
                                            </span>
                                            <span className="text-[11px] sm:text-xs text-ink-500 block font-medium mt-0.5">
                                                {lang === "gu" ? "પૂરું કે ₹૫૦૦ એડવાન્સ" : "Full or ₹500 advance"}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* SPECIAL: 1 KG PAYMENT OPTION (Advance vs Full) */}
                            {is1kg && (
                                <div className="mb-6 p-3.5 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300">
                                    <h3 className="text-sm sm:text-base font-bold text-amber-950 mb-2.5 flex items-center gap-1.5">
                                        <Info className="h-4 w-4 text-amber-700 shrink-0" />
                                        <span>{t.paymentOptionTitle}</span>
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {/* Option A: Advance ₹500 (Recommended default) */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentPlan1kg("advance")}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                paymentPlan1kg === "advance"
                                                    ? "bg-white border-brand-700 shadow-sm ring-1 ring-brand-700"
                                                    : "bg-white/60 border-amber-200"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-xs sm:text-sm text-brand-800">
                                                    {t.payAdvanceTitle}
                                                </span>
                                                {paymentPlan1kg === "advance" && (
                                                    <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-ink-600 mt-0.5">
                                                {t.payAdvanceSub}
                                            </p>
                                        </button>

                                        {/* Option B: Full ₹840 */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentPlan1kg("full")}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                paymentPlan1kg === "full"
                                                    ? "bg-white border-brand-700 shadow-sm ring-1 ring-brand-700"
                                                    : "bg-white/60 border-amber-200"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-xs sm:text-sm text-ink-900">
                                                    {t.payFullTitle}
                                                </span>
                                                {paymentPlan1kg === "full" && (
                                                    <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-ink-600 mt-0.5">
                                                {t.payFullSub}
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Quantity Selector */}
                            <div className="mb-6 p-3.5 sm:p-5 rounded-2xl bg-ivory-50 border border-line flex items-center justify-between gap-3">
                                <div>
                                    <span className="font-bold text-sm sm:text-base text-ink-900 block leading-tight">
                                        {step2} {t.quantityLabel}
                                    </span>
                                    <span className="text-[11px] text-ink-500">
                                        {lang === "gu" ? "બોક્સની સંખ્યા:" : "Number of boxes:"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-line text-xl sm:text-2xl font-extrabold text-ink-900 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-700 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl sm:text-2xl font-extrabold text-ink-900 w-8 sm:w-10 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-line text-xl sm:text-2xl font-extrabold text-ink-900 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-700 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price Summary Breakdown */}
                            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-brand-50/70 border-2 border-brand-200">
                                <div className="flex items-center justify-between text-xs sm:text-sm pb-2.5 border-b border-brand-200/80">
                                    <span className="text-ink-700 font-bold">{t.summaryItem}</span>
                                    <span className="font-extrabold text-ink-900">
                                        {is1kg ? t.weight1kg : t.weight500g} × {quantity} {lang === "gu" ? "બોક્સ" : "box"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2.5">
                                    <span className="font-extrabold text-sm sm:text-base text-ink-900">
                                        {t.summaryPayNow}
                                    </span>
                                    <span className="text-2xl sm:text-3xl font-extrabold text-brand-700">
                                        ₹{totalOnlinePayable}
                                    </span>
                                </div>

                                {totalDueAtVadi > 0 && (
                                    <div className="flex items-center justify-between pt-2 text-xs sm:text-sm text-amber-900 font-bold border-t border-brand-200/80 mt-2">
                                        <span>{t.summaryPayAtVadi}</span>
                                        <span>₹{totalDueAtVadi} ({lang === "gu" ? "રોકડા વાડી પર" : "Cash at Vadi"})</span>
                                    </div>
                                )}
                            </div>

                            {/* Step 3: Customer Form */}
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-bold text-ink-900 leading-tight">
                                        {step3} {t.formHeading}
                                    </h2>
                                    <p className="text-xs text-ink-500 mt-0.5">
                                        {t.formSub}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-ink-800 mb-1">
                                        {t.nameLabel}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={t.namePlaceholder}
                                        value={orderForm.name}
                                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                                        className="w-full px-3.5 py-3 rounded-xl border-2 border-line text-base font-medium focus:border-brand-700 focus:outline-none bg-ivory-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-ink-800 mb-1">
                                        {t.phoneLabel}
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder={t.phonePlaceholder}
                                        value={orderForm.phone}
                                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                        className="w-full px-3.5 py-3 rounded-xl border-2 border-line text-base font-medium focus:border-brand-700 focus:outline-none bg-ivory-50/50"
                                    />
                                    <span className="text-[11px] text-ink-500 block mt-1">
                                        {t.phoneHelp}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-ink-800 mb-1">
                                        {t.notesLabel}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t.notesPlaceholder}
                                        value={orderForm.notes}
                                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:border-brand-700 focus:outline-none"
                                    />
                                </div>

                                {/* Big Pay Button (Thumb-friendly on mobile) */}
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full mt-3 py-3.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl bg-brand-700 hover:bg-brand-800 active:scale-[0.99] text-white text-base sm:text-xl font-extrabold flex items-center justify-center gap-2.5 shadow-lg transition-all disabled:opacity-70 min-h-[52px]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                            <span>{t.btnProcessing}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                {t.btnPayNow} (₹{totalOnlinePayable})
                                            </span>
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-[11px] text-center text-ink-500 flex items-center justify-center gap-1 pt-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span>{t.secureNotice}</span>
                                </p>
                            </form>
                        </div>
                    ) : (
                        /* OFFICIAL DIGITAL PICKUP RECEIPT */
                        <div
                            id="order-receipt-modal"
                            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-ink-900 shadow-xl border-4 border-emerald-500 animate-fade-up"
                        >
                            <div className="text-center pb-4 border-b border-line">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-1">
                                    {t.receiptConfirmed}
                                </span>
                                <p className="text-xs sm:text-sm text-ink-600">
                                    {t.receiptSubtitle}
                                </p>
                            </div>

                            <div className="my-4 space-y-3 text-sm">
                                <div className="p-3.5 rounded-xl bg-brand-50 border-2 border-brand-200 text-center">
                                    <span className="text-[11px] uppercase tracking-wider text-ink-600 font-bold block mb-0.5">
                                        {t.tokenTitle}
                                    </span>
                                    <span className="text-2xl sm:text-4xl font-extrabold text-brand-700 font-mono tracking-wider">
                                        {confirmedOrder.orderId}
                                    </span>
                                    <p className="text-xs text-brand-900 mt-1 font-medium">
                                        {t.tokenInstruction}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm p-3.5 rounded-xl bg-ivory-50 border border-line">
                                    <div>
                                        <span className="text-[11px] text-ink-400 block font-semibold">{lang === "gu" ? "ગ્રાહકનું નામ:" : "Name:"}</span>
                                        <span className="font-bold text-ink-900">{confirmedOrder.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-ink-400 block font-semibold">{lang === "gu" ? "મોબાઈલ નંબર:" : "Phone:"}</span>
                                        <span className="font-bold text-ink-900">{confirmedOrder.phone}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-ink-400 block font-semibold">{lang === "gu" ? "ઓર્ડર વિગત:" : "Item:"}</span>
                                        <span className="font-bold text-ink-900">
                                            {confirmedOrder.weight} × {confirmedOrder.quantity} {lang === "gu" ? "બોક્સ" : "box"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-ink-400 block font-semibold">{t.paidAmount}</span>
                                        <span className="font-extrabold text-emerald-700 text-base">₹{confirmedOrder.paidOnline}</span>
                                    </div>
                                    {confirmedOrder.dueAtVadi > 0 && (
                                        <div className="sm:col-span-2 pt-1.5 border-t border-line text-amber-900 font-bold text-xs sm:text-sm">
                                            <span>{t.dueAmount} </span>
                                            <span className="text-base text-amber-700">₹{confirmedOrder.dueAtVadi}</span>
                                            <span className="text-[11px] block font-normal text-ink-600">
                                                {lang === "gu" ? "(સમાજ વાડી પર સાલમ પાક લેતી વખતે રોકડા આપવા)" : "(Pay in cash when collecting at Community Vadi)"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-0.5">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <MapPin className="h-4 w-4 text-amber-700 shrink-0" />
                                        <span>{t.pickupPoint}</span>
                                    </div>
                                    <p className="font-bold">{lang === "gu" ? BRAND.pickupLocationGu : BRAND.pickupLocation}</p>
                                    <p className="text-[11px] text-ink-600 pt-0.5">
                                        {lang === "gu"
                                            ? `અંદાજિત તૈયાર થવાની તારીખ: ${confirmedOrder.estimatedReadyDate}`
                                            : `Estimated Ready Date: ${confirmedOrder.estimatedReadyDate}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="flex-1 py-3 px-4 rounded-xl border border-line bg-ivory-50 text-ink-900 font-bold hover:bg-ivory-100 flex items-center justify-center gap-2 text-xs shadow-sm"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>{t.btnPrint}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={resetOrder}
                                    className="flex-1 py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 text-xs shadow"
                                >
                                    <span>{t.btnNewOrder}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PROMINENT HELPLINE / WHATSAPP HELP CARD FOR ELDERLY */}
                    <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                                <h3 className="text-base sm:text-xl font-extrabold text-emerald-950 leading-tight">
                                    {t.helplineTitle}
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                                    {t.helplineDesc}
                                </p>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                                    <a
                                        href={`tel:${BRAND.helplinePhone}`}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-extrabold shadow"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>{t.btnCall}: {BRAND.helplinePhone}</span>
                                    </a>
                                    <a
                                        href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
                                            lang === "gu"
                                                ? "સાલમ પાક ઓર્ડર કરવા માટે મદદ જોઈએ છે."
                                                : "Hello, I need help ordering Salampak."
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-extrabold shadow"
                                    >
                                        <MessageSquare className="h-4 w-4 text-emerald-600" />
                                        <span>{t.btnWhatsApp}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPTIONAL SECOND PAGE LINK */}
                    <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-line text-center shadow-sm">
                        <p className="text-xs sm:text-sm text-ink-600 font-medium mb-2">
                            {lang === "gu"
                                ? "સુરત ક્ષત્રિય યુવક મંડળનો ઇતિહાસ, હોદ્દેદારો અને સેવાકીય પ્રવૃત્તિઓ:"
                                : "Learn more about Mandal history, managing committee, and seva initiatives:"}
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-brand-700 font-bold text-xs sm:text-sm border border-line transition-all"
                        >
                            <span>{t.navAbout} →</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
