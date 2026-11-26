import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ShoppingBag,
    CheckCircle2,
    ShieldCheck,
    Flame,
    HeartHandshake,
    Leaf,
    ArrowRight,
    MapPin,
    Clock,
    MessageSquare,
    Printer,
    RefreshCw,
    Info,
    Receipt
} from "lucide-react";
import { toast } from "sonner";
import { BRAND, SALAMPAK_PRODUCTS, SALAMPAK_INGREDIENTS } from "@/data/site";

export default function Salampak() {
    const product = SALAMPAK_PRODUCTS[0]; // Salampak Classic only
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0); // 0: 500g (₹420), 1: 1kg (₹840)
    const [quantity, setQuantity] = useState(1);

    const [orderForm, setOrderForm] = useState({
        name: "",
        phone: "",
        email: "",
        notes: ""
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    const activeVariant = product.variants[selectedVariantIdx];
    const totalAmount = activeVariant.price * quantity;

    // Estimated ready date: 4 to 5 days from today
    const getEstimatedDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!orderForm.name.trim() || !orderForm.phone.trim()) {
            toast.error("કૃપા કરીને તમારું નામ અને મોબાઈલ નંબર દાખલ કરો.");
            return;
        }

        if (totalAmount < 1) {
            toast.error("Invalid order amount.");
            return;
        }

        setIsProcessing(true);

        const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_U4j3Z0fjk5YJ2s";

        // Verify Razorpay SDK is loaded
        if (!window.Razorpay) {
            setIsProcessing(false);
            toast.error("Razorpay SDK is not loaded. Please refresh or check your internet connection.");
            return;
        }

        try {
            // STEP 1: BACKEND - Call /api/create-order
            const createOrderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: totalAmount * 100, // paise
                    currency: "INR",
                    receipt: `skym_rcpt_${Date.now()}`
                })
            });

            const orderData = await createOrderRes.json();

            if (!createOrderRes.ok || !orderData.order_id) {
                throw new Error(orderData.error || "Failed to create order on server");
            }

            // STEP 2: FRONTEND - Open Razorpay Modal with order_id
            const options = {
                key: razorpayKey,
                amount: orderData.amount, // in paise
                currency: orderData.currency || "INR",
                name: BRAND.name,
                description: `Salampak Classic (${activeVariant.weight}) × ${quantity}`,
                image: BRAND.logoUrl,
                order_id: orderData.order_id,
                prefill: {
                    name: orderForm.name,
                    contact: orderForm.phone,
                    email: orderForm.email || ""
                },
                theme: {
                    color: "#8B150E"
                },
                handler: async function (response) {
                    // STEP 3: BACKEND - Verify Payment Signature
                    try {
                        setIsProcessing(true);
                        const verifyRes = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
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

                        // Success! Complete order and show confirmation receipt
                        completeOrder(response.razorpay_payment_id, response.razorpay_order_id);
                    } catch (verifyError) {
                        setIsProcessing(false);
                        console.error("Verification error:", verifyError);
                        toast.error(`Payment Verification Failed: ${verifyError.message}`);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.info("Payment cancelled. You can retry whenever you are ready.");
                    }
                }
            };

            const rzp = new window.Razorpay(options);

            // Handle payment failed event
            rzp.on("payment.failed", function (failResponse) {
                setIsProcessing(false);
                const desc = failResponse?.error?.description || "Payment failed or transaction was declined.";
                console.error("Razorpay payment.failed:", failResponse);
                toast.error(`Payment Failed: ${desc}`);
            });

            rzp.open();
        } catch (err) {
            setIsProcessing(false);
            console.error("Error initiating checkout:", err);
            toast.error(`Checkout Error: ${err.message}`);
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
            email: orderForm.email,
            item: product.name,
            variant: activeVariant.weight,
            unitPrice: activeVariant.price,
            quantity: quantity,
            totalAmount: totalAmount,
            pickupLocation: BRAND.pickupLocation,
            pickupLocationGu: BRAND.pickupLocationGu,
            estimatedReadyDate: getEstimatedDate(),
            orderDate: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        setConfirmedOrder(orderData);
        toast.success("ઓર્ડર પેમેન્ટ સફળ! Payment Received & Verified.", {
            description: `Order Token: ${tokenDisplay}. Pick up from Community Vadi in 4-5 days.`
        });

        // Scroll to confirmation receipt
        setTimeout(() => {
            const el = document.getElementById("order-receipt-modal");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
    };

    const resetOrder = () => {
        setConfirmedOrder(null);
        setOrderForm({
            name: "",
            phone: "",
            email: "",
            notes: ""
        });
        setQuantity(1);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div data-testid="salampak-page" className="animate-fade-up">
            {/* TOP TITLE POSTER BANNER */}
            <section className="bg-ivory-50 border-b border-line pt-6 sm:pt-8 pb-10">
                <div className="container-page">
                    <div className="relative rounded-3xl overflow-hidden border border-line shadow-2xl aspect-[21/9] sm:aspect-[2.35/1] max-h-[480px]">
                        <img
                            src="/images/salampak-hero.jpg"
                            alt="Authentic Surat Kshtriya Yuvak Mandal Salampak"
                            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-xs font-semibold tracking-wider uppercase text-saffron w-fit mb-2 border border-white/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />
                                <span>શુદ્ધ દેશી ઘી નો સાલમ પાક · EST. 1961</span>
                            </span>
                            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
                                Authentic Surat Salampak
                            </h1>
                            <p className="font-gujarati text-lg sm:text-2xl text-saffron mt-1 font-semibold">
                                સુરત ક્ષત્રિય યુવક મંડળ પ્રસ્તુત પરંપરાગત શિયાળુ વસાણું
                            </p>
                        </div>
                    </div>

                    {/* VADI PICKUP & TIME NOTICE BADGES */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-ink-700">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-brand-200/80 shadow-sm">
                            <MapPin className="h-5 w-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="text-[11px] uppercase tracking-wider text-ink-400 block font-semibold">Self-Pickup Only</span>
                                <span className="text-sm font-bold text-brand-800">Community Vadi, Surat</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-line shadow-sm">
                            <Clock className="h-5 w-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="text-[11px] uppercase tracking-wider text-ink-400 block font-semibold">Fresh Preparation</span>
                                <span className="text-sm font-bold text-ink-900">Ready in 4–5 Days</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-line shadow-sm">
                            <MessageSquare className="h-5 w-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="text-[11px] uppercase tracking-wider text-ink-400 block font-semibold">WhatsApp Update</span>
                                <span className="text-sm font-bold text-ink-900">Alert Once Ready</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-line shadow-sm">
                            <ShieldCheck className="h-5 w-5 text-brand-700 shrink-0" />
                            <div>
                                <span className="text-[11px] uppercase tracking-wider text-ink-400 block font-semibold">Direct Payment</span>
                                <span className="text-sm font-bold text-ink-900">UPI / GPay / Cards</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT IS SALAMPAK / STORY */}
            <section id="about-salampak" className="section-pad">
                <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="flex items-center gap-2 text-brand-700 font-serif italic text-lg">
                            <Flame className="h-4 w-4 text-brand-700" />
                            <span>Heritage Recipe from Surat</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-snug font-bold">
                            Not just a sweet. A sacred winter tradition passed through generations.
                        </h2>
                        <p className="font-gujarati text-lg text-brand-700 font-semibold">
                            "જ્યાં યુવાઓ સેવા કરે — ત્યાં સમાજ તંદુરસ્ત આગળ વધે."
                        </p>
                        <p className="text-ink-500 leading-relaxed">
                            Salampak (સાલમ પાક) is a revered Ayurvedic <em>Vasanu</em> consumed throughout the colder months in Gujarat. Its key therapeutic botanical is <strong>Salam Panja</strong> (Orchis mascula), recognized in classical Ayurveda for stamina, joint strength, and deep rejuvenation.
                        </p>
                        <p className="text-ink-500 leading-relaxed">
                            Every winter batch is prepared following strict traditional standards — slow-cooked mawa, pure desi cow ghee, freshly ground Pipramul (Ganthoda), Sonth, and Batrisyu masala. Proceeds directly support the educational, medical, and community welfare initiatives of Surat Kshtriya Yuvak Mandal.
                        </p>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="rounded-3xl border border-line bg-ivory-50 p-8 sm:p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-2xl opacity-60" />
                            <h3 className="font-serif text-2xl text-ink-900 mb-6 flex items-center gap-2 font-bold">
                                <HeartHandshake className="h-6 w-6 text-brand-700" />
                                Community Vadi Collection Process
                            </h3>
                            <ul className="space-y-4 text-ink-700 text-sm">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Made Fresh in Batches:</strong> Orders are prepared fresh upon booking, requiring 4 to 5 working days for authentic Ayurvedic slow-cooking.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Automated Readiness Notification:</strong> As soon as your order is packaged, you will receive an SMS/WhatsApp notification on your mobile number.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Self-Pickup from Community Vadi:</strong> Simply show your digital Order Token ID at the Vadi counter to collect your fresh box.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>100% Shuddh Samaj Seva:</strong> All surplus funds go directly towards student scholarships and medical camps.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCT CARD - SALAMPAK CLASSIC ONLY */}
            <section id="products-grid" className="section-pad bg-ivory-100 border-y border-line">
                <div className="container-page">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="overline justify-center">Authentic Selection · પૌષ્ટિક વસાણું</p>
                        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ink-900 font-bold">
                            Salampak Classic
                        </h2>
                        <p className="mt-3 text-ink-500 text-sm">
                            Handmade in pure desi cow ghee with genuine Salam Panja and 30+ restorative Ayurvedic herbs.
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto">
                        <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 border border-line shadow-inner">
                                <img
                                    src="/images/salampak-hero.jpg"
                                    alt="Salampak Classic"
                                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-3 right-3 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md bg-brand-700 text-white">
                                    Pure Desi Ghee
                                </span>
                            </div>

                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-serif text-3xl text-ink-900 leading-snug font-bold">
                                        {product.name}
                                    </h3>
                                    <p className="font-gujarati text-lg text-brand-700 font-semibold">
                                        {product.nameGu}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-ink-500 leading-relaxed mb-6">
                                {product.desc}
                            </p>

                            {/* Weight selection */}
                            <div className="border-t border-line pt-6 mb-6">
                                <label className="text-xs uppercase tracking-wider text-ink-400 block mb-3 font-semibold">
                                    Choose Size / Weight:
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((v, i) => (
                                        <button
                                            key={v.weight}
                                            type="button"
                                            onClick={() => setSelectedVariantIdx(i)}
                                            className={`py-3.5 px-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                                                i === selectedVariantIdx
                                                    ? "bg-brand-50 border-brand-700 text-brand-700 font-bold shadow-sm"
                                                    : "border-line text-ink-700 hover:bg-ivory-50 font-medium"
                                            }`}
                                        >
                                            <span className="text-base font-semibold">{v.weight}</span>
                                            <span className="text-sm opacity-90 mt-0.5 font-serif text-lg">₹{v.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity selection */}
                            <div className="flex items-center justify-between pb-6 mb-6 border-b border-line">
                                <span className="text-xs uppercase tracking-wider text-ink-400 font-semibold">
                                    Quantity (Boxes):
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 rounded-lg border border-line bg-ivory-50 text-ink-900 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="font-semibold text-lg w-6 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-9 h-9 rounded-lg border border-line bg-ivory-50 text-ink-900 font-bold hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <span className="text-xs text-ink-400 block font-medium">Total Amount</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-serif text-4xl font-bold text-brand-700">
                                            ₹{totalAmount}
                                        </span>
                                        <span className="text-xs text-ink-400">({activeVariant.weight} × {quantity})</span>
                                    </div>
                                </div>
                                <a
                                    href="#order-form-section"
                                    className="btn-primary !py-3.5 !px-8 text-sm font-semibold flex items-center gap-2"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>Proceed to Pay</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INGREDIENTS BREAKDOWN */}
            <section className="section-pad">
                <div className="container-page">
                    <div className="max-w-2xl mb-12">
                        <p className="overline">Authentic Formulation · સંપૂર્ણ સામગ્રી</p>
                        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ink-900 font-bold">
                            What goes into every batch
                        </h2>
                        <p className="mt-2 text-ink-500 text-sm">
                            Pure natural nutrition with zero chemical preservatives or artificial essence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SALAMPAK_INGREDIENTS.map((cat) => (
                            <div key={cat.category} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                                <h3 className="font-serif text-lg text-brand-700 pb-3 mb-4 border-b border-line font-bold">
                                    {cat.category}
                                </h3>
                                <ul className="space-y-2 text-xs text-ink-700">
                                    {cat.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="text-saffron font-bold text-sm">·</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DIRECT ORDER & PAYMENT GATEWAY SECTION */}
            <section id="order-form-section" className="section-pad bg-brand-800 text-white relative">
                <div className="container-page grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Pickup Notice & Explanations */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-saffron tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-sm bg-saffron rotate-45 shrink-0" />
                            <span>DIRECT PAYMENT &amp; VADI PICKUP</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                            Confirm order &amp; pay directly online.
                        </h2>
                        <p className="font-gujarati text-lg text-saffron font-semibold">
                            ઓર્ડર કન્ફર્મ કરી ૪-૫ દિવસમાં સમાજ વાડી પરથી મેળવી લો.
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed">
                            No delivery address required. All batches are prepared fresh with devotion. Simply enter your contact info, pay securely via UPI/Card, and collect your fresh box from our Community Vadi upon receiving our WhatsApp notification.
                        </p>

                        <div className="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-saffron shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Pickup Location:</h4>
                                    <p className="text-xs text-white/85 mt-0.5">{BRAND.pickupLocation}</p>
                                    <p className="font-gujarati text-xs text-saffron mt-0.5">{BRAND.pickupLocationGu}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                                <Clock className="h-5 w-5 text-saffron shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Preparation Time:</h4>
                                    <p className="text-xs text-white/85 mt-0.5">4 to 5 working days (Slow-cooked in fresh batches).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                                <MessageSquare className="h-5 w-5 text-saffron shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-white">Order Readiness Alert:</h4>
                                    <p className="text-xs text-white/85 mt-0.5">We will send you a WhatsApp message / SMS the day your fresh box is packed and ready for pickup.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-white/60 space-y-1">
                            <p>Official Email: {BRAND.email}</p>
                            <p>Surat Kshtriya Yuvak Mandal · Est. 1961</p>
                        </div>
                    </div>

                    {/* Right: Checkout & Payment Form / Confirmation Receipt */}
                    <div className="lg:col-span-7">
                        {!confirmedOrder ? (
                            <form
                                onSubmit={handleFormSubmit}
                                className="bg-white rounded-3xl p-8 sm:p-10 text-ink-900 shadow-2xl border border-line"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-serif text-2xl text-ink-900 font-bold">
                                        Pickup Registration &amp; Payment
                                    </h3>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-brand-50 text-brand-700">
                                        UPI / Cards Accepted
                                    </span>
                                </div>
                                <p className="text-xs text-ink-500 mb-6">
                                    Enter your contact details so we can alert you on WhatsApp the moment your batch is ready.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">
                                            Your Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Shri / Smt. Full Name"
                                            value={orderForm.name}
                                            onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:border-brand-700 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">
                                            WhatsApp / Mobile Number *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+91 98765 43210 (For pickup alert)"
                                            value={orderForm.phone}
                                            onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:border-brand-700 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">
                                        Email Address (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com (For digital receipt)"
                                        value={orderForm.email}
                                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-line text-sm focus:border-brand-700 focus:outline-none"
                                    />
                                </div>

                                {/* Order Summary Box */}
                                <div className="rounded-2xl bg-ivory-50 border border-line p-5 mb-6">
                                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-line text-xs font-semibold text-ink-500 uppercase tracking-wider">
                                        <span>Selected Item</span>
                                        <span>Amount</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="font-bold text-ink-900">
                                            {product.name} ({activeVariant.weight}) × {quantity}
                                        </span>
                                        <span className="font-bold text-brand-700 text-base">
                                            ₹{totalAmount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-ink-600 mb-1">
                                        <span>Collection Point:</span>
                                        <span className="font-semibold text-brand-800">Community Vadi, Surat</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-ink-600">
                                        <span>Est. Ready Window:</span>
                                        <span className="font-semibold text-ink-800">4–5 Days (~{getEstimatedDate()})</span>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-line flex items-center justify-between font-bold text-base text-brand-800">
                                        <span>Total Payable:</span>
                                        <span className="font-serif text-2xl font-bold">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full btn-primary !py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isProcessing ? (
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Pay Now ₹{totalAmount} via Razorpay / UPI</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-ink-400 text-center mt-3 flex items-center justify-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>Instant payment via Google Pay, PhonePe, Paytm, Cards &amp; Netbanking.</span>
                                </p>
                            </form>
                        ) : (
                            /* OFFICIAL DIGITAL PICKUP RECEIPT */
                            <div
                                id="order-receipt-modal"
                                className="bg-white rounded-3xl p-8 sm:p-10 text-ink-900 shadow-2xl border-2 border-emerald-500 animate-fade-up"
                            >
                                <div className="text-center pb-6 border-b border-line">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                                        Payment Received · ઓર્ડર કન્ફર્મ થયેલ છે
                                    </span>
                                    <h3 className="font-serif text-3xl font-bold text-ink-900">
                                        Order Confirmed!
                                    </h3>
                                    <p className="text-xs text-ink-500 mt-1">
                                        Your Salampak is being prepared fresh for collection at the Community Vadi.
                                    </p>
                                </div>

                                <div className="my-6 space-y-3.5 text-sm">
                                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-ivory-50 border border-line">
                                        <span className="text-xs text-ink-400 uppercase tracking-wider font-semibold">Pickup Token ID</span>
                                        <span className="font-mono font-bold text-brand-700 text-lg">{confirmedOrder.orderId}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                        <span>Payment ID:</span>
                                        <span className="font-mono text-ink-700">{confirmedOrder.paymentId}</span>
                                    </div>
                                    {confirmedOrder.razorpayOrderId && (
                                        <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                            <span>Razorpay Order ID:</span>
                                            <span className="font-mono text-ink-700">{confirmedOrder.razorpayOrderId}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                        <span>Customer Name:</span>
                                        <span className="font-medium text-ink-900">{confirmedOrder.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                        <span>WhatsApp Number:</span>
                                        <span className="font-medium text-ink-900">{confirmedOrder.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                        <span>Item Ordered:</span>
                                        <span className="font-bold text-ink-900">{confirmedOrder.item} ({confirmedOrder.variant}) × {confirmedOrder.quantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-ink-500 px-1">
                                        <span>Total Paid:</span>
                                        <span className="font-bold text-emerald-700 font-serif text-lg">₹{confirmedOrder.totalAmount}</span>
                                    </div>

                                    {/* Pickup Location details */}
                                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                                            <MapPin className="h-4 w-4 text-amber-700" />
                                            <span>Collection Point: Community Vadi</span>
                                        </div>
                                        <p>{confirmedOrder.pickupLocation}</p>
                                        <p className="font-gujarati font-semibold">{confirmedOrder.pickupLocationGu}</p>
                                    </div>

                                    {/* Ready Date & Alert message */}
                                    <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold text-brand-950">
                                            <Clock className="h-4 w-4 text-brand-700" />
                                            <span>Expected Ready Date: {confirmedOrder.estimatedReadyDate}</span>
                                        </div>
                                        <p>
                                            We will send an automated WhatsApp notification to <strong>{confirmedOrder.phone}</strong> as soon as your fresh box is packed. Simply show this Token ID at the Vadi counter.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="btn-ghost flex-1 flex items-center justify-center gap-2 !py-2.5 text-xs font-semibold"
                                    >
                                        <Printer className="h-4 w-4" />
                                        <span>Print / Save Receipt</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetOrder}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2 !py-2.5 text-xs font-semibold"
                                    >
                                        <span>Order Another Box</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
