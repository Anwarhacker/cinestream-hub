import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 sticky bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold tracking-wider text-primary" style={{ fontFamily: 'Bebas Neue' }}>
              CINEFLIX
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          )}

          {user && (
            <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
