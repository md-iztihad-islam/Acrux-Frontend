import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Define the props interface for our custom NavLink component
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;              // Base CSS classes
  activeClassName?: string;        // Classes applied when link is active
  pendingClassName?: string;       // Classes applied when link is pending
}

// Create the NavLink component using forwardRef
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  // Component function with props
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    // Return JSX that renders the RouterNavLink
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

// Set display name for debugging
NavLink.displayName = "NavLink";

export { NavLink };