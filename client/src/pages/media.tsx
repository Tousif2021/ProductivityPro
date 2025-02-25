import { useQuery, useMutation } from "@tanstack/react-query";
import { MediaUpload } from "@/components/MediaUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MediaFile } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function MediaPage() {
  const { data: files, isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media"],
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const data = {
        filename: file.name,
        filePath: URL.createObjectURL(file),
        fileType: file.type,
      };
      await apiRequest("POST", "/api/media", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Media Files</h1>
      
      <MediaUpload onUpload={(file) => uploadFile.mutate(file)} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {files?.map((file) => (
          <Card key={file.id} className="p-4">
            <h3 className="font-semibold">{file.filename}</h3>
            <p className="text-sm text-gray-600">{file.fileType}</p>
            <div className="mt-2 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteFile.mutate(file.id)}
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
