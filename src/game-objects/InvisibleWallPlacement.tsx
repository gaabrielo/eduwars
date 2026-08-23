import { Placement } from '@/game-objects/Placement';
import { DEBUG_MODE } from '@/utils/consts';

const textShadow = '0.25px 0.25px 0px #000, -0.25px -0.25px 0px #000, 0.25px -0.25px 0px #000, -0.25px 0.25px 0px #000';

export class InvisibleWallPlacement extends Placement {
  isSolidForBody(_body: any) {
    return true;
  }

  renderComponent() {
    if (DEBUG_MODE) {
      return (
        <div 
          style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: 'rgba(255, 0, 0, 0.4)',
            border: '0.5px solid rgba(255, 0, 0, 0.4)',
            position: 'relative',
          }} 
        >
          <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
            <span className="text-[0.25rem] text-yellow-300" style={{ textShadow }}>{this.x}</span>
            <span className="text-[0.25rem] text-yellow-300" style={{ textShadow }}>x</span>
            <span className="text-[0.25rem] text-yellow-300" style={{ textShadow }}>{this.y}</span>
          </div>
        </div>
      );
    }
    return null;
  }
}
