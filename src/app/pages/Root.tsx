import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, LogIn, LogOut, UserCircle } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { useState, useEffect } from "react";

export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.href = '/';
  };

  const navigation = [
    { name: "Domov", href: "/" },
    { name: "O konferencii", href: "/about" },
    { name: "Program", href: "/schedule" },
    { name: "Prednášajúci", href: "/speakers" },
    { name: "Registrácia", href: "/register" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl">
              INFORMATICS 2026
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(item.href) ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserCircle className="w-4 h-4" />
                      {currentUser.role === 'admin' ? 'Admin Panel' : 'Môj Panel'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Odhlásiť
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Prihlásiť
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t space-y-2">
                {currentUser ? (
                  <>
                    <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <UserCircle className="w-4 h-4" />
                        {currentUser.role === 'admin' ? 'Admin Panel' : 'Môj Panel'}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Odhlásiť
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button className="w-full gap-2">
                      <LogIn className="w-4 h-4" />
                      Prihlásiť
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">INFORMATICS 2026</h3>
              <p className="text-sm text-gray-600">
                Medzinárodná vedecká konferencia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dôležité odkazy</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-blue-600">
                    O konferencii
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="hover:text-blue-600">
                    Program
                  </Link>
                </li>
                <li>
                  <Link to="/submissions" className="hover:text-blue-600">
                    Odoslať príspevok
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <p className="text-sm text-gray-600">
                Email: martin@mtvrdon.com
                <br />
                Tel: +421 949 344 232
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2026 Martin T. Všetky práva vyhradené.
          </div>
        </div>
      </footer>
    </div>
  );
}