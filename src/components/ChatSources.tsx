import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadPdf } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Source {
  document: string;
  page: number;
  paragraph: number;
  text: string;
  metadata: {
    size: number;
    last_modified: string;
    file_type: string;
  };
}

interface ChatSourcesProps {
  sources: Source[];
  userId: string;
  runId?: string;
  pdfPath: string | null;
}

export const ChatSources = ({ sources, userId, runId, pdfPath }: ChatSourcesProps) => {
  const { toast } = useToast();
  console.log('ChatSources props:', { sources, userId, runId, pdfPath });

  const handleDownloadPdf = async () => {
    if (!runId || !userId) {
      console.error('Missing required data for PDF download:', { runId, userId });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to download PDF. Missing required information.",
      });
      return;
    }

    try {
      console.log('Attempting to download PDF:', { userId, runId });
      const blob = await downloadPdf(userId, runId);
      
      if (!blob) {
        throw new Error('No PDF data received');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${runId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download PDF. Please try again.",
      });
    }
  };

  if (!sources.length) return null;

  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm font-medium text-muted-foreground">Sources:</div>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="rounded-lg bg-muted p-3 text-sm">
            <div className="font-medium">{source.document}</div>
            <div className="text-muted-foreground">
              Page {source.page}, Paragraph {source.paragraph}
            </div>
            <div className="mt-2">{source.text}</div>
          </div>
        ))}
      </div>
      {(pdfPath || sources.length > 0) && runId && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleDownloadPdf}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      )}
    </div>
  );
};