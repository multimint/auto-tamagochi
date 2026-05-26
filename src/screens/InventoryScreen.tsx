import { useGame, useNavigate } from '@/context/GameContext';
import { useToast }             from '@/context/ToastContext';
import { resumeAudio }          from '@/utils/audioUtils';

interface ItemDef {
  id:          string;
  name:        string;
  emoji:       string;
  description: string;
  usableWhen:  'always' | 'sick' | 'notSleeping';
}

const ITEMS: ItemDef[] = [
  { id: 'apple',    name: 'Apple',    emoji: '🍎', description: '+15 hunger',                      usableWhen: 'always' },
  { id: 'cookie',   name: 'Cookie',   emoji: '🍪', description: '+5 hunger, +15 happiness',        usableWhen: 'always' },
  { id: 'toy',      name: 'Toy Ball', emoji: '🧸', description: '+20 happiness, -5 energy',        usableWhen: 'notSleeping' },
  { id: 'medicine', name: 'Medicine', emoji: '💊', description: 'Cures sickness, +50 health',      usableWhen: 'sick' },
  { id: 'soap',     name: 'Soap',     emoji: '🧼', description: '+50 cleanliness',                 usableWhen: 'always' },
  { id: 'vitamin',  name: 'Vitamin',  emoji: '🫧', description: '+10 health, +20 energy',          usableWhen: 'always' },
];

export function InventoryScreen() {
  const { dispatch, pet, inventory } = useGame();
  const navigate   = useNavigate();
  const { addToast } = useToast();

  function canUse(item: ItemDef): boolean {
    if (pet.stage === 'dead')          return false;
    if ((inventory[item.id] ?? 0) <= 0) return false;
    if (item.usableWhen === 'sick' && !pet.isSick) return false;
    if (item.usableWhen === 'notSleeping' && pet.isSleeping) return false;
    return true;
  }

  function handleUse(item: ItemDef) {
    resumeAudio();
    if (!canUse(item)) return;
    dispatch({ type: 'USE_ITEM', payload: { itemId: item.id } });
    addToast(`Used ${item.name}! ${item.emoji}`, 'success');
  }

  return (
    <div className="screen" style={{ background: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="top-bar">
        <button
          onClick={() => navigate('pet')}
          aria-label="Back to pet"
          style={{ color: 'var(--color-text)', fontSize: 22, background: 'none', border: 'none', padding: 'var(--space-1)' }}
        >
          ←
        </button>
        <h1 className="top-bar__title">📦 Inventory</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="list-screen">
        {ITEMS.map(item => {
          const qty     = inventory[item.id] ?? 0;
          const usable  = canUse(item);
          const reason  = item.usableWhen === 'sick' && !pet.isSick ? '(pet not sick)' :
                          item.usableWhen === 'notSleeping' && pet.isSleeping ? '(pet sleeping)' :
                          qty <= 0 ? '(none left)' : '';

          return (
            <div key={item.id} className="item-row">
              <span style={{ fontSize: 32, flexShrink: 0 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
                  {item.name} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>× {qty}</span>
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => handleUse(item)}
                disabled={!usable}
                aria-label={`Use ${item.name}${reason ? ' ' + reason : ''}`}
                style={{
                  padding:      'var(--space-2) var(--space-3)',
                  background:   usable ? 'var(--color-primary)' : 'var(--color-border)',
                  color:        usable ? 'white' : 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     'var(--font-size-sm)',
                  fontWeight:   'var(--font-weight-bold)',
                  fontFamily:   'var(--font-body)',
                  border:       'none',
                  whiteSpace:   'nowrap',
                  minHeight:    44,
                }}
              >
                {usable ? 'Use' : reason || 'Use'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
