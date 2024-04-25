"use client";

import useSuspenseCart from "@/_hooks/cart/use-suspense-cart.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/web-ui/components/ui/input";
import { Label } from "@repo/web-ui/components/ui/label";
import { useToast } from "@repo/web-ui/components/ui/toast";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useUpdateCartConfigMutation from "./use-update-cart-config-mutation.hook";

const detailsSchema = z.object({
  po: z.string(),
  projectName: z.string().optional(),
});

const CartDetails = () => {
  const id = useId();
  const poId = `po-${id}`;
  const projectNameId = `project-name-${id}`;

  const { toast } = useToast();
  const { data } = useSuspenseCart();

  const { register, getValues } = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    values: {
      po: data.configuration.po ?? "",
      projectName: data.configuration.jobName ?? "",
    },
  });

  const updateCartConfigMutation = useUpdateCartConfigMutation();

  const handleSave = () => {
    const data = getValues();

    updateCartConfigMutation.mutate(
      {
        po: data.po,
        jobName: data.projectName ?? "",
      },
      {
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update cart details",
          });
        },
      },
    );
  };

  return (
    <div className="px-5 py-4 border border-wurth-gray-150 rounded-lg shadow-md space-y-3">
      <div className="space-y-2">
        <Label htmlFor={poId}>PO Number (Required)</Label>

        <Input
          {...register("po", { onBlur: handleSave })}
          id={poId}
          type="text"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={projectNameId}>Project Name</Label>

        <Input
          {...register("projectName", { onBlur: handleSave })}
          id={projectNameId}
          type="text"
        />
      </div>
    </div>
  );
};

export default CartDetails;
