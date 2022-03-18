import { SortableScenePhoto } from "./SortableScenePhotos";

export function CampfireSceneGrid({children}) {
    return (
      <div className="grid grid-cols-4 gap-2.5 p-2"
      >
        {children}
      </div>
    );
  }