import HeroSection from "@/components/features/landing/home/hero";
import Footer from "@/components/features/landing/layout/footer";
import Header from "@/components/features/landing/layout/header";


export default function Home() {
  return (
    <main className="bg-white overflow-x-hidden">
      <Header />
      <HeroSection />
      <Footer />
    </main>
  );
}

