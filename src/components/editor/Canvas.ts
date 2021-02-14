import './memo/Memo';
import './table/Table';

import {
  defineComponent,
  html,
  FunctionalComponent,
} from '@dineug/lit-observable';
import { styleMap } from 'lit-html/directives/style-map';
import { repeat } from 'lit-html/directives/repeat';
import { useContext } from '@/core/hooks/context.hook';

declare global {
  interface HTMLElementTagNameMap {
    'vuerd-canvas': CanvasElement;
  }
}

export interface CanvasProps {}

export interface CanvasElement extends CanvasProps, HTMLElement {}

const Canvas: FunctionalComponent<CanvasProps, CanvasElement> = (
  props,
  ctx
) => {
  const contextRef = useContext(ctx);

  return () => {
    const {
      canvasState,
      memoState: { memos },
    } = contextRef.value.store;

    return html`
      <div
        class="vuerd-canvas"
        style=${styleMap({
          width: `${canvasState.width}px`,
          height: `${canvasState.height}px`,
          top: `${canvasState.scrollTop}px`,
          left: `${canvasState.scrollLeft}px`,
        })}
      >
        ${repeat(
          memos,
          memo => memo.id,
          memo => html`<vuerd-memo .memo=${memo}></vuerd-memo>`
        )}
      </div>
    `;
  };
};

defineComponent('vuerd-canvas', {
  shadow: false,
  render: Canvas,
});
