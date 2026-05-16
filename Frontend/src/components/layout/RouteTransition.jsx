import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

const ROUTE_ORDER = {
  '/admin/dashboard':          0,
  '/admin/users':              1,
  '/admin/grades':             2,
  '/admin/courses':            3,
  '/admin/notifications':      4,
  '/admin/settings':           5,
  '/superadmin/dashboard':     0,
  '/superadmin/users':         1,
  '/superadmin/grades':        2,
  '/superadmin/courses':       3,
  '/superadmin/notifications': 4,
  '/superadmin/settings':      5,
};

const RouteTransition = () => {
  const outlet = useOutlet();
  const location = useLocation();

  const currentIndex = useMemo(
    () => ROUTE_ORDER[location.pathname] ?? 0,
    [location.pathname]
  );
  const previousIndexRef = useRef(currentIndex);
  const directionRef = useRef(1);

  useEffect(() => {
    directionRef.current = currentIndex >= previousIndexRef.current ? 1 : -1;
    previousIndexRef.current = currentIndex;
    // Scroll to top on every route change — prevents stale scroll position
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentIndex]);

  const dir = directionRef.current;

  return (
    // No overflow-hidden / perspective here — those cause scroll jumps
    <div className="relative w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{
            y: dir * -28,
            opacity: 0,
            scale: 0.98,
            filter: 'blur(6px)',
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
          }}
          exit={{
            y: dir * 20,
            opacity: 0,
            scale: 0.97,
            filter: 'blur(4px)',
          }}
          transition={{
            y:       { type: 'spring', stiffness: 160, damping: 26, mass: 1 },
            opacity: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
            scale:   { type: 'spring', stiffness: 160, damping: 26, mass: 1 },
            filter:  { duration: 0.38, ease: 'easeOut' },
          }}
          className="w-full"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RouteTransition;
