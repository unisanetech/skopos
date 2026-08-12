"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { SkoposMark } from "@/features/brand/skopos-mark";
import {
  isRouteActive,
  primaryNavigation,
  productNavigation,
  type SiteNavItem,
} from "./site-navigation";

function NavigationLink({
  item,
  className,
  onClick,
}: {
  item: SiteNavItem;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = !item.external && isRouteActive(pathname, item.href);

  if (item.external) {
    return (
      <a className={className} href={item.href} target="_blank" rel="noreferrer" onClick={onClick}>
        {item.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link
      className={cn(className, active && "text-[var(--skopos-ink)] after:bg-[var(--skopos-ink)]")}
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const productActive = productNavigation.some((item) => isRouteActive(pathname, item.href));

  const closeMenu = useCallback((returnFocus = true) => {
    setMenuOpen(false);
    if (returnFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProductOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productOpen) return;

    const closeProductMenu = (event: MouseEvent) => {
      if (!productMenuRef.current?.contains(event.target as Node)) setProductOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductOpen(false);
    };
    document.addEventListener("pointerdown", closeProductMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeProductMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [productOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const previousOverflow = document.body.style.overflow;
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => firstMenuLinkRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const breakpoint = window.matchMedia("(min-width: 960px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu(false);
    };
    window.addEventListener("keydown", onKeyDown);
    breakpoint.addEventListener("change", onBreakpoint);

    return () => {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      breakpoint.removeEventListener("change", onBreakpoint);
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[1000] min-h-[60px] border-b border-[#d6d6d0] bg-[var(--skopos-paper)] px-[var(--page-gutter)] md:min-h-16">
        <div className="flex min-h-[60px] w-full items-center justify-between gap-5 md:min-h-16 md:gap-8">
          <Link className="inline-flex items-center gap-[9px] text-xl font-[760] tracking-[-0.04em] text-[var(--skopos-ink)] md:text-[22px]" href="/" aria-label="Skopos home">
            <SkoposMark className="size-7 shrink-0 md:size-8" />
            <span>Skopos</span>
          </Link>

          <nav className="ml-auto hidden self-stretch items-center gap-1 min-[960px]:flex" aria-label="Primary navigation">
            <div ref={productMenuRef} className="relative flex self-stretch items-stretch">
              <button
                className={cn("relative flex h-full cursor-pointer items-center gap-[3px] border-0 bg-transparent px-[13px] text-[13px] font-semibold text-[#5c5c5c] after:absolute after:right-[13px] after:bottom-[-1px] after:left-[13px] after:h-0.5 hover:text-[var(--skopos-ink)]", productActive && "text-[var(--skopos-ink)] after:bg-[var(--skopos-ink)]")}
                type="button"
                aria-expanded={productOpen}
                aria-controls="product-navigation"
                onClick={() => setProductOpen((open) => !open)}
              >
                Product
                <Icon symbol={productOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="sm" />
              </button>
              {productOpen ? (
                <div id="product-navigation" className="absolute top-[calc(100%+1px)] left-0 z-20 w-[390px] border border-[var(--skopos-rule-light)] bg-[var(--skopos-paper-strong)] p-2 shadow-[0_20px_45px_rgb(0_0_0/12%)]">
                  {productNavigation.map((item) => (
                    <Link
                      key={item.href}
                      className={cn("grid gap-[3px] border border-transparent px-3.5 py-[13px] hover:border-[var(--skopos-rule-light)] hover:bg-[#f0eee8] focus-visible:border-[var(--skopos-rule-light)] focus-visible:bg-[#f0eee8] [&_span]:text-xs [&_span]:leading-[1.4] [&_span]:text-[#666] [&_strong]:text-[13px] [&_strong]:leading-[1.35]", isRouteActive(pathname, item.href) && "border-[var(--skopos-rule-light)] bg-[#f0eee8]")}
                      href={item.href}
                      aria-current={isRouteActive(pathname, item.href) ? "page" : undefined}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {primaryNavigation.map((item) => (
              <NavigationLink key={item.href} item={item} className="relative flex h-full items-center px-[13px] text-[13px] font-semibold text-[#5c5c5c] after:absolute after:right-[13px] after:bottom-[-1px] after:left-[13px] after:h-0.5 hover:text-[var(--skopos-ink)]" />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link className="hidden min-h-10 items-center gap-2.5 rounded-[5px] border border-[var(--skopos-ink)] bg-[var(--skopos-ink)] px-[15px] text-xs font-bold text-white hover:border-[#2a2a2a] hover:bg-[#2a2a2a] min-[960px]:inline-flex" href="/docs">
              Get started
              <Icon symbol="arrow_forward" size="sm" />
            </Link>
            <button
              ref={menuButtonRef}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#a0a0a0] bg-transparent text-[var(--skopos-ink)] min-[960px]:hidden"
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              <Icon symbol={menuOpen ? "close" : "menu"} size="md" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-[60px_0_0] z-[1100] md:inset-[64px_0_0]">
          <button
            className="absolute inset-0 size-full cursor-pointer border-0 bg-[rgb(0_0_0/72%)]"
            type="button"
            aria-label="Close navigation"
            onClick={() => closeMenu()}
          />
          <nav
            id="mobile-navigation"
            className="absolute top-0 right-0 min-h-full w-[min(420px,100%)] border-l border-[var(--skopos-night-border)] bg-[var(--skopos-night)] px-7 py-[38px] text-white"
            aria-label="Mobile navigation"
            aria-modal="true"
            role="dialog"
          >
            <p className="mb-6 text-[11px] font-bold tracking-[0.12em] text-[#8f8f8f] uppercase">Product</p>
            {productNavigation.map((item, index) => (
              <Link
                key={item.href}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                className={cn("grid min-h-14 grid-cols-[36px_1fr_auto] items-center gap-2 border-b border-[#2d2d2d] font-semibold [&>span:first-child]:font-mono [&>span:first-child]:text-xs [&>span:first-child]:text-[var(--skopos-blue-bright)]", isRouteActive(pathname, item.href) && "bg-[#111] text-white")}
                href={item.href}
                aria-current={isRouteActive(pathname, item.href) ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
                <Icon symbol="arrow_forward" size="sm" />
              </Link>
            ))}
            <p className="mt-[30px] mb-2 text-[11px] font-bold tracking-[0.12em] text-[#8f8f8f] uppercase">Explore</p>
            {primaryNavigation.map((item, index) =>
              item.external ? (
                <a className="grid min-h-14 grid-cols-[36px_1fr_auto] items-center gap-2 border-b border-[#2d2d2d] font-semibold [&>span:first-child]:font-mono [&>span:first-child]:text-xs [&>span:first-child]:text-[var(--skopos-blue-bright)]" key={item.href} href={item.href} target="_blank" rel="noreferrer">
                  <span>{String(index + 5).padStart(2, "0")}</span>
                  {item.label}
                  <Icon symbol="arrow_outward" size="sm" />
                </a>
              ) : (
                <Link
                  key={item.href}
                  className={cn("grid min-h-14 grid-cols-[36px_1fr_auto] items-center gap-2 border-b border-[#2d2d2d] font-semibold [&>span:first-child]:font-mono [&>span:first-child]:text-xs [&>span:first-child]:text-[var(--skopos-blue-bright)]", isRouteActive(pathname, item.href) && "bg-[#111] text-white")}
                  href={item.href}
                  aria-current={isRouteActive(pathname, item.href) ? "page" : undefined}
                >
                  <span>{String(index + 5).padStart(2, "0")}</span>
                  {item.label}
                  <Icon symbol="arrow_forward" size="sm" />
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </>
  );
}
