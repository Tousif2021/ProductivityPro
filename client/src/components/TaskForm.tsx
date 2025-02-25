import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { insertTaskSchema, type InsertTask } from "@shared/schema";

interface TaskFormProps {
  onSubmit: (data: InsertTask) => void;
  defaultValues?: Partial<InsertTask>;
}

export function TaskForm({ onSubmit, defaultValues }: TaskFormProps) {
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            placeholder="Task title"
            {...form.register("title")}
          />
        </div>
        <div>
          <Input
            placeholder="Description"
            {...form.register("description")}
          />
        </div>
        <div>
          <Input
            type="datetime-local"
            {...form.register("dueDate")}
          />
        </div>
        <Select
          {...form.register("priority")}
          defaultValue="medium"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Button type="submit">Save Task</Button>
      </form>
    </Form>
  );
}
