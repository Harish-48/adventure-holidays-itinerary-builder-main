import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Eye, Loader2, Pencil } from "lucide-react";


// import isEqual from "lodash.isequal";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getItinerary, createItinerary, updateItinerary, generateItineraryCode } from "@/lib/itineraryService";
import { DEFAULT_BANK_DETAILS, DEFAULT_TERMS_CONDITIONS, DEFAULT_CANCELLATION_POLICY } from "@/lib/constants";

import type { Itinerary, Step1FormData, Step2FormData, Step3FormData, Step4FormData } from "@/types/itinerary";
// import { ConfirmLeaveDialog } from "@/components/ConfirmLeaveDialog";
import { Step1Summary } from "@/components/studio/Step1Summary";
import { Step2Itinerary } from "@/components/studio/Step2Itinerary";
import { Step3Details } from "@/components/studio/Step3Details";
import { Step4Policies } from "@/components/studio/Step4Policies";

const STEPS = ["summary", "itinerary", "details", "policies"] as const;

const ItineraryStudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [itineraryCode, setItineraryCode] = useState("");
  const [itineraryId, setItineraryId] = useState<string | undefined>(id);
  const [hasChanges, setHasChanges] = useState(false);

  const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
  // Form data for all steps
  const [step1Data, setStep1Data] = useState<Step1FormData>({
    consultantName: "",
    consultantNumber: "+91 ",
    quotationDate: new Date(),
    destination: "",
    duration: "",
    travelDate: new Date(),
    transportDetails: "",
    clientName: "",
    groupSize: 1,
    customHeadings: [],
    pricingSlots: [{ id: crypto.randomUUID(), label: "", price: 0, unit: "Per Pax" }],
  });

  const [step2Data, setStep2Data] = useState<Step2FormData>({
    showDay0: false,
    dayPlans: [{ id: crypto.randomUUID(), dayNumber: 1, title: "", activities: [] }],
  });

  const [step3Data, setStep3Data] = useState<Step3FormData>({
    notes: [],
    inclusions: [],
    exclusions: [],
  });

  const [step4Data, setStep4Data] = useState<Step4FormData>({
    termsConditions: DEFAULT_TERMS_CONDITIONS,
    cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
    bankDetails: DEFAULT_BANK_DETAILS,
  });

 const [isEditingCode, setIsEditingCode] = useState(false); // editable only if new itinerary



  // Keep a copy of the initial data for comparison
  const [initialStep1Data, setInitialStep1Data] = useState<Step1FormData | null>(null);
  const [initialStep2Data, setInitialStep2Data] = useState<Step2FormData | null>(null);
  const [initialStep3Data, setInitialStep3Data] = useState<Step3FormData | null>(null);
  const [initialStep4Data, setInitialStep4Data] = useState<Step4FormData | null>(null);

  // Detect any changes
  const detectChanges = () => {
    if (!initialStep1Data || !initialStep2Data || !initialStep3Data || !initialStep4Data) return;
    setHasChanges(
      !isEqual(step1Data, initialStep1Data) ||
      !isEqual(step2Data, initialStep2Data) ||
      !isEqual(step3Data, initialStep3Data) ||
      !isEqual(step4Data, initialStep4Data)
    );
  };

  // Load itinerary or generate new code
  useEffect(() => {
    const init = async () => {
      if (id) {
        try {
          const data = await getItinerary(id);
          if (data) {
            setItineraryCode(data.itineraryCode);
            setStep1Data({
              consultantName: data.consultantName,
              consultantNumber: data.consultantNumber,
              quotationDate: data.quotationDate,
              destination: data.destination,
              duration: data.duration,
              travelDate: data.travelDate,
              transportDetails: data.transportDetails,
              clientName: data.clientName,
              groupSize: data.groupSize,
              customHeadings: data.customHeadings,
              pricingSlots: data.pricingSlots,
            });
            setStep2Data({
              showDay0: data.showDay0,
              dayPlans: data.dayPlans,
            });
            setStep3Data({
              notes: data.notes,
              inclusions: data.inclusions,
              exclusions: data.exclusions,
            });
            setStep4Data({
              termsConditions: data.termsConditions,
              cancellationPolicy: data.cancellationPolicy,
              bankDetails: data.bankDetails,
            });

            // Save initial values for comparison
            setInitialStep1Data({
              consultantName: data.consultantName,
              consultantNumber: data.consultantNumber,
              quotationDate: data.quotationDate,
              destination: data.destination,
              duration: data.duration,
              travelDate: data.travelDate,
              transportDetails: data.transportDetails,
              clientName: data.clientName,
              groupSize: data.groupSize,
              customHeadings: data.customHeadings,
              pricingSlots: data.pricingSlots,
            });
            setInitialStep2Data({
              showDay0: data.showDay0,
              dayPlans: data.dayPlans,
            });
            setInitialStep3Data({
              notes: data.notes,
              inclusions: data.inclusions,
              exclusions: data.exclusions,
            });
            setInitialStep4Data({
              termsConditions: data.termsConditions,
              cancellationPolicy: data.cancellationPolicy,
              bankDetails: data.bankDetails,
            });
          }
        } catch (_error) {
          toast({ title: "Error loading itinerary", variant: "destructive" });
        }
      } else {
        // New itinerary
        try {
          const code = await generateItineraryCode();
          setItineraryCode(code);
        } catch (_error) {
          toast({ title: "Error generating code", variant: "destructive" });
        }
      }
      setLoading(false);
    };

    init();
  }, [id, toast]);

  // Save itinerary
  const handleSave = async () => {
    try {
      setSaving(true);
      const data: Omit<Itinerary, "id" | "createdAt" | "updatedAt"> = {
        itineraryCode,
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
      };

        if (!itineraryCode.trim()) {
    toast({ title: "Itinerary code cannot be empty", variant: "destructive" });
    return;
  }

      if (itineraryId) {
        await updateItinerary(itineraryId, data);
        toast({ title: "Itinerary saved successfully" });

        // Reset initial data after save
        setInitialStep1Data(step1Data);
        setInitialStep2Data(step2Data);
        setInitialStep3Data(step3Data);
        setInitialStep4Data(step4Data);
        setHasChanges(false);
        // After successful save (both create & update)
setIsEditingCode(false);
      } else {
        const newId = await createItinerary(data);
        setItineraryId(newId);
        toast({ title: "Itinerary created successfully" });

        // Reset initial data
        setInitialStep1Data(step1Data);
        setInitialStep2Data(step2Data);
        setInitialStep3Data(step3Data);
        setInitialStep4Data(step4Data);
        setHasChanges(false);
        // After successful save (both create & update)
setIsEditingCode(false);
      }
    } catch (_error) {
      toast({ title: "Error saving itinerary", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Preview itinerary
  const handlePreview = async () => {
    if (!itineraryId) {
      await handleSave();
    }
    if (itineraryId) {
      navigate(`/preview/${itineraryId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Logo size="sm"  />
<div>
  <h1 className="text-lg font-semibold">Itinerary studio</h1>
  <div className="flex items-center gap-2">
  {isEditingCode ? (
    <input
      type="text"
      value={itineraryCode}
      onChange={(e) => setItineraryCode(e.target.value)}
      className="border px-2 py-1 rounded text-sm w-38"
    />
  ) : (
    <p className="text-sm text-muted-foreground">{itineraryCode}</p>
  )}

  {/* Edit icon for new itinerary only */}
  {!isEditingCode && (
    <button
      onClick={() => setIsEditingCode(true)}
      className="text-muted-foreground hover:text-primary transition-colors"
      title="Edit itinerary code"
    >
      <Pencil className="h-4 w-4" /> {/* you can replace Eye with a pencil icon */}
    </button>
  )}

  {/* Save / confirm editing */}
  {isEditingCode && (
    <button
      onClick={() => setIsEditingCode(false)}
      className="text-muted-foreground hover:text-primary transition-colors"
      title="Save code"
    >
      ✔
    </button>
  )}
</div>

</div>

          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview} disabled={saving}>
              <Eye className="mr-2 h-4 w-4" /> Preview itinerary
            </Button>
{/* <Button
  onClick={handleSave}
  disabled={saving || isEqual(step1Data, initialStep1Data) && isEqual(step2Data, initialStep2Data) && isEqual(step3Data, initialStep3Data) && isEqual(step4Data, initialStep4Data)}
>
  {saving ? (
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ) : null}
  Confirm & save
</Button> */}

<Button variant="ghost" size="icon" onClick={() => navigate("/")}>
  <X className="h-5 w-5" />
</Button>


          </div>
        </div>

        {/* Step Navigation */}
        <div className="container pb-4">
          <div className="flex gap-2">
            {STEPS.map((step, index) => (
              <button
                key={step}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Step {index + 1}: {step}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Step Content */}
{/* Step Content */}
<main className="flex-1 container py-8">
  {currentStep === 0 && (
    <Step1Summary
      data={step1Data}
      onChange={(data) => {
        setStep1Data(data);
        detectChanges();
      }}
      onNext={() => setCurrentStep(1)}
    />
  )}
  {currentStep === 1 && (
    <Step2Itinerary
      data={step2Data}
      onChange={(data) => {
        setStep2Data(data);
        detectChanges();
      }}
      travelStartDate={step1Data.travelDate}
      onPrevious={() => setCurrentStep(0)}
      onNext={() => setCurrentStep(2)}
    />
  )}
  {currentStep === 2 && (
    <Step3Details
      data={step3Data}
      onChange={(data) => {
        setStep3Data(data);
        detectChanges();
      }}
      onPrevious={() => setCurrentStep(1)}
      onNext={() => setCurrentStep(3)}
    />
  )}
  {currentStep === 3 && (
    <Step4Policies
      data={step4Data}
      onChange={(data) => {
        setStep4Data(data);
        detectChanges();
      }}
      onPrevious={() => setCurrentStep(2)}
      onSave={handleSave}
      onPreview={handlePreview}
      saving={saving}
      canPreview={!!itineraryId}
    />
  )}
</main>

    {/* Sticky Footer */}
<footer className="sticky bottom-0 z-50 border-t bg-card py-4">
  <div className="container flex justify-end gap-2">
    {/* <Button variant="outline" onClick={handlePreview} disabled={saving}>
      <Eye className="mr-2 h-4 w-4" />
      Preview itinerary
    </Button> */}
    <Button
      onClick={handleSave}
      disabled={
        saving ||
        (initialStep1Data &&
          initialStep2Data &&
          initialStep3Data &&
          initialStep4Data &&
          isEqual(step1Data, initialStep1Data) &&
          isEqual(step2Data, initialStep2Data) &&
          isEqual(step3Data, initialStep3Data) &&
          isEqual(step4Data, initialStep4Data))
      }
    >
      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Confirm & save
    </Button>
    {/* <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
      <X className="h-5 w-5" />
    </Button> */}
  </div>
</footer>



    </div>
  );
};

export default ItineraryStudio;
