"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { CarbonCalculationResult } from "@/types/carbon-calculation-result";

interface ResultCardProps {
  carbonFootprint: CarbonCalculationResult;
}

export default function ResultCard({ carbonFootprint }: ResultCardProps) {
  const {
    totalYearly,
    totalDaily,
    streamingHours,
    emailsPerDay,
    socialMediaHours,
    storageGB,
  } = carbonFootprint;
  const kgPerYear = totalYearly / 1000;
  const lbsPerYear = totalYearly / 453.592;
  const treesNeeded = Math.ceil(kgPerYear / 20); // 1 tree absorbs ~20kg CO2/year

  // Get category and color
  let category = "Moderado";
  let categoryColor = "text-amber-600";
  let categoryBg = "bg-amber-50/50";

  if (kgPerYear < 10) {
    category = "Muito Baixo";
    categoryColor = "text-green-600";
    categoryBg = "bg-green-50/50";
  } else if (kgPerYear < 50) {
    category = "Baixo";
    categoryColor = "text-emerald-600";
    categoryBg = "bg-emerald-50/50";
  } else if (kgPerYear < 100) {
    category = "Moderado";
    categoryColor = "text-amber-600";
    categoryBg = "bg-amber-50/50";
  } else if (kgPerYear < 200) {
    category = "Alto";
    categoryColor = "text-orange-600";
    categoryBg = "bg-orange-50/50";
  } else {
    category = "Muito Alto";
    categoryColor = "text-red-600";
    categoryBg = "bg-red-50/50";
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Result */}
      <Card className="border-2 border-primary bg-linear-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle className="text-lg">Seu Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Pegada de Carbono Anual
            </p>
            <div className="space-y-1">
              <p className="text-5xl font-bold tracking-tight">
                {kgPerYear.toFixed(1)}
              </p>
              <p className="text-lg text-muted-foreground">
                kg CO<sub>2</sub> equivalente/ano
              </p>
            </div>
          </div>

          {/* Category Badge */}
          <div
            className={`px-4 py-3 rounded-lg ${categoryBg} border border-current/20`}
          >
            <p className={`text-sm font-semibold ${categoryColor}`}>
              Nível: {category}
            </p>
          </div>

          {/* Other metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Em Libras</p>
              <p className="text-2xl font-semibold">{lbsPerYear.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">
                lbs CO<sub>2</sub>
              </p>
            </div>
            <div className="p-4 bg-card/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                Árvores Necessárias
              </p>
              <p className="text-2xl font-semibold">{treesNeeded}</p>
              <p className="text-xs text-muted-foreground">para compensar</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <Card className="bg-card/50 border border-border/50">
        <CardHeader>
          <CardTitle className="text-base">
            Distribuição de CO<sub>2</sub> por categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Emissões diárias médias (~{(totalYearly / 365).toFixed(1)}g CO
            <sub>2</sub>)
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Streaming</span>
              <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${((streamingHours / totalDaily) * 100).toFixed(
                      1
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {((streamingHours / totalDaily) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Redes Sociais</span>
              <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${((socialMediaHours / totalDaily) * 100).toFixed(
                      1
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {((socialMediaHours / totalDaily) * 100).toFixed(1)}%%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emails</span>
              <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${((emailsPerDay / totalDaily) * 100).toFixed(1)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {((emailsPerDay / totalDaily) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Amazenamento em Nuvem</span>
              <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{
                    width: `${((storageGB / totalDaily) * 100).toFixed(1)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {((storageGB / totalDaily) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info tip */}
      <Card className="bg-blue-50/50 border border-blue-200/30 dark:bg-blue-950/20 dark:border-blue-900/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Dica de Redução
              </p>
              <ul className="list-disc pl-4">
                <li className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Reduzindo seu tempo de streaming em 1 hora por dia
                  economizaria aproximadamente {((36 * 365) / 1000).toFixed(1)}
                  kg CO
                  <sub>2</sub>/ano.
                </li>
                <li className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Reduzindo seu tempo de em mídias sociais em 1 hora por dia
                  economizaria aproximadamente{" "}
                  {((98.4 * 365) / 1000).toFixed(1)}
                  kg CO
                  <sub>2</sub>/ano.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
