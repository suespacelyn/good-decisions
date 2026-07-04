"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Landmark,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "@/core/data/store";
import { investmentsByPlatform, totalCpf } from "@/core/selectors";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddBankDialog } from "@/features/dashboard/components/add-bank-dialog";
import { formatSGD } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Consolidated breakdown of where the user's money sits. Balances are editable
 * inline — tap an amount to update it right from the home page. Each section
 * has a rounded action button on the side.
 */
export function AccountsBreakdown({ hidden = false }: { hidden?: boolean }) {
  const { state, updateBankAccount, deleteBankAccount, updateSnapshot } =
    useStore();
  const show = (n: number) => (hidden ? "••••" : formatSGD(n));

  const cpf = state.snapshot.cpf;
  const platforms = investmentsByPlatform(state.holdings);
  const cashTotal = state.bankAccounts.reduce((s, b) => s + b.balance, 0);

  const cpfRows = [
    { label: "Ordinary (OA)", value: cpf.ordinaryAccount, key: "ordinaryAccount" as const },
    { label: "Special (SA)", value: cpf.specialAccount, key: "specialAccount" as const },
    { label: "MediSave (MA)", value: cpf.medisave, key: "medisave" as const },
  ];

  return (
    <Card className="divide-y divide-border">
      {/* ── Total savings (bank/savings accounts) ──── */}
      <Section
        icon={Wallet}
        label="Total savings"
        total={show(cashTotal)}
        tint="var(--color-pastel-sky)"
        action={
          <AddBankDialog
            trigger={
              <Button size="sm" variant="secondary" className="rounded-full">
                <Plus /> Add savings account
              </Button>
            }
          />
        }
      >
        {state.bankAccounts.length === 0 ? (
          <EmptyRow text="No savings accounts yet." />
        ) : (
          state.bankAccounts.map((b) => (
            <SwipeableRow
              key={b.id}
              label={b.name}
              onDelete={() => deleteBankAccount(b.id)}
            >
              <span className="flex-1 truncate text-sm font-semibold">
                {b.name}
              </span>
              <EditableAmount
                value={b.balance}
                hidden={hidden}
                onSave={(n) => updateBankAccount(b.id, { balance: n })}
              />
            </SwipeableRow>
          ))
        )}
      </Section>

      {/* ── Investments by platform (read-only) ────── */}
      <Section
        icon={TrendingUp}
        label="Invested"
        total={show(state.snapshot.investmentsValue)}
        tint="var(--color-pastel-mint)"
        action={
          <Button asChild size="sm" variant="secondary" className="rounded-full">
            <Link href="/investments">Manage holdings</Link>
          </Button>
        }
      >
        {platforms.length === 0 ? (
          <EmptyRow text="No holdings yet." />
        ) : (
          platforms.map((p) => (
            <li key={p.platform} className="flex items-center gap-2 py-1.5">
              <span className="flex-1 truncate text-sm font-semibold">
                {p.platform}
              </span>
              <span className="px-1.5 text-sm font-bold tabular-nums">
                {show(p.value)}
              </span>
            </li>
          ))
        )}
      </Section>

      {/* ── CPF by sub-account (editable) ──────────── */}
      <Section
        icon={Landmark}
        label="CPF"
        total={show(totalCpf(state.snapshot))}
        tint="var(--color-pastel-coral)"
        action={
          <Button asChild size="sm" variant="secondary" className="rounded-full">
            <Link href="/cpf">Understand CPF</Link>
          </Button>
        }
      >
        {cpfRows.map((row) => (
          <li key={row.key} className="flex items-center gap-2 py-1.5">
            <span className="flex-1 text-sm font-semibold">{row.label}</span>
            <EditableAmount
              value={row.value}
              hidden={hidden}
              onSave={(n) => updateSnapshot({ cpf: { ...cpf, [row.key]: n } })}
            />
          </li>
        ))}
      </Section>
    </Card>
  );
}

