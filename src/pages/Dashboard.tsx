import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Copy,
  Trash2,
  Search,
  Plus,
  Bookmark,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getItineraries,
  deleteItinerary,
  duplicateItinerary,
} from "@/lib/itineraryService";
import type { Itinerary } from "@/types/itinerary";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      toast({
        title: "Error loading itineraries",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(deleteId);
      await deleteItinerary(deleteId);
      setItineraries((prev) => prev.filter((i) => i.id !== deleteId));
      toast({ title: "Itinerary deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting itinerary",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setActionLoading(id);
      await duplicateItinerary(id);
      await loadItineraries();
      toast({ title: "Itinerary duplicated successfully" });
    } catch (error) {
      toast({
        title: "Error duplicating itinerary",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredItineraries = itineraries.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.clientName.toLowerCase().includes(query) ||
      item.destination.toLowerCase().includes(query) ||
      item.duration.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card py-4 sm:py-5">
        <div className="container flex justify-center px-4">
          <Logo size="lg" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4 sm:py-8">
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row">
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 text-base sm:h-11"
            onClick={() => navigate("/studio")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create itinerary
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-14 text-base sm:h-11"
            onClick={() => navigate("/keywords")}
          >
            <Bookmark className="mr-2 h-5 w-5" />
            Manage keywords
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client name, destination, or duration..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Itineraries Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredItineraries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery
              ? "No itineraries match your search."
              : "No itineraries yet. Create your first one!"}
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItineraries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.itineraryCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.destination}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.groupSize}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8"
                          onClick={() => navigate(`/preview/${item.id}`)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8"
                          onClick={() => navigate(`/studio/${item.id}`)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8"
                          onClick={() => handleDuplicate(item.id!)}
                          disabled={actionLoading === item.id}
                          title="Copy"
                        >
                          {actionLoading === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8"
                          onClick={() => setDeleteId(item.id!)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Itinerary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this itinerary? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
