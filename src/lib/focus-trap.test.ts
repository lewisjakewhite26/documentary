import { describe, expect, it } from 'vitest';
import { getFocusableElements } from './focus-trap';

describe('getFocusableElements', () => {
  it('finds buttons inside a container', () => {
    document.body.innerHTML = `
      <div id="trap">
        <button type="button">One</button>
        <button type="button">Two</button>
      </div>
    `;
    const trap = document.getElementById('trap')!;
    expect(getFocusableElements(trap)).toHaveLength(2);
  });
});
