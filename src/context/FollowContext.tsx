import React, { createContext, useContext, ReactNode } from 'react';
import { FollowCounts } from '../component/Dieter/layout/LeftSidebar/types';

interface FollowContextType {
  refreshFollowCounts: () => Promise<void>;
  followCounts: FollowCounts;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

interface FollowProviderProps {
  children: ReactNode;
  refreshFollowCounts: () => Promise<void>;
  followCounts: FollowCounts;
}

export const FollowProvider: React.FC<FollowProviderProps> = ({
  children,
  refreshFollowCounts,
  followCounts,
}) => {
  return (
    <FollowContext.Provider value={{ refreshFollowCounts, followCounts }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollowContext = () => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollowContext must be used within a FollowProvider');
  }
  return context;
};

export const useFollowContextOptional = () => {
  return useContext(FollowContext);
};
