import type { Product } from "@/_lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/old/_components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/web-ui/components/ui/accordion";
import { Button } from "@repo/web-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/web-ui/components/ui/dialog";
import { Input } from "@repo/web-ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/web-ui/components/ui/select";
import Image from "next/image";

const LaminateCard = ({
  product,
  token,
}: {
  readonly product: Product;
  readonly token: string;
}) => {

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Image
              src={product.groupImage}
              alt={product.groupImage}
              width={203}
              height={203}
            />
            <h5 className="font-medium">{product.groupName}</h5>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[52rem]">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex w-full gap-4 lg:w-60 lg:flex-col">
              <div>
                <Image
                  src="https://wurthlac.com/api/pim//Brand%20Logos/Greenlam.png"
                  alt=""
                  width={44}
                  height={44}
                />
                <h3 className="mt-2 text-xl font-bold">105 Feather Gray</h3>
                <p className="mb-2">$0.663 / SqFoot</p>
              </div>
              <div>
                <Image
                  src="https://wurthlac.com/api/pim/Product-Assets/Images/300x300/105-FeatherGray.jpg"
                  alt=""
                  width={240}
                  height={240}
                />
              </div>
              <div className="mt-2 text-sm text-wurth-gray-500">
                <strong>Note:</strong>
                <p className="mb-2">
                  Image color is for reference only. Actual colors may vary due
                  to monitor settings.
                </p>
                <p>To obtain a sample, please contact your local branch.</p>
              </div>
            </div>
            <div className="grow">
              <h4 className="text-lg font-semibold">Laminate details</h4>
              <p className="mb-2 text-wurth-gray-800">
                Please select a <strong>Grade</strong> and{" "}
                <strong>Finish</strong> to show items.
              </p>
              <div className="mb-4 flex gap-1">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Finish" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Size</TableHead>
                    <TableHead>Stock/EA</TableHead>
                    {/* <TableHead className="text-center">
                        Alt Branch
                        <br />
                        <span className="text-xs">(Stock)</span>
                      </TableHead> */}
                    <TableHead className="text-center">QTY</TableHead>
                    <TableHead className="text-right font-medium">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-40 text-nowrap">
                      96&quot; x 48&quot;
                    </TableCell>
                    <TableCell className="text-nowrap">
                      Home Branch:{" "}
                      <strong className="font-semibold">681</strong>
                      <br />
                      Alt Branch: <strong className="font-semibold">34</strong>
                      <br />
                    </TableCell>
                    {/* <TableCell className="text-center">23</TableCell> */}
                    <TableCell className="text-right">
                      <Input type="number" className="w-16" />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      $250.00
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-40 text-nowrap">
                      96&quot; x 48&quot;
                    </TableCell>
                    <TableCell className="text-nowrap">
                      Home Branch:{" "}
                      <strong className="font-semibold">681</strong>
                      <br />
                      Alt Branch: <strong className="font-semibold">34</strong>
                      <br />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input type="number" className="w-16" />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      $250.00
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex items-center gap-4 rounded bg-gray-50 p-4">
                <div className="grow">
                  <span className="text-wurth-gray-500">Total:</span>{" "}
                  <strong className="text-lg">$456.00</strong>
                </div>
                <Button>Add to cart</Button>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <h4 className="pb-2 text-xl font-semibold">Matching Edgebanding</h4>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  3D Edgebanding, Color 3D700R Brushed Aluminum, 2mm Thick 15/16
                  inch(need to get from api)
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaminateCard;
