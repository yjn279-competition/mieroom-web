import { useState, useLayoutEffect } from 'react';

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode,
  fallback?: React.ReactNode,
}) {
  const [hasMounted, setHasMounted] = useState(false);
  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted ? children : fallback;
}
