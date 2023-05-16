import { FC, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import NoteModal from "../note.modal";
import UpdateNote from "./update.note";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import { INote } from "../../redux/types";
import { useDeleteNoteMutation } from "../../redux/noteAPI";

type NoteItemProps = {
  note: INote;
};

const NoteItem: FC<NoteItemProps> = ({ note }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const [deleteNote, { isLoading, isError, error, isSuccess }] =
    useDeleteNoteMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpenNoteModal(false);
      toast.warning("Note deleted successfully");
      NProgress.done();
    }

    if (isError) {
      setOpenNoteModal(false);
      const err = error as any;
      const resMessage =
        err.data.message || err.data.detail || err.message || err.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
      NProgress.done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${note.id}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [note.id]);

  const onDeleteHandler = (noteId: string) => {
    if (window.confirm("Are you sure")) {
      deleteNote(noteId);
    }
  };
  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden">
        <div className="details">
          <h4 className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
            {note.title.length > 40
              ? note.title.substring(0, 40) + "..."
              : note.title}
          </h4>
          <p className="mb-3 font-normal text-ct-dark-200">
            {note.content.length > 210
              ? note.content.substring(0, 210) + "..."
              : note.content}
          </p>
        </div>
        <div className="relative border-t border-slate-300 flex justify-between items-center">
          <span className="text-ct-dark-100 text-sm">
            {format(parseISO(String(note.createdAt)), "PPP")}
          </span>
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="text-ct-dark-100 text-lg cursor-pointer"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id={`settings-dropdown-${note.id}`}
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenNoteModal(true);
                }}
                className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-pencil"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(note.id);
                }}
                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
      >
        <UpdateNote note={note} setOpenNoteModal={setOpenNoteModal} />
      </NoteModal>
    </>
  );
};

export default NoteItem;
