import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const el = document.querySelector(hash);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [pathname, hash]);
    return null;
};

function App() {
    return (
        <LanguageProvider>
            <div className="App min-h-screen flex flex-col bg-ivory-50 text-ink-900 font-sans selection:bg-brand-700 selection:text-white">
                <BrowserRouter>
                    <ScrollToTop />
                    <Navbar />
                    <main className="flex-1">
                        <Routes>
                            {/* Page 1: Main Salampak Ordering Page */}
                            <Route path="/" element={<Home />} />

                            {/* Page 2: About Mandal, Members & Contact */}
                            <Route path="/about" element={<About />} />

                            {/* Legacy & fallback redirects */}
                            <Route path="/salampak" element={<Navigate to="/" replace />} />
                            <Route path="/shop" element={<Navigate to="/" replace />} />
                            <Route path="/members" element={<Navigate to="/about" replace />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                    <Toaster
                        position="top-center"
                        richColors
                        closeButton
                        toastOptions={{
                            classNames: {
                                toast: "font-sans text-sm font-semibold",
                            },
                        }}
                    />
                </BrowserRouter>
            </div>
        </LanguageProvider>
    );
}

export default App;
