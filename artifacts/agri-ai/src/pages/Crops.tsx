import { useListCrops } from "@workspace/api-client-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, Droplets, Thermometer, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Crops() {
  const { data: crops, isLoading } = useListCrops();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-chart-4/10 rounded-xl border border-chart-4/20">
          <Sprout className="w-6 h-6 text-chart-4" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Knowledge Base</h1>
          <p className="text-muted-foreground">Supported crops and their optimal growing conditions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2 border-b bg-muted/20">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops?.map((crop, i) => (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden group">
                <CardHeader className="pb-3 border-b border-border/50 bg-gradient-to-br from-background to-muted/20 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                    <Sprout className="w-16 h-16 text-primary" />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <CardTitle className="text-2xl capitalize mb-1 group-hover:text-primary transition-colors">{crop.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize font-normal border-primary/20">
                        {crop.season} Season
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6 flex-1">
                    {crop.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50 flex flex-col gap-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Droplets className="w-3 h-3 mr-1 text-chart-4" />
                        Water Req.
                      </div>
                      <span className="font-semibold text-sm">{crop.waterRequirement}</span>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/50 flex flex-col gap-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Info className="w-3 h-3 mr-1 text-chart-5" />
                        Optimal pH
                      </div>
                      <span className="font-semibold text-sm">{crop.optimalPh}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
