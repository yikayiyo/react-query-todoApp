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
      console.log("====================================");
      console.log("Todo添加成功");
      console.log("====================================");
      setNewTodo("");
    },
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodoMutation.mutate({
      title: newTodo,
      finished: false,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
        className="todo-input"
      />
      <button type="submit" className="add-button">
        Add Todo
      </button>
    </form>
  );
};

export default NewTodo;
