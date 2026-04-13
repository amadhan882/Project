import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Leaf, BarChart3, Database, ShieldCheck, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
              <Sprout className="w-4 h-4" />
              <span>Precision Agriculture AI</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
              Data-Driven Yields.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                Smarter Farming.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Leverage advanced machine learning to predict optimal crops and expected yields based on soil telemetry and environmental data.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/crops" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl bg-background/50 backdrop-blur-sm border-border hover:bg-accent">
                  Browse Crop Library
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-y border-border/50 backdrop-blur-md relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Scientific Authority, Accessible Insights.</h2>
            <p className="text-muted-foreground text-lg">Our models process thousands of data points across 7 dimensions to provide you with actionable intelligence for the upcoming season.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Comprehensive Soil Analysis",
                desc: "Input NPK ratios and pH levels to determine true soil fertility and identify the perfect crop match."
              },
              {
                icon: BarChart3,
                title: "Yield Forecasting",
                desc: "Predict tonnage per hectare using localized temperature, humidity, and rainfall patterns."
              },
              {
                icon: ShieldCheck,
                title: "High-Confidence Models",
                desc: "Trained on verified agronomic datasets with robust cross-validation ensuring reliable recommendations."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary relative z-10">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground relative z-10 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
