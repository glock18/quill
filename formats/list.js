import Block from '../blots/block';
import Container from '../blots/container';
import Quill from '../core/quill';

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

class ListItem extends Block {
  static create(value) {
    const isOrderedList =
      typeof value === 'string' && value.indexOf('ordered') === 0;
    const start = isOrderedList ? value.split(',').pop() : null;
    const node = super.create();
    node.setAttribute('data-list', value);

    if (start) {
      node.setAttribute('start', start);
    }
    return node;
  }

  static formats(domNode) {
    // return domNode.getAttribute('data-list') || undefined;
    if (domNode.parentNode && domNode.parentNode.tagName === 'OL') {
      return `ordered${
        domNode.hasAttribute('start') ? `,${domNode.getAttribute('start')}` : ''
      }`;
    }
    if (domNode.parentNode && domNode.parentNode.tagName === 'UL') {
      if (domNode.hasAttribute('data-checked')) {
        return domNode.getAttribute('data-checked') === 'true'
          ? 'checked'
          : 'unchecked';
      }
      return 'bullet';
    }
    return undefined;
  }

  static register() {
    Quill.register(ListContainer);
  }

  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = e => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      if (format === 'checked') {
        this.format('list', 'unchecked');
        e.preventDefault();
      } else if (format === 'unchecked') {
        this.format('list', 'checked');
        e.preventDefault();
      }
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    this.attachUI(ui);
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-list', value);
    } else {
      super.format(name, value);
    }
  }
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

ListContainer.allowedChildren = [ListItem];
// ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };
