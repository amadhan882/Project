import { useGetPredictionHistory, useGetCropStats } from "@workspace/api-client-react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportHistoryCSV } from "@/lib/reportGenerator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History as HistoryIcon, TrendingUp, BarChart3, Database, Calendar, FileDown } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
  const { data: history, isLoading: loadingHistory } = useGetPredictionHistory();
  const { data: stats, isLoading: loadingStats } = useGetCropStats();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-primary/20 text-primary hover:bg-primary/30";
    if (confidence >= 0.6) return "bg-chart-3/20 text-chart-3 hover:bg-chart-3/30";
    return "bg-destructive/20 text-destructive hover:bg-destructive/30";
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'excellent': return "border-primary/50 text-primary";
      case 'good': return "border-chart-4/50 text-chart-4";
      case 'average': return "border-chart-3/50 text-chart-3";
      default: return "border-muted-foreground/50 text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-secondary/50 rounded-xl border border-border">
          <HistoryIcon className="w-6 h-6 text-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Prediction History</h1>
          <p className="text-muted-foreground">Historical model outputs and aggregate statistics.</p>
        </div>
        {history && history.length > 0 && (
          <Button
            variant="outline"
            className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => exportHistoryCSV(history)}
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card/60 backdrop-blur-sm shadow-sm border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{stats?.totalPredictions.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Processed by AI models</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold text-chart-4">
                {Math.round((stats?.avgConfidence || 0) * 100)}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Across all historical data</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Top Recommended</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-3xl font-bold capitalize text-chart-3 truncate">
                {stats?.topCrops[0]?.crop || "N/A"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Most frequent match</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-xl border-border shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Detailed log of recent predictions with parameters and model outputs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                    <TableHead className="text-right">Forecast Yield</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="hidden md:table-cell">NPK (kg/ha)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record, i) => (
                    <motion.tr 
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="whitespace-nowrap">{format(new Date(record.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden mt-1">
                          N:{record.nitrogen} P:{record.phosphorus} K:{record.potassium}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize font-semibold text-foreground">
                        {record.crop}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className={`font-mono ${getConfidenceColor(record.confidence)} border-0`}>
                          {Math.round(record.confidence * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {record.yield.toLocaleString()} <span className="text-xs text-muted-foreground">kg/ha</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`capitalize ${getGradeColor(record.grade)}`}>
                          {record.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">
                        <div className="flex gap-2">
                          <span title="Nitrogen">N:{record.nitrogen}</span>
                          <span title="Phosphorus">P:{record.phosphorus}</span>
                          <span title="Potassium">K:{record.potassium}</span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p>No prediction history found.</p>
              <p className="text-sm">Run some predictions on the dashboard to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
