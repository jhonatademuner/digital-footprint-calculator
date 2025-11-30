"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CommunityStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageFootprint: 0,
    minFootprint: 0,
    maxFootprint: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommunityStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createClient()
        const { data, error: fetchError } = await supabase.from("carbon_footprints").select("annual_co2_kg")

        if (fetchError) {
          console.error("Fetch error:", fetchError)
          setError("Erro ao carregar estatísticas")
          setIsLoading(false)
          return
        }

        if (!data || data.length === 0) {
          // No data yet, show empty state
          setStats({
            totalUsers: 0,
            averageFootprint: 0,
            minFootprint: 0,
            maxFootprint: 0,
          })
          setIsLoading(false)
          return
        }

        const footprints = data.map((item: any) => item.annual_co2_kg)
        const average = footprints.reduce((a: number, b: number) => a + b, 0) / footprints.length
        const min = Math.min(...footprints)
        const max = Math.max(...footprints)

        setStats({
          totalUsers: data.length,
          averageFootprint: average,
          minFootprint: min,
          maxFootprint: max,
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Erro ao carregar dados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunityStats()

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(fetchCommunityStats, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-5 h-5" />
          Estatísticas da Comunidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : stats.totalUsers === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum dado de comunidade ainda. Seja o primeiro a calcular!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Usuários</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Média Anual</p>
                <p className="text-2xl font-bold">
                  {stats.averageFootprint.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  kg CO<sub>2</sub>
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Mínimo da Comunidade
                </span>
                <span className="font-semibold">
                  {stats.minFootprint.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Máximo da Comunidade
                </span>
                <span className="font-semibold">
                  {stats.maxFootprint.toFixed(1)} kg
                </span>
              </div>
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground pt-2">
          Cada cálculo adicionado aqui contribui para nossas estatísticas de
          comunidade.
        </p>
      </CardContent>
    </Card>
  );
}
