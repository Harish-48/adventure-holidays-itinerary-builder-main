import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react"; // ✅ import the icon
import type { Step3FormData } from "@/types/itinerary";

interface Step3DetailsProps {
  data: Step3FormData;
  onChange: (data: Step3FormData) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Step3Details = ({
  data,
  onChange,
  onPrevious,
  onNext,
}: Step3DetailsProps) => {
  const updateField = <K extends keyof Step3FormData>(key: K, value: Step3FormData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Notes textarea above Inclusions & Exclusions */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-primary" /> Notes
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Label htmlFor="notes">Additional notes</Label>

<Textarea
  id="notes"
  placeholder="Add notes (one per line)"
  rows={6}
  value={data.notes.join("\n")}
  onChange={(e) =>
    updateField(
      "notes",
      e.target.value.split("\n")
    )
  }
/>



    </div>
  </CardContent>
</Card>


      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inclusions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-success">✓</span> Inclusions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="inclusions">One per line</Label>
              <Textarea
                id="inclusions"
                placeholder={`Private Vehicle\nDriver Allowance\nParking & Toll\nAccommodation\nBreakfast & Dinner\nSightseeing tickets`}
                rows={12}
                value={data.inclusions.join("\n")}
                onChange={(e) =>
                  updateField(
                    "inclusions",
                    e.target.value.split("\n") // keep empty lines to allow new lines
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter one item per line
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-destructive">✕</span> Exclusions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="exclusions">One per line</Label>
              <Textarea
                id="exclusions"
                placeholder={`GST 5%\nPersonal Expenses\nAirfare / Train fare\nLunch\nMonument fees`}
                rows={12}
                value={data.exclusions.join("\n")}
                onChange={(e) =>
                  updateField(
                    "exclusions",
                    e.target.value.split("\n") // keep empty lines to allow new lines
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter one item per line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
