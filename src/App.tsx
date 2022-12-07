import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import NoteModal from "./components/note.modal";
import CreateNote from "./components/notes/create.note";
import NoteItem from "./components/notes/note.component";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useGetAllNotesQuery } from "./redux/noteAPI";

function AppContent() {
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    data: notes,
  } = useGetAllNotesQuery(
    { page: 1, limit: 10 },
    { refetchOnFocus: true, refetchOnReconnect: true }
  );

  const loading = isLoading || isFetching;

  useEffect(() => {
    if (isSuccess) {
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
  }, [loading]);

  return (
    <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
      <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
        <div className="p-4 min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
          <div
            onClick={() => setOpenNoteModal(true)}
            className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-ct-blue-600 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenNoteModal(true)}
            className="text-lg font-medium text-ct-blue-600 mt-5 cursor-pointer"
          >
            Add new note
          </h4>
        </div>
        {/* Note Items */}

        {notes?.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}

        {/* Create Note Modal */}
        <NoteModal
          openNoteModal={openNoteModal}
          setOpenNoteModal={setOpenNoteModal}
        >
          <CreateNote setOpenNoteModal={setOpenNoteModal} />
        </NoteModal>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <AppContent />
        <ToastContainer />
      </Provider>
    </>
  );
}

export default App;
