import supabase from "./supabase";

export type TODO = {
  id: string;
  created_at: string;
  title: string;
  finished: boolean;
};

export async function getTodos(): Promise<TODO[]> {
  const { data: todos, error } = await supabase.from("todos").select("*");
  if (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
  return todos;
}

export async function createTODO(todo: Partial<TODO>): Promise<TODO> {
  const { data: newTODO, error } = await supabase
    .from("todos")
    .insert(todo)
    .single();
  if (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
  return newTODO;
}

export const updateTodo = async ({
  id,
  ...updates
}: Partial<TODO> & { id: string }) => {
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const deleteTodo = async (id: string) => {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
};
