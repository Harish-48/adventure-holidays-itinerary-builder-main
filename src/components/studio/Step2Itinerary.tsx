import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { searchKeywords } from "@/lib/itineraryService";
import type { Step2FormData, DayPlan, Keyword } from "@/types/itinerary";

interface Step2ItineraryProps {
  data: Step2FormData;
  onChange: (data: Step2FormData) => void;
  travelStartDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export const Step2Itinerary = ({
  data,
  onChange,
  travelStartDate,
  onPrevious,
  onNext,
}: Step2ItineraryProps) => {
  const [keywordSearches, setKeywordSearches] = useState<Record<string, string>>({});
  const [keywordResults, setKeywordResults] = useState<Record<string, Keyword[]>>({});

  const renumberDays = (plans: DayPlan[], showDay0: boolean): DayPlan[] =>
    plans.map((plan, index) => ({
      ...plan,
      dayNumber: showDay0 ? index : index + 1,
    }));

  // ✅ FIXED: single-click Day 0 toggle
  const handleDay0Toggle = () => {
    const enabled = !data.showDay0;
    let updatedPlans = [...data.dayPlans];

    if (enabled && updatedPlans[0]?.dayNumber !== 0) {
      const newDay: DayPlan = {
        id: crypto.randomUUID(),
        dayNumber: 0,
        title: "Arrival",
        activities: [],
      };
      updatedPlans = [newDay, ...updatedPlans];
    }

    if (!enabled && updatedPlans[0]?.dayNumber === 0) {
      updatedPlans = updatedPlans.slice(1);
    }

    updatedPlans = renumberDays(updatedPlans, enabled);

    onChange({
      ...data,
      showDay0: enabled,
      dayPlans: updatedPlans,
    });
  };

  const addDay = () => {
    const newDay: DayPlan = {
      id: crypto.randomUUID(),
      dayNumber: data.dayPlans.length + (data.showDay0 ? 0 : 1),
      title: "",
      activities: [],
    };

    onChange({
      ...data,
      dayPlans: [...data.dayPlans, newDay],
    });
  };

  const updateDayPlan = (id: string, field: keyof DayPlan, value: any) => {
    onChange({
      ...data,
      dayPlans: data.dayPlans.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    });
  };

  const removeDay = (id: string) => {
    if (data.dayPlans.length <= 1) return;

    const filtered = data.dayPlans.filter((d) => d.id !== id);

    onChange({
      ...data,
      dayPlans: renumberDays(filtered, data.showDay0),
    });
  };

  const handleKeywordSearch = async (dayId: string, term: string) => {
    setKeywordSearches((prev) => ({ ...prev, [dayId]: term }));

    if (term.length >= 2) {
      const results = await searchKeywords(term);
      setKeywordResults((prev) => ({ ...prev, [dayId]: results }));
    } else {
      setKeywordResults((prev) => ({ ...prev, [dayId]: [] }));
    }
  };

  const selectKeyword = (dayId: string, keyword: Keyword) => {
    onChange({
      ...data,
      dayPlans: data.dayPlans.map((d) =>
        d.id === dayId
          ? {
              ...d,
              keyword: keyword.keyword,
              title: keyword.keyword,
              activities: keyword.activities,
            }
          : d
      ),
    });

    setKeywordSearches((prev) => ({ ...prev, [dayId]: "" }));
    setKeywordResults((prev) => ({ ...prev, [dayId]: [] }));
  };

  const getDayDate = (dayNumber: number) =>
    addDays(travelStartDate, dayNumber);

  return (
    <div className="space-y-8">
      {/* Day 0 Enable / Disable */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="space-y-0.5">
          <Label>Day 0</Label>
          <p className="text-sm text-muted-foreground">
            Add Day 0 for pre-trip or arrival details
          </p>
        </div>

        <Button
          variant={data.showDay0 ? "destructive" : "outline"}
          onClick={handleDay0Toggle}
        >
          {data.showDay0 ? "Disable" : "Enable"}
        </Button>
      </div>

      {/* Day Cards */}
      <div className="space-y-6">
        {data.dayPlans.map((day) => (
          <Card key={day.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-yellow-500">
                  {day.dayNumber}
                </div>

                <div className="flex-1 space-y-4">
                  {/* Keyword Search */}
                  <div className="space-y-2 relative">
                    <Label>Keyword search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="e.g. Ooty1day"
                        value={keywordSearches[day.id] || ""}
                        onChange={(e) =>
                          handleKeywordSearch(day.id, e.target.value)
                        }
                      />
                    </div>

                    {keywordResults[day.id]?.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg">
                        {keywordResults[day.id].map((kw) => (
                          <button
                            key={kw.id}
                            className="w-full px-4 py-2 text-left hover:bg-muted"
                            onClick={() => selectKeyword(day.id, kw)}
                          >
                            <span className="font-medium">{kw.keyword}</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({kw.activities.length} activities)
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Day title</Label>
                      <Input
                        placeholder="e.g. Arrival & Welcome"
                        value={day.title}
                        onChange={(e) =>
                          updateDayPlan(day.id, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Specific date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !day.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {day.date
                              ? format(day.date, "dd-MM-yyyy")
                              : format(getDayDate(day.dayNumber), "dd-MM-yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={day.date || getDayDate(day.dayNumber)}
                            onSelect={(date) =>
                              date && updateDayPlan(day.id, "date", date)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

<div className="space-y-2">
  <Label>Activities</Label>
  <Textarea
    rows={5}
    placeholder={`Check-in\nSightseeing\nDinner`}
    value={day.activities.join("\n")}
    onChange={(e) =>
      updateDayPlan(
        day.id,
        "activities",
        e.target.value.split("\n") // keep empty lines
      )
    }
    className="whitespace-pre-wrap"
  />
</div>

                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={data.dayPlans.length <= 1}
                  onClick={() => removeDay(day.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={addDay}>
        <Plus className="mr-2 h-4 w-4" />
        Add day
      </Button>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
