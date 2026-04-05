import clsx from "clsx";
import NextLink from "next/link";

type LinkProps = {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ href, external, children, className, ...props }: LinkProps) {
  const baseClass =
    "text-primary-700 underline hover:text-primary-800 transition break-all";

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(baseClass, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={clsx(baseClass, className)} {...props}>
      {children}
    </NextLink>
  );
}