import { useEffect, useRef, useState } from "react";
import { deleteTodo, TODO, updateTodo } from "./utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TodoItemProps = {
  todo: TODO;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const queryClient = useQueryClient();
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const handleDelete = async () => {
    try {
      await deleteTodoMutation.mutateAsync(todo.id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Local state for optimistic UI updates
  const [isFinished, setIsFinished] = useState(todo.finished);

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleToggleChecked = async () => {
    if (isEditing) return;
    const newFinishedState = !isFinished;
    setIsFinished(newFinishedState); // Optimistically update UI

    try {
      await updateTodoMutation.mutateAsync({
        ...todo,
        finished: newFinishedState,
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      setIsFinished(todo.finished); // Revert optimistic UI update
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const handleEdit = () => {
    setIsEditing((v) => !v);
  };
  useEffect(() => {
    if (isEditing) titleRef.current?.focus();
  }, [isEditing]);

  const [title, setTitle] = useState(todo.title);
  const handleTodoTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    try {
      await updateTodoMutation.mutateAsync({
        ...todo,
        title,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(todo.title);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col justify-between hover:cursor-pointer">
      <div className="flex items-center justify-center">
        <div className="flex items-center flex-1">
          <input
            disabled={isEditing}
            type="checkbox"
            checked={isFinished}
            onChange={handleToggleChecked}
            className="form-checkbox h-5 w-5 text-blue-600 mr-2"
          />
          <span
            className={`${isFinished ? "line-through text-gray-500 flex-1 mr-2" : "text-gray-800 flex-1 mr-2"}`}
          >
            {isEditing ? (
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={handleTodoTitleChange}
                className="px-2 rounded-md outline-none focus:border focus:border-gray-300"
              />
            ) : (
              <p className="p-1 rounded-md border border-white">{todo.title}</p>
            )}
          </span>
        </div>
        {isEditing ? (
          <div className="flex items-center justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-2 rounded border border-green-700 flex items-center justify-center"
              onClick={handleSave}
              disabled={updateTodoMutation.isPending}
            >
              {updateTodoMutation.isPending ? (
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              disabled={updateTodoMutation.isPending}
              onClick={handleCancel}
              className={`
              ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded border border-red-700
              ${updateTodoMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}
            `}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="">
            <button
              onClick={handleEdit}
              className="bg-white-500 hover:bg-gray-200 text-gray-500 font-bold py-2 px-2 rounded border border-black-300"
              disabled={deleteTodoMutation.isPending}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.414 2.586a2 2 0 010 2.828l-10 10a2 2 0 01-1.414.586H4a1 1 0 01-1-1v-2.586a2 2 0 01.586-1.414l10-10a2 2 0 012.828 0zM16 4l-1.5-1.5L15 2.5 16.5 4H16zM13.5 5.5L5 14H5v.5l8.5-8.5L13.5 5.5z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="ml-2 bg-white-500 hover:bg-gray-200 text-gray-500 font-bold py-2 px-2 rounded border border-black-300"
              disabled={deleteTodoMutation.isPending}
            >
              {deleteTodoMutation.isPending ? (
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      dur="0.75s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </path>
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 3a1 1 0 000 2h8a1 1 0 100-2H6zM5 6a1 1 0 011 1v8a1 1 0 001 1h6a1 1 0 001-1V7a1 1 0 112 0v8a3 3 0 01-3 3H7a3 3 0 01-3-3V7a1 1 0 011-1zm5-4a3 3 0 00-3 3H8a2 2 0 114 0h1a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 mt-2 self-end">
        {new Date(todo.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default TodoItem;
