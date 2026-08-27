/** @jsxImportSource solid-js */
import { type Component, createSignal } from 'solid-js';

export const TestComponent: Component = () => {
  const [state, setState] = createSignal('initial state');

  return (
    <div>
      <h1>Test Component</h1>
      {state()}
      <button disabled onClick={() => setState('new state')} type="submit">
        Change state
      </button>
    </div>
  );
};
