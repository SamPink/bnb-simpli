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
  console.log('[DEBUG] ChatSources props:', { 
    sources, 
    userId, 
    runId, 
    pdfPath,
    sourcesLength: sources?.length,
    firstSource: sources?.[0],
    hasValidSources: Array.isArray(sources) && sources.length > 0,
    sourcesType: typeof sources,
    isArray: Array.isArray(sources),
    rawSources: JSON.stringify(sources)
  });

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

  console.log('[DEBUG] ChatSources render:', {
    sourcesProvided: !!sources,
    sourcesType: typeof sources,
    sourcesLength: sources?.length,
    hasUserId: !!userId,
    hasRunId: !!runId,
    hasPdfPath: !!pdfPath
  });

  // Early return if no sources provided
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    console.log('[DEBUG] No valid sources to display');
    return null;
  }

  // Validate and transform sources
  const validSources = sources.reduce<Source[]>((acc, source) => {
    if (!source || typeof source !== 'object') {
      console.log('[DEBUG] Invalid source object:', source);
      return acc;
    }

    try {
      // Validate required properties
      if (!('document' in source && 
          'page' in source && 
          'paragraph' in source && 
          'text' in source)) {
        console.log('[DEBUG] Source missing required properties:', source);
        return acc;
      }

      // Ensure numeric values are valid
      const page = Number(source.page);
      const paragraph = Number(source.paragraph);
      if (isNaN(page) || isNaN(paragraph)) {
        console.log('[DEBUG] Invalid numeric values in source:', { page, paragraph });
        return acc;
      }

      // Add validated source
      acc.push({
        ...source,
        page,
        paragraph,
        text: String(source.text).trim(),
        metadata: {
          ...source.metadata,
          size: Number(source.metadata?.size) || 0,
          last_modified: source.metadata?.last_modified || new Date().toISOString(),
          file_type: source.metadata?.file_type || 'pdf'
        }
      });
    } catch (error) {
      console.error('[DEBUG] Error processing source:', error);
    }
    return acc;
  }, []);

  if (validSources.length === 0) {
    console.log('[DEBUG] No valid sources after processing');
    return null;
  }

  console.log('[DEBUG] Rendering valid sources:', {
    count: validSources.length,
    firstSource: validSources[0]
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="text-sm font-medium text-muted-foreground">Sources:</div>
      <div className="space-y-2">
        {validSources.map((source, index) => (
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
