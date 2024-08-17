import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { createTODO } from "./utils/api";

const NewTodo = () => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: createTODO,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodo("");
    },
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodoMutation.mutate({
      title: newTodo,
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="todo-form w-full flex items-center justify-center gap-4"
    >
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
        className="todo-input p-2 rounded-md border-2 border-gray-300 flex-1"
      />
      <button
        type="submit"
        className="add-button p-2 px-6 border-gray-300 border-2 bg-slate-100 rounded-md"
      >
        Add Todo
      </button>
    </form>
  );
};

export default NewTodo;
