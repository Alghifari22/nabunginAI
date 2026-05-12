"use client";

import axios from "axios";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

type AddSavingFormProps = {
  goalId: string;
};

export function AddSavingForm({
  goalId,
}: AddSavingFormProps) {
  const router = useRouter();

  const [amount, setAmount] = useState("");

  const [loading, setLoading] =
    useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(
        `/api/goals/${goalId}/saving`,
        {
          amount: Number(amount),
        }
      );

      toast.success("Saving added");

      setAmount("");

      router.refresh();
    } catch {
      toast.error("Failed to add saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="number"
        placeholder="Add saving amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full"
      >
        Add Saving
      </Button>
    </div>
  );
}