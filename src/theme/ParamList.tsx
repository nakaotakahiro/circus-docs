import React, { ReactElement, ReactNode } from 'react';

const isElement = (node: ReactNode): node is ReactElement<{ children?: ReactNode }> =>
  React.isValidElement(node);

const nodeToText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isElement(node)) return nodeToText(node.props.children);
  return '';
};

const parseStringTerm = (value: string) => {
  const match = value.match(/^\s*['"]([^'"]+)['"]:\s*(.*)$/s);
  if (!match) return null;
  return { term: match[1], rest: match[2] };
};

const splitTerm = (children: ReactNode) => {
  const nodes = React.Children.toArray(children);
  const [first, second, ...tail] = nodes;

  if (typeof first === 'string') {
    const parsed = parseStringTerm(first);
    if (!parsed) return null;
    return {
      term: parsed.term,
      rest: [parsed.rest, second, ...tail].filter(Boolean),
    };
  }

  return null;
};

const splitListItem = (item: ReactElement) => {
  const itemChildren = React.Children.toArray(item.props.children);
  const [first, ...tail] = itemChildren;

  if (isElement(first) && first.type === 'p') {
    const parsed = splitTerm(first.props.children);
    if (!parsed) return null;
    return {
      term: parsed.term,
      description: [
        parsed.rest.length > 0 ? <p>{parsed.rest}</p> : null,
        ...tail,
      ].filter(Boolean),
    };
  }

  const parsed = splitTerm(itemChildren);
  if (!parsed) return null;
  return {
    term: parsed.term,
    description: parsed.rest,
  };
};

const collectEntries = (children: ReactNode) => {
  const entries: Array<{ term: string; description: ReactNode[] }> = [];

  const visit = (nodes: ReactNode, inListContainer = false) => {
    for (const child of React.Children.toArray(nodes)) {
      if (!isElement(child)) continue;

      const parsed = splitListItem(child);
      if (parsed) {
        entries.push(parsed);
        continue;
      }

      const childElements = React.Children.toArray(child.props.children).filter(
        isElement
      );
      const hasDirectItems = childElements.some(item => !!splitListItem(item));
      if (hasDirectItems) {
        visit(child.props.children, true);
        continue;
      }

      if (inListContainer && entries.length > 0) {
        entries[entries.length - 1].description.push(child);
        continue;
      }

      visit(child.props.children, false);
    }
  };

  visit(children);
  return entries;
};

export const ParamList = ({ children }: { children: ReactNode }) => (
  <dl>
    {collectEntries(children).map((entry, index) => (
      <React.Fragment key={index}>
        <dt>{entry.term}</dt>
        <dd>{entry.description}</dd>
      </React.Fragment>
    ))}
  </dl>
);
