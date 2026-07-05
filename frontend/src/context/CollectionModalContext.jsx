import React, { createContext, useContext, useState } from "react";

const CollectionModalContext = createContext(null);

export function CollectionModalProvider({ children }) {
  const [targetFileId, setTargetFileId] = useState(null);

  const openCollectionModal = (fileId) => setTargetFileId(fileId);
  const closeCollectionModal = () => setTargetFileId(null);

  return (
    <CollectionModalContext.Provider value={{ targetFileId, openCollectionModal, closeCollectionModal }}>
      {children}
    </CollectionModalContext.Provider>
  );
}

export const useCollectionModal = () => useContext(CollectionModalContext);