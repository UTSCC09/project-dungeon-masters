import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ScenePhoto} from './ScenePhoto';
import "../../../index.css";

export const SortableScenePhoto = (props) => {
  const {url, index, deletePhoto} = props;
  const sortable = useSortable({id: props.url});
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className='relative'>
    <ScenePhoto
      ref={setNodeRef}
      style={style}
      url={url}
      index={index}
      {...attributes}
      {...listeners}
    />
    <div className='m-4 btn btn_remove w-8 h-8 z-10 col-span-1 absolute top-0 right-0' onClick={deletePhoto}/>
    </div>
  );
};
