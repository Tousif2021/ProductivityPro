import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import type { Reminder } from "@shared/schema";
import { format } from "date-fns";

export default function RemindersPage() {
  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reminders</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders?.map((reminder) => (
          <Card key={reminder.id} className="p-4">
            <p className="text-sm text-gray-600">
              Task #{reminder.taskId}
            </p>
            <p className="font-semibold">
              {format(new Date(reminder.reminderTime), "PPp")}
            </p>
            <p className="text-sm text-gray-600">
              Status: {reminder.notified ? "Sent" : "Pending"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
