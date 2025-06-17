import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "success" | "error" | "warning" | "info"

type ToastProps = {
  title?: string
  description?: string
  variant?: ToastVariant
  action?: {
    label: string
    onClick: () => void
  }
}

export function toast({ title, description, variant = "default", action }: ToastProps) {
  const toastOptions = {
    description,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
  }

  switch (variant) {
    case "success":
      return sonnerToast.success(title, toastOptions)
    case "error":
      return sonnerToast.error(title, toastOptions)
    case "warning":
      return sonnerToast.warning(title, toastOptions)
    case "info":
      return sonnerToast.info(title, toastOptions)
    default:
      return sonnerToast(title, toastOptions)
  }
}

export function useToast() {
  return {
    toast,
    success: (title?: string, description?: string, action?: ToastProps['action']) => 
      toast({ title, description, variant: "success", action }),
    error: (title?: string, description?: string, action?: ToastProps['action']) => 
      toast({ title, description, variant: "error", action }),
    warning: (title?: string, description?: string, action?: ToastProps['action']) => 
      toast({ title, description, variant: "warning", action }),
    info: (title?: string, description?: string, action?: ToastProps['action']) => 
      toast({ title, description, variant: "info", action }),
    dismiss: sonnerToast.dismiss,
  }
}