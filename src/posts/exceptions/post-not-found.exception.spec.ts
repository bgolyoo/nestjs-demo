import { PostNotFoundException } from './post-not-found.exception';

describe('PostNotFoundException', () => {
  it('should be defined', () => {
    expect(new PostNotFoundException(1)).toBeDefined();
  });
});
