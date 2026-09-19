import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TechTagList } from '../../../src/components/composite/TechTagList';

describe('Tier 3: TechTagList Composite Component', () => {
  const sampleTags = ['TypeScript', 'React', 'Docker', 'PostgreSQL'];

  it('renders list of tags with default badges', () => {
    render(<TechTagList tags={sampleTags} />);

    sampleTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders prefix when provided (e.g., hashtag #)', () => {
    render(<TechTagList tags={['Architecture', 'Cloud']} prefix="#" />);

    expect(screen.getByText('#Architecture')).toBeInTheDocument();
    expect(screen.getByText('#Cloud')).toBeInTheDocument();
  });

  it('highlights selected tag and triggers onTagClick', () => {
    const handleTagClick = vi.fn();
    render(
      <TechTagList
        tags={sampleTags}
        selectedTag="React"
        onTagClick={handleTagClick}
      />
    );

    const reactTag = screen.getByText('React');
    expect(reactTag).toHaveClass('badge-cyan');

    fireEvent.click(reactTag);
    expect(handleTagClick).toHaveBeenCalledWith('React');
  });

  it('renders nothing when tags list is empty', () => {
    const { container } = render(<TechTagList tags={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
