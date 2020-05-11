/**
 * Fields in a request to update a single Spending item.
 */
export interface UpdateSpendingRequest {
  name: string
  date: string
  amount: number
  category: string
}