"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { GoalType } from "@/core/types";
import { useStore } from "@/core/data/store";
import { Button } from "@/components/ui/button";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOAL_OPTIONS } from "@/features/onboarding/data/options";

export function AddGoalDialog() {
  const { addGoal } = useStore();
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<GoalType>("emergency_fund");
  const [name, setName] = useState("");
  const [target, setTarget] = useState(0);
  const [current, setCurrent] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [deadline, setDeadline] = useState("");

  const valid = name.trim().length > 0 && target > 0;

  function reset() {
    setType("emergency_fund");
    setName("");
    setTarget(0);
    setCurrent(0);
    setMonthly(0);
    setDeadline("");
  }

  function submit() {
    if (!valid) return;
    addGoal({
      type,
      name: name.trim(),
      targetAmount: target,
      currentAmount: current,
      monthlyContribution: monthly,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> New goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a goal</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => {
                const gt = v as GoalType;
                setType(gt);
                if (!name) {
                  const found = GOAL_OPTIONS.find((o) => o.value === gt);
                  if (found) setName(found.label);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.emoji} {o.label}
                  </SelectItem>
                ))}
                <SelectItem value="custom">✨ Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Japan Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Target</Label>
              <MoneyInput value={target || ""} onValueChange={setTarget} placeholder="4,000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Saved so far</Label>
              <MoneyInput value={current || ""} onValueChange={setCurrent} placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Monthly</Label>
              <MoneyInput value={monthly || ""} onValueChange={setMonthly} placeholder="300" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Deadline (optional)</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <Button size="lg" disabled={!valid} onClick={submit}>
            Create goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
