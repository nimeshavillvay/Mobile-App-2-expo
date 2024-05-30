import type {
  CartItemConfiguration,
  Plant,
  ShippingMethod,
} from "@/_lib/types";
import { cn } from "@/_lib/utils";
import { ChevronDown } from "@repo/web-ui/components/icons/chevron-down";
import { Button } from "@repo/web-ui/components/ui/button";
import { Checkbox } from "@repo/web-ui/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/web-ui/components/ui/collapsible";
import { Label } from "@repo/web-ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/web-ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/web-ui/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/web-ui/components/ui/table";
import dayjs from "dayjs";
import { useId } from "react";
import {
  ALTERNATIVE_BRANCHES,
  AVAILABLE_ALL,
  BACK_ORDER_ALL,
  EMPTY_STRING,
  IN_STOCK,
  LIMITED_STOCK,
  MAIN_OPTIONS,
  NOT_IN_STOCK,
  TAKE_ON_HAND,
} from "../constants";
import type { Availability } from "../types";
import {
  createCartItemConfig,
  findAvailabilityOptionForType,
  getAlternativeBranchesConfig,
} from "./helpers";
import PlantName from "./plant-name";
import type { MainOption, OptionPlant, ShipToMeOption } from "./types";

const UI_DATE_FORMAT = "ddd, MMM. DD YYYY";

// Vendor Direct Shipping Method
const VENDOR_DIRECT_CODE = "D";

export type CartItemShippingMethodProps = {
  readonly plants: Plant[];
  readonly availability: Availability;
  readonly setSelectedWillCallPlant: (plant: string) => void;
  readonly selectedWillCallPlant: string;
  readonly setSelectedShippingOption: (option: MainOption | undefined) => void;
  readonly selectedShippingOption: MainOption | undefined;
  readonly setSelectedShipToMe: (shipToMe: ShipToMeOption) => void;
  readonly selectedShipToMe: ShipToMeOption;
  readonly setSelectedShippingMethod: (method: string) => void;
  readonly selectedShippingMethod: string;
  readonly onSave: (config: Partial<CartItemConfiguration>) => void;
  readonly defaultShippingMethod: ShippingMethod | undefined;
  readonly shippingMethods: ShippingMethod[];
};

