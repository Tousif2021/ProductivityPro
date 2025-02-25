import { useQuery, useMutation } from "@tanstack/react-query";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isThisWeek, isAfter } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar } from "lucide-react";

function groupTasksByDueDate(tasks: Task[]) {
  const groups: { [key: string]: Task[] } = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    noDueDate: []
  };

  tasks.forEach(task => {
    if (!task.dueDate) {
      groups.noDueDate.push(task);
    } else {
      const dueDate = new Date(task.dueDate);
      if (isToday(dueDate)) {
        groups.today.push(task);
      } else if (isTomorrow(dueDate)) {
        groups.tomorrow.push(task);
      } else if (isThisWeek(dueDate)) {
        groups.thisWeek.push(task);
      } else if (isAfter(dueDate, new Date())) {
        groups.later.push(task);
      }
    }
  });

  return groups;
}

export default function TasksPage() {
  const { toast } = useToast();
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
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

  const taskGroups = groupTasksByDueDate(tasks);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TaskForm onSubmit={(data) => createTask.mutate(data)} />
      </motion.div>

      <AnimatePresence>
        {Object.entries(taskGroups).map(([group, groupTasks]) => (
          groupTasks.length > 0 && (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  {group.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {groupTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 py-3 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(task.dueDate), 'PPp')}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}