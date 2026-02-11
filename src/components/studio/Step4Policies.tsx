import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Step4FormData, BankDetails } from "@/types/itinerary";

interface Step4PoliciesProps {
  data: Step4FormData;
  onChange: (data: Step4FormData) => void;
  onPrevious: () => void;
  onSave: () => Promise<void>;
  onPreview: () => void;
  saving: boolean;
  canPreview: boolean;
}

export const Step4Policies = ({
  data,
  onChange,
  onPrevious,
  onSave,
  onPreview,
  saving,
  canPreview,
}: Step4PoliciesProps) => {
  const updateField = <K extends keyof Step4FormData>(key: K, value: Step4FormData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateBankDetails = (field: keyof BankDetails, value: string) => {
    updateField("bankDetails", { ...data.bankDetails, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Terms & Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={15}
              value={data.termsConditions}
              onChange={(e) => updateField("termsConditions", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={15}
              value={data.cancellationPolicy}
              onChange={(e) => updateField("cancellationPolicy", e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Bank Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Bank & branch</Label>
              <Input
                id="bank"
                value={data.bankDetails.bank}
                onChange={(e) => updateBankDetails("bank", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">A/c name</Label>
              <Input
                id="accountName"
                value={data.bankDetails.accountName}
                onChange={(e) => updateBankDetails("accountName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">A/c number</Label>
              <Input
                id="accountNumber"
                value={data.bankDetails.accountNumber}
                onChange={(e) => updateBankDetails("accountNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC code</Label>
              <Input
                id="ifscCode"
                value={data.bankDetails.ifscCode}
                onChange={(e) => updateBankDetails("ifscCode", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        {/* <div className="flex gap-2">
          <Button onClick={onSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Save
          </Button>
          <Button
            variant="outline"
            onClick={onPreview}
            disabled={!canPreview || saving}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview itinerary
          </Button>
        </div> */}
      </div>
    </div>
  );
};
