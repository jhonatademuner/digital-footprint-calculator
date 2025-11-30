"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import CarbonForm from "@/components/carbon-form"
import ResultCard from "@/components/result-card"
import CommunityStats from "@/components/community-stats"
import { CarbonCalculationResult } from "@/types/carbon-calculation-result"

export default function Home() {
  const [result, setResult] = useState<CarbonCalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-background" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Calculadora de Pegada Digital
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Calcule seu impacto ambiental digital e contribua para estatísticas de comunidade
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Seus Dados</CardTitle>
                <CardDescription>
                  Informe seus hábitos digitais diários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarbonForm
                  onCalculate={(carbonFootprint) => {
                    setResult(carbonFootprint);
                    setShowResult(true);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {showResult && result !== null && (
              <ResultCard carbonFootprint={result} />
            )}

            {/* Community Stats */}
            <CommunityStats />

            {/* Info Cards */}
            {!showResult && (
              <div className="space-y-4">
                <Card className="bg-card/50 border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      Como funciona?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      A calculadora estima sua pegada de carbono digital baseada
                      em:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>
                        • <strong>Streaming:</strong> 36g CO<sub>2</sub>/hora
                        (alta qualidade)
                      </li>
                      <li>
                        • <strong>Emails:</strong> 4g CO<sub>2</sub> por email
                        enviado
                      </li>
                      <li>
                        • <strong>Redes Sociais:</strong> 98.4g CO<sub>2</sub>
                        /hora
                      </li>
                      <li>
                        • <strong>Cloud Storage:</strong> 0.5kg CO<sub>2</sub>
                        /GB/ano
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Dicas para Reduzir
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <ul className="space-y-2">
                      <li className="flex gap-2">
                        <span className="text-primary">→</span>
                        Reduza a qualidade de streaming quando possível
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">→</span>
                        Limpe regularmente emails antigos e desnecessários
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">→</span>
                        Defina limites de tempo em redes sociais
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">→</span>
                        Delete arquivos em nuvem que não mais usa
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Jhonata Demuner © 2025 • Desenvolvido para fins educacionais
          </p>
        </div>
      </footer>
    </div>
  );
}
