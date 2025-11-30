"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CarbonCalculationResult } from "@/types/carbon-calculation-result"

interface CarbonFormProps {
  onCalculate: (carbonFootprint: CarbonCalculationResult) => void;
}

export default function CarbonForm({ onCalculate }: CarbonFormProps) {
  const [streaming, setStreaming] = useState("")
  const [emails, setEmails] = useState("")
  const [socialMedia, setSocialMedia] = useState("")
  const [cloudStorage, setCloudStorage] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setSessionId(id)
  }, [])

  const calculateCarbonFootprint = async () => {
    try {
      setError(null)
      const streamingHours = Number.parseFloat(streaming) || 0
      const emailsPerDay = Number.parseFloat(emails) || 0
      const socialMediaHours = Number.parseFloat(socialMedia) || 0
      const storageGB = Number.parseFloat(cloudStorage) || 0

      // CO2 emissions factors (in grams)
      const streamingEmission = streamingHours * 36
      const emailsEmission = emailsPerDay * 4
      const socialMediaEmission = socialMediaHours * 98.4
      const storageEmission = (storageGB * 500) / 365

      const totalDaily = streamingEmission + emailsEmission + socialMediaEmission + storageEmission
      const totalYearly = totalDaily * 365

      const result: CarbonCalculationResult = {
        totalYearly: totalYearly,
        totalDaily: totalDaily,
        streamingHours: streamingEmission,
        emailsPerDay: emailsEmission,
        socialMediaHours: socialMediaEmission,
        storageGB: storageEmission,
      };

      setIsCalculating(true)

      const supabase = createClient()
      const { error: insertError } = await supabase.from("carbon_footprints").insert({
        streaming_hours: streamingHours,
        daily_emails: emailsPerDay,
        social_media_hours: socialMediaHours,
        cloud_storage_gb: storageGB,
        annual_co2_kg: totalYearly / 1000,
        session_id: sessionId,
      })

      if (insertError) {
        console.error("Insert error:", insertError)
        setError("Erro ao salvar dados. Tente novamente.")
        setIsCalculating(false)
        return
      }

      // Show result with animation
      setTimeout(() => {
        onCalculate(result)
        setIsCalculating(false)
      }, 600)
    } catch (err) {
      console.error("Error:", err)
      setError("Erro ao calcular pegada. Tente novamente.")
      setIsCalculating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId) {
      setError("Por favor, aguarde o carregamento...")
      return
    }
    calculateCarbonFootprint()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="streaming" className="text-sm font-medium">
          Horas de Streaming/dia
        </Label>
        <div className="relative">
          <Input
            id="streaming"
            type="number"
            step="0.5"
            min="0"
            placeholder="Ex: 2"
            value={streaming}
            onChange={(e) => setStreaming(e.target.value)}
            className="bg-input border border-border"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">h</span>
        </div>
        <p className="text-xs text-muted-foreground">Netflix, YouTube, etc.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emails" className="text-sm font-medium">
          Emails enviados/dia
        </Label>
        <div className="relative">
          <Input
            id="emails"
            type="number"
            step="1"
            min="0"
            placeholder="Ex: 50"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="bg-input border border-border"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">msgs</span>
        </div>
        <p className="text-xs text-muted-foreground">Trabalho, pessoal, etc.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="social" className="text-sm font-medium">
          Redes Sociais/dia
        </Label>
        <div className="relative">
          <Input
            id="social"
            type="number"
            step="0.5"
            min="0"
            placeholder="Ex: 3"
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
            className="bg-input border border-border"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">h</span>
        </div>
        <p className="text-xs text-muted-foreground">Instagram, TikTok, etc.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storage" className="text-sm font-medium">
          Armazenamento em Nuvem
        </Label>
        <div className="relative">
          <Input
            id="storage"
            type="number"
            step="1"
            min="0"
            placeholder="Ex: 100"
            value={cloudStorage}
            onChange={(e) => setCloudStorage(e.target.value)}
            className="bg-input border border-border"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">GB</span>
        </div>
        <p className="text-xs text-muted-foreground">Google Drive, iCloud, etc.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50/50 border border-red-200/50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isCalculating || !sessionId}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 transition-all"
      >
        {isCalculating ? (
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            Calculando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Calcular Pegada
          </span>
        )}
      </Button>
    </form>
  )
}
