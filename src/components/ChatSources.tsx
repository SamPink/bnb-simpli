import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { downloadPdf } from "@/services/chatService";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  runId: string;
  pdfPath: string | null;
}

export const ChatSources = ({ sources, userId, runId, pdfPath }: ChatSourcesProps) => {
  const { toast } = useToast();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const handleViewPdf = async () => {
    try {
      const blob = await downloadPdf(userId, runId);
      setPdfBlob(blob);
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load PDF. Please try again.",
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
      {pdfPath && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleViewPdf}
            >
              <Eye className="h-4 w-4" />
              View Highlighted PDF
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90%] sm:w-[540px] overflow-y-auto">
            {pdfBlob && (
              <Document
                file={URL.createObjectURL(pdfBlob)}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-document"
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="mb-4"
                    width={Math.min(window.innerWidth * 0.8, 540)}
                  />
                ))}
              </Document>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};