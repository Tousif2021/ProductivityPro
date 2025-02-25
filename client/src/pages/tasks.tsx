import { useQuery, useMutation } from "@tanstack/react-query";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isThisWeek, compareAsc } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Flag, Trash2 } from "lucide-react";

function groupTasksByDueDate(tasks: Task[]) {
  const groups: { [key: string]: Task[] } = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    future: [],
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
      } else {
        groups.future.push(task);
      }
    }
  });

  // Sort future tasks by date
  groups.future.sort((a, b) => {
    return compareAsc(new Date(a.dueDate!), new Date(b.dueDate!));
  });

  return groups;
}

const priorityColors = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-rose-500"
};

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

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto px-4"
      {...pageTransition}
    >
      <TaskForm onSubmit={(data) => createTask.mutate(data)} />

      <AnimatePresence mode="wait">
        {Object.entries(taskGroups).map(([group, groupTasks]) => (
          groupTasks.length > 0 && (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                <h2 className="text-sm font-medium text-gray-600 uppercase">
                  {group === 'future' ? 'Upcoming' : group.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
              </div>

              <div className="divide-y divide-gray-50">
                {groupTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 py-3 flex items-center justify-between group hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                        <Flag className={`w-3 h-3 ${priorityColors[task.priority as keyof typeof priorityColors]}`} />
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </motion.div>
  );
}