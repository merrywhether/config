import { type FC, useState } from 'react';

export const TestComponent: FC = () => {
  const [state, setState] = useState('initial state');

  return (
    <div>
      <h1>Test Component</h1>
      {state}
      <button children="Change state" onClick={() => setState('new state')} />
    </div>
  );
};
