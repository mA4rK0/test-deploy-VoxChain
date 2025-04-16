"use client";

import * as React from "react";
import { Check, ChevronDown, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Status = "all" | "completed" | "in progress";

interface StatusDropdownProps {
  onStatusChange?: (status: Status) => void;
  defaultStatus?: Status;
  className?: string;
}

export function FilterComponents({
  onStatusChange,
  defaultStatus = "all",
  className,
}: StatusDropdownProps) {
  const [status, setStatus] = React.useState<Status>(defaultStatus);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-full pl-2 pr-4 h-9 border-gray-200 flex gap-2 items-center",
            className
          )}
        >
          <span className="bg-gray-600 rounded-full p-1">
            <Menu className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-normal">{status}</span>
          <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleStatusChange("all")}>
            <span className="flex-1">All</span>
            {status === "all" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
            <span className="flex-1">Completed</span>
            {status === "completed" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("in progress")}>
            <span className="flex-1">In progress</span>
            {status === "in progress" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
