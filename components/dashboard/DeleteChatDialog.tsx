"use client";

export default function DeleteChatDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-extrabold text-foreground mb-2">Delete Cosmic Memory?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          This will wipe your entire conversation history. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isDeleting} 
            className="px-4 py-2 text-sm font-bold text-foreground bg-secondary rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting} 
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center justify-center min-w-[100px] disabled:opacity-50 transition-colors shadow-md shadow-red-500/20"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}