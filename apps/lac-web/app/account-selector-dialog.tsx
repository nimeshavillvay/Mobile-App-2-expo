"use client";

import FullscreenLoading from "@/_components/fullscreen-loading";
import { Checkbox } from "@/_components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Label } from "@/_components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/_components/ui/radio-group";
import useAccountList from "@/_hooks/account/use-account-list.hook";
import useAccountNo from "@/_hooks/account/use-account-no.hook";
import useAccountSelectorDialog from "@/_hooks/account/use-account-selector-dialog.hook";
import useAddressId from "@/_hooks/account/use-address-id.hook";
import useCookies from "@/_hooks/storage/use-cookies.hook";
import { selectAccount } from "@/_lib/shared-apis";
import * as Accordion from "@radix-ui/react-accordion";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";

const AccountSelectorDialog = () => {
  const id = useId();
  const rememberId = `remember-${id}`;

  const open = useAccountSelectorDialog((state) => state.open);
  const setOpen = useAccountSelectorDialog((state) => state.setOpen);

  const [cookies, setCookies] = useCookies();
  const accountListQuery = useAccountList();
  const [localAccountNo, setLocalAccountNo] = useAccountNo();
  const [localAddressId, setLocalAddressId] = useAddressId();
  const [accountNo, setAccountNo] = useState(localAccountNo);
  const [addressId, setAddressId] = useState(localAddressId);

  const accountSelectMutation = useMutation({
    mutationFn: ({
      accountNo,
      shipTo,
    }: {
      accountNo: string;
      shipTo: string;
    }) => selectAccount(cookies.token, accountNo, shipTo),
    onSuccess: (data, { accountNo, shipTo }) => {
      setCookies("account-token", data.token);
      setLocalAccountNo(accountNo);
      setLocalAddressId(shipTo);
      setOpen(false);
    },
  });

  const onAccountNoChange = (accountNo: string) => {
    const account = accountListQuery.data?.accounts.find(
      (account) => account["account-no"] === accountNo,
    );

    if (account) {
      setAccountNo(accountNo);

      // If the account has only 1 address select it automatically
      if (
        account.addresses.length === 1 &&
        account.addresses[0]?.["address-id"]
      ) {
        setAddressId(account.addresses[0]["address-id"]);
      } else {
        setAddressId("");
      }
    }
  };

  useEffect(() => {
    // Used to sync the state with localstorage when the dialog opens
    setAccountNo(localAccountNo);
    setAddressId(localAddressId);
  }, [localAccountNo, localAddressId]);

  useEffect(() => {
    // Open dialog if there is an auth token but no account token
    if (cookies.token && !cookies["account-token"]) {
      setOpen(true);
    }
  }, [cookies, setOpen]);

  if ((accountListQuery.isLoading || accountSelectMutation.isPending) && open) {
    return <FullscreenLoading />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[360px]"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        hideClose
      >
        <DialogHeader>
          <DialogTitle>Account & Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-8 pb-7">
          <DialogDescription>
            Choose your account and shipping address
          </DialogDescription>

          <DialogDescription>Access My Account</DialogDescription>

          <RadioGroup
            value={accountNo}
            onValueChange={onAccountNoChange}
            asChild
          >
            <Accordion.Root type="single" value={accountNo}>
              {accountListQuery.data?.accounts.map((account) => (
                <Accordion.Item
                  key={account["account-no"]}
                  value={account["account-no"]}
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex cursor-default flex-row items-start gap-1 py-3">
                      <RadioGroupItem
                        value={account["account-no"]}
                        id={`account-${account["account-no"]}`}
                      />

                      <div className="flex flex-col items-start gap-2">
                        <Label
                          htmlFor={`account-${account["account-no"]}`}
                          className="text-brand-very-dark-gray text-[15px] font-bold leading-5"
                        >
                          {account.name} # {account["account-no"]}
                        </Label>

                        {account.addresses.length > 1 && (
                          <div className="text-brand-very-dark-gray text-[15px] leading-5">
                            Multiple shipping addresses
                          </div>
                        )}
                      </div>
                    </Accordion.Trigger>
                  </Accordion.Header>

                  {account.addresses.length > 1 && (
                    <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-brand-very-light-gray overflow-hidden text-sm transition-all">
                      <RadioGroup
                        value={addressId}
                        onValueChange={setAddressId}
                      >
                        {account.addresses.map((address) => (
                          <div
                            key={address["address-id"]}
                            className="grid grid-cols-[auto,1fr] gap-x-1 py-3 pl-5"
                          >
                            <div className="text-brand-very-dark-gray col-start-2 text-[15px] font-bold leading-5">
                              # {address["address-id"]}
                            </div>

                            <RadioGroupItem
                              value={address["address-id"]}
                              id={`address-${address["address-id"]}`}
                            />

                            <Label
                              htmlFor={`address-${address["address-id"]}`}
                              className="text-[15px] leading-5"
                            >
                              {address.name}, {address.locality},{" "}
                              {address.region}, {address["postal-code"]},{" "}
                              {address["country-name"]}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </Accordion.Content>
                  )}
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </RadioGroup>

          <div className="flex flex-row items-center gap-1">
            <Checkbox id={rememberId} />

            <Label htmlFor={rememberId}>Remember My Setting</Label>
          </div>

          <button
            className="bg-brand-primary block h-9 w-full rounded-[3px] px-4 text-base font-normal uppercase text-white"
            onClick={() =>
              accountSelectMutation.mutate({ accountNo, shipTo: addressId })
            }
            disabled={!accountNo || !addressId}
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSelectorDialog;
