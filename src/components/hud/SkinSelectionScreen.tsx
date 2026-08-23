import { useRecoilState } from 'recoil';
import { overworldStateAtom } from '@/atoms/overworldStateAtom';
import { currentCharacterNameAtom } from '@/atoms/currentCharacterNameAtom';
import { CHARACTERS } from '@/utils/consts';

export default function SkinSelectionScreen() {
  const [overworldState, setOverworldState] = useRecoilState(overworldStateAtom);
  const [characterName, setCharacterName] = useRecoilState(currentCharacterNameAtom);

  if (overworldState.activeUI !== 'SKIN_SELECTION') return null;

  const handleSelectSkin = (skin: string) => {
    setCharacterName(skin);
    // User can choose to close immediately or keep exploring options
    // I'll leave it open so they can click "Fechar" to exit
    // setOverworldState((prev) => ({ ...prev, activeUI: null }));
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Escolha seu Personagem</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(CHARACTERS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSelectSkin(value)}
              className={`p-4 rounded border-4 transition-all font-bold tracking-wider ${
                characterName === value
                  ? 'border-blue-500 bg-blue-100 text-blue-800 shadow-md scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full transition-colors"
            onClick={() => {
              setOverworldState((prev) => ({ ...prev, activeUI: null }));
            }}
          >
            Voltar ao Jogo
          </button>
        </div>
      </div>
    </div>
  );
}
