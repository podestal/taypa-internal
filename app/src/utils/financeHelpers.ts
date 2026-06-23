import type { FinanceReport, FinanceReportRow } from '../services/kitchen/financeService'
import { normalizeList, todayISO } from './inventoryHelpers'

export type FinanceDatePreset = 'today' | 'yesterday' | 'last7days' | 'thisWeek' | 'thisMonth' | 'custom'

export const FINANCE_DATE_PRESETS: { id: FinanceDatePreset; label: string }[] = [
    { id: 'today', label: 'Hoy' },
    { id: 'yesterday', label: 'Ayer' },
    { id: 'last7days', label: 'Últimos 7 días' },
    { id: 'thisWeek', label: 'Esta semana' },
    { id: 'thisMonth', label: 'Este mes' },
]

const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === 'object' ? (value as Record<string, unknown>) : null

const toNumber = (value: unknown) => {
    const parsed = Number(value ?? 0)
    return Number.isNaN(parsed) ? 0 : parsed
}

const toRow = (item: Record<string, unknown>): FinanceReportRow => ({
    date: String(item.date ?? ''),
    account_id: Number(item.account_id ?? 0),
    account_name: String(item.account_name ?? ''),
    opening_balance: toNumber(item.opening_balance),
    income: toNumber(item.income),
    expenses: toNumber(item.expenses),
    closing_balance: toNumber(item.closing_balance),
})

export const normalizeFinanceReport = (data: unknown): FinanceReport => {
    const record = asRecord(data)
    if (!record) {
        return {
            start_date: '',
            end_date: '',
            account_id: 0,
            results: [],
        }
    }

    return {
        start_date: String(record.start_date ?? ''),
        end_date: String(record.end_date ?? ''),
        account_id: Number(record.account_id ?? 0),
        results: normalizeList<Record<string, unknown>>(record.results).map(toRow),
    }
}

export const startOfMonthISO = () => {
    const date = new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
}

export const endOfMonthISO = () => {
    const date = new Date()
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
}

const toDateISO = (date: Date) => date.toISOString().split('T')[0]

export const getFinanceDateRange = (preset: FinanceDatePreset): { start_date: string; end_date: string } => {
    const today = new Date()

    switch (preset) {
        case 'today':
            return { start_date: todayISO(), end_date: todayISO() }
        case 'yesterday': {
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            const iso = toDateISO(yesterday)
            return { start_date: iso, end_date: iso }
        }
        case 'last7days': {
            const start = new Date(today)
            start.setDate(start.getDate() - 6)
            return { start_date: toDateISO(start), end_date: todayISO() }
        }
        case 'thisWeek': {
            const start = new Date(today)
            const day = start.getDay()
            const diff = start.getDate() - day + (day === 0 ? -6 : 1)
            start.setDate(diff)
            return { start_date: toDateISO(start), end_date: todayISO() }
        }
        case 'thisMonth':
            return { start_date: startOfMonthISO(), end_date: todayISO() }
        default:
            return { start_date: todayISO(), end_date: todayISO() }
    }
}

export const sortFinanceRowsAsc = (rows: FinanceReportRow[]) =>
    [...rows].sort((a, b) => a.date.localeCompare(b.date))

export const financeTotals = (rows: FinanceReportRow[]) => {
    const sorted = sortFinanceRowsAsc(rows)
    const income = sorted.reduce((sum, row) => sum + row.income, 0)
    const expenses = sorted.reduce((sum, row) => sum + row.expenses, 0)
    const opening = sorted[0]?.opening_balance ?? 0
    const closing = sorted.length > 0 ? sorted[sorted.length - 1].closing_balance : opening

    return {
        income,
        expenses,
        net: income - expenses,
        opening,
        closing,
    }
}

export const financeChartData = (rows: FinanceReportRow[]) =>
    sortFinanceRowsAsc(rows).map(row => ({
            date: row.date,
            income: row.income,
            expenses: row.expenses,
            net: row.income - row.expenses,
            closing: row.closing_balance,
        }))
