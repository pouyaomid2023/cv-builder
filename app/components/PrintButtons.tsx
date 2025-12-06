"use client";

export default function PrintButtons() {
    function handleDownloadPdf() {
        if (typeof window === "undefined") {
            return;
        }

        window.print();
    }

    return (
        <>
            {/* Desktop PDF button (floating bottom-right) */}
            <button
                type="button"
                onClick={handleDownloadPdf}
                className="hidden print:hidden md:inline-flex fixed bottom-6 right-6 z-30 px-4 py-2 rounded-full bg-slate-950/90 border border-slate-700 text-xs font-medium text-slate-100 shadow-lg hover:border-emerald-400/80 hover:text-emerald-300 transition-all"
            >
                Download PDF
            </button>

            {/* Mobile PDF bar (bottom full-width) */}
            <button
                type="button"
                onClick={handleDownloadPdf}
                className="fixed bottom-0 left-0 right-0 z-30 inline-flex items-center justify-center px-4 py-3 bg-slate-950/95 border-t border-slate-800 text-xs font-medium text-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.6)] md:hidden print:hidden"
            >
                Download PDF
            </button>
        </>
    );
}
