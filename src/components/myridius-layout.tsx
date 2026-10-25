import { Link } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  CircleHelp,
  ClipboardList,
  FilePlus2,
  FolderOpen,
  Gavel,
  HelpCircle,
  History,
  Home,
  Inbox,
  LayoutGrid,
  Search,
  Settings,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkbenchPersona = "analyst" | "po";
export type WorkbenchNavKey =
  | "home"
  | "work-queue"
  | "assessments"
  | "policies"
  | "precedents"
  | "reports"
  | "config"
  | "my-requests"
  | "create"
  | "documents"
  | "decisions"
  | "notifications"
  | "faqs";

const analystNav: { key: WorkbenchNavKey; label: string; icon: LucideIcon; href: string }[] = [
  { key: "home", label: "Home", icon: Home, href: "/" },
  { key: "work-queue", label: "Work queue", icon: Inbox, href: "/" },
  { key: "assessments", label: "Assessments", icon: ClipboardList, href: "/?view=list" },
  { key: "policies", label: "Policy library", icon: BookOpen, href: "/?view=policies" },
  { key: "precedents", label: "Precedents", icon: History, href: "/?view=audit" },
  { key: "reports", label: "Reports", icon: LayoutGrid, href: "/?view=audit" },
  { key: "config", label: "Configuration", icon: Settings, href: "/?view=policies" },
];

const poNav: { key: WorkbenchNavKey; label: string; icon: LucideIcon; href: string }[] = [
  { key: "home", label: "Home", icon: Home, href: "/" },
  { key: "my-requests", label: "My requests", icon: FolderOpen, href: "/?view=requests" },
  { key: "create", label: "Create request", icon: FilePlus2, href: "/new-assessment" },
  { key: "documents", label: "Documents", icon: BookOpen, href: "/?view=policies" },
  { key: "decisions", label: "Decisions", icon: Gavel, href: "/?view=committee" },
  { key: "notifications", label: "Notifications", icon: Bell, href: "/?view=requests" },
  { key: "faqs", label: "FAQs", icon: CircleHelp, href: "/?view=requests" },
];

function personaForActive(active: string): WorkbenchPersona {
  if (active === "new" || active === "requests") return "po";
  return "analyst";
}

function navKeyForActive(active: string): WorkbenchNavKey {
  const map: Record<string, WorkbenchNavKey> = {
    dashboard: "work-queue",
    list: "assessments",
    committee: "decisions",
    audit: "reports",
    policies: "policies",
    requests: "my-requests",
    new: "create",
  };
  return map[active] ?? "work-queue";
}

export function WorkbenchHeader({
  searchPlaceholder = "Search cases, documents, policies…",
  userName = "Marcus Chen",
  userRole = "FCRM Analyst",
  userInitials = "MC",
  action,
}: {
  searchPlaceholder?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            readOnly
            aria-label="Search"
            placeholder={searchPlaceholder}
            className="h-10 w-full max-w-xl rounded-lg border border-input bg-muted/40 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {action}
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            <Bell className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {userInitials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-xs font-semibold">{userName}</span>
              <span className="block text-[10px] text-muted-foreground">{userRole}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  const inner = (
    <>
      <Icon className="size-[18px] shrink-0 opacity-90" />
      <span>{label}</span>
    </>
  );
  const className = cn(
    "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
  );
  if (href.startsWith("/") && !href.includes("?")) {
    return (
      <Button variant="ghost" size="sm" asChild className={cn(className, "justify-start")}>
        <Link to={href}>{inner}</Link>
      </Button>
    );
  }
  return (
    <Button variant="ghost" size="sm" asChild className={cn(className, "justify-start")}>
      <a href={href}>{inner}</a>
    </Button>
  );
}

export function MyRidiusShell({
  children,
  active = "dashboard",
  headerAction,
  userName,
  userRole,
  userInitials,
}: {
  children: ReactNode;
  active?: string;
  headerAction?: ReactNode;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}) {
  const persona = personaForActive(active);
  const navKey = navKeyForActive(active);
  const nav = persona === "po" ? poNav : analystNav;
  const po = persona === "po";

  return (
    <div className="app-backdrop min-h-screen text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-lg bg-sidebar-accent">
            <Shield className="size-5 text-sidebar-primary" />
          </span>
          <span>
            <b className="block text-sm font-semibold tracking-tight">MyRidius</b>
            <small className="text-[9px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/70">
              FCRM Workbench
            </small>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5">
          {nav.map((item) => (
            <SidebarLink
              key={item.key}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={navKey === item.key}
            />
          ))}
        </nav>
        <div className="mt-4 space-y-0.5 border-t border-sidebar-border pt-4">
          <SidebarLink href="/#help" label="Help & support" icon={HelpCircle} active={false} />
          <SidebarLink href="/#settings" label="Settings" icon={Settings} active={false} />
        </div>
      </aside>
      <div className="flex min-h-screen flex-col lg:ml-60">
        <WorkbenchHeader
          userName={userName ?? (po ? "Arjun Patel" : "Marcus Chen")}
          userRole={userRole ?? (po ? "Product Owner" : "FCRM Analyst")}
          userInitials={userInitials ?? (po ? "AP" : "MC")}
          searchPlaceholder={po ? "Search requests, documents, risks…" : "Search cases, documents, policies…"}
          action={headerAction}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function IntakeStepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = ["Describe", "Upload", "Review gaps", "Submit"] as const;
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-2 sm:gap-0">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-bold",
                  done && "bg-primary text-primary-foreground",
                  current && "bg-foreground text-background",
                  !done && !current && "border border-border bg-card text-muted-foreground",
                )}
              >
                {done ? "✓" : n}
              </span>
              <span className={cn("text-sm font-medium", current ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 ? <span className="mx-3 hidden h-px w-8 bg-border sm:block" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function AssessmentWorkflowStepper({ current }: { current: number }) {
  const steps = ["Classify", "Retrieve", "Inherent", "Controls", "Residual", "Finalise", "Committee"] as const;
  return (
    <ol className="mb-6 flex flex-wrap gap-y-3">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-[10px] font-bold",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-foreground text-background ring-2 ring-foreground/20",
                  !done && !active && "border border-border bg-card text-muted-foreground",
                )}
              >
                {done ? "✓" : n}
              </span>
              <span className={cn("text-[10px] font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 ? <span className="mx-1 mt-[-12px] hidden h-px w-4 bg-border md:block" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function KpiTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger" | "warn" | "success";
}) {
  const iconTone = {
    default: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
    warn: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  }[tone];
  return (
    <div className="workbench-card flex items-center gap-4 p-4">
      <span className={cn("grid size-10 place-items-center rounded-lg", iconTone)}>
        <LayoutGrid className="size-5" />
      </span>
      <div>
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
