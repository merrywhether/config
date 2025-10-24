import { type FC, useState } from 'react';

export const TestComponent: FC = () => {
  const [state, setState] = useState('initial state');

  return (
    <div>
      <h1>Test Component</h1>
      {state}
      <button disabled onClick={() => setState('new state')} type="submit">
        Change state
      </button>
    </div>
  );
};
