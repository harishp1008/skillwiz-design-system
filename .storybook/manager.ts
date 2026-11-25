import { addons } from 'storybook/manager-api';
import { STORY_CHANGED, STORY_RENDERED } from 'storybook/internal/core-events';

/**
 * Component convention: every component has a Guidelines story and a Playground story.
 * Guidelines (tagged 'guidelines') hides the addon panel; every other story shows it.
 *
 * STORY_RENDERED covers a fresh page load (STORY_CHANGED does not fire for the first story);
 * STORY_CHANGED covers navigating between stories.
 */
addons.register('skillwiz/panel-by-story', (api) => {
  const sync = (storyId: string) => {
    const story = api.getData(storyId);
    if (!story || story.type !== 'story') return;
    api.togglePanel(!story.tags?.includes('guidelines'));
  };
  api.on(STORY_CHANGED, sync);
  api.on(STORY_RENDERED, sync);
});
