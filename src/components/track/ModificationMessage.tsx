
import { Track } from "@/lib/types";

interface ModificationMessageProps {
  track: Track;
}

export function ModificationMessage({ track }: ModificationMessageProps) {
  if (!track.modificationRequested || !track.modificationMessage) {
    return null;
  }
  
  return (
    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
      <p className="font-medium text-yellow-800">Modification needed:</p>
      <p className="text-yellow-700">{track.modificationMessage}</p>
    </div>
  );
}
