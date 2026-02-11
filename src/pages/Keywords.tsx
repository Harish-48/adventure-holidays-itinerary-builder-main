import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getKeywords, createKeyword, updateKeyword, deleteKeyword } from "@/lib/itineraryService";
import type { Keyword } from "@/types/itinerary";

const Keywords = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formKeyword, setFormKeyword] = useState("");
  const [formActivities, setFormActivities] = useState("");

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setLoading(true);
      const data = await getKeywords();
      setKeywords(data);
    } catch (_error) {
      toast({
        title: "Error loading keywords",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formKeyword.trim()) {
      toast({
        title: "Keyword is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSaving(true);
      const activities = formActivities
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);
      
      if (editingId) {
        await updateKeyword(editingId, { keyword: formKeyword, activities });
        toast({ title: "Keyword updated successfully" });
      } else {
        await createKeyword({ keyword: formKeyword, activities });
        toast({ title: "Keyword added successfully" });
      }
      
      setFormKeyword("");
      setFormActivities("");
      setEditingId(null);
      await loadKeywords();
    } catch (error: any) {
      toast({
        title: error.message || "Error saving keyword",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (keyword: Keyword) => {
    setEditingId(keyword.id!);
    setFormKeyword(keyword.keyword);
    setFormActivities(keyword.activities.join("\n"));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteKeyword(deleteId);
      setKeywords((prev) => prev.filter((k) => k.id !== deleteId));
      toast({ title: "Keyword deleted successfully" });
    } catch (_error) {
      toast({
        title: "Error deleting keyword",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormKeyword("");
    setFormActivities("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card py-4">
        <div className="container">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Keyword templates</h1>
          <p className="text-muted-foreground">Manage reusable day plans</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Add/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Template" : "Add New Template"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword (Unique identifier)</Label>
                <Input
                  id="keyword"
                  placeholder="e.g. Mysore1day"
                  value={formKeyword}
                  onChange={(e) => setFormKeyword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activities">Day plan activities (One per line)</Label>
                <Textarea
                  id="activities"
                  placeholder="Visit Mysore Palace&#10;Lunch at local hotel&#10;Chamundi Hills sunset"
                  rows={8}
                  value={formActivities}
                  onChange={(e) => setFormActivities(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Plus className="mr-2 h-4 w-4" />
                  {editingId ? "Update template" : "Add template"}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Keywords List */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Templates</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : keywords.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No keywords saved yet. Add your first template above.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((keyword) => (
                      <TableRow key={keyword.id}>
                        <TableCell className="font-medium">
                          {keyword.keyword}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(keyword)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(keyword.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this keyword template? This action
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

export default Keywords;
