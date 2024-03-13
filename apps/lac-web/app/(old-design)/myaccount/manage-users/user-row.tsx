import { Button } from "@/old/_components/ui/button";
import { TableCell, TableRow } from "@/old/_components/ui/table";
import { Role } from "@/old/_lib/types";
import { cn } from "@/old/_utils/helpers";
import { useState } from "react";
import {
  MdDeleteOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import ActionConfirmationDialog from "./action-confirmation-dialog";
import { Status, UserProfile } from "./types";
import useDeleteOtherUserMutation from "./use-delete-other-user-mutation.hook";
import UserUpdateForm from "./user-update-form";

type UserRowProps = {
  user: UserProfile;
  index: number;
  jobRoles: Role[];
};

const UserRow = ({ user, index, jobRoles }: UserRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenMessage, setIsOpenMessage] = useState(false);
  const [message, setMessage] = useState("");

  const deleteOtherUserMutation = useDeleteOtherUserMutation();

  const getStatusClass = (status: Status) => {
    switch (status) {
      case "ACTIVE":
        return "border-brand-tertiary text-brand-tertiary";

      case "DEACTIVE":
        return "border-brand-gray-400 text-brand-gray-200";

      case "PENDING":
        return "border-brand-secondary text-brand-secondary";

      default:
        return "border-brand-gray-400 text-brand-gray-400";
    }
  };

  return (
    <>
      <TableRow
        key={user?.uuid}
        className={index % 2 === 0 ? "bg-white" : "bg-brand-gray-100"}
      >
        <TableCell>{user?.email}</TableCell>

        <TableCell className="text-center capitalize">
          {user?.permission.toLowerCase()}
        </TableCell>

        <TableCell className="text-center">
          <div className="flex justify-center">
            <div
              className={cn(
                "py px w-[90px] rounded-sm border font-bold capitalize",
                getStatusClass(user?.status),
              )}
            >
              {user?.status?.toLowerCase()}
            </div>
          </div>
        </TableCell>

        <TableCell className="text-right">
          <div className="flex justify-end">
            <div className="cursor-pointer px-3 text-brand-gray-500">
              <MdDeleteOutline
                className="self-center text-2xl leading-none"
                onClick={() => setIsOpenDelete(true)}
              />
            </div>
            <Button
              className="flex h-6 min-w-20 flex-row items-center justify-center gap-0.5 bg-brand-secondary px-2 font-wurth text-base leading-6 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {!isOpen ? (
                <>
                  Open
                  <MdKeyboardArrowDown className="text-xl leading-none" />
                </>
              ) : (
                <>
                  Close
                  <MdKeyboardArrowUp className="text-xl leading-none" />
                </>
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow>
          <TableCell colSpan={4}>
            <UserUpdateForm
              jobRoles={jobRoles}
              user={user}
              setMessage={setMessage}
              setMessageOpen={setIsOpenMessage}
            />
          </TableCell>
        </TableRow>
      )}

      <ActionConfirmationDialog
        open={isOpenDelete}
        onOpenChange={setIsOpenDelete}
        title="Confirm Action"
        text="Do you really want to delete these records?"
        onConfirm={() => deleteOtherUserMutation.mutate(user?.signed_data)}
        okText="Confirm"
      />

      <ActionConfirmationDialog
        open={isOpenMessage}
        onOpenChange={setIsOpenMessage}
        title="Manage User"
        text={message}
        textColor="primary"
        onConfirm={() => setIsOpenMessage(false)}
        showCancelBtn={false}
      />
    </>
  );
};

export default UserRow;
