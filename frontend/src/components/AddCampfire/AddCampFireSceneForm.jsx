import React, { useState, useEffect, DragEvent, Fragment, useRef} from 'react';
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
import "../../index.css";
import { SwipeableDrawer } from '@mui/material';
import {api} from "../api";



export function AddCampFireSceneForm(props) {
  let { setPhotos, photos, setErrorMessage} = props;
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [visible, setVisible] = useState(false);
  const [img, setImg] = useState(null);

  function handleDragStart(event){
    console.log(photos);
    setActiveId(event.active.id);
    setImg(event.active.id);
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

  function toggleVisible(open){
    setVisible(open);
  }

  const handleAddImage = (e) => {
    if( e.currentTarget.files !== null){
      api.addImage(e.currentTarget.files[0]).then(res => {
        setPhotos([...photos, "http://localhost:4000" + res.url]);
        }).catch((error)=>{
          setErrorMessage(error);
        });
    }
};

const handleRemoveScene = (img_idx) => {
  setPhotos((photos) => {
    let newPhotos = [...photos];
    newPhotos.splice(img_idx, 1);
    return newPhotos;
  });
};

  const drawerBleeding = 56;
    return(<Fragment>
      <div className=' h-3/5 w-full' style={{height: '80vh'}}>
        {img ?
        <div className='m-auto h-full w-full grid place-content-center z-10 overflow-y-hidden object-cover'>
          <img src={img}/>
        </div>
        :
        <div className='m-auto h-full w-full p-5 text-xl text-white grid place-content-center'>Select a photo</div>
      }
      </div>
            {/* <div className='my-4 h-10 w-10 btn m-auto' onClick={toggleVisible(true)}>Expand</div> */}
             {/* <SwipeableDrawer anchor='bottom' 
              open={visible} onClose={toggleVisible(false)} onOpen={toggleVisible(true)}
              swipeAreaWidth={drawerBleeding} disableSwipeToOpen={false} > */}
                <div
                style={{
                  position: 'absolute',
                  top: -drawerBleeding,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  visibility: 'visible',
                  right: 0,
                  left: 0,
                }}
              >
                <div>51 results</div>
              </div>

              <DndContext sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              >
                  {/* Display in a grid view */}
                  <CampfireSceneGrid>
                  <SortableContext items={photos} strategy={rectSortingStrategy}>
                    {photos.map((item, index) => (
                      <SortableScenePhoto key={item} url={item} index={index} deletePhoto={() => handleRemoveScene(index)}/>
                    ))}
                    </SortableContext>
                    <div className="h-52 w-full bg-slate-400 btn flex place-items-center">
                    <input type="file" name="addImage" id='addImage' accept='image/*'hidden onChange={handleAddImage} />
                    <label htmlFor="addImage" className="w-14 h-14 m-auto btn btn_add"/>
                    </div> 
                  </CampfireSceneGrid>
                   
                {/* drag picture to show current dragged image */}
                <DragOverlay adjustScale={true}>
                  {activeId ? (
                    <ScenePhoto url={activeId} />
                  ) : null }
                </DragOverlay>
              </DndContext>
            {/* </SwipeableDrawer> */}

          </Fragment>
    );
}
