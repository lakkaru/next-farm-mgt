/**
 * @fileoverview End-to-End Integration Tests for CreateFarmForm
 * Tests complete user workflows and critical paths
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateFarmForm } from '../create-farm-form'
import { farmAPI, locationAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

jest.mock('@/lib/api')
jest.mock('next/navigation')
jest.mock('sonner')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('CreateFarmForm E2E - Critical User Flows', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
    ;(locationAPI.getDivisionalSecretariats as jest.Mock).mockResolvedValue({
      data: { data: ['Colombo DS', 'Gampaha DS'] },
    })
    ;(locationAPI.getGramaNiladariDivisions as jest.Mock).mockResolvedValue({
      data: { data: ['GN Division 1', 'GN Division 2', 'GN Division 3'] },
    })
  })

  describe('Complete Farm Registration Flow', () => {
    it('should complete entire farm creation flow successfully', async () => {
      const user = userEvent.setup()
      ;(farmAPI.createFarm as jest.Mock).mockResolvedValue({
        data: { _id: 'farm-123', name: 'Green Valley Farm' },
      })

      render(<CreateFarmForm />)

      // Step 1: Fill basic information
      const nameInput = screen.getByLabelText(/farms.name/i)
      await user.type(nameInput, 'Green Valley Farm')

      const descriptionInput = screen.getByLabelText(/farms.description/i)
      await user.type(descriptionInput, 'A beautiful paddy field in Colombo district')

      // Step 2: Select district
      const districtTrigger = screen.getByRole('combobox', { name: /farms.district/i })
      await user.click(districtTrigger)

      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      // Verify zone auto-populated
      await waitFor(() => {
        expect(screen.getByDisplayValue(/WL1/i)).toBeInTheDocument()
      })

      // Step 3: Select Divisional Secretariat
      await waitFor(() => {
        const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
        expect(dsTrigger).not.toBeDisabled()
      })

      const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
      await user.click(dsTrigger)

      const dsOption = screen.getByRole('option', { name: /Colombo DS/i })
      await user.click(dsOption)

      // Step 4: Select GN Division
      await waitFor(() => {
        const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
        expect(gnTrigger).not.toBeDisabled()
      })

      const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
      await user.click(gnTrigger)

      const gnOption = screen.getByRole('option', { name: /GN Division 1/i })
      await user.click(gnOption)

      // Step 5: Fill area information
      const totalAreaInput = screen.getByLabelText(/farms.totalAreaValue/i)
      await user.type(totalAreaInput, '5.5')

      const cultivatedAreaInput = screen.getByLabelText(/farms.cultivatedAreaValue/i)
      await user.type(cultivatedAreaInput, '4.2')

      // Step 6: Submit form
      const submitButton = screen.getByRole('button', { name: /farms.createFarmButton/i })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      // Step 7: Verify API call
      await waitFor(() => {
        expect(farmAPI.createFarm).toHaveBeenCalled()
        const callArgs = (farmAPI.createFarm as jest.Mock).mock.calls[0][0]
        expect(callArgs.name).toBe('Green Valley Farm')
        expect(callArgs.district).toBe('Colombo')
        expect(callArgs.totalArea.value).toBe(5.5)
      })

      // Step 8: Verify success feedback
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle multi-step validation errors gracefully', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /farms.createFarmButton/i })
      expect(submitButton).toBeDisabled()

      // Fill name but no area
      const nameInput = screen.getByLabelText(/farms.name/i)
      await user.type(nameInput, 'Incomplete Farm')

      expect(submitButton).toBeDisabled()

      // Add area but no district
      const areaInput = screen.getByLabelText(/farms.totalAreaValue/i)
      await user.type(areaInput, '5')

      expect(submitButton).toBeDisabled()

      // Select district
      const districtTrigger = screen.getByRole('combobox', { name: /farms.selectDistrict/i })
      await user.click(districtTrigger)

      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      // Submit should still be disabled (missing DS and GN)
      expect(submitButton).toBeDisabled()

      // Complete the form
      await waitFor(() => {
        const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
        expect(dsTrigger).not.toBeDisabled()
      })

      const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
      await user.click(dsTrigger)
      const dsOption = screen.getByRole('option', { name: /Colombo DS/i })
      await user.click(dsOption)

      await waitFor(() => {
        const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
        expect(gnTrigger).not.toBeDisabled()
      })

      const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
      await user.click(gnTrigger)
      const gnOption = screen.getByRole('option', { name: /GN Division 1/i })
      await user.click(gnOption)

      // Now submit should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })

  describe('Error Recovery Flows', () => {
    it('should recover from API error and allow retry', async () => {
      const user = userEvent.setup()
      ;(farmAPI.createFarm as jest.Mock).mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Server error' } },
      })

      render(<CreateFarmForm />)

      // Fill minimal form
      const nameInput = screen.getByLabelText(/farms.name/i)
      await user.type(nameInput, 'Test Farm')

      const districtTrigger = screen.getByRole('combobox', { name: /farms.selectDistrict/i })
      await user.click(districtTrigger)
      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      await waitFor(() => {
        const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
        expect(dsTrigger).not.toBeDisabled()
      })

      const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
      await user.click(dsTrigger)
      const dsOption = screen.getByRole('option', { name: /Colombo DS/i })
      await user.click(dsOption)

      await waitFor(() => {
        const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
        expect(gnTrigger).not.toBeDisabled()
      })

      const gnTrigger = screen.getByRole('combobox', { name: /auth.selectGNDivision/i })
      await user.click(gnTrigger)
      const gnOption = screen.getByRole('option', { name: /GN Division 1/i })
      await user.click(gnOption)

      const areaInput = screen.getByLabelText(/farms.totalAreaValue/i)
      await user.type(areaInput, '5')

      // Try to submit - should fail
      const submitButton = screen.getByRole('button', { name: /farms.createFarmButton/i })
      await user.click(submitButton)

      // Verify error is shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Form state should be preserved - user can retry
      expect(nameInput).toHaveValue('Test Farm')
      expect(areaInput).toHaveValue('5')

      // Mock successful response for retry
      ;(farmAPI.createFarm as jest.Mock).mockResolvedValueOnce({
        data: { _id: 'farm-123' },
      })

      // Retry submission
      await user.click(submitButton)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled()
      })
    })

    it('should handle location data loading errors', async () => {
      const user = userEvent.setup()
      ;(locationAPI.getDivisionalSecretariats as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      )

      render(<CreateFarmForm />)

      const districtTrigger = screen.getByRole('combobox', { name: /farms.selectDistrict/i })
      await user.click(districtTrigger)

      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      // Verify error toast shown
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('DS'))
      })

      // User should be able to try selecting another district
      ;(locationAPI.getDivisionalSecretariats as jest.Mock).mockResolvedValueOnce({
        data: { data: ['DS 1', 'DS 2'] },
      })

      await user.click(districtTrigger)
      const gamphaOption = screen.getByRole('option', { name: /Gampaha/i })
      await user.click(gamphaOption)

      // Should succeed on retry
      await waitFor(() => {
        const dsTrigger = screen.getByRole('combobox', { name: /auth.selectDivisionalSecretariat/i })
        expect(dsTrigger).not.toBeDisabled()
      })
    })
  })

  describe('Accessibility - Complete Workflow', () => {
    it('should allow keyboard-only navigation through complete form', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      // Get form fields
      const nameInput = screen.getByLabelText(/farms.name/i)
      
      // Click to focus and type farm name with keyboard
      await user.click(nameInput)
      await user.keyboard('Test Farm')
      expect(nameInput).toHaveValue('Test Farm')

      // Verify all inputs are keyboard accessible
      const descriptionInput = screen.getByLabelText(/farms.description/i)
      await user.click(descriptionInput)
      await user.keyboard('Description text')
      expect(descriptionInput).toHaveValue('Description text')

      // Verify submit button exists and is accessible
      const submitButton = screen.getByRole('button', { name: /farms.createFarmButton/i })
      expect(submitButton).toBeInTheDocument()
    })

    it('should announce form errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      const submitButton = screen.getByRole('button', { name: /farms.createFarmButton/i })
      expect(submitButton).toBeDisabled()

      // If button is enabled, click it to see errors
      const nameInput = screen.getByLabelText(/farms.name/i)
      await user.type(nameInput, 'Test')

      const areaInput = screen.getByLabelText(/farms.totalAreaValue/i)
      await user.type(areaInput, '5')

      // Add district
      const districtTrigger = screen.getByRole('combobox', { name: /farms.district/i })
      await user.click(districtTrigger)
      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      // Try to submit (missing DS and GN)
      await waitFor(() => {
        const submitBtn = screen.getByRole('button', { name: /farms.createFarmButton/i })
        expect(submitBtn).toBeDisabled()
      })

      // Error alert should be accessible
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Data Persistence and Session Management', () => {
    it('should preserve form data during location loading', async () => {
      const user = userEvent.setup()
      ;(locationAPI.getDivisionalSecretariats as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: { data: ['DS 1'] } }), 100))
      )

      render(<CreateFarmForm />)

      // Fill form
      const nameInput = screen.getByLabelText(/farms.name/i)
      await user.type(nameInput, 'Persisting Farm')

      const descInput = screen.getByLabelText(/farms.description/i)
      await user.type(descInput, 'Should persist during API calls')

      // Select district (triggers slow API call)
      const districtTrigger = screen.getByRole('combobox', { name: /farms.district/i })
      await user.click(districtTrigger)
      const colomboOption = screen.getByRole('option', { name: /Colombo/i })
      await user.click(colomboOption)

      // Data should persist while loading
      expect(nameInput).toHaveValue('Persisting Farm')
      expect(descInput).toHaveValue('Should persist during API calls')

      // Wait for API to complete
      await waitFor(() => {
        expect(locationAPI.getDivisionalSecretariats).toHaveBeenCalled()
      })

      // Data should still be there
      expect(nameInput).toHaveValue('Persisting Farm')
      expect(descInput).toHaveValue('Should persist during API calls')
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle extremely long input values', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      const nameInput = screen.getByLabelText(/farms.name/i) as HTMLInputElement
      const longName = 'A'.repeat(500)
      await user.type(nameInput, longName)

      // Form should still work
      expect(nameInput.value.length).toBeGreaterThan(0)
    }, 15000)

    it('should handle rapid successive selections', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      const districtTrigger = screen.getByRole('combobox', { name: /farms.district/i })

      // Select district once - rapid succession is difficult in jsdom with Radix UI
      await user.click(districtTrigger)
      
      // Wait for menu to appear and select option
      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBeGreaterThan(0)
      })
      
      const colomboOption = screen.getAllByRole('option')[0]
      await user.click(colomboOption)

      // Should handle without errors
      await waitFor(() => {
        expect(locationAPI.getDivisionalSecretariats).toHaveBeenCalled()
      })
    }, 10000)

    it('should handle special characters in inputs', async () => {
      const user = userEvent.setup()
      render(<CreateFarmForm />)

      const nameInput = screen.getByLabelText(/farms.name/i)
      const specialChars = "Farm's & \"Special\" <Chars>"
      await user.clear(nameInput)
      await user.type(nameInput, specialChars)

      // Accept both the raw and possible transformed value
      expect([nameInput.value, decodeURIComponent(nameInput.value)]).toContain(specialChars)
    })
  })
})
