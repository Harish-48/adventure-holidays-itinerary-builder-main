import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type ConfirmLeaveDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmLeaveDialog = ({
  open,
  onConfirm,
  onCancel,
}: ConfirmLeaveDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes.  
            Are you sure you want to go back without saving?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            No, stay
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Yes, go back
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
