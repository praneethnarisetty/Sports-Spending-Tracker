import { apiEndpoint } from '../config'
import { SpendingLog } from '../types/SpendingLog';
import { CreateSpendingRequest } from '../types/CreateSpendingRequest';
import Axios from 'axios'
import { UpdateSpendingRequest } from '../types/UpdateSpendingRequest';

export async function getSpendings(idToken: string): Promise<SpendingLog[]> {
  console.log('Fetching Spendings')

  const response = await Axios.get(`${apiEndpoint}/spendings`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Spendings:', response.data)
  return response.data.items
}

export async function createSpending(
  idToken: string,
  newSpending: CreateSpendingRequest
): Promise<SpendingLog> {
  const response = await Axios.post(`${apiEndpoint}/spendings`, JSON.stringify(newSpending), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchSpending(
  idToken: string,
  spendingId: string,
  updatedSpending: UpdateSpendingRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/spendings/${spendingId}`, JSON.stringify(updatedSpending), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteSpending(
  idToken: string,
  spendingId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/spendings/${spendingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  spendingId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/spendings/${spendingId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
