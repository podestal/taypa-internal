import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Loader2 } from 'lucide-react'
import useGetFinanceReport from '../../../hooks/kitchen/finance/useGetFinanceReport'
import useGetKitchenAccounts from '../../../hooks/kitchen/account/useGetKitchenAccounts'
import useAuthStore from '../../../store/useAuthStore'
import type { FinanceReportParams } from '../../../services/kitchen/financeService'
import {
    financeTotals,
    type FinanceDatePreset,
} from '../../../utils/financeHelpers'
import { todayISO } from '../../../utils/inventoryHelpers'
import FinanceFilters from './FinanceFilters'
import FinanceSummaryCards from './FinanceSummaryCards'
import FinanceChart from './FinanceChart'
import FinanceReportTable from './FinanceReportTable'

const DashboardMain = () => {
    const access = useAuthStore(state => state.access) || ''
    const { data: accounts, isLoading: accountsLoading, error: accountsError } = useGetKitchenAccounts({ access })

    const accountItems = Array.isArray(accounts) ? accounts : []
    const activeAccounts = accountItems.filter(account => account.is_active)

    const [datePreset, setDatePreset] = useState<FinanceDatePreset>('today')
    const [params, setParams] = useState<FinanceReportParams>({
        start_date: todayISO(),
        end_date: todayISO(),
        account_id: '',
    })

    useEffect(() => {
        if (!params.account_id && activeAccounts.length > 0) {
            setParams(prev => ({
                ...prev,
                account_id: String(activeAccounts[0].id),
            }))
        }
    }, [activeAccounts, params.account_id])

    const { data: report, isLoading: reportLoading, error: reportError } = useGetFinanceReport({
        access,
        params,
        enabled: !!params.account_id,
    })

    const rows = report?.results ?? []
    const totals = useMemo(() => financeTotals(rows), [rows])

    const isLoading = accountsLoading
    const error = accountsError

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                Error al cargar cuentas: {error.message}
            </div>
        )
    }

    if (activeAccounts.length === 0) {
        return (
            <div className="h-full bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-3 mb-6">
                        <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg border border-gray-200">
                        <p>Crea una cuenta activa en Cuentas para ver el reporte financiero</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                >
                    <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        {report?.account_id && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {rows[0]?.account_name ?? activeAccounts.find(a => a.id === report.account_id)?.name}
                                {' · '}{params.start_date} — {params.end_date}
                            </p>
                        )}
                    </div>
                </motion.div>

                <FinanceFilters
                    params={params}
                    accounts={activeAccounts}
                    datePreset={datePreset}
                    onParamsChange={setParams}
                    onDatePresetChange={setDatePreset}
                />

                {reportLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : reportError ? (
                    <div className="text-center text-red-500 py-12 bg-white rounded-lg border border-gray-200">
                        Error al cargar el reporte: {reportError.message}
                    </div>
                ) : (
                    <>
                        <FinanceSummaryCards
                            income={totals.income}
                            expenses={totals.expenses}
                            net={totals.net}
                            opening={totals.opening}
                            closing={totals.closing}
                        />

                        {rows.length > 0 && <FinanceChart rows={rows} />}

                        <FinanceReportTable rows={rows} />
                    </>
                )}
            </div>
        </div>
    )
}

export default DashboardMain
