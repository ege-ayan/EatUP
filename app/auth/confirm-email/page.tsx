import { Suspense } from "react";
import { ConfirmEmailForm } from "./_components/confirm-email-form";

function ConfirmEmailFormFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-4 h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmEmailFormFallback />}>
      <ConfirmEmailForm />
    </Suspense>
  );
}
