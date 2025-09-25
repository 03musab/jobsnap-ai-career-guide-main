import { useState, useEffect, RefObject } from 'react';

export function useOnScreen(
  ref: RefObject<HTMLElement>, 
  options: IntersectionObserverInit = { threshold: 0.1 }
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}