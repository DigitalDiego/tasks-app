import React, { useState, useEffect } from "react";
import { supabase } from "./utils";
import { ITask } from "./types";
import { BsFillTrash2Fill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState<Array<ITask> | null>(null);
  const [selected, setSelected] = useState(0);

  const getTasks = async () => {
    const { data, error } = await supabase.from("task").select("*");
    try {
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error }: any = await supabase
      .from("task")
      .insert({
        title: title,
        content: content,
      })
      .then(() => {
        window.location.reload();
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  const handleSelected = (id: number) => {
    if (selected === id) {
      setSelected(0);
    } else {
      setSelected(id);
    }
  };
  const deleteTask = async (id: number) => {
    await supabase
      .from("task")
      .delete()
      .match({ id: id })
      .then(() => {
        window.location.reload();
      });
  };
  return (
    <div className="w-full h-screen flex bg-[#202020] text-white">
      <div className="w-1/2 h-screen grid place-items-center">
        <form
          className="w-4/5 bg-[#303030] rounded-lg p-4 flex justify-center items-center flex-col gap-4"
          onSubmit={createTask}
        >
          <input
            className="w-full bg-[#404040] px-4 py-2 rounded-lg border-none outline-none"
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <textarea
            className="w-full h-[200px] rounded-lg bg-[#404040] px-4 py-2 resize-none border-none outline-none"
            placeholder="Description"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>
          <button
            className="w-full px-4 py-2 bg-teal-500 border-none outline-none rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={
              title.replace(/\s/g, "").length === 0 ||
              content.replace(/\s/g, "").length === 0
            }
          >
            Create Task
          </button>
        </form>
      </div>
      <div className="w-1/2 h-screen flex justify-start items-center flex-col gap-4 p-4 overflow-y-scroll scrollbar scrollbar-track scrollbar-thumb">
        {tasks?.map((task) => (
          <div
            className={cn(
              "bg-[#303030] rounded-lg w-4/5 overflow-hidden duration-[.8s]",
              selected === task?.id ? "h-auto" : "h-[10vh]"
            )}
            key={task?.id}
          >
            <div className="w-full flex justify-between items-center h-[10vh] px-4">
              <p>{task?.title}</p>
              <div className="flex items-center gap-[10px]">
                <button
                  className="p-2 bg-rose-500 text-whte rounded-lg"
                  onClick={() => deleteTask(task?.id)}
                >
                  <BsFillTrash2Fill />
                </button>
                <button
                  className="p-2 bg-emerald-500 text-whte rounded-lg"
                  onClick={() => handleSelected(task?.id)}
                >
                  {selected === task?.id ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full p-4 flex justify-start items-start">
              <p>{task?.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
