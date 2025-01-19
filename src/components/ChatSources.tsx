import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadPdf, downloadSourcePdf, validateSource } from "@/services/chatService";
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

  const handleDownloadSourcePdf = async (document: string) => {
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
      console.log('Attempting to download source PDF:', { userId, runId, document });
      const blob = await downloadSourcePdf(userId, runId, document);
      
      if (!blob) {
        throw new Error('No PDF data received');
      }

      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document}_highlighted.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `${document} PDF downloaded successfully`,
      });
    } catch (error) {
      console.error('Error downloading source PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download source PDF. Please try again.",
      });
    }
  };

  const handleDownloadAllPdf = async () => {
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
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `conversation-${runId}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
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

  // Group and validate sources by document
  const validSources = sources.reduce<Source[]>((acc, source) => {
    try {
      if (validateSource(source)) {
        // Add validated source with normalized data
        acc.push({
          ...source,
          page: Number(source.page),
          paragraph: Number(source.paragraph),
          text: String(source.text).trim(),
          metadata: {
            ...source.metadata,
            size: Number(source.metadata?.size) || 0,
            last_modified: source.metadata?.last_modified || new Date().toISOString(),
            file_type: source.metadata?.file_type || 'pdf'
          }
        });
      }
    } catch (error) {
      console.error('[DEBUG] Error processing source:', error);
    }
    return acc;
  }, []);

  // Sort sources by document name and page number
  validSources.sort((a, b) => {
    const docCompare = a.document.localeCompare(b.document);
    if (docCompare !== 0) return docCompare;
    return a.page - b.page;
  });

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
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium flex items-center justify-between">
                  <span>{source.document}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 ml-2"
                    onClick={() => handleDownloadSourcePdf(source.document)}
                    title={`Download highlighted PDF for ${source.document}`}
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                </div>
                <div className="text-muted-foreground text-xs">
                  Page {source.page}, Paragraph {source.paragraph}
                  {source.metadata && (
                    <span className="ml-2">
                      ({(source.metadata.size / 1024).toFixed(1)} KB, Last modified: {new Date(source.metadata.last_modified).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm">{source.text}</div>
          </div>
        ))}
      </div>
      {(pdfPath || sources.length > 0) && runId && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleDownloadAllPdf}
        >
          <Download className="h-4 w-4" />
          Download All Sources
        </Button>
      )}
    </div>
  );
};
