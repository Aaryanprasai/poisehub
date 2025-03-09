
import { DistributionService } from "@/lib/types";

interface DistributionServicesProps {
  services: DistributionService[];
  isTakenDown: boolean;
}

export function DistributionServices({ services, isTakenDown }: DistributionServicesProps) {
  if (services.length === 0 || isTakenDown) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {services.slice(0, 3).map((service) => (
        <div 
          key={service.id}
          className="h-5 w-5 relative group"
          title={service.name}
        >
          <img 
            src={service.logo} 
            alt={service.name} 
            className="h-full w-full object-contain"
          />
        </div>
      ))}
      {services.length > 3 && (
        <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">
          +{services.length - 3}
        </div>
      )}
    </div>
  );
}
