import React, { useState, useEffect, DragEvent} from 'react';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
  } from '@dnd-kit/sortable';
import { CampfireSceneGrid } from './AddScene/CampfireSceneGrid';
import {  SortableScenePhoto } from './AddScene/SortableScenePhotos';
import { ScenePhoto } from './AddScene/ScenePhoto';



export function AddCampFireSceneForm(props) {
  let { setPhotos, photos} = props;
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragStart(event){
    setActiveId(event.active.id);
  }

  function handleDragEnd(event){
    const {active, over} = event;

    if (active.id !== over.id) {
      setPhotos((photos) => {
        const oldIndex = photos.indexOf(active.id);
        const newIndex = photos.indexOf(over.id);

        return arrayMove(photos, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  function handleDragCancel(){
    setActiveId(null);
  }


    return(<DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            >
              <SortableContext items={photos} strategy={rectSortingStrategy}>
                {/* Display in a grid view */}
                <CampfireSceneGrid>
                  {photos.map((item, index) => (
                    <SortableScenePhoto key={item} url={item} index={index} />
                  ))}
                </CampfireSceneGrid>
              </SortableContext>
              {/* drag picture to show current dragged image */}
              <DragOverlay adjustScale={true}>
                {activeId ? (
                  <ScenePhoto url={activeId} />
                ) : null }
              </DragOverlay>
            </DndContext>
    );
}
