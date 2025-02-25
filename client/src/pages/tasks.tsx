import { useQuery, useMutation } from "@tanstack/react-query";
import { TaskForm } from "@/components/TaskForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TasksPage() {
  const { toast } = useToast();
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTask = useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <TaskForm onSubmit={(data) => createTask.mutate(data)} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <Card key={task.id} className="p-4">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-sm ${
                task.priority === 'high' ? 'text-red-500' :
                task.priority === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {task.priority}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTask.mutate(task.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}