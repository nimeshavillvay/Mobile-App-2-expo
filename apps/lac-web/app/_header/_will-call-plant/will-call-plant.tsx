"use client";

import useSuspenseCheckLogin from "@/_hooks/user/use-suspense-check-login.hook";
import type { Plant } from "@/_lib/types";
import { Map } from "@repo/web-ui/components/icons/map";
import { Phone } from "@repo/web-ui/components/icons/phone";
import { Shop } from "@repo/web-ui/components/icons/shop";
import { Timetable } from "@repo/web-ui/components/icons/timetable";
import { Button } from "@repo/web-ui/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/web-ui/components/ui/drawer";
import useSuspenseWillCallPlant from "./use-suspense-will-call-plant.hook";

type WillCallPlantProps = {
  token: string;
  plants: Plant[];
};

const WillCallPlantDrawer = ({ token, plants }: WillCallPlantProps) => {
  const willCallPlantQuery = useSuspenseWillCallPlant(token);
  const plant = willCallPlantQuery.data;

  // This is for cases where the Will Call Plant API doesn't return an address
  const backupPlant = plants.find((item) => item.code === plant.plant);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-fit flex-row items-center gap-2 p-0 text-black"
        >
          <Shop width={16} height={16} />

          <span>{`${backupPlant?.name}, ${backupPlant?.code}`}</span>
        </Button>
      </DrawerTrigger>

      {/* Don't show the drawer if no address data is returned */}
      {!!plant.address && (
        <DrawerContent>
          <div className="mx-auto w-full max-w-[26.75rem]">
            <DrawerHeader>
              <DrawerTitle>My Pickup Branch</DrawerTitle>

              <DrawerDescription className="sr-only">
                See details of your pickup branch.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-0">
              <div className="mb-4 mt-6 grid grid-cols-2 gap-4 text-sm font-medium text-wurth-gray-800">
                <div className="flex flex-row items-start gap-2">
                  <Map
                    width={20}
                    height={20}
                    className="mt-1 shrink-0 stroke-wurth-gray-800"
                  />

                  <div>
                    <div>{plant.address["street-address"]}</div>
                    <div>{plant.address.locality}</div>
                    <div>{`${plant.address.region} ${plant.address["postal-code"]}, ${plant.address["country-name"]}`}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <Phone
                      width={20}
                      height={20}
                      className="shrink-0 stroke-wurth-gray-800"
                    />

                    <span>{plant.address["phone-number"]}</span>
                  </div>

                  <div className="flex flex-row items-start gap-2">
                    <Timetable
                      width={20}
                      height={20}
                      className="shrink-0 stroke-wurth-gray-800"
                    />

                    <span>{plant.operation_hours}</span>
                  </div>
                </div>
              </div>
            </div>

            <DrawerFooter className="pb-9">
              <DrawerClose asChild>
                <Button>Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

const WillCallPlant = ({ token, ...delegated }: WillCallPlantProps) => {
  const checkLoginQuery = useSuspenseCheckLogin(token);

  if (checkLoginQuery.data.status_code === "NOT_LOGGED_IN") {
    return (
      <div className="flex flex-row items-center gap-2 text-black">
        <Shop width={16} height={16} />

        <span>Brea, CA</span>
      </div>
    );
  }

  return <WillCallPlantDrawer token={token} {...delegated} />;
};

export default WillCallPlant;
