import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  usePredictCrop, 
  usePredictYield, 
  useGetModelAccuracy 
} from "@workspace/api-client-react";
import type { PredictionInput } from "@workspace/api-client-react/src/generated/api.schemas";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PolarAngleAxis,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis
} from "recharts";
import { Activity, Beaker, CloudRain, Droplets, FileDown, Loader2, Sprout, Sun, Thermometer, Target, TrendingUp, CheckCircle2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCropEmoji, getCropImage } from "@/lib/cropImages";
import { generatePredictionReport } from "@/lib/reportGenerator";

const formSchema = z.object({
  nitrogen: z.number().min(0).max(140),
  phosphorus: z.number().min(0).max(145),
  potassium: z.number().min(0).max(205),
  temperature: z.number().min(0).max(50),
  humidity: z.number().min(0).max(100),
  rainfall: z.number().min(0).max(300),
  ph: z.number().min(0).max(14),
  area: z.number().min(0.1).max(100).default(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function Dashboard() {
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);

  const predictCrop = usePredictCrop();
  const predictYield = usePredictYield();
  const { data: accuracy, isLoading: loadingAccuracy } = useGetModelAccuracy();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      temperature: 25,
      humidity: 60,
      rainfall: 100,
      ph: 6.5,
      area: 1,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // 1. Predict Crop
      const cropResult = await predictCrop.mutateAsync({
        data: {
          nitrogen: values.nitrogen,
          phosphorus: values.phosphorus,
          potassium: values.potassium,
          temperature: values.temperature,
          humidity: values.humidity,
          rainfall: values.rainfall,
          ph: values.ph,
        }
      });

      // 2. Predict Yield based on the predicted crop
      await predictYield.mutateAsync({
        data: {
          crop: cropResult.crop,
          nitrogen: values.nitrogen,
          phosphorus: values.phosphorus,
          potassium: values.potassium,
          temperature: values.temperature,
          humidity: values.humidity,
          rainfall: values.rainfall,
          ph: values.ph,
          area: values.area,
        }
      });

      setShowResults(true);
      
      toast({
        title: "Prediction Complete",
        description: "Analysis ready based on your soil parameters.",
      });

      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "There was an error running the prediction models.",
        variant: "destructive"
      });
    }
  };

  const isPending = predictCrop.isPending || predictYield.isPending;

  const renderAccuracyDial = (value: number, label: string, color: string) => {
    const data = [{ name: label, value: value }];
    return (
      <div className="flex flex-col items-center">
        <div className="h-32 w-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="100%" 
              barSize={10} 
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill={color}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center -mt-6">
            <span className="text-2xl font-bold">{value}%</span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-muted-foreground">Run predictive models based on current telemetry.</p>
        </div>
      </div>

      {accuracy && !loadingAccuracy && (
        <Card className="mb-8 border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Model Performance Metrics
                </CardTitle>
                <CardDescription>Real-time accuracy of our machine learning ensemble</CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full border border-border">
                Trained on {accuracy.trainingDataSize.toLocaleString()} samples
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-around items-end pt-4">
              {renderAccuracyDial(Math.round(accuracy.cropModelAccuracy * 100), "Crop Model Accuracy", "hsl(var(--primary))")}
              {renderAccuracyDial(Math.round(accuracy.cropModelF1 * 100), "F1 Score", "hsl(var(--chart-4))")}
              
              <div className="flex flex-col items-center bg-background/50 p-4 rounded-xl border border-border">
                <span className="text-3xl font-bold text-chart-3 mb-1">{accuracy.yieldModelRmse.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground font-medium text-center">Yield RMSE<br/>(kg/ha)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {showResults && predictCrop.data && predictYield.data && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 grid lg:grid-cols-2 gap-6"
          >
            {/* Primary Recommendation */}
            <Card className="border-2 border-primary/50 shadow-lg shadow-primary/10 relative overflow-hidden bg-card/80 backdrop-blur-md">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Crop Image Banner */}
              <div className="relative w-full h-44 overflow-hidden bg-muted/30">
                {getCropImage(predictCrop.data.crop) ? (
                  <img
                    src={getCropImage(predictCrop.data.crop)}
                    alt={predictCrop.data.crop}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/40 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-3xl">{getCropEmoji(predictCrop.data.crop)}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/90 bg-card/80 px-2 py-1 rounded-full backdrop-blur-sm border border-primary/30">
                    AI Recommended
                  </span>
                </div>
              </div>

              <CardHeader className="pt-4">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold tracking-wide uppercase text-sm">OPTIMAL CROP MATCH</span>
                </div>
                <CardTitle className="text-4xl capitalize">{predictCrop.data.crop}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {predictCrop.data.reasoning}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted-foreground">Model Confidence</span>
                    <span className="font-bold text-primary">{Math.round(predictCrop.data.confidence * 100)}%</span>
                  </div>
                  <Progress value={predictCrop.data.confidence * 100} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 p-4 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Recommended Season</p>
                    <p className="font-semibold capitalize">{predictCrop.data.season}</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Quality Grade</p>
                    <p className="font-semibold">{predictYield.data.grade}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => {
                    const vals = form.getValues();
                    generatePredictionReport({
                      crop: predictCrop.data!.crop,
                      confidence: predictCrop.data!.confidence,
                      reasoning: predictCrop.data!.reasoning,
                      season: predictCrop.data!.season,
                      alternatives: predictCrop.data!.alternatives,
                      yieldPerHa: predictYield.data!.yield,
                      totalYield: predictYield.data!.totalYield,
                      grade: predictYield.data!.grade,
                      yieldTrend: predictYield.data!.yieldTrend,
                      inputs: vals,
                      modelAccuracy: accuracy ? {
                        cropModelAccuracy: accuracy.cropModelAccuracy,
                        cropModelF1: accuracy.cropModelF1,
                        yieldModelRmse: accuracy.yieldModelRmse,
                      } : undefined,
                    });
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Download PDF Report
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              {/* Yield Forecast */}
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-chart-3" />
                    Yield Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold tracking-tight">{predictYield.data.totalYield.toLocaleString()}</span>
                    <span className="text-muted-foreground mb-1">kg total</span>
                    <div className="ml-auto text-right">
                      <span className="block font-semibold text-primary">{predictYield.data.yield.toLocaleString()} kg/ha</span>
                      <span className="text-xs text-muted-foreground">Estimated Density</span>
                    </div>
                  </div>
                  
                  <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictYield.data.yieldTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} 
                          dy={10}
                        />
                        <Tooltip 
                          contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px'}}
                          itemStyle={{color: 'hsl(var(--foreground))'}}
                          formatter={(value: number) => [`${value} kg/ha`, 'Yield']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--chart-3))" 
                          strokeWidth={3}
                          dot={{r: 4, fill: 'hsl(var(--card))', strokeWidth: 2}}
                          activeDot={{r: 6, fill: 'hsl(var(--chart-3))', stroke: 'hsl(var(--card))'}}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alternatives */}
              <Card className="bg-card/80 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Viable Alternatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[100px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={predictCrop.data.alternatives} layout="vertical" margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis dataKey="crop" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--foreground))', textTransform: 'capitalize'}} width={80} />
                        <Tooltip 
                          cursor={{fill: 'hsl(var(--accent)/0.1)'}}
                          contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px'}}
                          formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Confidence']}
                        />
                        <Bar dataKey="confidence" fill="hsl(var(--primary)/0.5)" radius={[0, 4, 4, 0]}>
                          {
                            predictCrop.data.alternatives.map((entry, index) => (
                              <cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--chart-4))' : 'hsl(var(--primary)/0.5)'} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <Card className="shadow-md bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="border-b border-border/50 bg-background/50 pb-6">
          <CardTitle>Input Telemetry</CardTitle>
          <CardDescription>Enter current soil and environmental conditions to run the prediction model.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Soil Nutrients */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                    <Beaker className="w-4 h-4" /> Soil NPK
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="nitrogen"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground">Nitrogen (N)</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value} kg/ha</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={140}
                            step={1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phosphorus"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground">Phosphorus (P)</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value} kg/ha</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={145}
                            step={1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2 [&_[role=slider]]:border-chart-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="potassium"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground">Potassium (K)</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value} kg/ha</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={205}
                            step={1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2 [&_[role=slider]]:border-chart-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Environmental */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-chart-4/80 uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                    <Sun className="w-4 h-4" /> Environment
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground flex items-center gap-1"><Thermometer className="w-3 h-3 text-muted-foreground"/> Temp</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value}°C</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={50}
                            step={0.5}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="humidity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground flex items-center gap-1"><CloudRain className="w-3 h-3 text-muted-foreground"/> Humidity</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rainfall"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground flex items-center gap-1"><Droplets className="w-3 h-3 text-muted-foreground"/> Rainfall</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value}mm</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={300}
                            step={1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2 [&_[role=slider]]:border-chart-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Other Specs */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-chart-5/80 uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                    <Sprout className="w-4 h-4" /> Parameters
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="ph"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel className="text-foreground">Soil pH</FormLabel>
                          <span className="text-sm font-mono bg-background px-2 py-1 rounded border">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={14}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            className="py-2 [&_[role=slider]]:border-chart-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cultivation Area (Hectares)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              step="0.1"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="pl-3 pr-12 font-mono"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
                              ha
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>Total area planned for planting</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isPending}
                  className="w-full md:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Telemetry...
                    </>
                  ) : (
                    <>
                      Run Prediction Model
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