/** Tap-to-edit money amount, for quick balance updates from the home page. */
function EditableAmount({
  value,
  hidden,
  onSave,
}: {
  value: number;
  hidden: boolean;
  onSave: (n: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const start = () => {
    setDraft(String(value));
    setEditing(true);
  };
  const commit = () => {
    const n = Number(draft);
    onSave(Number.isFinite(n) ? n : 0);
    setEditing(false);
  };

  if (hidden) {
    return (
      <span className="px-1.5 text-sm font-bold tabular-nums">••••</span>
    );
  }

  if (editing) {
    return (
      <span className="flex items-center">
        <span className="text-sm font-bold text-muted-foreground">$</span>
        <input
          autoFocus
          inputMode="decimal"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9.]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            else if (e.key === "Escape") setEditing(false);
          }}
          className="w-20 rounded-md border border-input bg-card px-1.5 py-0.5 text-right text-sm font-bold tabular-nums outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </span>
    );
  }

  return (
    <button
      onClick={start}
      aria-label="Edit amount"
      className="group/e flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-bold tabular-nums transition hover:bg-muted"
    >
      {formatSGD(value)}
      <Pencil className="size-3 text-muted-foreground opacity-50 transition group-hover/e:opacity-100" />
    </button>
  );
}

function Section({
  icon: Icon,
  label,
  total,
  tint,
  action,
  children,
}: {
  icon: LucideIcon;
  label: string;
  total: string;
  tint: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: tint }}
        >
          <Icon className="size-[18px] text-ink" />
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span className="flex-1 font-bold">{label}</span>
          <span className="font-extrabold tabular-nums">{total}</span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
      {open && (
        <div className="mt-2 pl-12">
          <ul className="flex flex-col">{children}</ul>
          {action && <div className="mt-2.5 flex justify-end">{action}</div>}
        </div>
      )}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <li className="py-2 text-sm text-muted-foreground">{text}</li>;
}

/**
 * A savings-account row whose delete control stays hidden until the user swipes
 * the row to the left — this keeps the destructive action out of easy reach so
 * it can't be tapped by accident. Tapping an opened row closes it again.
 */
function SwipeableRow({
  label,
  onDelete,
  children,
}: {
  label: string;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const REVEAL = 76;
  const [dx, setDx] = useState(0);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const horizontal = useRef(false);

  function onPointerDown(e: React.PointerEvent) {
    start.current = { x: e.clientX, y: e.clientY };
    horizontal.current = false;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!start.current) return;
    const dX = e.clientX - start.current.x;
    const dY = e.clientY - start.current.y;
    if (!horizontal.current && Math.abs(dX) > Math.abs(dY) && Math.abs(dX) > 6) {
      horizontal.current = true;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (!horizontal.current) return;
    const base = open ? -REVEAL : 0;
    setDx(Math.max(-REVEAL, Math.min(0, base + dX)));
  }
  function onPointerUp() {
    start.current = null;
    setDragging(false);
    if (!horizontal.current) return;
    const shouldOpen = dx < -REVEAL / 2;
    setOpen(shouldOpen);
    setDx(shouldOpen ? -REVEAL : 0);
  }

  return (
    <li className="relative overflow-hidden">
      {/* Hidden delete — only reachable once the row is swiped open */}
      <button
        onClick={onDelete}
        aria-label={`Remove ${label}`}
        tabIndex={open ? 0 : -1}
        className="absolute inset-y-0 right-0 flex w-[76px] items-center justify-center rounded-r-md bg-destructive text-destructive-foreground"
      >
        <Trash2 className="size-4" />
      </button>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (open) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
            setDx(0);
          }
        }}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dragging ? "none" : "transform 0.2s ease-out",
        }}
        className="relative flex touch-pan-y items-center gap-2 bg-card py-1.5"
      >
        {children}
      </div>
    </li>
  );
}
