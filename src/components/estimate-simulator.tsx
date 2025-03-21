import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// インターフェース定義
interface Location {
  id: string
  name: string
}

interface Material {
  id: string
  name: string
  price: number
  image: string
}

interface MaterialSelectorProps {
  materials: Material[]
  selectedMaterialId: string | null
  onSelect: (materialId: string) => void
}

interface SimulationPreviewProps {
  locationName: string
  imageSrc: string | null
}

interface QuoteSummaryProps {
  selections: Record<string, string | null>
  locations: Location[]
  materialsByLocation: Record<string, Material[]>
  total: number
}

export default function EstimateSimulator({ product }: { product: {
  name: string
  locations: {
    name: string
    materials: {
      name: string
      price: number
      image: string
    }[]
  }[]
} }) {
  // 製品データからlocationsとmaterialsByLocationを生成
  const locations: Location[] = product.locations.map((loc, index) => ({
    id: ['door', 'ceiling', 'floor', 'wall'][index] || `location-${index}`,
    name: loc.name
  }));

  const materialsByLocation: Record<string, Material[]> = {};
  locations.forEach((location, locationIndex) => {
    materialsByLocation[location.id] = product.locations[locationIndex].materials.map((mat, matIndex) => ({
      id: `material-${locationIndex}-${matIndex}`,
      name: mat.name,
      price: mat.price,
      image: mat.image // 製品データから提供されたimageを使用
    }));
  });

  const [activeLocation, setActiveLocation] = useState(locations[0]?.id || "door")
  const [selections, setSelections] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {};
    locations.forEach(loc => {
      initial[loc.id] = null;
    });
    return initial;
  });
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // 全ての場所で材料が選択されているかチェック
  useEffect(() => {
    const allSelected = Object.values(selections).every((selection) => selection !== null)
    setIsComplete(allSelected)
  }, [selections])

  // 材料選択の処理
  const handleMaterialSelect = (locationId: string, materialId: string) => {
    setSelections((prev) => ({
      ...prev,
      [locationId]: materialId,
    }))
  }

  // 見積もり送信の処理
  const handleSubmitQuote = async () => {
    if (!isComplete || !email) return

    setIsSubmitting(true)
    try {
      // 選択された材料の詳細情報を取得
      const quoteDetails = Object.entries(selections)
        .map(([locationId, materialId]) => {
          if (!materialId) return null
          const location = locations.find((loc) => loc.id === locationId)
          const material = materialsByLocation[locationId as keyof typeof materialsByLocation].find(
            (mat) => mat.id === materialId,
          )
          return {
            location: location?.name,
            material: material?.name,
            price: material?.price,
          }
        })
        .filter(Boolean)

      await sendQuote(email, quoteDetails)
      alert("見積もりが送信されました。")
    } catch (error) {
      console.error("見積もり送信エラー:", error)
      alert("見積もりの送信に失敗しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 現在選択されている材料の画像を取得
  const getCurrentImage = () => {
    const materialId = selections[activeLocation]
    if (!materialId) return null

    const material = materialsByLocation[activeLocation as keyof typeof materialsByLocation].find(
      (mat) => mat.id === materialId,
    )
    return material?.image || null
  }

  // 見積もり合計を計算
  const calculateTotal = () => {
    let total = 0
    Object.entries(selections).forEach(([locationId, materialId]) => {
      if (!materialId) return
      const materials = materialsByLocation[locationId as keyof typeof materialsByLocation]
      const material = materials.find((mat) => mat.id === materialId)
      if (material) {
        total += material.price
      }
    })
    return total
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>シミュレーション</CardTitle>
              <CardDescription>場所を選択して、材料をお選びください</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLocation} onValueChange={setActiveLocation}>
                <TabsList className="mb-6">
                  {locations.map((location) => (
                    <TabsTrigger key={location.id} value={location.id}>
                      {location.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {locations.map((location) => (
                  <TabsContent key={location.id} value={location.id} className="space-y-6">
                    <SimulationPreview locationName={location.name} imageSrc={getCurrentImage()} />

                    <MaterialSelector
                      materials={materialsByLocation[location.id as keyof typeof materialsByLocation]}
                      selectedMaterialId={selections[location.id]}
                      onSelect={(materialId) => handleMaterialSelect(location.id, materialId)}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>見積もり概要</CardTitle>
              <CardDescription>選択した材料の見積もり</CardDescription>
            </CardHeader>
            <CardContent>
              <QuoteSummary
                selections={selections}
                locations={locations}
                materialsByLocation={materialsByLocation}
                total={calculateTotal()}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isComplete}
                />
              </div>
              <Button className="w-full" onClick={handleSubmitQuote} disabled={!isComplete || !email || isSubmitting}>
                {isSubmitting ? "送信中..." : "見積もりを送信"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function sendQuote(email: string, quoteDetails: any) {
  // 実際のAPIリクエストはここに実装
  // 現在はコンソールに出力するだけ
  console.log(email, quoteDetails)
  return Promise.resolve()
}

export function MaterialSelector({ materials, selectedMaterialId, onSelect }: MaterialSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup value={selectedMaterialId || ""} onValueChange={onSelect}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map((material) => (
              <div key={material.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={material.id} id={material.id} />
                  <Label htmlFor={material.id} className="font-medium">
                    {material.name}
                  </Label>
                </div>
                <div className="rounded-md overflow-hidden border">
                  <img
                    src={material.image || "/placeholder.svg"}
                    alt={material.name}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => onSelect(material.id)}
                  />
                </div>
                <p className="text-sm text-right">¥{material.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

export function QuoteSummary({ selections, locations, materialsByLocation, total }: QuoteSummaryProps) {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        {locations.map((location) => {
          const materialId = selections[location.id]
          const material = materialId ? materialsByLocation[location.id].find((m) => m.id === materialId) : null

          return (
            <div key={location.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{location.name}</h3>
                {material ? (
                  <span className="text-sm text-muted-foreground">{material.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">未選択</span>
                )}
              </div>
              {material && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">材料費</span>
                  <span className="font-medium">¥{material.price.toLocaleString()}</span>
                </div>
              )}
              <Separator className="my-2" />
            </div>
          )
        })}
      </ScrollArea>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">合計</h3>
          <span className="font-bold text-lg">¥{total.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">※ 税抜き価格</p>
      </div>
    </div>
  )
}

export function SimulationPreview({ locationName, imageSrc }: SimulationPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${locationName}のシミュレーション`}
              className="w-full h-[400px] object-cover"
            />
          ) : (
            <div className="w-full h-[400px] bg-muted flex items-center justify-center flex-col p-6">
              <p className="text-xl font-medium text-center mb-2">材料を選択してください</p>
              <p className="text-sm text-muted-foreground text-center">下の材料リストから選択すると、こちらにプレビューが表示されます</p>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-background/80 px-3 py-1 rounded-md">
            <p className="text-sm font-medium">{locationName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
