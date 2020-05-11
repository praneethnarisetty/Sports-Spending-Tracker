/**
 * Fields in a request to create a single Spending item.
 */
export interface CreateSpendingRequest {
  name: string
  date: string
  amount: number
  category: string
}
