import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TRANSPORT_OPTIONS, PRICE_UNITS } from "@/lib/constants";
import type { Step1FormData, CustomHeading, PricingSlot } from "@/types/itinerary";

interface Step1SummaryProps {
  data: Step1FormData;
  onChange: (data: Step1FormData) => void;
  onNext: () => void;
}

export const Step1Summary = ({ data, onChange, onNext }: Step1SummaryProps) => {
  const updateField = <K extends keyof Step1FormData>(key: K, value: Step1FormData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const addCustomHeading = () => {
    const newHeading: CustomHeading = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
    };
    updateField("customHeadings", [...data.customHeadings, newHeading]);
  };

  const updateCustomHeading = (id: string, field: keyof CustomHeading, value: string) => {
    updateField(
      "customHeadings",
      data.customHeadings.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const removeCustomHeading = (id: string) => {
    updateField(
      "customHeadings",
      data.customHeadings.filter((h) => h.id !== id)
    );
  };

  const addPricingSlot = () => {
    const newSlot: PricingSlot = {
      id: crypto.randomUUID(),
      label: "",
      price: 0,
      unit: "Per Pax",
    };
    updateField("pricingSlots", [...data.pricingSlots, newSlot]);
  };

  const updatePricingSlot = (id: string, field: keyof PricingSlot, value: any) => {
    updateField(
      "pricingSlots",
      data.pricingSlots.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removePricingSlot = (id: string) => {
    if (data.pricingSlots.length > 1) {
      updateField(
        "pricingSlots",
        data.pricingSlots.filter((s) => s.id !== id)
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Consultant Details */}
      <Card>
        <CardHeader>
          <CardTitle>Consultant Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="consultantName">Consultant name</Label>
            <Input
              id="consultantName"
              value={data.consultantName}
              onChange={(e) => updateField("consultantName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consultantNumber">Consultant number</Label>
            <Input
              id="consultantNumber"
              value={data.consultantNumber}
              onChange={(e) => updateField("consultantNumber", e.target.value)}
              placeholder="+91 "
            />
          </div>
        </CardContent>
      </Card>

      {/* Quotation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Quotation date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.quotationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.quotationDate ? format(data.quotationDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.quotationDate}
                  onSelect={(date) => date && updateField("quotationDate", date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g. Kerala, Munnar..."
              value={data.destination}
              onChange={(e) => updateField("destination", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g. 2N/3D"
              value={data.duration}
              onChange={(e) => updateField("duration", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Date of travel</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.travelDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.travelDate ? format(data.travelDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.travelDate}
                  onSelect={(date) => date && updateField("travelDate", date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
<div className="space-y-2">
  <Label htmlFor="transportDetails">Transport details</Label>
  <Input
    id="transportDetails"
    placeholder="Enter transport details"
    value={data.transportDetails}
    onChange={(e) =>
      updateField("transportDetails", e.target.value)
    }
  />
</div>

        </CardContent>
      </Card>

      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client name</Label>
            <Input
              id="clientName"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
            />
          </div>
<div className="space-y-2">
  <Label htmlFor="groupSize">Group size (Pax)</Label>
<Input
  id="groupSize"
  type="text"
  placeholder="Enter group size"
  value={data.groupSize ?? ""}
  onChange={(e) => {
    const value = e.target.value;
    updateField("groupSize", value);
  }}
/>

</div>

        </CardContent>
      </Card>

      {/* Custom Headings
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Custom Information</CardTitle>
          <Button variant="outline" size="sm" onClick={addCustomHeading}>
            <Plus className="mr-2 h-4 w-4" />
            Add heading
          </Button>
        </CardHeader>
        <CardContent>
          {data.customHeadings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No custom headings added.
            </p>
          ) : (
            <div className="space-y-4">
              {data.customHeadings.map((heading) => (
                <div key={heading.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Label>Heading title</Label>
                      <Input
                        value={heading.title}
                        onChange={(e) =>
                          updateCustomHeading(heading.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomHeading(heading.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={heading.content}
                      onChange={(e) =>
                        updateCustomHeading(heading.id, "content", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Costing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Costing</CardTitle>
          <Button variant="outline" size="sm" onClick={addPricingSlot}>
            <Plus className="mr-2 h-4 w-4" />
            Add pricing slot
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.pricingSlots.map((slot) => (
            <div key={slot.id} className="border rounded-lg p-4">
              <div className="grid gap-4 sm:grid-cols-4 items-end">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Slot label</Label>
                  <Input
                    placeholder="e.g. Inclusive of all meals"
                    value={slot.label}
                    onChange={(e) => updatePricingSlot(slot.id, "label", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={slot.price}
                    onChange={(e) =>
                      updatePricingSlot(slot.id, "price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Unit</Label>
                    <Select
                      value={slot.unit}
                      onValueChange={(value) => updatePricingSlot(slot.id, "unit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-7"
                    onClick={() => removePricingSlot(slot.id)}
                    disabled={data.pricingSlots.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
