import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SnipeCrosshair } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/shared/lib/utils"
import { SnipeStrategy, useSnipes } from "@/app/_contexts/SnipeContext"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SnipeDialogProps {
  tokenAddress: string
  chain: string
  tokenName: string
  tokenSymbol?: string
  totalSupply?: string
}

type GasPriority = "low" | "medium" | "high" | "instant" | "custom";

const presets: {amount: string, slippage: string, gasPriority: GasPriority}[] = [
  {
    amount: '0.00001',
    slippage: '100',
    gasPriority: 'medium'
  },
  {
    amount: '0.0001',
    slippage: '50',
    gasPriority: 'medium'
  },
  {
    amount: '0.001',
    slippage: '10',
    gasPriority: 'medium'
  },
]

const GAS_PRIORITY_FEES: Record<GasPriority, string> = {
  low: "1",
  medium: "2",
  high: "3",
  instant: "5",
  custom: ""
}

export function SnipeDialog({
  tokenAddress,
  chain,
  tokenName,
  tokenSymbol,
  totalSupply
}: SnipeDialogProps) {
  const [activePreset, setActivePreset] = useState<number>();
  const [amount, setAmount] = useState("")
  const [slippage, setSlippage] = useState("1")
  const [isOpen, setIsOpen] = useState(false)
  const [gasPriority, setGasPriority] = useState<GasPriority>("medium")
  const [customGasFee, setCustomGasFee] = useState("")
  const { addSnipe, loading } = useSnipes()

  const  handleClickPreset = (i: number) => {
    setActivePreset(i)
    const preset = presets[i]
    setAmount(preset.amount);
    setSlippage(preset.slippage);
    setGasPriority(preset.gasPriority);
  }

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (!slippage || parseFloat(slippage) <= 0) {
      toast.error("Please enter a valid slippage percentage")
      return
    }

    if (gasPriority === "custom" && (!customGasFee || parseFloat(customGasFee) <= 0)) {
      toast.error("Please enter a valid custom gas fee")
      return
    }

    try {
      await addSnipe({
        tokenAddress,
        chain,
        tokenName,
        tokenSymbol,
        totalSupply,
        amount,
        slippage,
        gasPriority,
        gasFee: gasPriority === "custom" ? customGasFee : GAS_PRIORITY_FEES[gasPriority],
        type: 'manual',
        strategy: SnipeStrategy.BUY_HOLD
      })

      toast.success(`Snipe for ${tokenName} created successfully`)
      setIsOpen(false)
    } catch (error) {
      toast.error(`Failed to create snipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SnipeCrosshair className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Snipe {tokenName} {tokenSymbol && `(${tokenSymbol})`}</SheetTitle>
          <SheetDescription>
            Configure your snipe settings for {tokenName} on {chain}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="chain">Chain</label>
              <Badge variant="outline">{chain}</Badge>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="token">Token</label>
              <div className="text-right">
                <div className="font-medium">{tokenName}</div>
                {tokenSymbol && <div className="text-sm text-muted-foreground">{tokenSymbol}</div>}
              </div>
            </div>
          </div>
          {totalSupply && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="totalSupply">Total Supply</label>
                <div className="text-right font-medium">{formatNumber(totalSupply)}</div>
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="amount">Presets</label>
            <PresetList activePreset={activePreset} onClick={handleClickPreset} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="amount">Amount (Native)</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="slippage">Slippage (%)</label>
            <Input
              id="slippage"
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="gasPriority">Gas Priority</label>
            <div className="flex gap-2 items-center">
              <Select value={gasPriority} onValueChange={(value: GasPriority) => setGasPriority(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select gas priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {gasPriority !== "custom" && (
                <span className="text-sm text-muted-foreground">
                  {GAS_PRIORITY_FEES[gasPriority]} GWEI
                </span>
              )}
            </div>
          </div>
          {gasPriority === "custom" && (
            <div className="grid gap-2">
              <label htmlFor="customGasFee">Custom Gas Fee (GWEI)</label>
              <Input
                id="customGasFee"
                type="number"
                value={customGasFee}
                onChange={(e) => setCustomGasFee(e.target.value)}
                placeholder="Enter custom gas fee"
              />
            </div>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Confirm Snipe"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const PresetList = ({activePreset, onClick}: {activePreset: number | undefined, onClick: (i: number) => void}) => {

  return (
    <div className="flex items-center gap-2">{presets.map((preset, i) => (
      <Button
        variant={i === activePreset ? "default" : "secondary"}
        size="icon"
        onClick={() => onClick(i)}
        key={i}
      >
        {`P${i + 1}`}
      </Button>
    ))}</div>
  )
}
