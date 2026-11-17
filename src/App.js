import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Members from "@/pages/Members";
import Salampak from "@/pages/Salampak";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            // delay to let DOM render
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
        <div className="App">
            <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/members" element={<Members />} />
                        <Route path="/salampak" element={<Salampak />} />
                        <Route path="/shop" element={<Salampak />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
                <Footer />
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: "font-sans",
                        },
                    }}
                />
            </BrowserRouter>
        </div>
    );
}

export default App;