const CartItemShippingMethod = ({
  plants,
  availability,
  setSelectedWillCallPlant,
  selectedWillCallPlant,
  setSelectedShippingOption,
  selectedShippingOption,
  setSelectedShipToMe,
  selectedShipToMe,
  setSelectedShippingMethod,
  selectedShippingMethod,
  onSave,
  defaultShippingMethod,
  shippingMethods,
}: CartItemShippingMethodProps) => {
  const id = useId();
  const shipToMeId = `${MAIN_OPTIONS.SHIP_TO_ME}-${id}`;
  const willCallId = `${MAIN_OPTIONS.WILL_CALL}-${id}`;
  const backOrderId = `${MAIN_OPTIONS.BACK_ORDER}-${id}`;

  const {
    options: availabilityOptions,
    status,
    willCallAnywhere,
  } = availability;

  const availableAll = findAvailabilityOptionForType(
    availabilityOptions,
    AVAILABLE_ALL,
  );
  const takeOnHand = findAvailabilityOptionForType(
    availabilityOptions,
    TAKE_ON_HAND,
  );
  const backOrderAll = findAvailabilityOptionForType(
    availabilityOptions,
    BACK_ORDER_ALL,
  );
  const shipAlternativeBranch = findAvailabilityOptionForType(
    availabilityOptions,
    ALTERNATIVE_BRANCHES,
  );

  const calculateAllPlantsQuantity = (
    plants: {
      quantity?: number;
    }[],
  ) => {
    // Get all the values of the plants
    const plantValues = Object.values(plants);

    // Calculate the total quantity
    return plantValues.reduce((acc, plant) => acc + (plant.quantity ?? 0), 0);
  };

  const isVendorShipped = !!availableAll?.plants
    ?.at(0)
    ?.shippingMethods?.find((method) => method.code === VENDOR_DIRECT_CODE);

  const isSameDayShippingEnabled =
    !!availableAll?.plants?.find((value) => value?.isSameDayAvail)
      ?.isSameDayAvail ?? false;

  // Ship to me logics
  const isShipToMeEnabled = status === IN_STOCK || status === LIMITED_STOCK;

  let availableAllPlant: OptionPlant | undefined = undefined;
  let takeOnHandPlant: OptionPlant | undefined = undefined;

  if (availableAll) {
    // Find available plant details within plants object
    availableAllPlant = Object.values(availableAll?.plants)?.at(0) ?? undefined;
  }

  if (takeOnHand) {
    // Find take on hand plant details within plants object
    takeOnHandPlant = Object.values(takeOnHand?.plants)?.at(0) ?? undefined;
  }

  // Back Order all logics
  const isBackOrderAllEnabled = !!backOrderAll;

  const getFirstBackOrderDateFromPlants = (
    plants: {
      backOrderDate?: string;
    }[],
  ) => {
    return plants?.at(0)?.backOrderDate;
  };

  const getFirstPlantFromPlants = (
    plants: {
      plant: string;
    }[],
  ) => {
    return plants?.at(0)?.plant ?? "";
  };

  const getFirstShippingCodeFromShippingMethod = (
    plants: {
      shippingMethods: ShippingMethod[];
    }[],
  ) => {
    const shippingMethods = plants?.at(0)?.shippingMethods ?? [];
    // Get the first method available
    return shippingMethods?.at(0)?.code ?? "";
  };

  const handleDeliveryOptionSelect = ({
    checked,
    selectedOption,
  }: {
    checked: boolean;
    selectedOption: MainOption;
  }) => {
    if (checked) {
      setSelectedShippingOption(selectedOption);
      // Ship to me configs
      if (selectedOption === MAIN_OPTIONS.SHIP_TO_ME) {
        if (availableAll) {
          onSave(
            createCartItemConfig({
              method: selectedShippingMethod,
              quantity: availableAllPlant?.quantity ?? 0,
              plant: availableAllPlant?.plant ?? EMPTY_STRING,
              hash: availableAll.hash,
            }),
          );
        } else if (takeOnHand) {
          onSave(
            createCartItemConfig({
              method: selectedShippingMethod,
              quantity: takeOnHandPlant?.quantity ?? 0,
              plant: takeOnHandPlant?.plant ?? EMPTY_STRING,
              hash: takeOnHand.hash,
            }),
          );
        } else if (shipAlternativeBranch) {
          onSave(
            getAlternativeBranchesConfig({
              plants: shipAlternativeBranch.plants,
              method: selectedShippingMethod,
              hash: shipAlternativeBranch.hash,
            }),
          );
        }
      }
      // Will call pickup configs
      if (selectedOption === MAIN_OPTIONS.WILL_CALL && willCallAnywhere) {
        onSave({
          ...createCartItemConfig({
            method: EMPTY_STRING,
            quantity: 0,
            plant: EMPTY_STRING,
            hash: willCallAnywhere.hash,
          }),
          will_call_avail: (willCallAnywhere?.status === NOT_IN_STOCK
            ? 0
            : willCallAnywhere?.willCallQuantity ?? 0
          ).toString(),
          will_call_plant: willCallAnywhere?.willCallPlant ?? EMPTY_STRING,
        });
      }
      // Back order all can have only this config
      if (selectedOption === MAIN_OPTIONS.BACK_ORDER && backOrderAll) {
        onSave(
          createCartItemConfig({
            method: getFirstShippingCodeFromShippingMethod(
              backOrderAll?.plants,
            ),
            quantity: 0,
            plant: getFirstPlantFromPlants(backOrderAll?.plants),
            hash: backOrderAll.hash,
            backOrderAll: true,
          }),
        );
      }
    } else {
      setSelectedShippingOption(undefined);
    }
  };

  const handleShipToMeMethod = (shippingMethod: string) => {
    setSelectedShippingMethod(shippingMethod);

    if (shippingMethod) {
      switch (selectedShipToMe) {
        case AVAILABLE_ALL:
          onSave(
            createCartItemConfig({
              method: shippingMethod,
              quantity: availableAllPlant?.quantity ?? 0,
              plant: availableAllPlant?.plant ?? EMPTY_STRING,
              hash: availableAll?.hash ?? "",
            }),
          );
          break;
        case TAKE_ON_HAND:
          onSave(
            createCartItemConfig({
              method: shippingMethod,
              quantity: takeOnHandPlant?.quantity ?? 0,
              plant: takeOnHandPlant?.plant ?? EMPTY_STRING,
              hash: takeOnHand?.hash ?? "",
            }),
          );
          break;
        case ALTERNATIVE_BRANCHES:
          if (shipAlternativeBranch) {
            onSave(
              getAlternativeBranchesConfig({
                plants: shipAlternativeBranch.plants,
                method: shippingMethod,
                hash: shipAlternativeBranch.hash,
              }),
            );
          }
          break;
      }
    }
  };

  const handleShipToMeOptions = (shipToMe: ShipToMeOption) => {
    setSelectedShipToMe(shipToMe);
    // Reset the selected shipping method to default
    if (defaultShippingMethod) {
      setSelectedShippingMethod(defaultShippingMethod.code);

      if (shipToMe === TAKE_ON_HAND && takeOnHand) {
        onSave(
          createCartItemConfig({
            method: defaultShippingMethod.code,
            quantity: takeOnHandPlant?.quantity ?? 0,
            plant: takeOnHandPlant?.plant ?? EMPTY_STRING,
            hash: takeOnHand.hash,
          }),
        );
      }

      if (shipToMe === ALTERNATIVE_BRANCHES && shipAlternativeBranch) {
        onSave(
          getAlternativeBranchesConfig({
            plants: shipAlternativeBranch?.plants,
            method: defaultShippingMethod.code,
            hash: shipAlternativeBranch.hash,
          }),
        );
      }
    }
  };

  return (
    <ul className="flex flex-col gap-3">
      {isVendorShipped && (
        <li className="text-sm text-wurth-gray-500">
          This item is shipped by the vender
        </li>
      )}

      {isShipToMeEnabled && (
        <li className="flex flex-col items-stretch gap-2">
          <div className="flex flex-row items-center gap-3">
            <Checkbox
              id={shipToMeId}
              className="size-5 rounded-full"
              iconClassName="size-4"
              checked={selectedShippingOption === MAIN_OPTIONS.SHIP_TO_ME}
              onCheckedChange={(checked) =>
                handleDeliveryOptionSelect({
                  checked: checked === true,
                  selectedOption: MAIN_OPTIONS.SHIP_TO_ME,
                })
              }
            />

            <Label htmlFor={shipToMeId} className="text-base">
              Ship to me
            </Label>
          </div>

          <div className="ml-[1.625rem] flex flex-col gap-2">
            {shippingMethods?.length > 0 && (
              <Select
                disabled={
                  selectedShippingOption !== MAIN_OPTIONS.SHIP_TO_ME ||
                  shippingMethods?.length <= 1
                }
                value={selectedShippingMethod}
                onValueChange={(method) => handleShipToMeMethod(method)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a delivery method" />
                </SelectTrigger>

                <SelectContent>
                  {shippingMethods.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isSameDayShippingEnabled && (
              <div className="text-sm">
                Get it by <b>today</b> if you order before noon
              </div>
            )}

            {selectedShippingOption === MAIN_OPTIONS.SHIP_TO_ME && (
              <RadioGroup
                value={selectedShipToMe}
                onValueChange={(value) =>
                  handleShipToMeOptions(value as ShipToMeOption)
                }
              >
                {/* All available option */}
                {availableAll && (
                  <div className="flex flex-row gap-2 rounded-lg border border-wurth-gray-150 px-2 py-2 text-sm shadow-sm">
                    <div className="w-4">
                      <RadioGroupItem
                        value={AVAILABLE_ALL}
                        id={AVAILABLE_ALL}
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="font-medium">
                        {availableAllPlant?.quantity && (
                          <ItemCountBadge count={availableAllPlant.quantity} />
                        )}
                        &nbsp;from&nbsp;
                        <PlantName
                          plants={plants}
                          plantCode={availableAllPlant?.plant}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Take on hand option */}
                {takeOnHand && (
                  <div className="flex flex-row gap-2 rounded-lg border border-wurth-gray-150 px-2 py-2 text-sm shadow-sm">
                    <div className="w-4">
                      <RadioGroupItem value={TAKE_ON_HAND} id={TAKE_ON_HAND} />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="font-medium">
                        {takeOnHandPlant?.quantity && (
                          <ItemCountBadge count={takeOnHandPlant.quantity} />
                        )}
                        &nbsp;from&nbsp;
                        <PlantName
                          plants={plants}
                          plantCode={takeOnHandPlant?.plant}
                        />
                      </div>

                      {takeOnHand.backOrder && (
                        <BackOrderItemCountLabel
                          count={takeOnHandPlant?.backOrderQuantity ?? 0}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Ship from alternative branches option */}
                {shipAlternativeBranch && (
                  <div className="flex flex-row gap-2 rounded-lg border border-wurth-gray-150 px-2 py-2 text-sm shadow-sm">
                    <div className="w-4">
                      <RadioGroupItem
                        value={ALTERNATIVE_BRANCHES}
                        id={ALTERNATIVE_BRANCHES}
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="text-wrap font-medium">
                        {shipAlternativeBranch.plants?.length > 0 && (
                          <ItemCountBadge
                            count={calculateAllPlantsQuantity(
                              shipAlternativeBranch.plants,
                            )}
                          />
                        )}
                        &nbsp;from&nbsp;
                        <PlantName
                          plants={plants}
                          plantCode={shipAlternativeBranch.plants?.at(0)?.plant}
                        />
                        &nbsp;and&nbsp;
                        <span className="font-normal">
                          other alternative branches
                        </span>
                      </div>

                      {shipAlternativeBranch.backOrder && (
                        <BackOrderItemCountLabel
                          count={
                            shipAlternativeBranch.plants?.at(0)
                              ?.backOrderQuantity ?? 0
                          }
                        />
                      )}

                      {selectedShipToMe === ALTERNATIVE_BRANCHES && (
                        <Collapsible
                          className="mt-1.5 flex flex-col gap-1"
                          disabled={selectedShipToMe !== ALTERNATIVE_BRANCHES}
                        >
                          <CollapsibleTrigger
                            className="group flex h-7 w-full flex-row items-center justify-start"
                            asChild
                          >
                            <Button
                              type="button"
                              variant="subtle"
                              className="gap-2 px-2"
                            >
                              <ChevronDown
                                width={16}
                                height={16}
                                className="transition duration-150 ease-out group-data-[state=open]:rotate-180"
                              />
                              <span>Show breakdown by branch</span>
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="font-light">
                                    Location
                                  </TableHead>
                                  <TableHead className="text-end font-light">
                                    Items
                                  </TableHead>
                                </TableRow>
                              </TableHeader>

                              <TableBody className="font-light">
                                {shipAlternativeBranch.plants &&
                                  Object.values(
                                    shipAlternativeBranch.plants,
                                  )?.map((plant) => (
                                    <TableRow key={plant.plant}>
                                      <TableCell>
                                        <div>
                                          <PlantName
                                            plants={plants}
                                            plantCode={plant.plant}
                                          />
                                        </div>
                                        <div className="text-xs">
                                          via&nbsp;
                                          {shippingMethods?.find(
                                            (option) =>
                                              option.code ===
                                              selectedShippingMethod,
                                          )?.name ??
                                            defaultShippingMethod?.name}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-end">
                                        {plant.quantity}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </div>
                )}

                {selectedShipToMe === TAKE_ON_HAND && (
                  <ShipToMeBOInfoBanner option={takeOnHand} />
                )}

                {selectedShipToMe === ALTERNATIVE_BRANCHES && (
                  <ShipToMeBOInfoBanner option={shipAlternativeBranch} />
                )}
              </RadioGroup>
            )}
          </div>
        </li>
      )}

      <li className="flex flex-col items-stretch gap-2">
        <div className="flex flex-row items-center gap-3">
          <Checkbox
            id={willCallId}
            className="size-5 rounded-full"
            iconClassName="size-4"
            checked={selectedShippingOption === MAIN_OPTIONS.WILL_CALL}
            onCheckedChange={(checked) =>
              handleDeliveryOptionSelect({
                checked: checked === true,
                selectedOption: MAIN_OPTIONS.WILL_CALL,
              })
            }
            disabled={false}
          />

          <Label htmlFor={willCallId} className="text-base">
            Store pick up (Will call)
          </Label>
        </div>

        {selectedShippingOption === MAIN_OPTIONS.WILL_CALL && (
          <div className="ml-[1.625rem] flex flex-col gap-2">
            <Select
              disabled={selectedShippingOption !== MAIN_OPTIONS.WILL_CALL}
              value={selectedWillCallPlant}
              onValueChange={(plant) => setSelectedWillCallPlant(plant)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>

              <SelectContent>
                {plants?.length > 0 &&
                  plants.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {willCallAnywhere && (
              <div className="flex flex-col gap-1">
                {willCallAnywhere.status === IN_STOCK && (
                  <div className="flex items-center text-sm">
                    <ItemCountBadge count={willCallAnywhere.willCallQuantity} />
                    &nbsp;<span className="font-medium">pick up at</span>
                    &nbsp;
                    <PlantName
                      plants={plants}
                      plantCode={willCallAnywhere.willCallPlant}
                    />
                  </div>
                )}

                {willCallAnywhere.status === LIMITED_STOCK && (
                  <>
                    <div className="flex items-center text-sm">
                      <ItemCountBadge
                        count={willCallAnywhere.willCallQuantity}
                      />
                      &nbsp;<span className="font-medium">pick up at</span>
                      &nbsp;
                      <PlantName
                        plants={plants}
                        plantCode={willCallAnywhere.willCallPlant}
                      />
                    </div>

                    {willCallAnywhere?.backOrder && (
                      <BackOrderItemCountLabel
                        count={willCallAnywhere.backOrderQuantity_1 ?? 0}
                      />
                    )}
                  </>
                )}

                {willCallAnywhere.status === NOT_IN_STOCK && (
                  <>
                    <div className="rounded bg-red-800/10 px-2 py-1 text-sm text-red-800">
                      This item is out of stock at&nbsp;
                      <PlantName
                        plants={plants}
                        plantCode={willCallAnywhere.willCallPlant}
                      />
                    </div>

                    <BackOrderItemCountLabel
                      count={willCallAnywhere.willCallQuantity}
                    />
                  </>
                )}
              </div>
            )}

            {willCallAnywhere?.backOrder && (
              <BackOrderInfoBanner
                date={willCallAnywhere?.backOrderDate_1 ?? ""}
              />
            )}

            {willCallAnywhere?.status === NOT_IN_STOCK && (
              <BackOrderInfoBanner
                date={willCallAnywhere?.willCallBackOrder ?? ""}
              />
            )}
          </div>
        )}
      </li>

      {isBackOrderAllEnabled && (
        <li className="flex flex-col items-stretch gap-2">
          <div className="flex flex-row items-center gap-3">
            <Checkbox
              id={backOrderId}
              className="size-5 rounded-full"
              iconClassName="size-4"
              checked={selectedShippingOption === MAIN_OPTIONS.BACK_ORDER}
              onCheckedChange={(checked) =>
                handleDeliveryOptionSelect({
                  checked: checked === true,
                  selectedOption: MAIN_OPTIONS.BACK_ORDER,
                })
              }
              disabled={!backOrderAll}
            />

            <Label htmlFor={backOrderId} className="text-base">
              Backorder everything
            </Label>
          </div>

          {selectedShippingOption === MAIN_OPTIONS.BACK_ORDER && (
            <div className="ml-[1.625rem]">
              <BackOrderInfoBanner
                date={
                  getFirstBackOrderDateFromPlants(backOrderAll?.plants) ?? "N/A"
                }
              />
            </div>
          )}
        </li>
      )}
    </ul>
  );
};

export default CartItemShippingMethod;

const ItemCountBadge = ({
  count = 0,
  className,
}: {
  readonly count: number;
  readonly className?: string;
}) => {
  return (
    <span
      className={cn(
        "rounded bg-green-700/10 px-1 font-medium text-green-700",
        className,
      )}
    >
      {count}&nbsp;{count > 1 ? "items" : "item"}
    </span>
  );
};

const BackOrderItemCountLabel = ({ count }: { readonly count: number }) => {
  return (
    <div className="text-sm font-medium">
      <span className="rounded bg-yellow-700/10 px-1 text-yellow-700">
        Backorder
      </span>
      &nbsp;{count}&nbsp;{count > 1 ? "items" : "item"}
    </div>
  );
};

const BackOrderInfoBanner = ({ date }: { readonly date: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-yellow-50 px-4 py-2 text-sm">
      <div>
        Backordered items are expected to ship by&nbsp;
        {date !== "" ? dayjs(date).format(UI_DATE_FORMAT) : "N/A"}.
      </div>
      <div className="text-xs text-wurth-gray-500">
        Delivery dates are subject to change without notice.
      </div>
    </div>
  );
};

const ShipToMeBOInfoBanner = ({
  option,
}: {
  readonly option:
    | {
        backOrder: boolean;
        plants: {
          backOrderDate?: string;
        }[];
      }
    | undefined;
}) => {
  if (option?.backOrder) {
    return (
      <BackOrderInfoBanner date={option?.plants?.at(0)?.backOrderDate ?? ""} />
    );
  }

  return null;
};
