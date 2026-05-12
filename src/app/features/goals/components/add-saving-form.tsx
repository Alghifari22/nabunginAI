"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import { toast } from "sonner";

type AddSavingFormProps = {
  goalId: string;
};

export function AddSavingForm({ goalId }: AddSavingFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    const parsed = Number(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axios.post(`/api/goals/${goalId}/saving`, { amount: parsed });
      toast.success("Saving added successfully!");
      setAmount("");
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const message = axiosError.response?.data?.error;
      toast.error(message || "Failed to add saving. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Input
          type="number"
          min="0"
          placeholder="Enter saving amount (Rp)"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (error) setError("");
          }}
          disabled={isLoading}
          className="h-11"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <LoadingButton
        onClick={onSubmit}
        disabled={!amount}
        loading={isLoading}
        loadingText="Adding..."
        className="w-full"
      >
        Add Saving
      </LoadingButton>
    </div>
  );
}