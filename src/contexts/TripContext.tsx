import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TripLocation {
  lat: number;
  lng: number;
  name: string;
}

interface ActiveTrip {
  id: string;
  from: TripLocation;
  to: TripLocation;
  status: 'planning' | 'active' | 'completed';
  startTime: Date;
  currentLocation: TripLocation;
  progress: number; // 0-100
  estimatedTimeRemaining: string;
  distanceRemaining: string;
  nextStop?: {
    name: string;
    distance: string;
    estimatedTime: string;
  };
}

interface TripContextType {
  activeTrip: ActiveTrip | null;
  startTrip: (from: TripLocation, to: TripLocation) => void;
  updateTripProgress: () => void;
  endTrip: () => void;
  isInTripMode: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);

  // Simulate trip progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTrip && activeTrip.status === 'active') {
      interval = setInterval(() => {
        setActiveTrip(prev => {
          if (!prev || prev.progress >= 100) return prev;
          
          const newProgress = Math.min(prev.progress + 0.5, 100); // 0.5% every 2 seconds
          const progressRatio = newProgress / 100;
          
          // Simulate location interpolation
          const latDiff = prev.to.lat - prev.from.lat;
          const lngDiff = prev.to.lng - prev.from.lng;
          const currentLat = prev.from.lat + (latDiff * progressRatio);
          const currentLng = prev.from.lng + (lngDiff * progressRatio);
          
          // Calculate remaining distance and time
          const remainingProgress = 100 - newProgress;
          const totalDistance = 250; // Mock total distance in km
          const distanceRemaining = Math.round(totalDistance * (remainingProgress / 100));
          const timeRemaining = Math.round((remainingProgress / 100) * 300); // Mock total time in minutes
          
          return {
            ...prev,
            progress: newProgress,
            currentLocation: {
              lat: currentLat,
              lng: currentLng,
              name: `En route to ${prev.to.name}`
            },
            distanceRemaining: `${distanceRemaining} km`,
            estimatedTimeRemaining: `${Math.floor(timeRemaining / 60)}h ${timeRemaining % 60}m`,
            nextStop: newProgress > 50 ? {
              name: 'Scenic Viewpoint',
              distance: '5 km',
              estimatedTime: '10 min'
            } : {
              name: 'Local Food Stop',
              distance: '12 km',
              estimatedTime: '15 min'
            }
          };
        });
      }, 2000); // Update every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTrip?.status]);

  const startTrip = (from: TripLocation, to: TripLocation) => {
    const newTrip: ActiveTrip = {
      id: Date.now().toString(),
      from,
      to,
      status: 'active',
      startTime: new Date(),
      currentLocation: from,
      progress: 0,
      estimatedTimeRemaining: '5h 0m',
      distanceRemaining: '250 km',
      nextStop: {
        name: 'Local Food Stop',
        distance: '12 km',
        estimatedTime: '15 min'
      }
    };
    
    setActiveTrip(newTrip);
  };

  const updateTripProgress = () => {
    // Manual progress update if needed
    setActiveTrip(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        progress: Math.min(prev.progress + 10, 100)
      };
    });
  };

  const endTrip = () => {
    setActiveTrip(prev => 
      prev ? { ...prev, status: 'completed' } : null
    );
    
    // Clear trip after 5 seconds
    setTimeout(() => {
      setActiveTrip(null);
    }, 5000);
  };

  const isInTripMode = activeTrip?.status === 'active';

  return (
    <TripContext.Provider value={{
      activeTrip,
      startTrip,
      updateTripProgress,
      endTrip,
      isInTripMode
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}