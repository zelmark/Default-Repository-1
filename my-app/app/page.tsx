import { Navbar } from "@/components/saturn/navbar";
import { Hero } from "@/components/saturn/hero";
import { Stats } from "@/components/saturn/stats";
import { About } from "@/components/saturn/about";
import { Portfolio } from "@/components/saturn/portfolio";
import { Sectors } from "@/components/saturn/sectors";
import { Team } from "@/components/saturn/team";
import { Contact } from "@/components/saturn/contact";
import { Footer } from "@/components/saturn/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Portfolio />
        <Sectors />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
