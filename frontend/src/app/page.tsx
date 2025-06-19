'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase, Star, Shield, Zap, CheckCircle } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5"></div>
        <div className="relative container mx-auto px-3 sm:px-4 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              BuildBoard Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
              Connect. Build. Succeed.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              The modern platform where buyers meet skilled sellers. Post projects, receive competitive bids, 
              and manage your work with confidence in a secure, streamlined environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto btn-hover group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto btn-hover">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20 px-2">
            <Card className="card-hover gradient-bg border-border/50">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl text-blue-400">For Buyers</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Post your projects and find the right talent
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Post detailed project requirements with rich descriptions',
                    'Receive competitive bids from verified sellers',
                    'Track project progress with real-time updates',
                    'Secure collaboration with built-in communication tools'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover gradient-bg border-border/50">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl text-green-400">For Sellers</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Find projects that match your expertise
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Browse curated projects matching your skills',
                    'Submit compelling proposals with portfolios',
                    'Build reputation through client reviews',
                    'Secure payments and milestone tracking'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
              Why Choose BuildBoard?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Experience the future of project collaboration with our cutting-edge platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2">
            <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl bg-card/30 border border-border/50 card-hover">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                Secure & Trusted
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Advanced security measures and verified user profiles ensure safe transactions and reliable partnerships.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl bg-card/30 border border-border/50 card-hover">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                Quality Assured
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Comprehensive review system and milestone tracking ensure high-quality deliverables every time.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl bg-card/30 border border-border/50 card-hover sm:col-span-2 lg:col-span-1">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                Lightning Fast
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Streamlined workflows and instant notifications keep your projects moving at the speed of business.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-t border-border/50">
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of buyers and sellers who trust BuildBoard for their project needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Building Today
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
