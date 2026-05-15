"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { TrendingDown, TrendingUp, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/app/utils/format-rupiah";
import { ConfirmDialog } from "@/app/components/shared/confirm-dialog";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Transaction = {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string | null;
  createdAt: Date;
};

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/transactions?id=${deleteId}`);
      toast.success("Transaction deleted");
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-2xl border bg-background/70 backdrop-blur-sm p-4 transition-all hover:shadow-md"
          >
            {/* Left: icon + info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={cn(
                  "size-10 rounded-2xl flex items-center justify-center shrink-0",
                  transaction.type === "income"
                    ? "bg-emerald-500/10"
                    : "bg-destructive/10"
                )}
              >
                {transaction.type === "income" ? (
                  <TrendingUp className="size-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="size-4 text-destructive" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{transaction.category}</h3>
                {transaction.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {transaction.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right: amount + action menu */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <div className="text-right mr-1">
                <p
                  className={cn(
                    "font-semibold text-sm whitespace-nowrap",
                    transaction.type === "income"
                      ? "text-emerald-500"
                      : "text-destructive"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatRupiah(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {transaction.type}
                </p>
              </div>

              {/* Action menu — always visible (no hover-only on mobile) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-xl shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    aria-label="Transaction actions"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={4}
                  className="rounded-2xl min-w-[140px]"
                >
                  <DropdownMenuItem
                    className="gap-2 rounded-xl cursor-pointer h-10"
                    onClick={() => setEditTarget(transaction)}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 rounded-xl cursor-pointer h-10 text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => setDeleteId(transaction.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Transaction"
        description="This action cannot be undone. The transaction will be permanently removed."
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Edit dialog */}
      {editTarget && (
        <EditTransactionDialog
          transaction={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        />
      )}
    </>
  );
}
