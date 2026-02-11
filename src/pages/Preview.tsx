import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getItinerary } from "@/lib/itineraryService";
import { generatePDF } from "@/lib/pdfGenerator";
import { ItineraryPreview } from "@/components/preview/ItineraryPreview";
import type { Itinerary } from "@/types/itinerary";

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadItinerary = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        const data = await getItinerary(id);
        if (data) {
          setItinerary(data);
        } else {
          toast({
            title: "Itinerary not found",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (_error) {
        toast({
          title: "Error loading itinerary",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [id, navigate, toast]);

  const handleDownload = async () => {
    if (!itinerary) return;

    try {
      setDownloading(true);
      // Clone #pdf-content off-screen, apply PDF styles, capture, and generate single-page PDF
      await generatePDF("pdf-content", itinerary);
      toast({ title: "PDF downloaded successfully" });
    } catch (_error) {
      toast({
        title: "Error generating PDF",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!itinerary) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            DASHBOARD
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-card"
              onClick={() => navigate(`/studio/${id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="w-full py-8 flex justify-center">
        <div id="pdf-content" className="w-full max-w-4xl mx-auto px-4">
          <ItineraryPreview itinerary={itinerary} />
        </div>
      </main>
    </div>
  );
};

export default Preview;
