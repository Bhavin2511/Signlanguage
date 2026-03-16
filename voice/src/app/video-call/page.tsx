import TranslatorNavbar from "@/components/isl/TranslatorNavbar";

export default function VideoCallPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <TranslatorNavbar />
      <main className="translator-container flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Video Translation</h1>
        <p className="text-slate-500">Connect with others via real-time sign language translation. Coming soon!</p>
      </main>
    </div>
  );
}