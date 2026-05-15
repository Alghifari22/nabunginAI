"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/app/components/shared/confirm-dialog";
import { EditGoalDialog } from "./edit-goal-dialog";

interface GoalForActions {
  id: string;
  title: string;
  targetAmount: number;
  dailyTarget: number;
}

export function GoalCardActions({ goal }: { goal: GoalForActions }) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/goals?id=${goal.id}`);
      toast.success("Goal deleted");
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to delete goal");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 rounded-xl">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-2xl">
          <DropdownMenuItem
            className="gap-2 rounded-xl cursor-pointer"
            onClick={() => setShowEdit(true)}
          >
            <Pencil className="size-4" />
            Edit Goal
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 rounded-xl cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="size-4" />
            Delete Goal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Goal"
        description={`Delete "${goal.title}"? All savings history for this goal will also be removed. This cannot be undone.`}
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
      />

      <EditGoalDialog
        goal={goal}
        open={showEdit}
        onOpenChange={setShowEdit}
      />
    </>
  );
}
