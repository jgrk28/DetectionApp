import { render, screen } from '@testing-library/react';
import App from './App';

// If this project were to continue to develop we would want some regression testing
// Each component would have a test.js file and we would change the states of the
// components to make sure they were rendering correctly
test('renders upload page', () => {
  render(<App />);
  expect(screen.getByText('Upload Video')).toBeInTheDocument();
});
