import { Link } from "react-router";

export function AppFooter() {
    return (
        <footer className="border-t bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 font-bold">
                            INFORMATICS 2026
                        </h3>

                        <p className="text-sm text-gray-600">
                            Medzinárodná vedecká konferencia
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">
                            Dôležité odkazy
                        </h4>

                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <Link
                                    to="/schedule"
                                    className="hover:text-blue-600"
                                >
                                    Program
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/submissions"
                                    className="hover:text-blue-600"
                                >
                                    Odoslať príspevok
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">
                            Kontakt
                        </h4>

                        <p className="text-sm text-gray-600">
                            Email: martin@mtvrdon.com
                            <br />
                            Tel: +421 949 344 232
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                    © 2026 Martin T. Všetky práva vyhradené.
                </div>
            </div>
        </footer>
    );
}