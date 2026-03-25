"use client";

import InteractiveHero from "../components/InteractiveHero";
import PageTransition from "../components/PageTransition";

export function HomeClient() {
  return (
    <PageTransition>
      <section>
        <InteractiveHero />
      </section>
    </PageTransition>
  );
}
