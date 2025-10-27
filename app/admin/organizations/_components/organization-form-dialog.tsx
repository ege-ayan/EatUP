import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface OrganizationFormData {
  name: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  website: string;
}

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: OrganizationFormData;
  onFormDataChange: (data: OrganizationFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitText: string;
}

export default function OrganizationFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  onFormDataChange,
  onSubmit,
  isPending,
  submitText,
}: OrganizationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Organizasyon Adı <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  onFormDataChange({ ...formData, name: e.target.value })
                }
                placeholder="Organizasyon adı"
              />
            </div>

            <div>
              <Label htmlFor="location" className="mb-2 block">
                Konum <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  onFormDataChange({ ...formData, location: e.target.value })
                }
                placeholder="Kızılay, Ankara"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">
              Açıklama
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ ...formData, description: e.target.value })
              }
              placeholder="Organizasyon hakkında kısa bir açıklama"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  onFormDataChange({ ...formData, phone: e.target.value })
                }
                placeholder="+90 555 123 4567"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  onFormDataChange({ ...formData, email: e.target.value })
                }
                placeholder="info@organizasyon.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website" className="mb-2 block">
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) =>
                onFormDataChange({ ...formData, website: e.target.value })
              }
              placeholder="https://organizasyon.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "İşleniyor..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
