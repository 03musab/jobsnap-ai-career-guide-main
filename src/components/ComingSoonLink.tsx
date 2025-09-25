import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { comingSoonToastEmitter } from './ComingSoonToast';

interface ComingSoonProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  href?: string;
  isComingSoon?: boolean;
}

const ComingSoon = React.forwardRef<HTMLElement, ComingSoonProps>(
  ({ asChild, children, href, isComingSoon: isComingSoonProp, onClick, className, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? 'a' : 'span';

    const isComingSoon = isComingSoonProp ?? (href != null && (href === '#' || href === ''));

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (isComingSoon) {
        e.preventDefault();
        comingSoonToastEmitter.emit('This feature is coming soon!');
      }
      onClick?.(e);
    };

    if (!isComingSoon) {
      return (
        <Comp ref={ref} href={href} onClick={onClick} className={className} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

ComingSoon.displayName = 'ComingSoon';

export default ComingSoon;