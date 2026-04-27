import { HomeButtonLink } from "./base/index.ts";

export function CtaSection() {
    return (
        <section className="bg-blue-600 py-16 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                    Pripravení sa pripojiť?
                </h2>

                <p className="mb-8 text-xl text-blue-100">
                    Registrácia je otvorená počas aktívnej konferencie
                </p>

                <HomeButtonLink
                    to="/register"
                    size="lg"
                    variant="secondary"
                >
                    Registrovať sa teraz
                </HomeButtonLink>
            </div>
        </section>
    );
}