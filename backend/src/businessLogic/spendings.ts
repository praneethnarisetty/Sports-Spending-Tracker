import * as uuid from 'uuid'

import { SpendingLog } from '../models/SpendingLog'
import { SpendingLogUpdate } from '../models/SpendingLogUpdate'
import { SpendingAccess } from '../dataLayer/spendingccess'
import { CreateSpendingRequest } from '../requests/CreateSpendingRequest'
import { UpdateSpendingRequest } from '../requests/UpdateSpendingRequest'
import { parseUserId } from '../auth/utils'

const spendingAccess = new SpendingAccess()

export async function getAllSpendings(jwtToken: string): Promise<SpendingLog[]> {
    const userid = parseUserId(jwtToken)
    return spendingAccess.getAllSpendings(userid)
}

export async function createspending(
    createSpendingRequest: CreateSpendingRequest,
    jwtToken: string
): Promise<SpendingLog> {
    const spendingId = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await spendingAccess.createSpending({
        spendingId,
        userId,
        name: createSpendingRequest.name,
        date: createSpendingRequest.date,
        createdAt: new Date().toISOString(),
        category: createSpendingRequest.category,
        amount: createSpendingRequest.amount
    })
}

export async function updateSpending(
    spendingId: string,
    updateSpendingRequest: UpdateSpendingRequest,
    jwtToken: string
): Promise<SpendingLogUpdate> {
    const userId = parseUserId(jwtToken)

    return await spendingAccess.updateSpending(spendingId, {
        name: updateSpendingRequest.name,
        date: updateSpendingRequest.date,
        category: updateSpendingRequest.category,
        amount: updateSpendingRequest.amount
    }, userId)
}

export async function updatSpendingImageUrl(imageUrl: string, userId: string, spendingId: string): Promise<any> {
    return spendingAccess.updateSpendingImageUrl(imageUrl, userId, spendingId)
}

export async function deleteSpending(
    spendingId: string,
    jwtToken: string
): Promise<any> {
    const userId = parseUserId(jwtToken)
    return await spendingAccess.deleteSpending(spendingId, userId)
}