import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { SocialNetwork } from '../types';
/* import { use } from 'react'; */

type DevtreeLinkProps = {
    item: SocialNetwork
}   

function DevtreeLink({item}: DevtreeLinkProps) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  return (
    <li 
      ref={setNodeRef}
      style={style}
      className='bg-white rounded-lg shadow-sm px-5 py-2 flex items-center  gap-3 hover:bg-slate-200 transition-colors duration-200 ease-in-out'
      {...attributes}
      {...listeners}
    >
        <div
            className="w-12 h-12 bg-cover"
            style={{backgroundImage: `url('/social/icon_${item.name}.svg')`}}
            >           
        </div>
        <p className='text-slate-800 font-bold text-xl '>Visita mi: {item.name}</p>
    </li>
  )
}

export default DevtreeLink