import KitchenClient from "./kitchenClient"

export interface FinanceReportRow {
    date: string
    account_id: number
    account_name: string
    opening_balance: number
    income: number
    expenses: number
    closing_balance: number
}

export interface FinanceReport {
    start_date: string
    end_date: string
    account_id: number
    results: FinanceReportRow[]
}

export interface FinanceReportParams {
    start_date: string
    end_date: string
    account_id: string
}

const getFinanceReportService = () =>
    new KitchenClient<FinanceReport>('finance/report/')

export default getFinanceReportService
