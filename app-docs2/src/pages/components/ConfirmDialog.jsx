import { useMemo, useState } from 'react';
import Modal from './Modal.jsx';


export function useConfirm() {
  const [state, setState] = useState({ open: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', onConfirm: null });

  const api = useMemo(
    () => ({
      confirm: ({ title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) => {
        setState({ open: true, title, message, confirmText, cancelText, onConfirm });
      },
      _hide: () => setState((s) => ({ ...s, open: false, onConfirm: null })),
    }),
    [],
  );

  const Dialog = (
    <Modal
      open={state.open}
      title={state.title}
      onCancel={() => api._hide()}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      onConfirm={() => {
        const fn = state.onConfirm;
        api._hide();
        fn?.();
      }}
    >
      {state.message}
    </Modal>
  );

  return { confirm: api.confirm, Dialog };
}

