import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../Functions/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Test Stock' }],
    });
  });

  test('renders some text in Home', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
  });
});
