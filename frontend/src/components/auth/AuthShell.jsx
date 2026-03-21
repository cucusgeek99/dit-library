import { useEffect, useState } from "react";

const slides = [
  {
    image: "/auth/etudiant-bibliotheque.jpg",
    badge: "Vie étudiante",
    title: "Un espace pensé pour les étudiants",
    description:
      "Accédez facilement aux ouvrages, consultez les disponibilités et profitez d’un environnement académique mieux structuré.",
  },
  {
    image: "/auth/it-room.jpg",
    badge: "Innovation",
    title: "Une bibliothèque connectée à l’environnement numérique",
    description:
      "Une plateforme moderne qui accompagne l’administration, les étudiants et le personnel dans la gestion des ressources documentaires.",
  },
  {
    image: "/auth/rayon-livre.jpg",
    badge: "Catalogue",
    title: "Un meilleur suivi des ouvrages disponibles",
    description:
      "Organisez les livres, simplifiez les recherches et centralisez les informations essentielles du catalogue.",
  },
  {
    image: "/auth/salle-lecture.jpg",
    badge: "Lecture",
    title: "Un cadre adapté à l’apprentissage et à la consultation",
    description:
      "Valorisez les espaces de lecture avec une gestion plus simple des emprunts, des retours et du suivi documentaire.",
  },
  {
    image: "/auth/building-dit.jpg",
    badge: "Institution",
    title: "Une plateforme alignée à l’identité de DIT",
    description:
      "Une expérience institutionnelle sobre et professionnelle au service de la gestion académique et administrative.",
  },
];

export default function AuthShell({ title, subtitle, children }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-screen overflow-hidden lg:block">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`h-full w-full object-cover transition-transform duration-7000 ease-out ${
                  index === currentSlide ? "scale-110" : "scale-100"
                }`}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-linear-to-br from-[#154854]/90 via-[#154854]/65 to-black/55" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
            <div className="space-y-10">
              <img
                src="/logo.png"
                alt="DIT Dakar Institute of Technology"
                className="h-20 w-full object-contain object-left"
              />

              <div
                key={currentSlide}
                className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4"
              >
                <span className="inline-flex rounded-full bg-white/12 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-white/85 backdrop-blur-sm">
                  {slides[currentSlide].badge}
                </span>

                <h1 className="text-4xl font-semibold leading-tight text-white">
                  {slides[currentSlide].title}
                </h1>

                <p className="max-w-lg text-sm leading-7 text-white/80">
                  {slides[currentSlide].description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Aller à la diapositive ${index + 1}`}
                  />
                ))}
              </div>

              <div className="max-w-md rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                <p className="text-sm text-white/90">
                  Dakar Institute of Technology
                </p>
                <p className="mt-2 text-xs leading-6 text-white/65">
                  Interface académique et administrative dédiée à la gestion des
                  ressources documentaires, des utilisateurs et des emprunts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-6 py-10 md:px-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#154854]/8 to-transparent lg:hidden" />

          <div className="w-full max-w-lg space-y-8">
            <div className="space-y-5 lg:hidden">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#154854] text-white shadow-sm">
                  <img
                    src="/logo-dit.png"
                    alt="DIT"
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] bg-white shadow-lg shadow-slate-200/30">
                <div className="relative h-52">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={`h-full w-full object-cover transition-transform duration-7000 ease-out ${
                          index === currentSlide ? "scale-110" : "scale-100"
                        }`}
                      />
                    </div>
                  ))}

                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

                  <div
                    key={`mobile-${currentSlide}`}
                    className="absolute inset-x-0 bottom-0 animate-in fade-in slide-in-from-bottom-3 duration-700 p-5 text-white"
                  >
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-white/85 backdrop-blur-sm">
                      {slides[currentSlide].badge}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold leading-snug">
                      {slides[currentSlide].title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/80">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-5 py-4">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "w-7 bg-[#154854]"
                          : "w-2 bg-slate-300"
                      }`}
                      aria-label={`Aller à la diapositive ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {title}
              </h2>
              <p className="text-sm text-slate-500 md:text-base">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
